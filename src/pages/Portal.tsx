import { Facebook, Instagram, Github } from "@thesvg/react";
import { PortalConfig } from "../config/portal.config";
import LinkAggregator from "../components/LinkAggregator";

export default function Portal() {
  const { profile, theme } = PortalConfig;

  const renderSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <Facebook className="h-4 w-4" />;
      case "instagram":
        return <Instagram className="h-4 w-4" />;
      case "github":
        return <Github className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen bg-black text-white font-sans ${theme.tailwindSelectionBg} pb-32 relative`}
    >
      {/* Background Effects */}
      {/* <div className="absolute top-0 left-0 z-0 h-screen w-full border-t border-white/5 bg-[linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] bg-[size:150px_100px] [mask-image:radial-gradient(circle_at_top_left,rgba(255,255,255,1)_0%,rgba(255,255,255,.2)_60%),linear-gradient(rgba(255,255,255,1)_70%,rgba(255,255,255,0)_100%)] pointer-events-none" /> */}

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
          maskComposite: "intersect", // `source-in` isn't supported by the standard property
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
            <div className="w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] bg-neutral-700 rounded-full overflow-hidden relative flex items-center justify-center">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover object-center"
                />
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
            <LinkAggregator />
          </div>
        </div>
      </div>
    </div>
  );
}
