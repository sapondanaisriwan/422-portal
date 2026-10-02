// ==UserScript==
// @name         Copy Product Data & Import to Basket
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  ระบบดึงข้อมูล Next.js (Background Fetch ไม่ง้อ Refresh) และ Import ตะกร้า
// @match        *://*.makro.pro/*
// @grant        none
// @author       Sapondanai Sriwan
// ==/UserScript==

(function() {
    'use strict';

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9998';
    container.style.display = 'none';
    container.style.gap = '10px';

    const baseButtonStyle = `
        padding: 12px 20px;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-family: ui-sans-serif, system-ui, sans-serif;
        font-weight: 600;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    const copyBtn = document.createElement('button');
    copyBtn.innerHTML = 'Copy Data';
    copyBtn.style.cssText = baseButtonStyle + 'background-color: #2563eb;';
    copyBtn.onmouseover = () => copyBtn.style.backgroundColor = '#1d4ed8';
    copyBtn.onmouseout = () => copyBtn.style.backgroundColor = '#2563eb';

    const importBtn = document.createElement('button');
    importBtn.innerHTML = 'Import to Basket';
    importBtn.style.cssText = baseButtonStyle + 'background-color: #059669;';
    importBtn.onmouseover = () => importBtn.style.backgroundColor = '#047857';
    importBtn.onmouseout = () => importBtn.style.backgroundColor = '#059669';

    const linkBtn = document.createElement('button');
    linkBtn.innerHTML = 'JSON to Table';
    linkBtn.style.cssText = baseButtonStyle + 'background-color: #7c3aed;';
    linkBtn.onmouseover = () => linkBtn.style.backgroundColor = '#6d28d9';
    linkBtn.onmouseout = () => linkBtn.style.backgroundColor = '#7c3aed';

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    const getOrderIdFromUrl = () => {
        const path = window.location.pathname;
        if (!path.includes('/orders-v2/')) return null;
        const parts = path.split('/').filter(Boolean);
        const lastPart = parts[parts.length - 1];
        if (lastPart === 'orders-v2' || lastPart === 'orders') return null;
        return lastPart;
    };

    // UI Modal นำเข้าตะกร้าสินค้า
    const createModal = () => {
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'import-basket-modal';
        modalOverlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background-color: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px);
            display: none; align-items: center; justify-content: center; z-index: 9999;
            font-family: ui-sans-serif, system-ui, sans-serif;
        `;

        const modalBox = document.createElement('div');
        modalBox.style.cssText = `
            background-color: #111827; border: 1px solid #374151; border-radius: 12px;
            width: 500px; max-width: 90%; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
            display: flex; flex-direction: column; gap: 16px; color: #f9fafb;
        `;

        const title = document.createElement('h2');
        title.innerText = 'Import JSON to Basket';
        title.style.cssText = 'margin: 0; font-size: 18px; font-weight: 600; color: #f9fafb;';

        const textarea = document.createElement('textarea');
        textarea.placeholder = 'Paste product JSON here...';
        textarea.style.cssText = `
            width: 100%; height: 200px; background-color: #1f2937; color: #d1d5db;
            border: 1px solid #4b5563; border-radius: 8px; padding: 12px;
            font-family: ui-monospace, monospace; font-size: 13px; resize: vertical;
            box-sizing: border-box; outline: none;
        `;
        textarea.onfocus = () => textarea.style.borderColor = '#3b82f6';
        textarea.onblur = () => textarea.style.borderColor = '#4b5563';

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px;';

        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = 'Cancel';
        cancelBtn.style.cssText = `
            padding: 8px 16px; background-color: transparent; color: #d1d5db;
            border: 1px solid #4b5563; border-radius: 6px; cursor: pointer; font-weight: 500;
        `;
        cancelBtn.onmouseover = () => cancelBtn.style.backgroundColor = '#374151';
        cancelBtn.onmouseout = () => cancelBtn.style.backgroundColor = 'transparent';

        const submitBtn = document.createElement('button');
        submitBtn.innerText = 'Submit Order';
        submitBtn.style.cssText = `
            padding: 8px 16px; background-color: #059669; color: white;
            border: none; border-radius: 6px; cursor: pointer; font-weight: 500;
        `;
        submitBtn.onmouseover = () => submitBtn.style.backgroundColor = '#047857';
        submitBtn.onmouseout = () => submitBtn.style.backgroundColor = '#059669';

        buttonContainer.appendChild(cancelBtn);
        buttonContainer.appendChild(submitBtn);

        modalBox.appendChild(title);
        modalBox.appendChild(textarea);
        modalBox.appendChild(buttonContainer);
        modalOverlay.appendChild(modalBox);
        document.body.appendChild(modalOverlay);

        const closeModal = () => {
            modalOverlay.style.display = 'none';
            textarea.value = '';
        };

        cancelBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });

        submitBtn.addEventListener('click', async () => {
            try {
                const originalText = submitBtn.innerText;
                submitBtn.innerText = 'Processing...';
                submitBtn.disabled = true;

                let rawInputText = textarea.value.trim();
                if (!rawInputText) throw new Error("Textarea is empty");

                if (rawInputText.startsWith('"') && rawInputText.endsWith('"')) {
                    rawInputText = rawInputText.substring(1, rawInputText.length - 1);
                }

                rawInputText = rawInputText.replace(/""/g, '"');
                const rawData = JSON.parse(rawInputText);

                const basketItems = rawData.map(item => {
                    const targetId = item.id || item.productId;
                    if (!targetId) throw new Error("JSON structure invalid: missing 'id' or 'productId'");
                    return {
                        productId: targetId.toString(),
                        quantity: parseInt(item.quantity) || 1
                    };
                });

                let token = getCookie('idToken');
                if (!token) throw new Error("Auth Token not found in Cookie");
                token = decodeURIComponent(token);

                const response = await fetch("https://basket-service.mango-prod.siammakro.cloud/basket/api/v5/preview", {
                    method: "POST",
                    headers: {
                        "accept": "*/*",
                        "authorization": `Bearer ${token}`,
                        "content-type": "application/json",
                        "x-app-version": "2.2.0",
                        "x-country-code": "TH"
                    },
                    body: JSON.stringify({ basketItems: basketItems, region: "TH" })
                });

                if (!response.ok) throw new Error(`API Error: ${response.status}`);
                alert("Successfully added items to basket.");
                closeModal();

            } catch (error) {
                console.error("Import Error:", error);
                alert(`Error: ${error.message}`);
            } finally {
                submitBtn.innerText = 'Submit Order';
                submitBtn.disabled = false;
            }
        });

        return { modalOverlay, textarea };
    };

    let modalElements = null;

    importBtn.addEventListener('click', () => {
        if (!modalElements) modalElements = createModal();
        modalElements.modalOverlay.style.display = 'flex';
        modalElements.textarea.focus();
    });

    // ระบบคัดลอกข้อมูล (Background Fetch ดึงข้อมูล Next.js อัปเดตล่าสุด)
    copyBtn.addEventListener('click', async () => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = 'Extracting...';

        try {
            let foundProducts = null;

            // 1. แอบดึง HTML ของ URL ปัจจุบันแบบหลังบ้าน (จะได้ข้อมูลอัปเดตล่าสุดโดยไม่ต้องกด F5)
            const response = await fetch(window.location.href, { credentials: 'include' });
            const htmlText = await response.text();

            // 2. ทำการลบสัญลักษณ์ Escape (\") ออกจาก HTML สตริงก่อนค้นหา
            let cleanText = htmlText.replace(/\\"/g, '"');

            // 3. ใช้วิธีหาจุดเริ่มต้นแล้วนับวงเล็บเปิดปิด (ชัวร์สุดสำหรับ JSON ใน HTML)
            let startIdx = cleanText.indexOf('"products":[');
            if (startIdx !== -1) {
                let arrayStart = startIdx + '"products":'.length;
                let bracketCount = 0;
                let arrayEnd = -1;
                let inString = false;

                for (let i = arrayStart; i < cleanText.length; i++) {
                    let char = cleanText[i];
                    let prevChar = cleanText[i-1];

                    if (char === '"' && prevChar !== '\\') inString = !inString;

                    if (!inString) {
                        if (char === '[') bracketCount++;
                        else if (char === ']') {
                            bracketCount--;
                            if (bracketCount === 0) {
                                arrayEnd = i;
                                break;
                            }
                        }
                    }
                }

                if (arrayEnd !== -1) {
                    try {
                        let jsonStr = cleanText.substring(arrayStart, arrayEnd + 1).replace(/\\\\/g, '\\');
                        // หากมี \n เป็น text ซ่อนอยู่ให้เอาออก
                        jsonStr = jsonStr.replace(/\\n/g, '');
                        foundProducts = JSON.parse(jsonStr);
                    } catch (e) {
                        console.error("Bracket extraction failed:", e);
                    }
                }
            }

            if (!foundProducts || foundProducts.length === 0) {
                throw new Error("Product data not found in page source.");
            }

            // จัดรูปแบบ JSON สุดท้ายสำหรับ Copy ลง Clipboard
            console.log("here", foundProducts)
            const extractedData = foundProducts.map(item => ({
                id: item.id || item.productId || "",
                name: item.title || "",
                price: item.unitAmount || item.originalAmount || item.amount || "",
                quantity: item.quantity?.toString() || "1",
                image: item.productImgUrl || ""
            }));

            const textToCopy = JSON.stringify(extractedData, null, 2);
            await navigator.clipboard.writeText(textToCopy);

            copyBtn.innerHTML = 'Copied';
            copyBtn.style.backgroundColor = '#2e7d32';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.backgroundColor = '#2563eb';
            }, 2000);

        } catch (error) {
            console.error('Data Extraction Error:', error);
            alert(`Error: ${error.message}`);
            copyBtn.innerHTML = 'Error';
            copyBtn.style.backgroundColor = '#dc2626';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.backgroundColor = '#2563eb';
            }, 2000);
        }
    });

    linkBtn.addEventListener('click', () => {
        window.open('https://jsontotable.org/', '_blank');
    });

    container.appendChild(copyBtn);
    container.appendChild(importBtn);
    container.appendChild(linkBtn);

    const init = setInterval(() => {
        if (document.body) {
            document.body.appendChild(container);
            clearInterval(init);
        }
    }, 500);

    setInterval(() => {
        if (getOrderIdFromUrl()) {
            container.style.display = 'flex';
        } else {
            container.style.display = 'none';
        }
    }, 500);

})();
