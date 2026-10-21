import React, { useState } from "react";
import {
  LayoutDashboard,
  Layers,
  Shirt,
  BookmarkCheck,
  CalendarDays,
  LineChart,
  RotateCcw,
  Plus
} from "lucide-react";
import { useWardrobe } from "../../context/WardrobeContext";
import { ViewRoute } from "../../types";
import { ConfirmDialog } from "../ui/ConfirmDialog";

interface NavItem {
  id: ViewRoute;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "The Edit", icon: LayoutDashboard },
  { id: "wardrobe", label: "The Rack", icon: Layers },
  { id: "studio", label: "Fitting Room", icon: Shirt, badge: "Canvas" },
  { id: "collections", label: "Collections", icon: BookmarkCheck },
  { id: "calendar", label: "Wear Calendar", icon: CalendarDays },
  { id: "insights", label: "Closet Report", icon: LineChart },
];

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    wardrobe,
    outfits,
    resetToDemoData,
    setIsAddItemModalOpen
  } = useWardrobe();

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-[#FBFAF6] border-r border-[#E7E4DB] select-none flex-shrink-0 z-30">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#E7E4DB]">
        <button
          onClick={() => setCurrentView("dashboard")}
          className="text-left group block focus:outline-none"
        >
          <span className="font-serif text-2xl tracking-tight font-medium text-[#244A3B] group-hover:text-[#B95F43] transition-colors">
            fit theory
          </span>
          <span className="block text-[11px] uppercase tracking-widest text-[#727A70] mt-0.5 font-sans font-medium">
            A store for your own style
          </span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-widest text-[#727A70]">
          Navigation
        </div>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-sm font-sans font-medium transition-all group ${
                isActive
                  ? "bg-[#E5E8DF] text-[#244A3B] font-semibold border-l-2 border-[#244A3B]"
                  : "text-[#727A70] hover:text-[#244A3B] hover:bg-[#F0EEE6]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-[#26332D]" : "text-[#7D8379] group-hover:text-[#26332D]"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[11px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-[#E5E8DF] text-[#34493E]">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Quick Add Button in Sidebar */}
        <div className="pt-4 px-1">
          <button
            onClick={() => setIsAddItemModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#E5E8DF] hover:bg-[#DDE4DA] text-[#26332D] text-xs uppercase tracking-widest font-semibold rounded border border-[#E7E4DB] transition-all group"
          >
            <Plus className="w-3.5 h-3.5 transition-transform group-hover:rotate-90" />
            <span>Add Clothing</span>
          </button>
        </div>
      </nav>

      {/* Profile & Settings Footer */}
      <div className="p-4 border-t border-[#E7E4DB] bg-[#FBFAF6]/60">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#E5E8DF] flex items-center justify-center text-xs font-serif font-bold text-[#26332D] shadow-sm">
              FT
            </div>
            <div className="text-left">
              <div className="text-xs font-medium text-[#26332D]">My Style Space</div>
              <div className="text-[11px] text-[#727A70]">
                {wardrobe.length} items | {outfits.length} looks
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsResetConfirmOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-1.5 px-2 text-[11px] text-[#727A70] hover:text-[#26332D] hover:bg-[#EEEAE1] rounded transition-colors"
          title="Restore original 20 demo items and looks"
        >
          <RotateCcw className="w-3 h-3 text-[#7D8379]" />
          <span>Reset demo data</span>
        </button>
      </div>

      {/* Confirmation Dialog for Demo Data Reset */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={resetToDemoData}
        title="Reset to Initial Demo Data?"
        message="This will restore the original 20 sample clothing items, curated outfits, and calendar schedule. Any custom additions will be reset."
        confirmLabel="Reset Everything"
      />
    </aside>
  );
};
