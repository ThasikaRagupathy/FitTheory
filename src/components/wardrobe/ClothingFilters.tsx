import React from "react";
import { Search, X, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { ClothingCategory, Season } from "../../types";

export type SortOption = "recent" | "alpha-asc" | "alpha-desc" | "wear-count";

interface ClothingFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedSeason: string;
  onSeasonChange: (season: string) => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  availableColors: string[];
  categoryCounts: Record<string, number>;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const CATEGORIES: (ClothingCategory | "All")[] = [
  "All",
  "Tops",
  "Bottoms",
  "Dresses",
  "Outerwear",
  "Shoes",
  "Bags",
  "Accessories"
];

const SEASONS: (Season | "All")[] = [
  "All",
  "All-season",
  "Spring",
  "Summer",
  "Autumn",
  "Winter"
];

export const ClothingFilters: React.FC<ClothingFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedSeason,
  onSeasonChange,
  selectedColor,
  onColorChange,
  sortOption,
  onSortChange,
  availableColors,
  categoryCounts,
  onClearFilters,
  hasActiveFilters
}) => {
  return (
    <div className="space-y-4">
      {/* Search and Secondary Controls Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#727A70]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search items by name or style..."
            className="w-full pl-9 pr-9 py-2 bg-[#FBFAF6] border border-[#E7E4DB] text-xs sm:text-sm text-[#26332D] placeholder:text-[#727A70] focus:outline-none focus:ring-1 focus:ring-[#244A3B] shadow-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#727A70] hover:text-[#26332D] p-0.5"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters (Season, Color, Sort) */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:overflow-visible pb-1 sm:pb-0">
          {/* Season Filter */}
          <select
            value={selectedSeason}
            onChange={(e) => onSeasonChange(e.target.value)}
            className="w-full min-w-0 px-2.5 py-2 bg-[#FBFAF6] border border-[#E7E4DB] text-xs text-[#26332D] focus:outline-none focus:ring-1 focus:ring-[#244A3B] cursor-pointer shadow-none sm:w-auto"
          >
            <option value="All">Season: All</option>
            {SEASONS.filter(s => s !== "All").map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Color Filter */}
          <select
            value={selectedColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-full min-w-0 px-2.5 py-2 bg-[#FBFAF6] border border-[#E7E4DB] text-xs text-[#26332D] focus:outline-none focus:ring-1 focus:ring-[#244A3B] cursor-pointer shadow-none sm:w-auto"
          >
            <option value="All">Color: All</option>
            {availableColors.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Sort Filter */}
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full min-w-0 px-2.5 py-2 bg-[#FBFAF6] border border-[#E7E4DB] text-xs text-[#26332D] focus:outline-none focus:ring-1 focus:ring-[#244A3B] cursor-pointer shadow-none sm:w-auto"
          >
            <option value="recent">Sort: Recently Added</option>
            <option value="alpha-asc">Sort: Name (A-Z)</option>
            <option value="alpha-desc">Sort: Name (Z-A)</option>
            <option value="wear-count">Sort: Most Worn</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-[#727A70] hover:text-[#26332D] bg-[#E5E8DF] hover:bg-[#DDE4DA] rounded border border-[#E7E4DB] transition-colors flex-shrink-0"
              title="Clear all active filters"
            >
              <X className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Bar (Horizontal scrollable on mobile) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        {CATEGORIES.map(cat => {
          const isActive = selectedCategory === cat;
          const count = cat === "All" ? categoryCounts["Total"] : (categoryCounts[cat] || 0);

          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3.5 py-1.5 rounded-none text-xs font-sans whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 ${
                isActive
                  ? "bg-[#244A3B] text-white font-medium shadow-none"
                  : "bg-[#FBFAF6] text-[#727A70] hover:text-[#26332D] border border-[#E7E4DB] hover:border-[#B8B8AA]"
              }`}
            >
              <span>{cat}</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-none ${
                isActive ? "bg-[#FBFAF6]/20 text-white" : "bg-[#EEEAE1] text-[#677168]"
              }`}>
                {count || 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
