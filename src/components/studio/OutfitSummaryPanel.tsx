import React, { useState, useMemo } from "react";
import { useWardrobe } from "../../context/WardrobeContext";
import { analyzeOutfitColors } from "../../utils/colorMatching";
import { OccasionTag, Season } from "../../types";
import { Bookmark, Check, Tag, Plus, X } from "lucide-react";
import { triggerEditorialCelebration } from "../../utils/confetti";

const OCCASIONS: OccasionTag[] = ["Casual", "Work", "Evening", "Formal", "Sport"];
const SEASONS: Season[] = ["All-season", "Spring", "Summer", "Autumn", "Winter"];

export const OutfitSummaryPanel: React.FC = () => {
  const {
    wardrobe,
    collections,
    studioDraft,
    setStudioDraft,
    saveOutfit,
    setCurrentView,
    showToast
  } = useWardrobe();

  const [newTagInput, setNewTagInput] = useState("");
  const [nameError, setNameError] = useState(false);

  // Collect placed clothing items
  const placedItems = useMemo(() => {
    return Object.values(studioDraft.slots)
      .filter(Boolean)
      .map(id => wardrobe.find(w => w.id === id))
      .filter((i): i is NonNullable<typeof i> => Boolean(i));
  }, [studioDraft.slots, wardrobe]);

  // Color harmony analysis
  const colorAnalysis = useMemo(() => {
    const colors = placedItems.map(i => i.color);
    return analyzeOutfitColors(colors);
  }, [placedItems]);

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = newTagInput.trim();
    if (tag && !studioDraft.tags.includes(tag)) {
      setStudioDraft(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setNewTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setStudioDraft(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove),
    }));
  };

  const toggleCollection = (collectionId: string) => {
    setStudioDraft(prev => {
      const exists = prev.collectionIds.includes(collectionId);
      return {
        ...prev,
        collectionIds: exists
          ? prev.collectionIds.filter(id => id !== collectionId)
          : [...prev.collectionIds, collectionId],
      };
    });
  };

  const handleSave = () => {
    if (placedItems.length === 0) {
      showToast("Place at least one piece on the canvas to save an outfit", "warning");
      return;
    }

    const outfitName = studioDraft.name.trim() || "Untitled Curated Look";

    saveOutfit({
      id: studioDraft.outfitId,
      name: outfitName,
      itemIds: placedItems.map(i => i.id),
      occasion: studioDraft.occasion,
      season: studioDraft.season,
      tags: studioDraft.tags.length > 0 ? studioDraft.tags : ["Editorial"],
      collectionIds: studioDraft.collectionIds,
      notes: studioDraft.notes,
    });

    triggerEditorialCelebration();

    // Reset draft state after save
    setStudioDraft({
      name: "",
      occasion: "Casual",
      season: "All-season",
      tags: [],
      notes: "",
      collectionIds: [],
      slots: {},
    });

    // Option to stay or view in wardrobe/dashboard
    setCurrentView("collections");
  };

  return (
    <div className="bg-[#FBFAF6] border border-[#E7E4DB] p-4 sm:p-5 flex flex-col justify-between space-y-4">
      <div className="space-y-4">
        {/* Panel Header */}
        <div className="pb-3 border-b border-[#E7E4DB] flex items-center justify-between">
          <div>
            <span className="font-serif text-sm font-medium text-[#26332D] block">
              Look Specifications
            </span>
            <span className="text-[11px] text-[#727A70]">
              {studioDraft.outfitId ? "Editing saved outfit" : "New outfit assembly"}
            </span>
          </div>
          {studioDraft.outfitId && (
            <span className="px-2 py-0.5 text-[11px] uppercase tracking-wider font-semibold bg-[#E5E8DF]/60 text-[#26332D] rounded">
              Edit Mode
            </span>
          )}
        </div>

        {/* Outfit Name */}
        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-[#26332D] mb-1 font-sans">
            Look Title
          </label>
          <input
            type="text"
            value={studioDraft.name}
            onChange={(e) => {
              setNameError(false);
              setStudioDraft(prev => ({ ...prev, name: e.target.value }));
            }}
            placeholder="e.g. Minimalist Linen Weekend"
            className="w-full px-3 py-2 bg-[#FBFAF6] border border-[#E7E4DB] rounded text-sm text-[#26332D] placeholder:text-[#727A70] focus:outline-none focus:ring-1 focus:ring-[#244A3B]"
          />
        </div>

        {/* Occasion & Season */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#26332D] mb-1 font-sans">
              Occasion
            </label>
            <select
              value={studioDraft.occasion}
              onChange={(e) => setStudioDraft(prev => ({ ...prev, occasion: e.target.value }))}
              className="w-full px-2.5 py-1.5 bg-[#FBFAF6] border border-[#E7E4DB] rounded text-xs text-[#26332D] focus:outline-none focus:ring-1 focus:ring-[#244A3B]"
            >
              {OCCASIONS.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#26332D] mb-1 font-sans">
              Season
            </label>
            <select
              value={studioDraft.season}
              onChange={(e) => setStudioDraft(prev => ({ ...prev, season: e.target.value as Season }))}
              className="w-full px-2.5 py-1.5 bg-[#FBFAF6] border border-[#E7E4DB] rounded text-xs text-[#26332D] focus:outline-none focus:ring-1 focus:ring-[#244A3B]"
            >
              {SEASONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Palette Analysis */}
        {placedItems.length > 0 && (
          <div className="p-3 bg-[#FBFAF6]/80 rounded-lg border border-[#E7E4DB]">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[#727A70] block mb-1.5">
              Color Balance
            </span>
            <div className="flex items-center gap-1.5 mb-1.5">
              {colorAnalysis.palette.map((c, i) => (
                <span
                  key={i}
                  className="w-4 h-4 rounded-full border border-black/15 shadow-inner"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
            <p className="text-[11px] text-[#677168] italic">
              "{colorAnalysis.notes}"
            </p>
          </div>
        )}

        {/* Collections Assignment */}
        {collections.length > 0 && (
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#26332D] mb-1.5 font-sans">
              Assign to Collections
            </label>
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {collections.map(col => {
                const checked = studioDraft.collectionIds.includes(col.id);
                return (
                  <label
                    key={col.id}
                    className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-colors text-xs ${
                      checked
                        ? "bg-[#E5E8DF]/30 border-[#B8B8AA] text-[#26332D] font-medium"
                        : "bg-white border-[#E7E4DB] text-[#727A70] hover:bg-[#FBFAF6]"
                    }`}
                  >
                    <span className="truncate">{col.name}</span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCollection(col.id)}
                      className="rounded text-[#26332D] focus:ring-[#B95F43] h-3.5 w-3.5"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Style Tags */}
        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-[#26332D] mb-1 font-sans">
            Style Tags
          </label>
          <div className="flex flex-wrap gap-1 mb-2">
            {studioDraft.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-[#EEEAE1] text-[#26332D] font-medium border border-[#E7E4DB]"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-600"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
          </div>

          <form onSubmit={handleAddTag} className="flex gap-1.5">
            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              placeholder="Add tag (e.g. Casual, Layered)..."
              className="flex-1 px-2.5 py-1 bg-[#FBFAF6] border border-[#E7E4DB] rounded text-xs text-[#26332D] placeholder:text-[#727A70] focus:outline-none focus:ring-1 focus:ring-[#244A3B]"
            />
            <button
              type="submit"
              className="px-2.5 py-1 bg-[#EEEAE1] hover:bg-[#E5E8DF]/60 text-[#26332D] text-xs rounded border border-[#E7E4DB]"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Primary Save Action */}
      <div className="pt-3 border-t border-[#E7E4DB]">
        <button
          type="button"
          onClick={handleSave}
          disabled={placedItems.length === 0}
          className={`w-full py-2.5 px-4 rounded text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2 shadow-subtle ${
            placedItems.length > 0
              ? "bg-[#244A3B] hover:bg-[#193B2F] text-white hover:scale-[1.01]"
              : "bg-[#EEEAE1] text-[#727A70] cursor-not-allowed border border-[#E7E4DB]"
          }`}
        >
          <Bookmark className="w-3.5 h-3.5 text-[#E9C5A8]" />
          <span>{studioDraft.outfitId ? "Update Outfit" : "Save Outfit Look"}</span>
        </button>
      </div>
    </div>
  );
};
