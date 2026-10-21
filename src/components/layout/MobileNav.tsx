import React from "react";
import {
  X,
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

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { currentView, setCurrentView, wardrobe, outfits, resetToDemoData, setIsAddItemModalOpen } = useWardrobe();

  if (!isOpen) return null;

  const handleNavigate = (route: ViewRoute) => {
    setCurrentView(route);
    onClose();
  };

  const navItems = [
    { id: "dashboard", label: "The Edit", icon: LayoutDashboard },
    { id: "wardrobe", label: "The Rack", icon: Layers },
    { id: "studio", label: "Fitting Room", icon: Shirt },
    { id: "collections", label: "Collections", icon: BookmarkCheck },
    { id: "calendar", label: "Wear Calendar", icon: CalendarDays },
    { id: "insights", label: "Closet Report", icon: LineChart },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#193B2F]/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-canvas border-r border-[#E7E4DB] flex flex-col z-10 animate-fade-in">
        <div className="p-5 border-b border-[#E7E4DB] flex items-center justify-between">
          <div>
            <div className="font-serif text-xl font-medium text-[#26332D]">fit theory</div>
            <div className="text-[11px] uppercase tracking-widest text-[#727A70]">A store for your own style</div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#727A70] hover:text-[#26332D] rounded-md"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3">
          <button
            onClick={() => {
              setIsAddItemModalOpen(true);
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#244A3B] text-white text-xs uppercase tracking-widest font-semibold rounded"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#E5E8DF] text-[#26332D] font-semibold border-l-2 border-[#244A3B]"
                    : "text-[#727A70] hover:bg-[#EEEAE1] hover:text-[#26332D]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#26332D]" : "text-[#7D8379]"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#E7E4DB] bg-[#FBFAF6]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#E5E8DF] flex items-center justify-center font-serif font-bold text-xs">
              FT
            </div>
            <div>
              <div className="text-xs font-medium text-[#26332D]">My Style Space</div>
              <div className="text-[11px] text-[#727A70]">
                {wardrobe.length} pieces | {outfits.length} looks
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              resetToDemoData();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-1.5 text-xs text-[#727A70] hover:text-[#26332D] hover:bg-[#EEEAE1] rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#7D8379]" />
            <span>Reset demo data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const MobileBottomBar: React.FC = () => {
  const { currentView, setCurrentView } = useWardrobe();

  const items = [
    { id: "dashboard", label: "Edit", icon: LayoutDashboard },
    { id: "wardrobe", label: "Rack", icon: Layers },
    { id: "studio", label: "Style", icon: Shirt },
    { id: "collections", label: "Edits", icon: BookmarkCheck },
    { id: "calendar", label: "Plans", icon: CalendarDays },
  ] as const;

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 bg-[#FBFAF6]/95 backdrop-blur-md border-t border-[#E7E4DB] z-30 px-1.5 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] flex items-center justify-around shadow-subtle">
      {items.map(item => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex flex-col items-center justify-center min-h-[44px] py-1 px-2.5 rounded transition-all ${
              isActive ? "text-[#26332D] font-semibold scale-105" : "text-[#727A70] hover:text-[#26332D]"
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? "text-[#26332D]" : "text-[#7D8379]"}`} />
            <span className="text-[11px] tracking-tight mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
