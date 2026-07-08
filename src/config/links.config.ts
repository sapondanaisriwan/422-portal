export type LinkType = "form" | "excel" | "doc" | "link";

export interface LinkItem {
  title: string;
  url: string;
  type: LinkType;
  description?: string;
  isHighlight?: boolean;
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
];
