export interface SocialLink {
  platform: string;
  url: string;
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
}

export const PortalConfig: PortalConfig = {
  profile: {
    username: "422 Space ทดสอบ",
    displayName: "422 Space ทดสอบ",
    avatarUrl: "422-logo.png",
    bannerUrl: "banner.jpg",
    avatarInitials: "422",
    description:
      "มาเปย์กันเถอะ! มาเปย์กันเถอะ! มาเปย์กันเถอะ!",
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
};
