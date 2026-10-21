import React from "react";
import { Modal } from "../ui/Modal";
import { Outfit, ClothingItem } from "../../types";
import { useWardrobe } from "../../context/WardrobeContext";
import { getColorHex } from "../../utils/colorMatching";
import { Calendar, Layers, Eye } from "lucide-react";

interface MannequinPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfit: Outfit | null;
}

export const MannequinPreviewModal: React.FC<MannequinPreviewModalProps> = ({
  isOpen,
  onClose,
  outfit
}) => {
  const { wardrobe, loadOutfitIntoStudio } = useWardrobe();

  if (!outfit) return null;

  const items = outfit.itemIds
    .map(id => wardrobe.find(w => w.id === id))
    .filter((i): i is ClothingItem => Boolean(i));

  const topItem = items.find(i => i.category === "Tops");
  const bottomItem = items.find(i => i.category === "Bottoms" || i.category === "Dresses");
  const outerwearItem = items.find(i => i.category === "Outerwear");
  const shoesItem = items.find(i => i.category === "Shoes");
  const bagsItem = items.find(i => i.category === "Bags");
  const accessoriesItem = items.find(i => i.category === "Accessories");

  const isDressSelected = bottomItem?.category === "Dresses";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={outfit.name}
      subtitle={`Atelier Mannequin Silhouette · ${outfit.occasion} · ${outfit.season}`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Mannequin Stage */}
        <div className="relative bg-gradient-to-b from-[#F8F6F0] via-[#F0EEE6] to-[#E5E8DF] border border-[#E7E4DB] p-6 flex flex-col items-center justify-center overflow-hidden min-h-[460px] shadow-subtle">
          {/* Spotlight Effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#E5E8DF]/70 rounded-full blur-3xl opacity-80 pointer-events-none" />

          {/* SVG Dress Form */}
          <div className="relative w-56 h-[390px] flex items-center justify-center">
            <svg
              className="absolute inset-0 w-full h-full text-[#B8B8AA]/50"
              viewBox="0 0 240 440"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="120" cy="20" r="8" fill="#B8A895" fillOpacity="0.4" stroke="#8C7D6B" />
              <path d="M120 28 L120 48" stroke="#8C7D6B" strokeWidth="2.5" />
              <path d="M106 48 C106 46, 134 46, 134 48 C134 52, 106 52, 106 48 Z" fill="#D5C8B8" fillOpacity="0.6" stroke="#8C7D6B" />
              <path
                d="M106 50 C85 52, 68 68, 66 88 C64 110, 78 135, 88 155 C94 167, 95 180, 88 198 C80 216, 75 240, 82 260 C88 275, 110 282, 120 282 C130 282, 152 275, 158 260 C165 240, 160 216, 152 198 C145 180, 146 167, 152 155 C162 135, 176 110, 174 88 C172 68, 155 52, 134 50 Z"
                fill="#F4EEE6"
                fillOpacity="0.9"
                stroke="#B8A895"
                strokeWidth="1.5"
              />
              <path d="M120 52 L120 280" stroke="#B8A895" strokeDasharray="3 3" strokeOpacity="0.7" />
              <path d="M120 282 L120 405" stroke="#54514C" strokeWidth="4" strokeLinecap="round" />
              <path d="M120 405 L75 425 M120 405 L165 425 M120 405 L120 430" stroke="#3D3B37" strokeWidth="3.5" strokeLinecap="round" />
            </svg>

            {/* Accessories */}
            {accessoriesItem && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30">
                <div className="w-12 h-12 rounded-full bg-white p-1 border border-[#D8D9D1] shadow-md overflow-hidden">
                  <img src={accessoriesItem.imageUrl} alt={accessoriesItem.name} className="w-full h-full object-cover rounded-full" />
                </div>
              </div>
            )}

            {/* Outerwear */}
            {outerwearItem && (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 z-25">
                <div className="w-44 h-32 rounded-xl bg-white/95 p-1 border border-[#B8B8AA] shadow-md overflow-hidden">
                  <img src={outerwearItem.imageUrl} alt={outerwearItem.name} className="w-full h-full object-cover object-top rounded-lg" />
                </div>
              </div>
            )}

            {/* Torso Top or Dress */}
            {isDressSelected && bottomItem ? (
              <div className={`absolute ${outerwearItem ? "top-20" : "top-14"} left-1/2 -translate-x-1/2 z-20`}>
                <div className="w-32 h-52 rounded-xl bg-white p-1 border border-[#E7E4DB] shadow-md overflow-hidden ring-2 ring-[#B95F43]/40">
                  <img src={bottomItem.imageUrl} alt={bottomItem.name} className="w-full h-full object-cover rounded-lg" />
                </div>
              </div>
            ) : topItem ? (
              <div className={`absolute ${outerwearItem ? "top-20" : "top-14"} left-1/2 -translate-x-1/2 z-20`}>
                <div className="w-28 h-28 rounded-lg bg-white p-1 border border-[#E7E4DB] shadow-md overflow-hidden ring-2 ring-[#B95F43]/30">
                  <img src={topItem.imageUrl} alt={topItem.name} className="w-full h-full object-cover object-top rounded-md" />
                </div>
              </div>
            ) : null}

            {/* Bottoms */}
            {!isDressSelected && bottomItem && (
              <div className="absolute top-40 left-1/2 -translate-x-1/2 z-15">
                <div className="w-28 h-32 rounded-lg bg-white p-1 border border-[#E7E4DB] shadow-md overflow-hidden ring-2 ring-[#B95F43]/30">
                  <img src={bottomItem.imageUrl} alt={bottomItem.name} className="w-full h-full object-cover object-top rounded-md" />
                </div>
              </div>
            )}

            {/* Bag */}
            {bagsItem && (
              <div className="absolute top-44 -right-4 z-30">
                <div className="w-14 h-16 rounded-lg bg-white p-1 border border-[#D8D9D1] shadow-md overflow-hidden">
                  <img src={bagsItem.imageUrl} alt={bagsItem.name} className="w-full h-full object-cover rounded-md" />
                </div>
              </div>
            )}

            {/* Shoes */}
            {shoesItem && (
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-30">
                <div className="w-24 h-14 rounded-lg bg-white p-1 border border-[#D8D9D1] shadow-md overflow-hidden flex items-center justify-center">
                  <img src={shoesItem.imageUrl} alt={shoesItem.name} className="w-full h-full object-cover rounded-md" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Garment Credits Strip */}
        <div className="space-y-2">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-[#727A70] block">
            Garments on Mannequin ({items.length})
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {items.map(item => (
              <div key={item.id} className="p-2 rounded bg-[#F8F6F0] border border-[#E7E4DB] flex items-center gap-2">
                <div className="w-8 h-10 rounded bg-white overflow-hidden border border-[#E7E4DB] flex-shrink-0">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="truncate">
                  <span className="text-[11px] uppercase font-semibold text-[#727A70] block">{item.category}</span>
                  <span className="font-serif text-xs font-medium text-[#26332D] truncate block">{item.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E7E4DB]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs uppercase tracking-widest font-medium text-[#727A70] hover:text-[#26332D] border border-[#E7E4DB] rounded hover:bg-[#EEEAE1]"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              loadOutfitIntoStudio(outfit);
            }}
            className="px-5 py-2 bg-[#244A3B] hover:bg-[#193B2F] text-white rounded text-xs uppercase tracking-widest font-semibold transition-all shadow-sm flex items-center gap-2"
          >
            <Layers className="w-3.5 h-3.5 text-[#E9C5A8]" />
            <span>Edit in Outfit Studio</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
