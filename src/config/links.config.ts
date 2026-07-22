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
        title: "ลำดับการสมัครตะกร้าคุณธรรม",
        url: "https://docs.google.com/spreadsheets/d/13H1j1Rm5AbROEaXFa_WpcDP9yb0nai_yBFAuPR4P5MU/edit?usp=sharing",
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
        url: "https://github.com/sapondanaisriwan/422-portal/raw/main/scripts/makro-v2.user.js",
        code: `// ==UserScript==
// @name         Copy Product Data (API Version) & JSON to Table
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  ดึงข้อมูลสินค้าผ่าน GraphQL API พร้อมราคา ขนาด
// @match        *://www.makro.pro/*
// @grant        none
// @author       Sapondanai Sriwan
// ==/UserScript==`,
        isHighlight: false,
      },
    ],
  },
];
