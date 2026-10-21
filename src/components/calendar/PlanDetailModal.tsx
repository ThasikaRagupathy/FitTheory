import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { OutfitPlan, Outfit } from "../../types";
import { useWardrobe } from "../../context/WardrobeContext";
import { formatFullDate } from "../../utils/dates";
import { Calendar, Trash2, Check, AlertCircle } from "lucide-react";

interface PlanDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateKey: string;
  existingPlan?: OutfitPlan;
}

export const PlanDetailModal: React.FC<PlanDetailModalProps> = ({
  isOpen,
  onClose,
  dateKey,
  existingPlan
}) => {
  const { wardrobe, outfits, savePlan, deletePlan, loadOutfitIntoStudio, setCurrentView } = useWardrobe();

  const [selectedOutfitId, setSelectedOutfitId] = useState<string>("");
  const [occasion, setOccasion] = useState("");
  const [note, setNote] = useState("");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existingPlan) {
      setSelectedOutfitId(existingPlan.outfitId);
      setOccasion(existingPlan.occasion || "");
      setNote(existingPlan.note || "");
    } else {
      setSelectedOutfitId(outfits[0]?.id || "");
      setOccasion("");
      setNote("");
    }
    setError(null);
  }, [existingPlan, dateKey, outfits, isOpen]);

  const selectedOutfit = outfits.find(o => o.id === selectedOutfitId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOutfitId) {
      setError("Please select an outfit to wear on this date.");
      return;
    }

    savePlan({
      id: existingPlan?.id,
      date: dateKey,
      outfitId: selectedOutfitId,
      occasion: occasion.trim(),
      note: note.trim(),
    });

    onClose();
  };

  const handleDelete = () => {
    if (existingPlan) {
      deletePlan(existingPlan.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={existingPlan ? "Edit Planned Outfit" : "Schedule Outfit"}
      subtitle={formatFullDate(dateKey)}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Outfit Selection Dropdown / Preview */}
        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-[#26332D] mb-1.5 font-sans">
            Choose Saved Look *
          </label>
          {outfits.length > 0 ? (
            <select
              value={selectedOutfitId}
              onChange={(e) => setSelectedOutfitId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FBFAF6] border border-[#E7E4DB] rounded text-sm text-[#26332D] focus:outline-none focus:ring-1 focus:ring-[#244A3B]"
            >
              {outfits.map(o => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.occasion} · {o.itemIds.length} pieces)
                </option>
              ))}
            </select>
          ) : (
            <div className="p-3 bg-[#EEEAE1] rounded text-xs text-[#677168]">
              You haven't saved any outfits yet.{" "}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setCurrentView("studio");
                }}
                className="underline font-semibold text-[#26332D]"
              >
                Create one in Outfit Studio
              </button>
            </div>
          )}
        </div>

        {/* Selected Outfit Mini-Preview */}
        {selectedOutfit && (
          <div className="p-3 bg-[#FBFAF6] rounded-lg border border-[#E7E4DB] flex items-center justify-between">
            <div>
              <span className="font-serif text-sm font-medium text-[#26332D] block">
                {selectedOutfit.name}
              </span>
              <span className="text-[11px] text-[#727A70]">
                {selectedOutfit.occasion} · {selectedOutfit.season} · {selectedOutfit.itemIds.length} pieces
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                loadOutfitIntoStudio(selectedOutfit);
              }}
              className="px-2.5 py-1 text-[11px] uppercase font-semibold text-[#26332D] bg-[#E5E8DF]/70 hover:bg-[#DDE4DA] rounded border border-[#E7E4DB]"
            >
              Edit in Studio
            </button>
          </div>
        )}

        {/* Occasion / Event Field */}
        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-[#26332D] mb-1.5 font-sans">
            Event / Occasion Label
          </label>
          <input
            type="text"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            placeholder="e.g. Creative Review, Gallery Dinner, Coffee Date..."
            className="w-full px-3.5 py-2 bg-[#FBFAF6] border border-[#E7E4DB] rounded text-sm text-[#26332D] placeholder:text-[#727A70] focus:outline-none focus:ring-1 focus:ring-[#244A3B]"
          />
        </div>

        {/* Optional Note Field */}
        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-[#26332D] mb-1.5 font-sans">
            Notes & Weather Considerations
          </label>
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Expecting light rain in afternoon, bring trench coat..."
            className="w-full px-3.5 py-2 bg-[#FBFAF6] border border-[#E7E4DB] rounded text-sm text-[#26332D] placeholder:text-[#727A70] focus:outline-none focus:ring-1 focus:ring-[#244A3B]"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E7E4DB]">
          {existingPlan ? (
            <button
              type="button"
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Plan</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs uppercase tracking-widest font-medium text-[#727A70] hover:text-[#26332D] border border-[#E7E4DB] rounded hover:bg-[#EEEAE1]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={outfits.length === 0}
              className="px-5 py-2 bg-[#244A3B] hover:bg-[#193B2F] disabled:opacity-50 text-white rounded text-xs uppercase tracking-widest font-semibold transition-all shadow-sm"
            >
              {existingPlan ? "Update Schedule" : "Confirm Plan"}
            </button>
          </div>
        </div>
      </form>

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Remove Planned Outfit?"
        message="This will remove the planned outfit from this date. The saved outfit remains intact in your collection."
        confirmLabel="Remove"
      />
    </Modal>
  );
};
