import { FileText, Link as LinkIcon, ChevronRight } from "lucide-react";
import { linksConfig, type LinkType } from "../config/links.config";
import { GoogleForms2026, GoogleSheets2026 } from "@thesvg/react";

export default function LinkAggregator() {
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
      default:
        return {
          icon: <LinkIcon size={20} />,
          colorClass: "text-neutral-400 bg-neutral-400/10",
        };
    }
  };

  return (
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

                return (
                  <a
                    key={itemIdx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center p-3 rounded-xl transition-all duration-200 outline-none
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
  );
}
