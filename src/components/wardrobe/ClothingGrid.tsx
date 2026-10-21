import React, { useState, useMemo } from "react";
import { useWardrobe } from "../../context/WardrobeContext";
import { ClothingCard } from "./ClothingCard";
import { ClothingFilters, SortOption } from "./ClothingFilters";
import { ClothingDetailModal } from "./ClothingDetailModal";
import { ClothingFormModal } from "./ClothingFormModal";
import { EmptyState } from "../ui/EmptyState";
import { ClothingCategory, ClothingItem } from "../../types";
import { Plus, SearchX } from "lucide-react";

export const WardrobeView: React.FC = () => {
  const {
    wardrobe,
    setIsAddItemModalOpen,
    selectedItemIdForDetail,
    setSelectedItemIdForDetail,
  } = useWardrobe();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSeason, setSelectedSeason] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const [sortOption, setSortOption] = useState<SortOption>("recent");
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);

  // Available unique colors for the filter dropdown
  const availableColors = useMemo(() => {
    const set = new Set<string>();
    wardrobe.forEach(item => {
      if (item.color) set.add(item.color);
    });
    return Array.from(set).sort();
  }, [wardrobe]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Total: wardrobe.length };
    wardrobe.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [wardrobe]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return wardrobe
      .filter(item => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = item.name.toLowerCase().includes(q);
          const matchesNotes = item.notes?.toLowerCase().includes(q);
          const matchesOccasions = item.occasions.some(o => o.toLowerCase().includes(q));
          if (!matchesName && !matchesNotes && !matchesOccasions) return false;
        }

        // Category filter
        if (selectedCategory !== "All" && item.category !== selectedCategory) {
          return false;
        }

        // Season filter
        if (selectedSeason !== "All") {
          const hasSeason =
            item.season.includes("All-season") ||
            item.season.includes(selectedSeason as any);
          if (!hasSeason) return false;
        }

        // Color filter
        if (selectedColor !== "All" && item.color !== selectedColor) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === "recent") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortOption === "alpha-asc") {
          return a.name.localeCompare(b.name);
        }
        if (sortOption === "alpha-desc") {
          return b.name.localeCompare(a.name);
        }
        if (sortOption === "wear-count") {
          return (b.wearCount || 0) - (a.wearCount || 0);
        }
        return 0;
      });
  }, [wardrobe, searchQuery, selectedCategory, selectedSeason, selectedColor, sortOption]);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedCategory !== "All" ||
    selectedSeason !== "All" ||
    selectedColor !== "All";

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedSeason("All");
    setSelectedColor("All");
    setSortOption("recent");
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-[1440px] mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.19em] text-[#B95F43] font-semibold block">
            YOUR COLLECTION
          </span>
          <h2 className="mt-2 font-serif text-4xl sm:text-5xl font-medium text-[#26332D] tracking-[-0.04em]">
            My closet
          </h2>
          <p className="text-xs sm:text-sm text-[#727A70] mt-2 font-sans">
            Browse and style {wardrobe.length} pieces from your own collection.
          </p>
        </div>

        <button
          onClick={() => setIsAddItemModalOpen(true)}
          className="inline-flex min-h-11 items-center justify-center gap-2 px-5 py-3 bg-[#244A3B] hover:bg-[#193B2F] text-white text-[11px] uppercase tracking-[0.15em] font-semibold transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add a piece</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <ClothingFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedSeason={selectedSeason}
        onSeasonChange={setSelectedSeason}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        sortOption={sortOption}
        onSortChange={setSortOption}
        availableColors={availableColors}
        categoryCounts={categoryCounts}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Clothing Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10">
          {filteredItems.map(item => (
            <ClothingCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<SearchX className="w-6 h-6 text-[#7D8379]" />}
          title={hasActiveFilters ? "No matching pieces found" : "Your wardrobe is empty"}
          description={
            hasActiveFilters
              ? "We couldn't find any pieces matching your current filters. Try resetting the filters or add a new piece to this category."
              : "Start by cataloging your favorite clothing pieces to build outfits and planned looks."
          }
          actionLabel={hasActiveFilters ? "Reset Filters" : "Add Your First Piece"}
          onAction={hasActiveFilters ? handleClearFilters : () => setIsAddItemModalOpen(true)}
        />
      )}

      {/* Detail Modal */}
      <ClothingDetailModal
        itemId={selectedItemIdForDetail}
        onClose={() => setSelectedItemIdForDetail(null)}
        onEdit={(item) => setEditingItem(item)}
      />

      {/* Edit Form Modal */}
      {editingItem && (
        <ClothingFormModal
          isOpen={Boolean(editingItem)}
          onClose={() => setEditingItem(null)}
          itemToEdit={editingItem}
        />
      )}
    </div>
  );
};
