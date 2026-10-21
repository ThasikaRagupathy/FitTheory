import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { ClothingCategory, ClothingItem, OccasionTag, Season } from "../../types";
import { useWardrobe } from "../../context/WardrobeContext";
import { Upload, Image as ImageIcon, Check, AlertCircle } from "lucide-react";
import { COLOR_PALETTE_MAP, getColorHex } from "../../utils/colorMatching";

interface ClothingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: ClothingItem | null;
}

const CATEGORIES: ClothingCategory[] = [
  "Tops",
  "Bottoms",
  "Dresses",
  "Outerwear",
  "Shoes",
  "Bags",
  "Accessories"
];

const SEASONS: Season[] = [
  "All-season",
  "Spring",
  "Summer",
  "Autumn",
  "Winter"
];

const OCCASIONS: OccasionTag[] = [
  "Casual",
  "Work",
  "Evening",
  "Formal",
  "Sport"
];

const PRESET_IMAGES: Record<ClothingCategory, string[]> = {
  Tops: [
    "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
  ],
  Bottoms: [
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=600&auto=format&fit=crop&q=80",
  ],
  Dresses: [
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80",
  ],
  Outerwear: [
    "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80",
  ],
  Shoes: [
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80",
  ],
  Bags: [
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
  ],
  Accessories: [
    "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80",
  ],
};

