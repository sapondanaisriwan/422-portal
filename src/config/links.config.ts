export type LinkType =
  | "form"
  | "excel"
  | "doc"
  | "link"
  | "snippet"
  | "tampermonkey";

export interface LinkItem {
  title: string;
  url?: string;
  type: LinkType;
  description?: string;
  isHighlight?: boolean;
  code?: string;
}

export interface LinkCategory {
  title: string;
  items: LinkItem[];
}

export const linksConfig: LinkCategory[] = [
  {
    title: "การเงิน",
    items: [
      {
        title: "บัญชี 422",
        url: "https://cmu.to/422Finance",
        type: "excel",
        description: "ตรวจสอบรายรับ รายจ่าย ต้นทุน",
        isHighlight: true,
      },
    ],
  },
  {
    title: "แบบฟอร์ม",
    items: [
      {
        title: "แบบฟอร์มรับสมัคร ตะกร้าคุณธรรม",
        url: "https://forms.gle/uy5gRjo6zMAyEP4i7",
        type: "form",
        isHighlight: true,
      },
    ],
  },
  {
    title: "การตอบกลับ",
    items: [
      {
        title: "แบบฟอร์มสำรวจความคิดเห็น",
        url: "https://docs.google.com/spreadsheets/d/1gUFRqDmuSBVhQq9JoBMyABvqA7DTed2TvPrF2vXcS10/edit?usp=sharing",
        type: "excel",
        isHighlight: true,
      },
    ],
  },
  {
    title: "เครื่องมือ & โค้ด",
    items: [
//       {
//         title: "Json to Table",
//         url: "https://jsontotable.org/",
//         type: "link",
//         description: "แปลง JSON เป็นตาราง HTML",
//       },
//       {
//         title: "ดึงรายการสินค้า และราคาจากหน้าเว็บ",
//         type: "snippet",
//         description: "",
//         code: `// Script by Adashima (6/7/69) //
// // ดึง ชื่อสินค้า, ราคารวม, จำนวนแพ็คที่ซื้อ และนำมาแสดงเป็นตาราง
// const products = [...document.querySelectorAll(".css-dvgoqj")].map(card => ({
//     name: card.querySelector(".main")?.textContent.trim(),
//     price: (
//         card.querySelector(".discountPriceWrapper")?.textContent ||
//         [...card.querySelectorAll("p")]
//             .find(p =>
//                 !p.classList.contains("main") &&
//                 !p.classList.contains("sub") &&
//                 !p.classList.contains("quantity")
//             )?.textContent ||
//         ""
//     )
//         .replace(/฿/g, "")
//         .trim(),
//     quantity: card.querySelector(".quantity")?.textContent.trim()
// }));

// console.table(products);
// `,
//       },
//       {
//         title: "ดึงรูปสินค้าจากหน้าเว็บ",
//         type: "snippet",
//         description: "",
//         code: `// Script by Adashima (11/7/69) //
// // ดึงรูปสินค้ามาแสดง
// const imageData = [...document.querySelectorAll(".css-dvgoqj")].map(card => ({
//     name: card.querySelector(".main")?.textContent.trim(),
//     image: card.querySelector('img:not([aria-hidden="true"])')?.src || ""
// }));

// console.log(imageData)
// `,
//       },
      {
        title: "Auto-Collect data product from Makro",
        type: "tampermonkey",
        description: "สคริปต์ช่วยดึงข้อมูลจาก Makro",
        url: "https://github.com/sapondanaisriwan/422-portal/raw/main/scripts/makro.user.js",
        code: `// ==UserScript==
// @name         Copy Product Data
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  เพิ่มปุ่ม Copy ข้อมูลสินค้าจากหน้าเว็บ
// @match        https://www.makro.pro/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=makro.pro
// @author       sapondanaisriwan
// ==/UserScript==

(function() {
    'use strict';

    // 1. สร้าง Container สำหรับเก็บปุ่มให้อยู่เรียงกัน
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    container.style.display = 'none'; // ซ่อนปุ่มไว้เป็นค่าเริ่มต้น
    container.style.gap = '10px';

    const baseButtonStyle = \`
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
    \`;

    // 2. สร้างปุ่ม Copy Data
    const copyBtn = document.createElement('button');
    copyBtn.innerHTML = '📋 Copy Data';
    copyBtn.style.cssText = baseButtonStyle + 'background-color: #1976d2;';
    copyBtn.onmouseover = () => copyBtn.style.backgroundColor = '#115293';
    copyBtn.onmouseout = () => copyBtn.style.backgroundColor = '#1976d2';

    // 3. สร้างปุ่มเปิดเว็บ JSON to Table
    const linkBtn = document.createElement('button');
    linkBtn.innerHTML = '🌐 JSON to Table';
    linkBtn.style.cssText = baseButtonStyle + 'background-color: #9c27b0;';
    linkBtn.onmouseover = () => linkBtn.style.backgroundColor = '#7b1fa2';
    linkBtn.onmouseout = () => linkBtn.style.backgroundColor = '#9c27b0';

    // 4. การทำงานของปุ่ม Copy Data
    copyBtn.addEventListener('click', () => {
        const data = [...document.querySelectorAll(".css-dvgoqj")].map(card => ({
            name: card.querySelector(".main")?.textContent.trim(),
            price: (
                card.querySelector(".discountPriceWrapper")?.textContent ||
                [...card.querySelectorAll("p")]
                    .find(p =>
                        !p.classList.contains("main") &&
                        !p.classList.contains("sub") &&
                        !p.classList.contains("quantity")
                    )?.textContent ||
                ""
            )
                .replace(/฿/g, "")
                .trim(),
            quantity: card.querySelector(".quantity")?.textContent.trim(),
            image: card.querySelector('img:not([aria-hidden="true"])')?.src || ""
        }));

        if (data.length === 0) {
            alert("ไม่พบข้อมูลสินค้าบนหน้านี้");
            return;
        }

        const textToCopy = JSON.stringify(data, null, 2);

        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '✅ Copied!';
            copyBtn.style.backgroundColor = '#2e7d32';

            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.backgroundColor = '#1976d2';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert("ไม่สามารถคัดลอกข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
        });
    });

    // 5. การทำงานของปุ่มเปิดเว็บ
    linkBtn.addEventListener('click', () => {
        window.open('https://jsontotable.org/', '_blank');
    });

    container.appendChild(copyBtn);
    container.appendChild(linkBtn);

    // 6. แปะปุ่มลงในหน้าเว็บ
    const init = setInterval(() => {
        if (document.body) {
            document.body.appendChild(container);
            clearInterval(init);
        }
    }, 500);

    // 7. ฟังก์ชันเช็ค URL ตลอดเวลา
    // ถ้า URL ปัจจุบันมีคำว่า /account/orders/ ให้แสดงปุ่ม ถ้าไม่มีให้ซ่อน
    setInterval(() => {
        if (window.location.href.includes('https://www.makro.pro/account/orders')) {
            container.style.display = 'flex';
        } else {
            container.style.display = 'none';
        }
    }, 500); // เช็คทุกๆ 0.5 วินาที

})();`,
        isHighlight: false,
      },
    ],
  },
];
