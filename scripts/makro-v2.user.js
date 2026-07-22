// ==UserScript==
// @name         Copy Product Data (API Version) & JSON to Table
// @namespace    https://github.com/sapondanaisriwan/422-portal/raw/main/scripts/makro-v2.user.js
// @version      2.8
// @description  ดึงข้อมูลสินค้าผ่าน GraphQL API พร้อมราคา ขนาด
// @match        https://www.makro.pro/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=makro.pro
// @author       Sapondanai Sriwan
// ==/UserScript==

(function() {
    'use strict';

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    container.style.display = 'none';
    container.style.gap = '10px';

    const baseButtonStyle = `
        padding: 12px 20px;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        font-family: sans-serif;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        transition: 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    const copyBtn = document.createElement('button');
    copyBtn.innerHTML = 'Copy Data';
    copyBtn.style.cssText = baseButtonStyle + 'background-color: #1976d2;';
    copyBtn.onmouseover = () => copyBtn.style.backgroundColor = '#115293';
    copyBtn.onmouseout = () => copyBtn.style.backgroundColor = '#1976d2';

    const linkBtn = document.createElement('button');
    linkBtn.innerHTML = 'JSON to Table';
    linkBtn.style.cssText = baseButtonStyle + 'background-color: #9c27b0;';
    linkBtn.onmouseover = () => linkBtn.style.backgroundColor = '#7b1fa2';
    linkBtn.onmouseout = () => linkBtn.style.backgroundColor = '#9c27b0';

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    copyBtn.addEventListener('click', async () => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = 'Fetching...';

        try {
            const urlParts = window.location.pathname.split('/');
            const orderId = urlParts[urlParts.length - 3];

            if (!orderId) throw new Error("Order ID not found in URL");

            let token = getCookie('idToken');

            if (!token) {
                throw new Error("Auth Token not found in Cookie");
            }

            token = decodeURIComponent(token);

            // 1. ดึงข้อมูล Order หลัก
            const orderPayload = {
                "operationName": "getOrderDetails",
                "variables": {
                    "orderName": `#${orderId}`,
                    "miraklOrderNumber": `MAKROPRO${orderId}-0-1P`,
                    "storeCodes": ["41"],
                    "locale": "th"
                },
                "query": "query getOrderDetails($locale: String, $orderName: String!, $miraklOrderNumber: String, $storeCodes: [String!]) {\n  ordersDetailsV3(\n    locale: $locale\n    orderName: $orderName\n    miraklOrderNumber: $miraklOrderNumber\n    storeCodes: $storeCodes\n  ) {\n    orderName\n    isExpressOrder\n    status\n    lineItemsV2 {\n      quantity\n      price\n      productDetails {\n        id\n        title\n        displayPrice\n        originPrice\n        image {\n          mediaUrl\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    lineItems {\n      quantity\n      productDetails {\n        id\n        title\n        displayPrice\n        image {\n          mediaUrl\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}"
            };

            const orderResponse = await fetch("https://channel-integrator.omni.cpaxtra.com/channel-integrator/graphql", {
                method: "POST",
                headers: {
                    "accept": "*/*",
                    "authorization": `Bearer ${token}`,
                    "content-type": "application/json",
                    "x-app-version": "2.2.0",
                    "x-app-version-code": "1.0.0",
                    "x-country-code": "TH",
                    "x-device-platform": "ios"
                },
                body: JSON.stringify(orderPayload)
            });

            if (!orderResponse.ok) {
                throw new Error(`API Error (Order): ${orderResponse.status}`);
            }

            const orderResult = await orderResponse.json();

            if (orderResult.errors) {
                throw new Error(`GraphQL Error: ${orderResult.errors[0].message}`);
            }

            const orderDetails = orderResult?.data?.ordersDetailsV3;
            if (!orderDetails) {
                throw new Error("Order details not found in response");
            }

            const items = orderDetails.lineItemsV2 || orderDetails.lineItems || [];

            if (items.length === 0) {
                throw new Error("Line items not found");
            }

            // 2. ดึงข้อมูล size แยกทีละรายการผ่าน productById endpoint
            const extractedData = await Promise.all(items.map(async (item) => {
                const productId = item.productDetails?.id || "";
                let actualSize = "";

                if (productId) {
                    try {
                        const productPayload = {
                            "operationName": "productById",
                            "variables": {
                                "id": productId,
                                "storeCodes": ["41"],
                                "lang": "th",
                                "countryCode": "TH"
                            },
                            "query": "query productById($id: String!, $storeCodes: [String!], $lang: String, $countryCode: String) {\n  productById(\n    id: $id\n    storeCodes: $storeCodes\n    lang: $lang\n    countryCode: $countryCode\n  ) {\n    size\n    __typename\n  }\n}"
                        };

                        const productResponse = await fetch("https://marketplace.mango-prod.siammakro.cloud/product/api/v1/graphql?apiVersion=20230109", {
                            method: "POST",
                            headers: {
                                "accept": "*/*",
                                "authorization": `Bearer ${token}`,
                                "content-type": "application/json"
                            },
                            body: JSON.stringify(productPayload)
                        });

                        if (productResponse.ok) {
                            const productResult = await productResponse.json();
                            const rawSize = productResult?.data?.productById?.size || "";
                            // ใช้ Regular Expression ลบคำว่า "หน่วย" และช่องว่างที่อยู่ติดกัน
                            actualSize = rawSize.replace(/\s*หน่วย/g, '').trim();
                        }
                    } catch (err) {
                        console.error(`Error fetching size for product ${productId}:`, err);
                    }
                }

                return {
                    id: productId,
                    name: item.productDetails?.title || "",
                    // size: actualSize,
                    price: item.productDetails?.originPrice || item.price || "",
                    quantity: item.quantity?.toString() || "1",
                    image: item.productDetails?.image?.mediaUrl || ""
                };
            }));

            // 3. คัดลอกข้อมูลลง Clipboard
            const textToCopy = JSON.stringify(extractedData, null, 2);
            await navigator.clipboard.writeText(textToCopy);

            copyBtn.innerHTML = 'Copied!';
            copyBtn.style.backgroundColor = '#2e7d32';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.backgroundColor = '#1976d2';
            }, 2000);

        } catch (error) {
            console.error('Data Fetch Error:', error);
            alert(`Error: ${error.message}`);
            copyBtn.innerHTML = 'Error';
            copyBtn.style.backgroundColor = '#d32f2f';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.backgroundColor = '#1976d2';
            }, 2000);
        }
    });

    linkBtn.addEventListener('click', () => {
        window.open('https://jsontotable.org/', '_blank');
    });

    container.appendChild(copyBtn);
    container.appendChild(linkBtn);

    const init = setInterval(() => {
        if (document.body) {
            document.body.appendChild(container);
            clearInterval(init);
        }
    }, 500);

    setInterval(() => {
        if (window.location.href.includes('/account/orders/')) {
            container.style.display = 'flex';
        } else {
            container.style.display = 'none';
        }
    }, 500);

})();