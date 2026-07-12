import { useState, useEffect } from "react";
import { Facebook, Instagram, Github } from "@thesvg/react";
import { QrCode, Users, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { PortalConfig } from "../config/portal.config";
import LinkAggregator from "../components/LinkAggregator";
// @ts-ignore
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

// Glob import for gallery images in public/gallery folder
const galleryModules = import.meta.glob("/public/gallery/*.{png,jpg,jpeg,gif,webp,svg,PNG,JPG,JPEG}", { eager: true });
const galleryItems = Object.keys(galleryModules).map((path, idx) => {
  const imageUrl = path.replace("/public", "");
  const filename = path.split("/").pop() || "";
  const title = filename.replace(/\.[^/.]+$/, "");
  return {
    id: `gal-${idx}`,
    title: title,
    imageUrl: imageUrl,
  };
});

export default function Portal() {
  const { profile, theme } = PortalConfig;
  const [activeTab, setActiveTab] = useState<string>(() => {
    const hash = window.location.hash.replace("#", "");
    return ["links", "gallery", "announcements", "qrcodes", "managers"].includes(hash) ? hash : "links";
  });
  const [activeImagePreview, setActiveImagePreview] = useState<{ title: string; imageUrl: string; type?: "qr" | "manager" | "gallery" | "profile" } | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (["links", "gallery", "announcements", "qrcodes", "managers"].includes(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveImagePreview(null);
      }
    };
    if (activeImagePreview) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeImagePreview]);

  const changeTab = (tab: string) => {
    window.location.hash = tab;
    setActiveTab(tab);
  };

  const renderSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <Facebook className="h-4 w-4" />;
      case "instagram":
        return <Instagram className="h-4 w-4" />;
      case "github":
        return <Github variant="dark" className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const mainTabs = [
    { id: "links", label: "ลิงก์ทั้งหมด", icon: <LinkIcon size={16} /> },
    { id: "gallery", label: "แกลเลอรี", icon: <ImageIcon size={16} /> },
    // { id: "announcements", label: "ข่าวประกาศ", icon: <Megaphone size={16} /> },
    { id: "qrcodes", label: "คิวอาร์โค้ด", icon: <QrCode size={16} /> },
    { id: "managers", label: "ผู้ดูแลร้านค้า", icon: <Users size={16} /> },
  ];

  const renderAnnouncements = () => {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 md:px-0 flex flex-col gap-4 animate-fade-in text-left">
        {PortalConfig.announcements.map((ann) => (
          <div
            key={ann.id}
            className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex flex-col gap-3 group"
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold
                ${ann.type === 'promotion' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}
              `}>
                {ann.type === 'promotion' ? 'โปรโมชัน' : 'ประกาศทั่วไป'}
              </span>
              <span className="text-xs text-white/40">{ann.date}</span>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
              {ann.title}
            </h3>
            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">
              {ann.content}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const renderGallery = () => {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 md:px-0 animate-fade-in text-left">
        {/* @ts-ignore */}
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 640: 2, 1024: 3 }}>
          {/* @ts-ignore */}
          <Masonry gutter="16px">
            {galleryItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveImagePreview({ title: item.title, imageUrl: item.imageUrl, type: "gallery" })}
                className="w-full rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 hover:scale-[1.01] transition-all duration-300 group cursor-zoom-in outline-none focus:border-orange-500"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-auto object-cover select-none block"
                  loading="lazy"
                />
              </button>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    );
  };

  const renderQRCodes = () => {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 md:px-0 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in text-left">
        {PortalConfig.qrcodes.map((qr) => {
          const qrCodeUrl = qr.imageUrl 
            ? qr.imageUrl 
            : qr.url 
              ? (qr.url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) || qr.url.startsWith("http://localhost") || qr.url.startsWith("localhost") || qr.url.includes("localhost:"))
                ? qr.url.startsWith("localhost") ? `http://${qr.url}` : qr.url
                : `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qr.url)}`
              : "";
          
          return (
            <div
              key={qr.id}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center text-center gap-4 group hover:bg-white/10 transition-all duration-300"
            >
              <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                {qr.title}
              </h3>
              <p className="text-xs text-white/50 leading-relaxed -mt-2">
                {qr.description}
              </p>
              
              <button
                onClick={() => setActiveImagePreview({ title: qr.title, imageUrl: qrCodeUrl, type: "qr" })}
                className="relative p-4 bg-white rounded-2xl overflow-hidden shadow-2xl group-hover:scale-[1.03] transition-all duration-300 w-52 h-52 flex items-center justify-center cursor-zoom-in outline-none border-2 border-transparent focus:border-orange-500"
                title="คลิกเพื่อขยายรูปภาพ"
              >
                <img
                  src={qrCodeUrl}
                  alt={qr.title}
                  className="w-full h-full object-contain"
                />
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  const renderManagers = () => {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 md:px-0 flex flex-col sm:flex-row justify-center items-stretch gap-6 animate-fade-in text-center">
        {PortalConfig.managers.map((mgr) => (
          <div
            key={mgr.id}
            className="w-full sm:w-72 p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-102 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 flex flex-col items-center justify-center"
          >
            {mgr.avatarUrl ? (
              <button
                onClick={() => setActiveImagePreview({ title: mgr.name, imageUrl: mgr.avatarUrl!, type: "manager" })}
                className="w-36 h-36 rounded-2xl flex items-center justify-center text-orange-400 font-bold text-2xl mb-4 relative shadow-inner shadow-orange-500/10 shrink-0 overflow-hidden cursor-zoom-in outline-none focus:border-orange-500 hover:scale-[1.03] transition-all duration-300"
                title="คลิกเพื่อขยายรูปโปรไฟล์"
              >
                <img
                  src={mgr.avatarUrl}
                  alt={mgr.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-orange-500/20 to-orange-400/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-2xl mb-4 relative shadow-inner shadow-orange-500/10 shrink-0 overflow-hidden">
                {mgr.name.replace("คุณ", "").substring(0, 2)}
              </div>
            )}
            
            <h3 className="text-lg font-bold text-white">
              {mgr.name}
            </h3>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen bg-black text-white font-sans ${theme.tailwindSelectionBg} pb-32 relative`}
    >
      <div
        className="absolute top-0 left-0 z-0 h-screen w-full border-t border-white/5"
        style={{
          backgroundImage: `
      linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
    `,
          backgroundSize: "150px 100px",
          backgroundPosition: "-1px -1px",
          WebkitMaskImage: `
      radial-gradient(circle at left top, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0.2) 60%),
      linear-gradient(rgb(255, 255, 255) 70%, rgba(255, 255, 255, 0) 100%)
    `,
          maskImage: `
      radial-gradient(circle at left top, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0.2) 60%),
      linear-gradient(rgb(255, 255, 255) 70%, rgba(255, 255, 255, 0) 100%)
    `,
          WebkitMaskComposite: "source-in",
          maskComposite: "intersect",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom right, ${theme.primaryHexDark}, transparent, ${theme.primaryHexLight})`,
        }}
      />

      <div className="relative z-10 flex flex-col items-center mx-auto max-w-5xl">
        {/* Banner Section */}
        <div className="w-full relative aspect-[128/40] max-h-[300px] md:mt-8">
          {profile.bannerUrl ? (
            <img
              src={profile.bannerUrl}
              alt="Banner"
              className="w-full h-full object-cover object-center md:rounded-t-3xl transition-all duration-300"
              style={{
                maskImage:
                  "linear-gradient(to bottom, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%)",
              }}
            />
          ) : (
            <div
              className="absolute inset-0 bg-neutral-800 md:rounded-t-3xl"
              style={{
                maskImage:
                  "linear-gradient(to bottom, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%)",
              }}
            />
          )}
        </div>

        {/* Profile Section */}
        <div className="sm:px-16 md:px-8 w-full -mt-[60px] md:-mt-[75px] flex flex-col items-center md:flex-row md:items-start md:gap-8 transition-all duration-300 justify-center">
          <div className="relative">
            <div className="w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] bg-neutral-700 rounded-full overflow-hidden relative flex items-center justify-center shrink-0 border border-white/10 shadow-2xl">
              {profile.avatarUrl ? (
                <button
                  onClick={() => setActiveImagePreview({ title: profile.displayName, imageUrl: profile.avatarUrl, type: "profile" })}
                  className="w-full h-full cursor-zoom-in outline-none flex items-center justify-center"
                  title="คลิกเพื่อขยายรูปโปรไฟล์"
                >
                  <img
                    src={profile.avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover object-center"
                  />
                </button>
              ) : (
                <span className="text-neutral-500 font-bold text-2xl">
                  {profile.avatarInitials}
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 md:mt-[90px] w-full flex flex-col items-center md:items-start">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
              {profile.displayName}
            </h1>

            {/* Social Links */}
            <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start mt-4">
              {profile.socials.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1 text-sm font-semibold text-white transition duration-300 hover:scale-105 bg-black/20 backdrop-blur-sm"
                >
                  {renderSocialIcon(social.platform)}
                  <span>{social.platform}</span>
                </a>
              ))}
            </div>

            <p className="text-base text-white/90 text-center md:text-left max-w-2xl mt-2">
              {profile.description}
            </p>

            {/* Main Tabs Navigation */}
            <div className="w-full border-b border-white/10 mt-8 mb-6 flex overflow-x-auto no-scrollbar gap-6 px-4 md:px-0">
              {mainTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => changeTab(tab.id)}
                    className={`flex items-center gap-2 pb-3 pt-1 text-sm font-semibold transition-all relative cursor-pointer outline-none shrink-0
                      ${isActive ? "text-orange-500 font-bold" : "text-white/60 hover:text-white"}
                    `}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[3px] bg-orange-500 rounded-t-full shadow-md shadow-orange-500/50" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div className="w-full transition-all duration-300">
              {activeTab === "links" && <LinkAggregator />}
              {activeTab === "gallery" && renderGallery()}
              {activeTab === "announcements" && renderAnnouncements()}
              {activeTab === "qrcodes" && renderQRCodes()}
              {activeTab === "managers" && renderManagers()}
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {activeImagePreview && (
        <div
          className="fixed inset-0 z-55 flex flex-col items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-all duration-300 cursor-zoom-out"
          onClick={() => setActiveImagePreview(null)}
        >
          <div 
            className="flex flex-col items-center gap-4 max-w-4xl w-full scale-100"
          >
            {activeImagePreview.type === "qr" ? (
              // Large white background box for QR Code so it remains easily scannable
              <div className="relative p-6 sm:p-8 bg-white rounded-3xl overflow-hidden shadow-2xl w-80 h-80 sm:w-[420px] sm:h-[420px] flex items-center justify-center border border-white/10">
                <img
                  src={activeImagePreview.imageUrl}
                  alt={activeImagePreview.title}
                  className="w-full h-full object-contain select-none"
                />
              </div>
            ) : (
              // Clean borderless full-size preview for gallery, manager profile, and main profile
              <img
                src={activeImagePreview.imageUrl}
                alt={activeImagePreview.title}
                className="max-w-[95vw] max-h-[80vh] md:max-h-[85vh] object-contain rounded-2xl shadow-2xl select-none"
              />
            )}
            
            <div className="text-center flex flex-col gap-1 px-4">
              {activeImagePreview.type !== "gallery" && (
                <h4 className="text-lg font-bold text-white">
                  {activeImagePreview.title}
                </h4>
              )}
              <p className="text-xs text-white/50">
                คลิกที่ใดก็ได้บนหน้าจอ หรือกดปุ่ม ESC เพื่อปิด
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
