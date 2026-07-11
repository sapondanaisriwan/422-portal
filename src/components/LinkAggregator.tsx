import { useState, useEffect } from "react";
import { FileText, Link as LinkIcon, ChevronRight, Code, Copy, Check, X } from "lucide-react";
import { linksConfig, type LinkItem, type LinkType } from "../config/links.config";
import { GoogleForms2026, GoogleSheets2026 } from "@thesvg/react";

export default function LinkAggregator() {
  const [activeSnippet, setActiveSnippet] = useState<LinkItem | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveSnippet(null);
      }
    };
    if (activeSnippet) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeSnippet]);

  const handleCopy = async () => {
    if (!activeSnippet?.code) return;
    try {
      await navigator.clipboard.writeText(activeSnippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const getLinkMeta = (type: LinkType) => {
    switch (type) {
      case "form":
        return {
          icon: <GoogleForms2026 className="h-6 w-6" />,
          colorClass: "text-purple-400 bg-purple-400/10",
        };
      case "excel":
        return {
          icon: <GoogleSheets2026 className="h-6 w-6" />,
          colorClass: "text-green-400 bg-green-400/10",
        };
      case "doc":
        return {
          icon: <FileText size={20} />,
          colorClass: "text-blue-400 bg-blue-400/10",
        };
      case "snippet":
        return {
          icon: <Code size={20} />,
          colorClass: "text-orange-400 bg-orange-400/10",
        };
      default:
        return {
          icon: <LinkIcon size={20} />,
          colorClass: "text-neutral-400 bg-neutral-400/10",
        };
    }
  };

  return (
    <>
      <div className="w-full max-w-3xl mx-auto mt-12 px-4 md:px-0">
        <div className="flex flex-col gap-8">
          {linksConfig.map((category, idx) => (
            <section key={idx} className="w-full">
              <h3 className="text-sm font-semibold text-white/50 tracking-wider uppercase mb-3 px-1">
                {category.title}
              </h3>

              <div className="flex flex-col gap-2">
                {category.items.map((item, itemIdx) => {
                  const meta = getLinkMeta(item.type);
                  const isSnippet = item.type === "snippet";

                  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                    if (isSnippet) {
                      e.preventDefault();
                      setActiveSnippet(item);
                    }
                  };

                  return (
                    <a
                      key={itemIdx}
                      href={isSnippet ? undefined : item.url}
                      target={isSnippet ? undefined : "_blank"}
                      rel={isSnippet ? undefined : "noopener noreferrer"}
                      onClick={isSnippet ? handleClick : undefined}
                      role={isSnippet ? "button" : undefined}
                      className={`group flex items-center p-3 rounded-xl transition-all duration-200 outline-none cursor-pointer w-full text-left
                        ${
                          item.isHighlight
                            ? "bg-white/5 border border-white/10 hover:bg-white/10"
                            : "bg-transparent border border-transparent hover:bg-white/5"
                        }
                      `}
                    >
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${meta.colorClass}`}
                      >
                        {meta.icon}
                      </div>

                      <div className="ml-4 flex-1 min-w-0">
                        <p className="text-base font-medium text-white/90 truncate group-hover:text-white transition-colors">
                          {item.title}
                        </p>
                        {item.description && (
                          <p className="text-sm text-white/40 truncate mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="ml-4 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all duration-200 shrink-0">
                        <ChevronRight size={18} />
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Code Snippet Modal */}
      {activeSnippet && (
        <div
          className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300"
          onClick={() => setActiveSnippet(null)}
        >
          <div
            className="w-full max-w-3xl bg-neutral-950/95 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg text-orange-400 bg-orange-400/10">
                  <Code size={16} />
                </div>
                <h4 className="text-lg font-semibold text-white truncate">
                  {activeSnippet.title}
                </h4>
              </div>
              <button
                onClick={() => setActiveSnippet(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex flex-col gap-4">
              {activeSnippet.description && (
                <p className="text-sm text-white/60">
                  {activeSnippet.description}
                </p>
              )}

              <div className="relative group/code rounded-xl overflow-hidden border border-white/5 bg-neutral-900">
                {/* Copy Button */}
                <button
                  onClick={handleCopy}
                  className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer
                    ${
                      copied
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copied ? "คัดลอกแล้ว!" : "คัดลอก"}</span>
                </button>

                <pre className="p-5 font-mono text-sm text-neutral-200 overflow-x-auto whitespace-pre leading-relaxed select-text text-left max-h-[50vh]">
                  <code>{activeSnippet.code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
