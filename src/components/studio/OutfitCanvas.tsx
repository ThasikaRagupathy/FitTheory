import React from "react";
import { OutfitSlot } from "./OutfitSlot";
import { ClothingItem } from "../../types";
import { useWardrobe } from "../../context/WardrobeContext";
import { generateOutfitSuggestion } from "../../utils/outfitSuggestions";
import { Shuffle, Trash2, SlidersHorizontal, Info } from "lucide-react";
import { triggerEditorialCelebration } from "../../utils/confetti";

interface OutfitCanvasProps {
  onOpenPickerForSlot: (slot: "tops" | "bottoms" | "outerwear" | "shoes" | "bags" | "accessories") => void;
}

export const OutfitCanvas: React.FC<OutfitCanvasProps> = ({ onOpenPickerForSlot }) => {
  const { wardrobe, studioDraft, setStudioDraft, clearStudio, showToast } = useWardrobe();

  const getItem = (id?: string): ClothingItem | undefined => {
    return id ? wardrobe.find(w => w.id === id) : undefined;
  };

  const topItem = getItem(studioDraft.slots.tops);
  const bottomItem = getItem(studioDraft.slots.bottoms);
  const outerwearItem = getItem(studioDraft.slots.outerwear);
  const shoesItem = getItem(studioDraft.slots.shoes);
  const bagsItem = getItem(studioDraft.slots.bags);
  const accessoriesItem = getItem(studioDraft.slots.accessories);

  const selectedCount = Object.values(studioDraft.slots).filter(Boolean).length;
  const isDressSelected = bottomItem?.category === "Dresses";

  const handleDropToSlot = (slotId: keyof typeof studioDraft.slots, itemId: string) => {
    const droppedItem = wardrobe.find(w => w.id === itemId);
    if (!droppedItem) return;

    setStudioDraft(prev => {
      // If a dress is dropped into bottoms or tops, it fills the slot
      let updatedSlots = { ...prev.slots };

      if (droppedItem.category === "Dresses") {
        updatedSlots.bottoms = droppedItem.id;
        // Optionally keep top or leave as alternative
      } else {
        updatedSlots[slotId] = droppedItem.id;
      }

      return {
        ...prev,
        slots: updatedSlots,
      };
    });
    showToast(`Placed "${droppedItem.name}" in ${slotId}`);
  };

  const handleRemoveSlot = (slotId: keyof typeof studioDraft.slots) => {
    setStudioDraft(prev => {
      const nextSlots = { ...prev.slots };
      delete nextSlots[slotId];
      return {
        ...prev,
        slots: nextSlots,
      };
    });
  };

  const handleSurpriseMe = () => {
    // Generate deterministic rule-based suggestion from current wardrobe
    const randomSeed = Math.floor(Math.random() * 10);
    const suggestion = generateOutfitSuggestion(wardrobe, {
      preferredOccasion: studioDraft.occasion,
      preferredSeason: studioDraft.season,
      seedOffset: randomSeed,
    });

    setStudioDraft(prev => ({
      ...prev,
      name: prev.name || suggestion.title,
      notes: suggestion.rationale,
      slots: {
        tops: suggestion.slots.top?.id,
        bottoms: suggestion.slots.bottom?.id || suggestion.slots.dress?.id,
        outerwear: suggestion.slots.outerwear?.id,
        shoes: suggestion.slots.shoes?.id,
        bags: suggestion.slots.bag?.id,
        accessories: suggestion.slots.accessories?.id,
      },
    }));

    triggerEditorialCelebration();
    showToast(`Assembled: "${suggestion.title}"`, "info");
  };

  return (
    <div className="bg-[#FBFAF6] border border-[#E7E4DB] p-3 sm:p-5 flex flex-col justify-between">
      {/* Canvas Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-[#E7E4DB]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-serif font-medium text-[#26332D]">
            Styling Tabletop
          </span>
          <span className="px-2 py-0.5 text-[11px] uppercase tracking-wider font-semibold bg-[#E5E8DF]/50 text-[#34493E] rounded-full">
            {selectedCount} / 6 Pieces
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSurpriseMe}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#E5E8DF]/30 text-[#26332D] text-xs uppercase tracking-wider font-semibold rounded border border-[#E7E4DB] shadow-sm transition-all hover:scale-[1.02]"
            title="Assemble a rule-based curated look from your wardrobe"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#244A3B]" />
            <span>Surprise Me</span>
          </button>

          {selectedCount > 0 && (
            <button
              type="button"
              onClick={clearStudio}
              className="p-1.5 text-[#727A70] hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Clear all canvas slots"
              aria-label="Clear canvas"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Flat Lay Tabletop Layout */}
      <div className="space-y-4">
        {/* Layer 1: Outerwear & Accessories (Top accent pieces) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <OutfitSlot
            slotId="outerwear"
            label="Outerwear / Jacket"
            item={outerwearItem}
            onRemove={() => handleRemoveSlot("outerwear")}
            onDropItem={(id) => handleDropToSlot("outerwear", id)}
            onOpenPicker={() => onOpenPickerForSlot("outerwear")}
          />
          <OutfitSlot
            slotId="accessories"
            label="Jewelry / Scarf"
            item={accessoriesItem}
            onRemove={() => handleRemoveSlot("accessories")}
            onDropItem={(id) => handleDropToSlot("accessories", id)}
            onOpenPicker={() => onOpenPickerForSlot("accessories")}
          />
        </div>

        {/* Layer 2: Core Body Pieces (Top & Bottom, OR Full Dress) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {!isDressSelected ? (
            <>
              <OutfitSlot
                slotId="tops"
                label="Top / Shirt / Knit"
                item={topItem}
                onRemove={() => handleRemoveSlot("tops")}
                onDropItem={(id) => handleDropToSlot("tops", id)}
                onOpenPicker={() => onOpenPickerForSlot("tops")}
                isLarge
              />
              <OutfitSlot
                slotId="bottoms"
                label="Bottom / Trousers / Skirt"
                item={bottomItem}
                onRemove={() => handleRemoveSlot("bottoms")}
                onDropItem={(id) => handleDropToSlot("bottoms", id)}
                onOpenPicker={() => onOpenPickerForSlot("bottoms")}
                isLarge
              />
            </>
          ) : (
            <div className="sm:col-span-2">
              <OutfitSlot
                slotId="bottoms"
                label="Full Dress"
                item={bottomItem}
                onRemove={() => handleRemoveSlot("bottoms")}
                onDropItem={(id) => handleDropToSlot("bottoms", id)}
                onOpenPicker={() => onOpenPickerForSlot("bottoms")}
                isLarge
              />
            </div>
          )}
        </div>

        {/* Layer 3: Grounding Pieces (Shoes & Bags) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <OutfitSlot
            slotId="shoes"
            label="Footwear"
            item={shoesItem}
            onRemove={() => handleRemoveSlot("shoes")}
            onDropItem={(id) => handleDropToSlot("shoes", id)}
            onOpenPicker={() => onOpenPickerForSlot("shoes")}
          />
          <OutfitSlot
            slotId="bags"
            label="Bag / Handbag"
            item={bagsItem}
            onRemove={() => handleRemoveSlot("bags")}
            onDropItem={(id) => handleDropToSlot("bags", id)}
            onOpenPicker={() => onOpenPickerForSlot("bags")}
          />
        </div>
      </div>

      {/* Helpful Hint Footer */}
      <div className="mt-4 pt-3 border-t border-[#E7E4DB]/80 flex items-center justify-between text-[11px] text-[#727A70]">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#7D8379] flex-shrink-0" />
          <span>Drag pieces or click any slot to browse matching items.</span>
        </span>
        {isDressSelected && (
          <span className="text-[11px] italic text-[#677168]">
            Dress replaces top + bottom
          </span>
        )}
      </div>
    </div>
  );
};
