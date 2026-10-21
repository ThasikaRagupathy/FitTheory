import React, { useState } from "react";
import { ClothingItem } from "../../types";
import { useWardrobe } from "../../context/WardrobeContext";
import { getColorHex } from "../../utils/colorMatching";
import { Eye, X, RefreshCw, Plus, Info } from "lucide-react";

interface MannequinVisualizerProps {
  onOpenPickerForSlot?: (slot: "tops" | "bottoms" | "outerwear" | "shoes" | "bags" | "accessories") => void;
  className?: string;
  isCompact?: boolean;
}

export const MannequinVisualizer: React.FC<MannequinVisualizerProps> = ({
  onOpenPickerForSlot,
  className = "",
  isCompact = false
}) => {
  const { wardrobe, studioDraft, setStudioDraft, showToast } = useWardrobe();
  const [activeHoverSlot, setActiveHoverSlot] = useState<string | null>(null);

  const getItem = (id?: string): ClothingItem | undefined => {
    return id ? wardrobe.find(w => w.id === id) : undefined;
  };

  const topItem = getItem(studioDraft.slots.tops);
  const bottomItem = getItem(studioDraft.slots.bottoms);
  const outerwearItem = getItem(studioDraft.slots.outerwear);
  const shoesItem = getItem(studioDraft.slots.shoes);
  const bagsItem = getItem(studioDraft.slots.bags);
  const accessoriesItem = getItem(studioDraft.slots.accessories);

  const isDressSelected = bottomItem?.category === "Dresses";

  const handleDropToSlot = (slotId: keyof typeof studioDraft.slots, e: React.DragEvent) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("text/plain") || e.dataTransfer.getData("application/json");
    if (!itemId) return;

    const droppedItem = wardrobe.find(w => w.id === itemId);
    if (!droppedItem) return;

    setStudioDraft(prev => {
      let updatedSlots = { ...prev.slots };
      if (droppedItem.category === "Dresses") {
        updatedSlots.bottoms = droppedItem.id;
      } else {
        updatedSlots[slotId] = droppedItem.id;
      }
      return { ...prev, slots: updatedSlots };
    });

    showToast(`Dressed mannequin with "${droppedItem.name}"`);
  };

  const handleRemove = (slotId: keyof typeof studioDraft.slots, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setStudioDraft(prev => {
      const nextSlots = { ...prev.slots };
      delete nextSlots[slotId];
      return { ...prev, slots: nextSlots };
    });
  };

  return (
    <div
      className={`relative bg-gradient-to-b from-[#F8F6F0] via-[#F0EEE6] to-[#E5E8DF] border border-[#E7E4DB] p-3 sm:p-6 overflow-hidden shadow-canvas flex flex-col items-center justify-between min-h-[500px] sm:min-h-[620px] select-none ${className}`}
    >
      {/* Editorial Atelier Studio Lighting Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft overhead warm spotlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#E5E8DF]/35 rounded-full blur-3xl opacity-70" />
        {/* Floor pedestal radial shadow */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-72 h-16 bg-[#244A3B]/10 rounded-full blur-xl" />
      </div>

      {/* Atelier Eyebrow Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-[#E7E4DB]/70 z-10">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#727A70] font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#315B4A] inline-block animate-pulse" />
            FitTheory Atelier
          </span>
          <h4 className="font-serif text-base sm:text-lg font-medium text-[#26332D]">
            Editorial Mannequin Display
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-sans px-2.5 py-1 bg-white/80 backdrop-blur-sm rounded-full text-[#34493E] border border-[#E7E4DB] font-medium shadow-sm">
            {isDressSelected ? "Dress Silhouette" : "Layered Silhouette"}
          </span>
        </div>
      </div>

      {/* Main Interactive Mannequin Model & Layered Garments */}
      <div className="relative w-full max-w-sm flex-1 flex items-center justify-center py-6 sm:py-8 z-10">
        {/* SVG Standing Tailor's Dress Form Structure */}
        <div className="relative w-56 h-[390px] sm:w-64 sm:h-[440px] flex items-center justify-center">
          <svg
            className="absolute inset-0 w-full h-full text-[#B8B8AA]/50"
            viewBox="0 0 240 440"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Wooden Finial Top */}
            <circle cx="120" cy="20" r="8" fill="#B8A895" fillOpacity="0.4" stroke="#8C7D6B" />
            <path d="M120 28 L120 48" stroke="#8C7D6B" strokeWidth="2.5" />

            {/* Neck Collar */}
            <path d="M106 48 C106 46, 134 46, 134 48 C134 52, 106 52, 106 48 Z" fill="#D5C8B8" fillOpacity="0.6" stroke="#8C7D6B" />

            {/* Sculpted Atelier Torso / Dress Form */}
            <path
              d="M106 50
                 C85 52, 68 68, 66 88
                 C64 110, 78 135, 88 155
                 C94 167, 95 180, 88 198
                 C80 216, 75 240, 82 260
                 C88 275, 110 282, 120 282
                 C130 282, 152 275, 158 260
                 C165 240, 160 216, 152 198
                 C145 180, 146 167, 152 155
                 C162 135, 176 110, 174 88
                 C172 68, 155 52, 134 50
                 Z"
              fill="#F4EEE6"
              fillOpacity="0.85"
              stroke="#B8A895"
              strokeWidth="1.5"
            />

            {/* Tailor Seam Lines (Couture markings) */}
            <path d="M120 52 L120 280" stroke="#B8A895" strokeDasharray="3 3" strokeOpacity="0.7" />
            <path d="M80 145 C100 152, 140 152, 160 145" stroke="#B8A895" strokeDasharray="3 3" strokeOpacity="0.5" />
            <path d="M88 198 C104 205, 136 205, 152 198" stroke="#B8A895" strokeDasharray="3 3" strokeOpacity="0.5" />

            {/* Metal/Wood Stand Rod */}
            <path d="M120 282 L120 405" stroke="#54514C" strokeWidth="4" strokeLinecap="round" />

            {/* Cast Iron Pedestal Base */}
            <path d="M120 405 L75 425 M120 405 L165 425 M120 405 L120 430" stroke="#3D3B37" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="75" cy="425" r="4" fill="#3D3B37" />
            <circle cx="165" cy="425" r="4" fill="#3D3B37" />
            <circle cx="120" cy="430" r="4" fill="#3D3B37" />
          </svg>

          {/* ========================================================
              LAYER 1: ACCESSORIES (Head / Neck Level)
             ======================================================== */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDropToSlot("accessories", e)}
            onClick={() => onOpenPickerForSlot?.("accessories")}
            onMouseEnter={() => setActiveHoverSlot("accessories")}
            onMouseLeave={() => setActiveHoverSlot(null)}
            className="absolute top-2 left-1/2 -translate-x-1/2 cursor-pointer z-30 group"
          >
            {accessoriesItem ? (
              <div className="relative transform hover:scale-110 transition-transform">
                <div className="w-14 h-14 rounded-full bg-white/95 p-1 border-2 border-[#D8D9D1] shadow-elevated overflow-hidden ring-4 ring-white/60">
                  <img src={accessoriesItem.imageUrl} alt={accessoriesItem.name} className="w-full h-full object-cover rounded-full" />
                </div>
                {/* Floating chic label tag */}
                <div className="absolute -top-3 -right-24 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded shadow-md border border-[#E7E4DB] whitespace-nowrap flex items-center gap-1.5 animate-fade-in pointer-events-none">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accessoriesItem.colorHex || getColorHex(accessoriesItem.color) }} />
                  <span className="font-serif text-[11px] font-medium text-[#26332D]">{accessoriesItem.name.split(" ")[0]} {accessoriesItem.name.split(" ")[1] || ""}</span>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#B8B8AA]/60 bg-white/50 hover:bg-white flex items-center justify-center text-[#7D8379] hover:text-[#26332D] transition-all" title="Add Jewelry / Scarf">
                <Plus className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          {/* ========================================================
              LAYER 2: OUTERWEAR (Shoulder Drape Level)
             ======================================================== */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDropToSlot("outerwear", e)}
            onClick={() => onOpenPickerForSlot?.("outerwear")}
            onMouseEnter={() => setActiveHoverSlot("outerwear")}
            onMouseLeave={() => setActiveHoverSlot(null)}
            className="absolute top-14 left-1/2 -translate-x-1/2 cursor-pointer z-25 group"
          >
            {outerwearItem ? (
              <div className="relative transform hover:scale-105 transition-transform flex flex-col items-center">
                {/* Layered Outerwear Graphic */}
                <div className="w-40 h-32 sm:w-48 sm:h-36 rounded-2xl bg-white/95 p-1.5 border border-[#B8B8AA] shadow-elevated overflow-hidden relative">
                  <img src={outerwearItem.imageUrl} alt={outerwearItem.name} className="w-full h-full object-cover object-top rounded-xl opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[11px] uppercase tracking-wider text-white font-semibold">
                      {outerwearItem.name}
                    </span>
                  </div>
                </div>
                {/* Remove button on hover */}
                <button
                  type="button"
                  onClick={(e) => handleRemove("outerwear", e)}
                  className="absolute -top-2 -right-2 p-1 bg-white hover:bg-red-50 text-[#26332D] hover:text-red-600 rounded-full shadow-md transition-colors"
                  title="Remove layer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="px-3 py-1 rounded-full border border-dashed border-[#B8B8AA]/50 bg-white/40 hover:bg-white text-[11px] uppercase tracking-wider font-semibold text-[#727A70] hover:text-[#26332D] transition-colors">
                + Outerwear Drape
              </div>
            )}
          </div>

          {/* ========================================================
              LAYER 3: CORE TORSO (Top or Full Dress)
             ======================================================== */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDropToSlot(isDressSelected ? "bottoms" : "tops", e)}
            onClick={() => onOpenPickerForSlot?.(isDressSelected ? "bottoms" : "tops")}
            onMouseEnter={() => setActiveHoverSlot("torso")}
            onMouseLeave={() => setActiveHoverSlot(null)}
            className={`absolute ${outerwearItem ? "top-24" : "top-16"} left-1/2 -translate-x-1/2 cursor-pointer z-20 group`}
          >
            {isDressSelected && bottomItem ? (
              <div className="relative transform hover:scale-105 transition-transform flex flex-col items-center">
                <div className="w-36 h-56 rounded-2xl bg-white p-1.5 border border-[#E7E4DB] shadow-elevated overflow-hidden ring-2 ring-[#B95F43]/40">
                  <img src={bottomItem.imageUrl} alt={bottomItem.name} className="w-full h-full object-cover rounded-xl" />
                </div>
                <div className="absolute bottom-2 inset-x-2 bg-[#244A3B]/80 backdrop-blur-sm text-white px-2 py-1 rounded text-center">
                  <span className="font-serif text-[11px] block truncate">{bottomItem.name}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleRemove("bottoms", e)}
                  className="absolute -top-2 -right-2 p-1 bg-white hover:bg-red-50 text-[#26332D] hover:text-red-600 rounded-full shadow-md"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : topItem ? (
              <div className="relative transform hover:scale-105 transition-transform flex flex-col items-center">
                <div className="w-32 h-32 rounded-xl bg-white p-1 border border-[#E7E4DB] shadow-elevated overflow-hidden ring-2 ring-[#B95F43]/30">
                  <img src={topItem.imageUrl} alt={topItem.name} className="w-full h-full object-cover object-top rounded-lg" />
                </div>
                <button
                  type="button"
                  onClick={(e) => handleRemove("tops", e)}
                  className="absolute -top-2 -right-2 p-1 bg-white hover:bg-red-50 text-[#26332D] hover:text-red-600 rounded-full shadow-md"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="w-28 h-24 rounded-lg border-2 border-dashed border-[#B8B8AA]/50 bg-white/40 hover:bg-white flex flex-col items-center justify-center text-center p-2 transition-all">
                <span className="text-[11px] uppercase font-semibold text-[#727A70] tracking-wider">
                  Top / Shirt
                </span>
                <span className="text-[11px] text-[#7D8379] mt-0.5">Drop piece</span>
              </div>
            )}
          </div>

          {/* ========================================================
              LAYER 4: BOTTOMS (Trousers / Skirt) - if no dress
             ======================================================== */}
          {!isDressSelected && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDropToSlot("bottoms", e)}
              onClick={() => onOpenPickerForSlot?.("bottoms")}
              onMouseEnter={() => setActiveHoverSlot("bottoms")}
              onMouseLeave={() => setActiveHoverSlot(null)}
              className="absolute top-44 left-1/2 -translate-x-1/2 cursor-pointer z-15 group"
            >
              {bottomItem ? (
                <div className="relative transform hover:scale-105 transition-transform flex flex-col items-center">
                  <div className="w-32 h-36 rounded-xl bg-white p-1 border border-[#E7E4DB] shadow-elevated overflow-hidden ring-2 ring-[#B95F43]/30">
                    <img src={bottomItem.imageUrl} alt={bottomItem.name} className="w-full h-full object-cover object-top rounded-lg" />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleRemove("bottoms", e)}
                    className="absolute -top-2 -right-2 p-1 bg-white hover:bg-red-50 text-[#26332D] hover:text-red-600 rounded-full shadow-md"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-28 h-24 rounded-lg border-2 border-dashed border-[#B8B8AA]/50 bg-white/40 hover:bg-white flex flex-col items-center justify-center text-center p-2 transition-all">
                  <span className="text-[11px] uppercase font-semibold text-[#727A70] tracking-wider">
                    Bottoms / Skirt
                  </span>
                  <span className="text-[11px] text-[#7D8379] mt-0.5">Drop piece</span>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              LAYER 5: BAG (Side Hip / Arm Level)
             ======================================================== */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDropToSlot("bags", e)}
            onClick={() => onOpenPickerForSlot?.("bags")}
            onMouseEnter={() => setActiveHoverSlot("bags")}
            onMouseLeave={() => setActiveHoverSlot(null)}
            className="absolute top-48 -right-4 sm:-right-8 cursor-pointer z-30 group"
          >
            {bagsItem ? (
              <div className="relative transform hover:scale-110 transition-transform">
                {/* Draped strap graphic */}
                <div className="w-16 h-18 rounded-xl bg-white p-1 border border-[#D8D9D1] shadow-elevated overflow-hidden">
                  <img src={bagsItem.imageUrl} alt={bagsItem.name} className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="absolute -bottom-2 -left-2 px-1.5 py-0.5 bg-white text-[11px] font-semibold text-[#26332D] rounded shadow-sm border border-[#E7E4DB] whitespace-nowrap">
                  Bag
                </div>
                <button
                  type="button"
                  onClick={(e) => handleRemove("bags", e)}
                  className="absolute -top-2 -right-2 p-1 bg-white hover:bg-red-50 text-[#26332D] hover:text-red-600 rounded-full shadow-md"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ) : (
              <div className="w-12 h-14 rounded-lg border-2 border-dashed border-[#B8B8AA]/50 bg-white/50 hover:bg-white flex flex-col items-center justify-center text-center p-1 transition-all" title="Add Bag">
                <span className="text-[11px] uppercase font-semibold text-[#7D8379]">Bag</span>
                <Plus className="w-3 h-3 text-[#7D8379] mt-0.5" />
              </div>
            )}
          </div>

          {/* ========================================================
              LAYER 6: SHOES (Ground Pedestal Level)
             ======================================================== */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDropToSlot("shoes", e)}
            onClick={() => onOpenPickerForSlot?.("shoes")}
            onMouseEnter={() => setActiveHoverSlot("shoes")}
            onMouseLeave={() => setActiveHoverSlot(null)}
            className="absolute bottom-1 left-1/2 -translate-x-1/2 cursor-pointer z-30 group"
          >
            {shoesItem ? (
              <div className="relative transform hover:scale-110 transition-transform">
                <div className="w-28 h-18 rounded-xl bg-white p-1 border border-[#D8D9D1] shadow-elevated overflow-hidden flex items-center justify-center">
                  <img src={shoesItem.imageUrl} alt={shoesItem.name} className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#244A3B] text-white text-[11px] uppercase font-semibold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                  {shoesItem.name.split(" ")[0]} {shoesItem.name.split(" ")[1] || ""}
                </div>
                <button
                  type="button"
                  onClick={(e) => handleRemove("shoes", e)}
                  className="absolute -top-2 -right-2 p-1 bg-white hover:bg-red-50 text-[#26332D] hover:text-red-600 rounded-full shadow-md"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="w-24 h-12 rounded-lg border-2 border-dashed border-[#B8B8AA]/50 bg-white/50 hover:bg-white flex items-center justify-center gap-1.5 text-center transition-all px-2" title="Add Shoes">
                <Plus className="w-3 h-3 text-[#7D8379]" />
                <span className="text-[11px] uppercase font-semibold text-[#727A70]">Footwear</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Bottom Control Strip */}
      <div className="w-full pt-3 border-t border-[#E7E4DB]/80 flex flex-wrap items-center justify-between gap-2 z-10 text-[11px] text-[#727A70]">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#7D8379] flex-shrink-0" />
          <span>Interactive 3D atelier mannequin. Drag pieces onto body parts or click to replace.</span>
        </span>

        <span className="font-serif italic text-[#34493E]">
          Tailored Atelier Proportions
        </span>
      </div>
    </div>
  );
};
