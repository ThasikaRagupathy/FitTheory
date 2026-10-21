import React, { useState } from "react";
import { ClothingItem } from "../../types";
import { getColorHex } from "../../utils/colorMatching";
import { getFallbackImageDataUri } from "../../utils/imageFallback";
import { useWardrobe } from "../../context/WardrobeContext";
import { Shirt, Eye } from "lucide-react";

interface ClothingCardProps {
  item: ClothingItem;
  onSelect?: (item: ClothingItem) => void;
  showStudioAdd?: boolean;
}

export const ClothingCard: React.FC<ClothingCardProps> = ({
  item,
  onSelect,
  showStudioAdd = true
}) => {
  const { setSelectedItemIdForDetail, setStudioDraft, setCurrentView, showToast } = useWardrobe();
  const [imgError, setImgError] = useState(false);

  const fallbackUri = getFallbackImageDataUri(item.name, item.category, item.colorHex);
  const colorHex = item.colorHex || getColorHex(item.color);

  const handleAddToStudio = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    showToast(`Added "${item.name}" to Outfit Studio`);
    setCurrentView("studio");
  };

  const handleClick = () => {
    if (onSelect) {
      onSelect(item);
    } else {
      setSelectedItemIdForDetail(item.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-[#FBFAF6] overflow-hidden transition-colors duration-300 cursor-pointer flex flex-col relative"
    >
      {/* Image Container with editorial aspect ratio */}
      <div className="relative aspect-[4/5] bg-[#EEEAE1] overflow-hidden">
        <img
          src={imgError ? fallbackUri : item.imageUrl}
          alt={item.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center group-hover:scale-[1.035] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
          loading="lazy"
        />

        {/* Category Pill Tag */}
        <div className="absolute top-2.5 left-2.5">
          <span className="px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] font-semibold bg-[#F8F6F0]/95 text-[#315B4A]">
            {item.category}
          </span>
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#193B2F]/60 via-transparent to-transparent opacity-100 transition-opacity duration-200 flex items-end justify-between p-3 md:bg-[#1C3029]/15 md:opacity-0 md:group-hover:opacity-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedItemIdForDetail(item.id);
            }}
            className="p-2.5 bg-[#F8F6F0]/95 hover:bg-white text-[#26332D] rounded-full hover:scale-105 transition-all"
            title="Inspect Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {showStudioAdd && (
            <button
              type="button"
              onClick={handleAddToStudio}
              className="px-3 py-2 bg-[#244A3B]/95 hover:bg-[#193B2F] text-white text-[11px] uppercase tracking-[0.14em] font-semibold hover:scale-105 transition-all flex items-center gap-1.5"
              title="Add this piece to an outfit"
            >
              <Shirt className="w-3 h-3 text-[#E9C5A8]" />
              <span>Style</span>
            </button>
          )}
        </div>
      </div>

      {/* Card Info */}
      <div className="p-3 pt-3 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-serif text-sm font-medium text-[#262A26] group-hover:text-[#244A3B] transition-colors line-clamp-1">
            {item.name}
          </h4>
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full border border-black/10 shadow-inner flex-shrink-0"
              style={{ backgroundColor: colorHex }}
              title={item.color}
            />
            <span className="text-xs text-[#777A72] truncate">
              {item.color}
            </span>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-[#E7E4DB] flex items-center justify-between text-[11px] text-[#777A72] font-sans">
          <span>{item.season[0] || "All-season"}</span>
          {item.wearCount !== undefined && item.wearCount > 0 && (
            <span className="text-[11px] text-[#B95F43]">
              Worn {item.wearCount}x
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
