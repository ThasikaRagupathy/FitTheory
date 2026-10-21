import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Collection } from "../../types";
import { useWardrobe } from "../../context/WardrobeContext";
import { AlertCircle, Image as ImageIcon } from "lucide-react";

interface NewCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionToEdit?: Collection | null;
}

const PRESET_COVERS = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=800&auto=format&fit=crop&q=80",
];

export const NewCollectionModal: React.FC<NewCollectionModalProps> = ({
  isOpen,
  onClose,
  collectionToEdit
}) => {
  const { addCollection, updateCollection } = useWardrobe();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState(PRESET_COVERS[0]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (collectionToEdit) {
      setName(collectionToEdit.name);
      setDescription(collectionToEdit.description);
      setCoverImageUrl(collectionToEdit.coverImageUrl || PRESET_COVERS[0]);
    } else {
      setName("");
      setDescription("");
      setCoverImageUrl(PRESET_COVERS[0]);
    }
    setError(null);
  }, [collectionToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide a collection title.");
      return;
    }

    if (collectionToEdit) {
      updateCollection(collectionToEdit.id, {
        name: name.trim(),
        description: description.trim(),
        coverImageUrl: coverImageUrl.trim(),
      });
    } else {
      addCollection({
        name: name.trim(),
        description: description.trim(),
        coverImageUrl: coverImageUrl.trim(),
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={collectionToEdit ? "Edit Collection" : "Create New Collection"}
      subtitle="Group curated outfits into seasonal or thematic wardrobe capsules."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-[#26332D] mb-1.5 font-sans">
            Collection Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Autumn Monochrome Capsule"
            className="w-full px-3.5 py-2.5 bg-[#FBFAF6] border border-[#E7E4DB] rounded text-sm text-[#26332D] placeholder:text-[#727A70] focus:outline-none focus:ring-1 focus:ring-[#244A3B]"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-[#26332D] mb-1.5 font-sans">
            Curatorial Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the aesthetic, tone, or intention for this collection..."
            className="w-full px-3.5 py-2 bg-[#FBFAF6] border border-[#E7E4DB] rounded text-sm text-[#26332D] placeholder:text-[#727A70] focus:outline-none focus:ring-1 focus:ring-[#244A3B]"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-[#26332D] mb-1.5 font-sans">
            Cover Editorial Imagery
          </label>
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {PRESET_COVERS.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCoverImageUrl(url)}
                className={`w-14 h-16 rounded overflow-hidden flex-shrink-0 border transition-all ${
                  coverImageUrl === url
                    ? "ring-2 ring-[#244A3B] border-transparent"
                    : "border-[#E7E4DB] opacity-60 hover:opacity-100"
                }`}
              >
                <img src={url} alt={`Preset ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E7E4DB]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs uppercase tracking-widest font-medium text-[#727A70] hover:text-[#26332D] border border-[#E7E4DB] rounded hover:bg-[#EEEAE1]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-[#244A3B] hover:bg-[#193B2F] text-white rounded text-xs uppercase tracking-widest font-semibold transition-all shadow-sm"
          >
            {collectionToEdit ? "Update Collection" : "Create Collection"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
