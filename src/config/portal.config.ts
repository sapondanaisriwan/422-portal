export interface SocialLink {
  platform: string;
  url: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  date: string;
  type: "info" | "warning" | "success" | "promotion";
}

export interface QRCodeItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  url?: string;
}

export interface ManagerItem {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface PortalConfig {
  profile: {
    username: string;
    displayName: string;
    avatarUrl: string;
    bannerUrl: string;
    avatarInitials: string;
    description: string;
    socials: SocialLink[];
  };
  theme: {
    primaryHex: string;
    primaryHexLight: string;
    primaryHexDark: string;
    tailwindGradientFrom: string;
    tailwindGradientTo: string;
    tailwindSelectionBg: string;
  };
  announcements: AnnouncementItem[];
  qrcodes: QRCodeItem[];
  managers: ManagerItem[];
}

export const PortalConfig: PortalConfig = {
  profile: {
    username: "422 Space",
    displayName: "422 Space",
    avatarUrl: "422-logo.png",
    bannerUrl: "banner.jpg",
    avatarInitials: "422",
    description: "มาเปย์กันเถอะ! มาเปย์กันเถอะ! มาเปย์กันเถอะ!",
    socials: [
      {
        platform: "Facebook",
        url: "https://www.facebook.com/shoppingmallcpecmu",
      },
      {
        platform: "Github",
        url: "https://github.com/sapondanaisriwan/422-portal",
      },
    ],
  },
  theme: {
    primaryHex: "#f97316",
    primaryHexLight: "#f9731633",
    primaryHexDark: "#f9731666",
    tailwindGradientFrom: "from-orange-500",
    tailwindGradientTo: "to-orange-400",
    tailwindSelectionBg: "selection:bg-orange-500/30",
  },
  announcements: [
    {
      id: "ann-1",
      title: "📢 ปรับเวลาทำการของร้านค้า 422",
      content:
        "เพื่อความสะดวกของสมาชิก ตั้งแต่วันที่ 15 กรกฎาคมนี้เป็นต้นไป ร้านค้าจะปรับเวลาเปิดให้บริการเป็น 08:00 - 20:00 น. ทุกวัน ขอเชิญชวนมาช้อปปิ้งกันได้เลยครับ",
      date: "12 ก.ค. 2026",
      type: "info",
    },
    {
      id: "ann-2",
      title: "🎉 โปรโมชันช้อปปิ้งต้อนรับเดือนนี้!",
      content:
        "เมื่อสั่งซื้อสินค้าและขนมในร้านครบ 300 บาทขึ้นไป รับทันทีคูปองส่วนลดพิเศษมูลค่า 30 บาท สำหรับใช้ในบิลถัดไป (คูปองมีจำนวนจำกัดนะ)",
      date: "10 ก.ค. 2026",
      type: "promotion",
    },
  ],
  qrcodes: [
    {
      id: "qr-1",
      title: "PromptPay",
      description:
        "สแกน QR Code เพื่อโอนเงินชำระค่าสินค้าและบริการของร้านค้า 422 Space",
      url: "qrcode.png",
    },
  ],
  managers: [
    {
      id: "mgr-1",
      name: "สพลดนัย ศรีวรรณ์ (ซอฟท์)",
      avatarUrl: "manager/nongmeow.jpg",
    },
    {
      id: "mgr-2",
      name: "กิตติพงศ์ ไชยายอง (กอล์ฟ)",
      avatarUrl: "manager/nongmeow.jpg",
    },
  ],
};
