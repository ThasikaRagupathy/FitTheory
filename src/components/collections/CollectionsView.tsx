import React, { useState } from "react";
import { useWardrobe } from "../../context/WardrobeContext";
import { Collection } from "../../types";
import { CollectionDetailModal } from "./CollectionDetailModal";
import { NewCollectionModal } from "./NewCollectionModal";
import { EmptyState } from "../ui/EmptyState";
import { Plus, BookmarkCheck, ArrowRight, Layers } from "lucide-react";

export const CollectionsView: React.FC = () => {
  const { collections, setCurrentView } = useWardrobe();

  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [collectionToEdit, setCollectionToEdit] = useState<Collection | null>(null);

  const handleEdit = (col: Collection) => {
    setCollectionToEdit(col);
    setIsNewModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.19em] text-[#B95F43] font-semibold block">
            Capsules & Edits
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-medium text-[#26332D] tracking-[-0.04em]">
            Wardrobe Collections
          </h2>
          <p className="text-xs sm:text-sm text-[#727A70] mt-1 font-sans">
            Curate thematic capsules, seasonal edits, and outfits tailored for specific moods or occasions.
          </p>
        </div>

        <button
          onClick={() => {
            setCollectionToEdit(null);
            setIsNewModalOpen(true);
          }}
          className="inline-flex min-h-11 items-center justify-center gap-2 px-5 py-3 bg-[#244A3B] hover:bg-[#193B2F] text-white text-[11px] uppercase tracking-[0.14em] font-semibold transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Collection</span>
        </button>
      </div>

      {/* Collections Grid */}
      {collections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map(col => (
            <div
              key={col.id}
              onClick={() => setSelectedCollection(col)}
              className="group bg-[#FBFAF6] border border-[#E7E4DB] overflow-hidden transition-colors duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Editorial Cover Photo */}
              <div className="relative aspect-[16/10] bg-[#EEEAE1] overflow-hidden">
                <img
                  src={col.coverImageUrl || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80"}
                  alt={col.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#244A3B]/70 via-[#244A3B]/20 to-transparent" />
                
                {/* Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 text-[11px] uppercase tracking-wider font-semibold bg-white/95 backdrop-blur-sm text-[#26332D] rounded shadow-sm border border-[#E7E4DB]">
                    {col.outfitIds.length} {col.outfitIds.length === 1 ? "Outfit" : "Outfits"}
                  </span>
                </div>

                {/* Title over gradient */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-serif text-xl font-medium tracking-tight group-hover:text-[#F8F6F0] transition-colors">
                    {col.name}
                  </h3>
                </div>
              </div>

              {/* Description & Action */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-[#677168] line-clamp-2 leading-relaxed">
                  {col.description}
                </p>

                <div className="mt-4 pt-3 border-t border-[#E7E4DB] flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#26332D] group-hover:text-[#193B2F]">
                  <span>Explore Capsule</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<BookmarkCheck className="w-6 h-6 text-[#7D8379]" />}
          title="No collections created yet"
          description="Group your saved outfits into editorial capsules like 'Everyday Ease' or 'Work, Reimagined'."
          actionLabel="Create First Collection"
          onAction={() => {
            setCollectionToEdit(null);
            setIsNewModalOpen(true);
          }}
          secondaryActionLabel="Open Outfit Studio"
          onSecondaryAction={() => setCurrentView("studio")}
        />
      )}

      {/* Collection Detail Modal */}
      <CollectionDetailModal
        collection={selectedCollection}
        onClose={() => setSelectedCollection(null)}
        onEdit={handleEdit}
      />

      {/* New / Edit Collection Modal */}
      <NewCollectionModal
        isOpen={isNewModalOpen}
        onClose={() => {
          setIsNewModalOpen(false);
          setCollectionToEdit(null);
        }}
        collectionToEdit={collectionToEdit}
      />
    </div>
  );
};
