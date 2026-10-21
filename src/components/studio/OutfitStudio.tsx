import React, { useState } from "react";
import { useWardrobe } from "../../context/WardrobeContext";
import { WardrobePicker } from "./WardrobePicker";
import { OutfitCanvas } from "./OutfitCanvas";
import { OutfitSummaryPanel } from "./OutfitSummaryPanel";
import { MannequinVisualizer } from "./MannequinVisualizer";
import { ClothingCategory, ClothingItem } from "../../types";
import { Layers, User, Columns2, SlidersHorizontal, Eye } from "lucide-react";

export type StudioDisplayMode = "tabletop" | "mannequin" | "dual";

export const OutfitStudio: React.FC = () => {
  const { wardrobe, studioDraft, setStudioDraft, showToast } = useWardrobe();
  const [activeSlotForPicker, setActiveSlotForPicker] = useState<ClothingCategory | "All">("All");
  const [mobileTab, setMobileTab] = useState<"canvas" | "picker" | "summary">("canvas");
  const [displayMode, setDisplayMode] = useState<StudioDisplayMode>("tabletop");

  const handleSelectItemFromPicker = (item: ClothingItem) => {
    setStudioDraft(prev => {
      let slotKey: keyof typeof prev.slots = "tops";
      if (item.category === "Tops") slotKey = "tops";
      else if (item.category === "Bottoms" || item.category === "Dresses") slotKey = "bottoms";
      else if (item.category === "Outerwear") slotKey = "outerwear";
      else if (item.category === "Shoes") slotKey = "shoes";
      else if (item.category === "Bags") slotKey = "bags";
      else if (item.category === "Accessories") slotKey = "accessories";

      return {
        ...prev,
        slots: {
          ...prev.slots,
          [slotKey]: item.id,
        },
      };
    });

    showToast(`Added "${item.name}" to look`);

    // On mobile, switch back to canvas to see placement
    if (window.innerWidth < 1280) {
      setMobileTab("canvas");
    }
  };

  const handleOpenPickerForSlot = (slot: "tops" | "bottoms" | "outerwear" | "shoes" | "bags" | "accessories") => {
    let cat: ClothingCategory | "All" = "All";
    if (slot === "tops") cat = "Tops";
    else if (slot === "bottoms") cat = "Bottoms";
    else if (slot === "outerwear") cat = "Outerwear";
    else if (slot === "shoes") cat = "Shoes";
    else if (slot === "bags") cat = "Bags";
    else if (slot === "accessories") cat = "Accessories";

    setActiveSlotForPicker(cat);
    if (window.innerWidth < 1280) {
      setMobileTab("picker");
    }
  };

  const placedCount = Object.values(studioDraft.slots).filter(Boolean).length;

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-[1440px] mx-auto">
      {/* Studio Editorial Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-[#FBFAF6] p-4 sm:p-6 border border-[#E7E4DB]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] uppercase tracking-[0.16em] text-[#34493E] font-semibold bg-[#E5E8DF] px-2.5 py-1">
              OUTFIT BUILDER
            </span>
            <span className="text-xs text-[#B95F43] font-serif">·</span>
            <span className="text-[11px] font-sans text-[#727A70] font-medium">
              Made from your wardrobe
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#26332D] tracking-[-0.035em]">
            Outfit studio
          </h2>
          <p className="text-xs sm:text-sm text-[#727A70] mt-1 font-sans">
            Put pieces together on the tabletop or preview them on the mannequin.
          </p>
        </div>

        {/* View Mode Toggle Strip */}
        <div className="flex flex-wrap items-center gap-2 self-start xl:self-auto">
          {/* Display Mode Switcher (Desktop) */}
          <div className="bg-[#EEEAE1] p-1 border border-[#E7E4DB] flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => setDisplayMode("tabletop")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                displayMode === "tabletop"
                  ? "bg-[#244A3B] text-white"
                  : "text-[#727A70] hover:text-[#244A3B]"
              }`}
              title="Editorial Flat-Lay Mood Board"
            >
              <Layers className="w-3.5 h-3.5 text-[#B95F43]" />
              <span>Flat Lay</span>
            </button>

            <button
              type="button"
              onClick={() => setDisplayMode("mannequin")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                displayMode === "mannequin"
                  ? "bg-[#244A3B] text-white"
                  : "text-[#727A70] hover:text-[#244A3B]"
              }`}
              title="Standing Atelier Mannequin Visualizer"
            >
              <User className="w-3.5 h-3.5 text-[#B95F43]" />
              <span>Mannequin</span>
            </button>

            <button
              type="button"
              onClick={() => setDisplayMode("dual")}
              className={`hidden xl:flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold transition-all ${
                displayMode === "dual"
                  ? "bg-[#244A3B] text-white"
                  : "text-[#727A70] hover:text-[#244A3B]"
              }`}
              title="Side-by-side Tabletop and Mannequin"
            >
              <Columns2 className="w-3.5 h-3.5 text-[#B95F43]" />
              <span>Dual View</span>
            </button>
          </div>

          {/* Mobile Tab Switcher */}
          <div className="sticky top-14 z-20 flex xl:hidden bg-[#F8F6F0] py-2 border-b border-[#E7E4DB] xl:static xl:bg-transparent xl:py-0 xl:border-0">
            <button
              onClick={() => setMobileTab("canvas")}
              className={`px-2.5 py-2 text-[11px] font-semibold ${
                mobileTab === "canvas" ? "bg-[#244A3B] text-white" : "text-[#727A70]"
              }`}
            >
              Look ({placedCount})
            </button>
            <button
              onClick={() => setMobileTab("picker")}
              className={`px-2.5 py-2 text-[11px] font-semibold ${
                mobileTab === "picker" ? "bg-[#244A3B] text-white" : "text-[#727A70]"
              }`}
            >
              Pieces
            </button>
            <button
              onClick={() => setMobileTab("summary")}
              className={`px-2.5 py-2 text-[11px] font-semibold ${
                mobileTab === "summary" ? "bg-[#244A3B] text-white" : "text-[#727A70]"
              }`}
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Main Responsive Grid Layout based on displayMode */}
      {displayMode === "dual" ? (
        /* DUAL VIEW: Picker (3 cols) + Canvas (3 cols) + Mannequin (3 cols) + Summary (3 cols) */
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-12 gap-4 items-start">
          <div className="2xl:col-span-3">
            <WardrobePicker
              activeSlotCategory={activeSlotForPicker}
              onSelectItem={handleSelectItemFromPicker}
            />
          </div>
          <div className="2xl:col-span-3">
            <OutfitCanvas onOpenPickerForSlot={handleOpenPickerForSlot} />
          </div>
          <div className="2xl:col-span-3">
            <MannequinVisualizer onOpenPickerForSlot={handleOpenPickerForSlot} />
          </div>
          <div className="2xl:col-span-3">
            <OutfitSummaryPanel />
          </div>
        </div>
      ) : displayMode === "mannequin" ? (
        /* MANNEQUIN VIEW: Picker (3 cols) + Mannequin (5 cols) + Summary (4 cols) */
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-12 gap-5 items-start">
          <div className={`2xl:col-span-3 ${mobileTab === "picker" ? "block" : "hidden xl:block"}`}>
            <WardrobePicker
              activeSlotCategory={activeSlotForPicker}
              onSelectItem={handleSelectItemFromPicker}
            />
          </div>
          <div className={`2xl:col-span-5 ${mobileTab === "canvas" ? "block" : "hidden xl:block"}`}>
            <MannequinVisualizer onOpenPickerForSlot={handleOpenPickerForSlot} />
          </div>
          <div className={`2xl:col-span-4 ${mobileTab === "summary" ? "block" : "hidden xl:block"}`}>
            <OutfitSummaryPanel />
          </div>
        </div>
      ) : (
        /* TABLETOP FLAT LAY: Picker (3 cols) + Canvas (5 cols) + Summary (4 cols) */
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-12 gap-5 items-start">
          <div className={`2xl:col-span-3 ${mobileTab === "picker" ? "block" : "hidden xl:block"}`}>
            <WardrobePicker
              activeSlotCategory={activeSlotForPicker}
              onSelectItem={handleSelectItemFromPicker}
            />
          </div>
          <div className={`2xl:col-span-5 ${mobileTab === "canvas" ? "block" : "hidden xl:block"}`}>
            <OutfitCanvas onOpenPickerForSlot={handleOpenPickerForSlot} />
          </div>
          <div className={`2xl:col-span-4 ${mobileTab === "summary" ? "block" : "hidden xl:block"}`}>
            <OutfitSummaryPanel />
          </div>
        </div>
      )}
    </div>
  );
};
