import React from "react";
import { Plus, Menu, Search, Layers } from "lucide-react";
import { useWardrobe } from "../../context/WardrobeContext";
import { ViewRoute } from "../../types";

interface TopbarProps {
  onOpenMobileMenu: () => void;
}

const VIEW_TITLES: Record<ViewRoute, { title: string; subtitle: string }> = {
  dashboard: {
    title: "The Edit",
    subtitle: "A store for the clothes you already own.",
  },
  wardrobe: {
    title: "The Rack",
    subtitle: "Browse every piece in your personal collection.",
  },
  studio: {
    title: "Fitting Room",
    subtitle: "Put together a look from pieces you already own.",
  },
  collections: {
    title: "Collections",
    subtitle: "Themed edits and capsules for every mood.",
  },
  calendar: {
    title: "Wear Calendar",
    subtitle: "Plan and coordinate your outfits ahead of time.",
  },
  insights: {
    title: "Closet Report",
    subtitle: "Transparent analysis and category distribution.",
  },
};

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileMenu }) => {
  const { currentView, setCurrentView, setIsAddItemModalOpen } = useWardrobe();
  const currentMeta = VIEW_TITLES[currentView] || VIEW_TITLES.dashboard;

  return (
    <header className="sticky top-0 z-20 bg-[#FBFAF6]/90 backdrop-blur-md border-b border-[#E7E4DB] px-3.5 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex items-center justify-between">
      {/* Left: Mobile hamburger & Page Breadcrumb Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden w-10 h-10 p-2 text-[#26332D] hover:bg-[#E5E8DF]/40 rounded-md transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-widest text-[#727A70] font-sans font-medium">
              FitTheory
            </span>
            <span className="text-[#7D8379] text-xs">/</span>
            <span className="text-xs font-serif font-medium text-[#26332D]">
              {currentMeta.title}
            </span>
          </div>
          <h1 className="text-base sm:text-lg font-serif font-medium text-[#26332D] tracking-tight hidden sm:block">
            {currentMeta.subtitle}
          </h1>
        </div>
      </div>

      {/* Right: Quick Studio shortcut & Primary "+ Add item" Button */}
      <div className="flex items-center gap-2.5">
        {currentView !== "studio" && (
          <button
            onClick={() => setCurrentView("studio")}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#727A70] hover:text-[#26332D] hover:bg-[#E5E8DF]/40 rounded border border-[#E7E4DB] transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-[#7D8379]" />
            <span>Open Studio</span>
          </button>
        )}

        <button
          onClick={() => setIsAddItemModalOpen(true)}
          aria-label="Add clothing item"
          className="inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-[#244A3B] hover:bg-[#193B2F] text-white rounded text-xs uppercase tracking-widest font-semibold transition-all shadow-subtle hover:shadow-elevated focus:outline-none focus:ring-2 focus:ring-[#B95F43]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add item</span>
        </button>
      </div>
    </header>
  );
};
