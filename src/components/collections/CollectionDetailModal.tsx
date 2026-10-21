import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { Collection, Outfit, ClothingItem } from "../../types";
import { useWardrobe } from "../../context/WardrobeContext";
import { Edit2, Trash2, Plus, X, Layers, User } from "lucide-react";
import { MannequinPreviewModal } from "../studio/MannequinPreviewModal";

interface CollectionDetailModalProps {
  collection: Collection | null;
  onClose: () => void;
  onEdit: (collection: Collection) => void;
}

export const CollectionDetailModal: React.FC<CollectionDetailModalProps> = ({
  collection,
  onClose,
  onEdit
}) => {
  const {
    wardrobe,
    outfits,
    deleteCollection,
    toggleOutfitInCollection,
    loadOutfitIntoStudio,
    setCurrentView
  } = useWardrobe();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isAddOutfitPickerOpen, setIsAddOutfitPickerOpen] = useState(false);
  const [previewOutfitOnMannequin, setPreviewOutfitOnMannequin] = useState<Outfit | null>(null);

  if (!collection) return null;

  // Filter outfits assigned to this collection
  const collectionOutfits = outfits.filter(o => collection.outfitIds.includes(o.id));
  // Outfits NOT yet in this collection
  const availableOutfitsToAdd = outfits.filter(o => !collection.outfitIds.includes(o.id));

  const handleDelete = () => {
    deleteCollection(collection.id);
    onClose();
  };

  return (
    <Modal
      isOpen={Boolean(collection)}
      onClose={onClose}
      title={collection.name}
      subtitle={`Collection Capsule · ${collectionOutfits.length} looks`}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Cover image & description */}
        <div className="relative h-44 rounded-lg overflow-hidden border border-[#E7E4DB] shadow-subtle">
          <img
            src={collection.coverImageUrl || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80"}
            alt={collection.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#244A3B]/80 via-[#244A3B]/30 to-transparent flex items-end p-5">
            <p className="text-sm text-ivory font-serif leading-relaxed italic max-w-lg">
              "{collection.description}"
            </p>
          </div>
        </div>

        {/* Outfits List Header */}
        <div className="flex items-center justify-between pt-2">
          <h4 className="font-serif text-base font-medium text-[#26332D]">
            Saved Outfits in this Capsule ({collectionOutfits.length})
          </h4>
          <button
            type="button"
            onClick={() => setIsAddOutfitPickerOpen(!isAddOutfitPickerOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EEEAE1] hover:bg-[#E5E8DF] text-[#26332D] rounded text-xs uppercase tracking-wider font-semibold border border-[#E7E4DB] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Outfit</span>
          </button>
        </div>

        {/* Add Outfit Picker Dropdown / Box */}
        {isAddOutfitPickerOpen && (
          <div className="p-4 bg-[#FBFAF6] rounded-lg border border-[#E7E4DB] space-y-2 animate-fade-in">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#26332D] block">
              Select an Outfit to Include
            </span>
            {availableOutfitsToAdd.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                {availableOutfitsToAdd.map(outfit => (
                  <button
                    key={outfit.id}
                    type="button"
                    onClick={() => {
                      toggleOutfitInCollection(collection.id, outfit.id);
                    }}
                    className="p-2 bg-white hover:bg-[#E5E8DF]/70 rounded border border-[#E7E4DB] text-left text-xs text-[#26332D] flex items-center justify-between transition-colors"
                  >
                    <span className="truncate font-medium">{outfit.name}</span>
                    <Plus className="w-3.5 h-3.5 text-[#7D8379] flex-shrink-0" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#727A70] italic">
                All existing saved outfits are already in this collection.
              </p>
            )}
          </div>
        )}

        {/* Outfits Grid */}
        {collectionOutfits.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {collectionOutfits.map(outfit => {
              const items = outfit.itemIds
                .map(id => wardrobe.find(w => w.id === id))
                .filter(Boolean);

              return (
                <div
                  key={outfit.id}
                  className="bg-white rounded-lg border border-[#E7E4DB] p-3.5 shadow-subtle hover:border-[#B8B8AA] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-[#EEEAE1] text-[#34493E] rounded">
                        {outfit.occasion} · {outfit.season}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleOutfitInCollection(collection.id, outfit.id)}
                        className="text-[#727A70] hover:text-red-600 p-0.5"
                        title="Remove from this collection"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h5 className="font-serif text-sm font-medium text-[#26332D]">
                      {outfit.name}
                    </h5>

                    {/* Clothing pieces preview */}
                    <div className="flex items-center gap-1.5 my-3 overflow-x-auto pb-1">
                      {items.map((item, idx) => (
                        <div
                          key={idx}
                          className="w-10 h-12 rounded bg-[#EEEAE1] overflow-hidden border border-[#E7E4DB] flex-shrink-0"
                          title={item?.name}
                        >
                          <img src={item?.imageUrl} alt={item?.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        loadOutfitIntoStudio(outfit);
                        onClose();
                      }}
                      className="flex-1 py-1.5 bg-[#E5E8DF]/70 hover:bg-[#DDE4DA] text-[#26332D] text-xs uppercase tracking-wider font-semibold rounded border border-[#E7E4DB] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Layers className="w-3 h-3 text-[#B95F43]" />
                      <span>Studio</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewOutfitOnMannequin(outfit)}
                      className="p-1.5 bg-[#EEEAE1] hover:bg-[#E5E8DF] text-[#26332D] rounded border border-[#E7E4DB] transition-colors flex items-center justify-center"
                      title="View on Mannequin"
                    >
                      <User className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center bg-[#FBFAF6] rounded-lg border border-dashed border-[#E7E4DB]">
            <Layers className="w-6 h-6 text-[#7D8379] mx-auto mb-2" />
            <p className="text-xs text-[#727A70]">
              No outfits added to this capsule yet.
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E7E4DB]">
          <button
            type="button"
            onClick={() => setIsDeleteConfirmOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Collection</span>
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
                onEdit(collection);
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#E5E8DF] hover:bg-[#E5E8DF] text-[#26332D] text-xs uppercase tracking-widest font-semibold rounded border border-[#E7E4DB] transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Info</span>
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Collection?"
        message={`Are you sure you want to delete "${collection.name}"? The outfits inside it will remain saved in your wardrobe.`}
        confirmLabel="Delete Collection"
      />

      {/* Mannequin Preview Modal */}
      <MannequinPreviewModal
        isOpen={Boolean(previewOutfitOnMannequin)}
        onClose={() => setPreviewOutfitOnMannequin(null)}
        outfit={previewOutfitOnMannequin}
      />
    </Modal>
  );
};
