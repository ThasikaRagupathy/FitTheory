import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { useWardrobe } from "../../context/WardrobeContext";
import { getColorHex } from "../../utils/colorMatching";
import { getFallbackImageDataUri } from "../../utils/imageFallback";
import { Edit2, Trash2, Calendar, Layers } from "lucide-react";
import { ClothingItem } from "../../types";

interface ClothingDetailModalProps {
  itemId: string | null;
  onClose: () => void;
  onEdit: (item: ClothingItem) => void;
}

export const ClothingDetailModal: React.FC<ClothingDetailModalProps> = ({
  itemId,
  onClose,
  onEdit
}) => {
  const { wardrobe, outfits, deleteItem, setStudioDraft, setCurrentView, showToast } = useWardrobe();
  const [imgError, setImgError] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  if (!itemId) return null;

  const item = wardrobe.find(i => i.id === itemId);
  if (!item) return null;

  const colorHex = item.colorHex || getColorHex(item.color);
  const fallbackUri = getFallbackImageDataUri(item.name, item.category, item.colorHex);

  // Find outfits containing this item
  const matchingOutfits = outfits.filter(o => o.itemIds.includes(item.id));

  const handleAddToStudio = () => {
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
    showToast(`Loaded "${item.name}" into Outfit Studio`);
    onClose();
    setCurrentView("studio");
  };

  const handleDelete = () => {
    deleteItem(item.id);
    onClose();
  };

  return (
    <Modal
      isOpen={Boolean(itemId)}
      onClose={onClose}
      title={item.name}
      subtitle={`${item.category} · ${item.color}`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Top: Image and Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="relative aspect-[4/5] rounded-md bg-[#EEEAE1] overflow-hidden border border-[#E7E4DB] shadow-subtle">
            <img
              src={imgError ? fallbackUri : item.imageUrl}
              alt={item.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2.5 left-2.5">
              <span className="px-2 py-0.5 text-[11px] uppercase tracking-wider font-semibold bg-white/95 text-[#26332D] rounded shadow-sm border border-[#E7E4DB]">
                {item.category}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#727A70] font-semibold block">
                  Colorway
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-inner"
                    style={{ backgroundColor: colorHex }}
                  />
                  <span className="text-sm font-medium text-[#26332D]">{item.color}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#727A70] font-semibold block">
                  Seasons
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.season.map(s => (
                    <span key={s} className="px-2 py-0.5 text-xs bg-[#EEEAE1] text-[#34493E] rounded-full border border-[#E7E4DB]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#727A70] font-semibold block">
                  Occasions
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.occasions.map(o => (
                    <span key={o} className="px-2 py-0.5 text-xs bg-[#E5E8DF]/40 text-[#244A3B] rounded-full border border-[#E7E4DB]">
                      {o}
                    </span>
                  ))}
                </div>
              </div>

              {item.wearCount !== undefined && (
                <div className="pt-2 border-t border-[#E7E4DB]">
                  <span className="text-[11px] uppercase tracking-widest text-[#727A70] font-semibold block">
                    Wardrobe Presence
                  </span>
                  <p className="text-xs text-[#677168] mt-0.5">
                    Worn in <strong className="text-[#26332D] font-semibold">{item.wearCount}</strong> outfit combinations
                  </p>
                </div>
              )}
            </div>

            {/* Quick Action Button */}
            <button
              type="button"
              onClick={handleAddToStudio}
              className="w-full py-2.5 px-4 bg-[#244A3B] hover:bg-[#193B2F] text-white rounded text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Layers className="w-3.5 h-3.5 text-[#E9C5A8]" />
              <span>Style in Outfit Studio</span>
            </button>
          </div>
        </div>

        {/* Styling Notes */}
        {item.notes && (
          <div className="p-3.5 bg-[#FBFAF6] rounded border border-[#E7E4DB]">
            <span className="text-[11px] uppercase tracking-widest text-[#727A70] font-semibold block mb-1">
              Styling Notes
            </span>
            <p className="text-xs text-[#34493E] leading-relaxed italic">
              "{item.notes}"
            </p>
          </div>
        )}

        {/* Saved Outfits Featuring This Item */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#26332D] font-sans">
              Outfits featuring this piece ({matchingOutfits.length})
            </span>
          </div>

          {matchingOutfits.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5">
              {matchingOutfits.map(outfit => (
                <div
                  key={outfit.id}
                  className="p-2.5 rounded border border-[#E7E4DB] bg-white hover:border-[#B8B8AA] transition-colors flex items-center justify-between"
                >
                  <div className="truncate pr-2">
                    <span className="font-serif text-xs font-medium text-[#26332D] block truncate">
                      {outfit.name}
                    </span>
                    <span className="text-[11px] text-[#727A70]">
                      {outfit.occasion} · {outfit.itemIds.length} pieces
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      setCurrentView("studio");
                    }}
                    className="p-1 text-[#727A70] hover:text-[#26332D]"
                    title="View in Studio"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#7D8379]" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#727A70] italic">
              This piece has not yet been saved in any outfit. Style it in Outfit Studio to create your first combination!
            </p>
          )}
        </div>

        {/* Footer Actions: Edit and Delete */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E7E4DB]">
          <button
            type="button"
            onClick={() => setIsDeleteConfirmOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove piece</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs uppercase tracking-widest font-medium text-[#727A70] hover:text-[#26332D] border border-[#E7E4DB] rounded hover:bg-[#EEEAE1]"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(item);
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#E5E8DF]/50 hover:bg-[#E5E8DF] text-[#26332D] text-xs uppercase tracking-widest font-semibold rounded border border-[#E7E4DB] transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit piece</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Remove piece from wardrobe?"
        message={`Are you sure you want to remove "${item.name}"? It will also be removed from any outfits that include it.`}
        confirmLabel="Remove Piece"
      />
    </Modal>
  );
};
