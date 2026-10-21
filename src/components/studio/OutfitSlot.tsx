import React, { useState } from "react";
import { ClothingItem } from "../../types";
import { X, RefreshCw, Plus } from "lucide-react";
import { getFallbackImageDataUri } from "../../utils/imageFallback";
import { getColorHex } from "../../utils/colorMatching";

interface OutfitSlotProps {
  slotId: "tops" | "bottoms" | "outerwear" | "shoes" | "bags" | "accessories";
  label: string;
  item?: ClothingItem;
  onRemove: () => void;
  onDropItem: (itemId: string) => void;
  onOpenPicker?: () => void;
  className?: string;
  isLarge?: boolean;
}

export const OutfitSlot: React.FC<OutfitSlotProps> = ({
  slotId,
  label,
  item,
  onRemove,
  onDropItem,
  onOpenPicker,
  className = "",
  isLarge = false
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const itemId = e.dataTransfer.getData("text/plain") || e.dataTransfer.getData("application/json");
    if (itemId) {
      onDropItem(itemId);
    }
  };

  if (!item) {
    return (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={onOpenPicker}
        className={`relative rounded-lg border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-3 text-center ${
          isDragOver
            ? "border-[#244A3B] bg-[#E5E8DF]/30 scale-[1.02]"
            : "border-[#E7E4DB] bg-white/60 hover:bg-white hover:border-[#B8B8AA]"
        } ${isLarge ? "min-h-[170px]" : "min-h-[130px]"} ${className}`}
      >
        <div className="w-8 h-8 rounded-full bg-[#EEEAE1] flex items-center justify-center text-[#727A70] mb-1.5 transition-transform group-hover:scale-110">
          <Plus className="w-4 h-4 text-[#7D8379]" />
        </div>
        <span className="text-[11px] uppercase tracking-wider font-semibold text-[#26332D] font-sans">
          {label}
        </span>
        <span className="text-[11px] text-[#727A70] mt-0.5">
          {isDragOver ? "Drop to place" : "Click or drag piece"}
        </span>
      </div>
    );
  }

  const colorHex = item.colorHex || getColorHex(item.color);
  const fallbackUri = getFallbackImageDataUri(item.name, item.category, item.colorHex);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`group relative rounded-lg bg-[#FBFAF6] border border-[#E7E4DB] transition-colors overflow-hidden flex flex-col ${
        isDragOver ? "ring-2 ring-[#244A3B]" : ""
      } ${className}`}
    >
      {/* Photo with Overlay Controls */}
      <div className={`relative bg-[#EEEAE1] overflow-hidden ${isLarge ? "h-36 sm:h-44" : "h-28 sm:h-32"}`}>
        <img
          src={imgError ? fallbackUri : item.imageUrl}
          alt={item.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {/* Slot label pill */}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-0.5 text-[11px] uppercase tracking-widest font-semibold bg-white/95 backdrop-blur-sm text-[#26332D] rounded shadow-sm border border-[#E7E4DB]/60">
            {item.category === "Dresses" ? "Dress" : label}
          </span>
        </div>

        {/* Action Controls */}
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
          {onOpenPicker && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenPicker();
              }}
              className="p-1.5 bg-white/90 hover:bg-white text-[#26332D] rounded-full shadow-sm hover:scale-110 transition-transform"
              title="Replace item in this slot"
              aria-label="Replace item"
            >
              <RefreshCw className="w-3 h-3 text-[#26332D]" />
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-1.5 bg-white/90 hover:bg-red-50 text-[#26332D] hover:text-red-600 rounded-full shadow-sm hover:scale-110 transition-transform"
            title="Remove item"
            aria-label="Remove item"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Item info */}
      <div className="p-2.5 bg-white flex flex-col justify-between flex-1">
        <h5 className="font-serif text-xs font-medium text-[#26332D] line-clamp-1">
          {item.name}
        </h5>
        <div className="flex items-center gap-1.5 mt-1">
          <span
            className="w-2 h-2 rounded-full border border-black/10 flex-shrink-0"
            style={{ backgroundColor: colorHex }}
          />
          <span className="text-[11px] text-[#727A70] truncate">
            {item.color}
          </span>
        </div>
      </div>
    </div>
  );
};