export const ClothingFormModal: React.FC<ClothingFormModalProps> = ({
  isOpen,
  onClose,
  itemToEdit
}) => {
  const { addItem, updateItem } = useWardrobe();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<ClothingCategory>("Tops");
  const [color, setColor] = useState("Cream");
  const [colorHex, setColorHex] = useState("#F5F2EB");
  const [selectedSeasons, setSelectedSeasons] = useState<Season[]>(["All-season"]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>(["Casual"]);
  const [imageUrl, setImageUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setCategory(itemToEdit.category);
      setColor(itemToEdit.color);
      setColorHex(itemToEdit.colorHex || getColorHex(itemToEdit.color));
      setSelectedSeasons(itemToEdit.season);
      setSelectedOccasions(itemToEdit.occasions);
      setImageUrl(itemToEdit.imageUrl);
      setNotes(itemToEdit.notes || "");
    } else {
      // Defaults for new item
      setName("");
      setCategory("Tops");
      setColor("Cream");
      setColorHex("#F5F2EB");
      setSelectedSeasons(["All-season"]);
      setSelectedOccasions(["Casual"]);
      setImageUrl(PRESET_IMAGES.Tops[0]);
      setNotes("");
    }
    setError(null);
  }, [itemToEdit, isOpen]);

  const toggleSeason = (season: Season) => {
    setSelectedSeasons(prev => {
      if (season === "All-season") {
        return ["All-season"];
      }
      const withoutAll = prev.filter(s => s !== "All-season");
      if (withoutAll.includes(season)) {
        const next = withoutAll.filter(s => s !== season);
        return next.length === 0 ? ["All-season"] : next;
      } else {
        return [...withoutAll, season];
      }
    });
  };

  const toggleOccasion = (occ: string) => {
    setSelectedOccasions(prev =>
      prev.includes(occ)
        ? prev.length > 1 ? prev.filter(o => o !== occ) : prev
        : [...prev, occ]
    );
  };

  const handleColorChange = (newColorName: string) => {
    setColor(newColorName);
    setColorHex(getColorHex(newColorName));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setError("Image size exceeds 4MB. Please select a smaller photo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImageUrl(result);
      setError(null);
    };
    reader.onerror = () => {
      setError("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide a name for this clothing piece.");
      return;
    }
    if (!imageUrl.trim()) {
      setError("Please upload an image or choose one of the curated presets.");
      return;
    }

    if (itemToEdit) {
      updateItem(itemToEdit.id, {
        name: name.trim(),
        category,
        color,
        colorHex,
        season: selectedSeasons,
        occasions: selectedOccasions,
        imageUrl: imageUrl.trim(),
        notes: notes.trim(),
      });
    } else {
      addItem({
        name: name.trim(),
        category,
        color,
        colorHex,
        season: selectedSeasons,
        occasions: selectedOccasions,
        imageUrl: imageUrl.trim(),
        notes: notes.trim(),
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={itemToEdit ? "Edit Clothing Piece" : "Add to Wardrobe"}
      subtitle="Catalog pieces you own to assemble effortless looks."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Item Name */}
        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-[#26332D] mb-1.5 font-sans">
            Piece Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Crisp Poplin Button-Down Shirt"
            className="w-full px-3.5 py-2.5 bg-white border border-[#E7E4DB] rounded text-sm text-[#26332D] placeholder:text-[#727A70] focus:outline-none focus:ring-1 focus:ring-[#244A3B]"
          />
        </div>

        {/* Category & Color Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#26332D] mb-1.5 font-sans">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => {
                const newCat = e.target.value as ClothingCategory;
                setCategory(newCat);
                if (!itemToEdit && PRESET_IMAGES[newCat]?.[0]) {
                  setImageUrl(PRESET_IMAGES[newCat][0]);
                }
              }}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E7E4DB] rounded text-sm text-[#26332D] focus:outline-none focus:ring-1 focus:ring-[#244A3B]"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#26332D] mb-1.5 font-sans">
              Primary Color
            </label>
            <div className="flex items-center gap-2">
              <span
                className="w-6 h-6 rounded-full border border-black/15 shadow-inner flex-shrink-0"
                style={{ backgroundColor: colorHex }}
              />
              <select
                value={color}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E7E4DB] rounded text-sm text-[#26332D] focus:outline-none focus:ring-1 focus:ring-[#244A3B]"
              >
                {Object.keys(COLOR_PALETTE_MAP).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Image Selection / Upload */}
        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-[#26332D] mb-1.5 font-sans">
            Piece Photography *
          </label>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {/* Preview Box */}
            <div className="w-24 h-28 rounded border border-[#E7E4DB] bg-[#EEEAE1] overflow-hidden flex-shrink-0 relative group">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#727A70]">
                  <ImageIcon className="w-6 h-6 mb-1 text-[#7D8379]" />
                  <span className="text-[11px]">No image</span>
                </div>
              )}
            </div>

            {/* Upload & Presets */}
            <div className="flex-1 space-y-2.5 w-full">
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-[#E5E8DF]/30 hover:bg-[#E5E8DF]/60 text-[#26332D] rounded border border-[#E7E4DB] text-xs font-medium transition-colors">
                  <Upload className="w-3.5 h-3.5 text-[#727A70]" />
                  <span>Upload local file</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-[#727A70] font-sans">or select preset</span>
              </div>

              {/* Curated Preset Row */}
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {(PRESET_IMAGES[category] || []).map((presetUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(presetUrl)}
                    className={`w-12 h-14 rounded border overflow-hidden flex-shrink-0 transition-all ${
                      imageUrl === presetUrl
                        ? "ring-2 ring-[#244A3B] border-transparent"
                        : "border-[#E7E4DB] hover:border-[#B8B8AA] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={presetUrl} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Seasons */}
        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-[#26332D] mb-1.5 font-sans">
            Seasonality
          </label>
          <div className="flex flex-wrap gap-1.5">
            {SEASONS.map(season => {
              const active = selectedSeasons.includes(season);
              return (
                <button
                  type="button"
                  key={season}
                  onClick={() => toggleSeason(season)}
                  className={`px-3 py-1.5 rounded-full text-xs font-sans transition-colors ${
                    active
                      ? "bg-[#244A3B] text-white font-medium"
                      : "bg-[#EEEAE1] text-[#677168] hover:bg-[#E5E8DF]/30 border border-[#E7E4DB]"
                  }`}
                >
                  {season}
                </button>
              );
            })}
          </div>
        </div>

        {/* Occasions */}
        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-[#26332D] mb-1.5 font-sans">
            Occasions
          </label>
          <div className="flex flex-wrap gap-1.5">
            {OCCASIONS.map(occ => {
              const active = selectedOccasions.includes(occ);
              return (
                <button
                  type="button"
                  key={occ}
                  onClick={() => toggleOccasion(occ)}
                  className={`px-3 py-1.5 rounded-full text-xs font-sans transition-colors ${
                    active
                      ? "bg-[#315B4A] text-white font-medium"
                      : "bg-[#EEEAE1] text-[#677168] hover:bg-[#E5E8DF]/30 border border-[#E7E4DB]"
                  }`}
                >
                  {occ}
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Notes */}
        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-[#26332D] mb-1.5 font-sans">
            Styling Notes (Optional)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Fabric composition, fit tips, styling preferences..."
            className="w-full px-3.5 py-2.5 bg-white border border-[#E7E4DB] rounded text-sm text-[#26332D] placeholder:text-[#727A70] focus:outline-none focus:ring-1 focus:ring-[#244A3B]"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E7E4DB]">
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
            {itemToEdit ? "Update Piece" : "Save to Wardrobe"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
