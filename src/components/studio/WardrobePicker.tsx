import React, { useState, useMemo } from "react";
import { useWardrobe } from "../../context/WardrobeContext";
import { ClothingCategory, ClothingItem } from "../../types";
import { getColorHex } from "../../utils/colorMatching";
import { getFallbackImageDataUri } from "../../utils/imageFallback";
import { Search, Plus, Check, Grab } from "lucide-react";

interface WardrobePickerProps {
  activeSlotCategory?: ClothingCategory | "All";
  onSelectItem: (item: ClothingItem) => void;
}

const CATEGORIES: (ClothingCategory | "All")[] = [
  "All",
  "Tops",
  "Bottoms",
  "Dresses",
  "Outerwear",
  "Shoes",
  "Bags",
  "Accessories"
];

export const WardrobePicker: React.FC<WardrobePickerProps> = ({
  activeSlotCategory = "All",
  onSelectItem
}) => {
  const { wardrobe, studioDraft } = useWardrobe();
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory | "All">(
    activeSlotCategory
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Items currently placed on canvas
  const placedItemIds = useMemo(() => {
    return new Set(Object.values(studioDraft.slots).filter(Boolean));
  }, [studioDraft.slots]);

  const filteredItems = useMemo(() => {
    return wardrobe.filter(item => {
      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.color.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [wardrobe, selectedCategory, searchQuery]);

  const handleDragStart = (e: React.DragEvent, item: ClothingItem) => {
    e.dataTransfer.setData("text/plain", item.id);
    e.dataTransfer.setData("application/json", item.id);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="bg-[#FBFAF6] border border-[#E7E4DB] p-3 sm:p-4 flex flex-col h-full min-h-0 max-h-[65dvh] xl:min-h-[360px] xl:max-h-[750px]">
      {/* Header */}
      <div className="pb-3 border-b border-[#E7E4DB]">
        <div className="flex items-center justify-between mb-2">
          <span className="font-serif text-sm font-medium text-[#26332D]">
            Wardrobe Pieces
          </span>
          <span className="text-[11px] text-[#727A70]">
            {filteredItems.length} available
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#727A70]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pieces..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#FBFAF6] border border-[#E7E4DB] rounded text-xs text-[#26332D] placeholder:text-[#727A70] focus:outline-none focus:ring-1 focus:ring-[#244A3B]"
          />
        </div>
      </div>

      {/* Category Tabs (Scrollable) */}
      <div className="py-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none no-scrollbar border-b border-[#E7E4DB]">
        {CATEGORIES.map(cat => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-[#244A3B] text-white font-medium shadow-sm"
                  : "bg-[#EEEAE1] text-[#727A70] hover:text-[#26332D] hover:bg-[#E5E8DF]/30"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Item List (Draggable Cards) */}
      <div className="flex-1 overflow-y-auto pt-3 space-y-2 pr-1">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => {
            const isPlaced = placedItemIds.has(item.id);
            const colorHex = item.colorHex || getColorHex(item.color);
            const fallbackUri = getFallbackImageDataUri(item.name, item.category, item.colorHex);

            return (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onClick={() => onSelectItem(item)}
                className={`group flex items-center justify-between p-2 rounded-lg border transition-all cursor-grab active:cursor-grabbing select-none ${
                  isPlaced
                    ? "bg-[#E5E8DF]/20 border-[#B8B8AA]/40 opacity-80"
                    : "bg-white hover:bg-[#FBFAF6] border-[#E7E4DB] hover:border-[#B8B8AA] shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Thumbnail */}
                  <div className="w-12 h-14 rounded overflow-hidden bg-[#EEEAE1] border border-[#E7E4DB] flex-shrink-0 relative">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackUri;
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[#244A3B]/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Grab className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  {/* Info */}
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#727A70] font-semibold block">
                      {item.category}
                    </span>
                    <h6 className="font-serif text-xs font-medium text-[#26332D] line-clamp-1">
                      {item.name}
                    </h6>
                    <div className="flex items-center gap-1.5 mt-0.5">
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

                {/* Add / Added Button */}
                <div className="flex-shrink-0">
                  {isPlaced ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#E5E8DF] text-[#244A3B] rounded text-[11px] font-semibold">
                      <Check className="w-3 h-3" />
                      <span>On canvas</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectItem(item);
                      }}
                      className="p-1.5 bg-[#EEEAE1] hover:bg-[#244A3B] text-[#727A70] hover:text-white rounded transition-colors"
                      title="Add to canvas"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center text-[#727A70] text-xs italic">
            No clothing items in this category.
          </div>
        )}
      </div>
    </div>
  );
};
