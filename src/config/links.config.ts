export type LinkType = "form" | "excel" | "doc" | "link" | "snippet";

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
      {
        title: "Json to Table",
        url: "https://jsontotable.org/",
        type: "link",
        description: "แปลง JSON เป็นตาราง HTML",
      },
      {
        title: "ดึงรายการสินค้า และราคาจากหน้าเว็บ",
        type: "snippet",
        description: "",
        code: `// Script by Adashima (6/7/69) //
// ดึง ชื่อสินค้า, ราคารวม, จำนวนแพ็คที่ซื้อ และนำมาแสดงเป็นตาราง
const products = [...document.querySelectorAll(".css-dvgoqj")].map(card => ({
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
    quantity: card.querySelector(".quantity")?.textContent.trim()
}));

console.table(products);
`,
      },
      {
        title: "ดึงรูปสินค้าจากหน้าเว็บ",
        type: "snippet",
        description: "",
        code: `// Script by Adashima (11/7/69) //
// ดึงรูปสินค้ามาแสดง
const imageData = [...document.querySelectorAll(".css-dvgoqj")].map(card => ({
    name: card.querySelector(".main")?.textContent.trim(),
    image: card.querySelector('img:not([aria-hidden="true"])')?.src || ""
}));

console.log(imageData)
`,
      },
    ],
  },
];
