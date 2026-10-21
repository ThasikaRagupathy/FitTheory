import React, { useMemo } from "react";
import { useWardrobe } from "../../context/WardrobeContext";
import { getColorHex, HARMONY_RULES } from "../../utils/colorMatching";
import { ClothingCategory } from "../../types";
import {
  PieChart,
  BarChart,
  Layers,
  TrendingUp,
  AlertCircle,
  Palette,
  ArrowRight,
  HelpCircle
} from "lucide-react";

export const InsightsView: React.FC = () => {
  const { wardrobe, outfits, plans, loadItemsIntoStudio, setCurrentView } = useWardrobe();

  // 1. Category breakdown
  const categoryStats = useMemo(() => {
    const total = wardrobe.length || 1;
    const counts: Record<string, number> = {};
    wardrobe.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([cat, count]) => ({
        category: cat as ClothingCategory,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [wardrobe]);

  // 2. Color distribution
  const colorStats = useMemo(() => {
    const total = wardrobe.length || 1;
    const counts: Record<string, number> = {};
    wardrobe.forEach(item => {
      counts[item.color] = (counts[item.color] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([color, count]) => ({
        color,
        hex: getColorHex(color),
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [wardrobe]);

  // 3. Most-used items (based on wear count and outfit appearances)
  const mostUsedItems = useMemo(() => {
    return [...wardrobe]
      .sort((a, b) => (b.wearCount || 0) - (a.wearCount || 0))
      .slice(0, 4);
  }, [wardrobe]);

  // 4. Underused pieces: items appearing in 0 saved looks
  const underusedItems = useMemo(() => {
    const usedItemIds = new Set<string>();
    outfits.forEach(o => {
      o.itemIds.forEach(id => usedItemIds.add(id));
    });

    return wardrobe
      .filter(item => !usedItemIds.has(item.id))
      .slice(0, 6);
  }, [wardrobe, outfits]);

  // Harmony rules with matchable items in wardrobe
  const pairingSuggestions = useMemo(() => {
    return HARMONY_RULES.map(rule => {
      const matchingItems = wardrobe.filter(item =>
        rule.colors.includes(item.color)
      );
      return {
        ...rule,
        availableItems: matchingItems,
      };
    }).filter(rule => rule.availableItems.length >= 2);
  }, [wardrobe]);

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-[1440px] mx-auto">
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.19em] text-[#B95F43] font-semibold block">
          Transparent Metrics
        </span>
        <h2 className="font-serif text-4xl sm:text-5xl font-medium text-[#26332D] tracking-[-0.04em]">
          Style Insights
        </h2>
        <p className="text-xs sm:text-sm text-[#727A70] mt-1 font-sans">
          Deterministic wardrobe calculations and transparent color harmony analysis derived from your {wardrobe.length} cataloged pieces.
        </p>
      </div>

      {/* Metric Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#FBFAF6] border border-[#E7E4DB]">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#727A70] block">
            Cataloged Pieces
          </span>
          <div className="font-serif text-2xl font-medium text-[#26332D] mt-1">
            {wardrobe.length}
          </div>
          <span className="text-[11px] text-[#727A70]">Active in library</span>
        </div>

        <div className="p-4 bg-[#FBFAF6] border border-[#E7E4DB]">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#727A70] block">
            Saved Looks
          </span>
          <div className="font-serif text-2xl font-medium text-[#26332D] mt-1">
            {outfits.length}
          </div>
          <span className="text-[11px] text-[#727A70]">Formulated outfits</span>
        </div>

        <div className="p-4 bg-[#FBFAF6] border border-[#E7E4DB]">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#727A70] block">
            Calendar Plans
          </span>
          <div className="font-serif text-2xl font-medium text-[#26332D] mt-1">
            {plans.length}
          </div>
          <span className="text-[11px] text-[#727A70]">Scheduled dates</span>
        </div>

        <div className="p-4 bg-[#FBFAF6] border border-[#E7E4DB]">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#727A70] block">
            Underused Pieces
          </span>
          <div className="font-serif text-2xl font-medium text-[#26332D] mt-1">
            {underusedItems.length}
          </div>
          <span className="text-[11px] text-[#727A70]">In 0 saved looks</span>
        </div>
      </div>

      {/* Category Breakdown & Color Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution Bar Chart */}
        <div className="bg-[#FBFAF6] border border-[#E7E4DB] p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E7E4DB]">
            <h3 className="font-serif text-lg font-medium text-[#26332D]">
              Category Distribution
            </h3>
            <span className="text-[11px] text-[#727A70] font-sans">
              App calculation
            </span>
          </div>

          <div className="space-y-3">
            {categoryStats.map(stat => (
              <div key={stat.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="text-[#26332D] font-medium">{stat.category}</span>
                  <span className="text-[#727A70]">
                    {stat.count} {stat.count === 1 ? "item" : "items"} ({stat.percentage}%)
                  </span>
                </div>
                {/* Clean progress bar */}
                <div className="w-full h-2 bg-[#EEEAE1] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#244A3B] rounded-full transition-all duration-500"
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Color Palette Distribution */}
        <div className="bg-[#FBFAF6] border border-[#E7E4DB] p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E7E4DB]">
            <h3 className="font-serif text-lg font-medium text-[#26332D]">
              Most Prominent Tones
            </h3>
            <span className="text-[11px] text-[#727A70] font-sans">
              Palette breakdown
            </span>
          </div>

          <div className="space-y-3">
            {colorStats.map(stat => (
              <div key={stat.color} className="flex items-center justify-between p-2.5 rounded-lg bg-[#FBFAF6]/50 border border-[#E7E4DB]">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-4 h-4 rounded-full border border-black/15 shadow-inner"
                    style={{ backgroundColor: stat.hex }}
                  />
                  <span className="text-xs font-medium text-[#26332D] font-sans">
                    {stat.color}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#727A70] font-sans">
                  <span>{stat.count} pieces</span>
                  <span className="font-semibold text-[#26332D]">{stat.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Most Worn Pieces & Underused Pieces */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most-Used Items */}
        <div className="bg-[#FBFAF6] border border-[#E7E4DB] p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E7E4DB]">
            <h3 className="font-serif text-lg font-medium text-[#26332D]">
              Most Integrated Pieces
            </h3>
            <span className="text-[11px] text-[#727A70]">
              By outfit wear count
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {mostUsedItems.map(item => (
              <div
                key={item.id}
                className="p-2.5 rounded-lg border border-[#E7E4DB] bg-[#FBFAF6]/40 flex items-center gap-3"
              >
                <div className="w-12 h-14 rounded overflow-hidden bg-[#EEEAE1] border border-[#E7E4DB] flex-shrink-0">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="truncate">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#727A70] block">
                    {item.category}
                  </span>
                  <h5 className="font-serif text-xs font-medium text-[#26332D] truncate">
                    {item.name}
                  </h5>
                  <span className="text-[11px] text-[#244A3B] font-medium block mt-0.5">
                    Worn {item.wearCount || 0} times
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Underused Pieces */}
        <div className="bg-[#FBFAF6] border border-[#E7E4DB] p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E7E4DB]">
            <div>
              <h3 className="font-serif text-lg font-medium text-[#26332D]">
                Underused Pieces
              </h3>
              <p className="text-[11px] text-[#727A70] mt-0.5">
                Simple app calculation: Items currently in 0 saved looks
              </p>
            </div>
            <span className="px-2 py-0.5 text-[11px] uppercase font-semibold bg-[#E5E8DF] text-[#26332D] rounded">
              {underusedItems.length} pieces
            </span>
          </div>

          {underusedItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {underusedItems.map(item => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-lg border border-[#E7E4DB] bg-[#FBFAF6]/40 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-10 h-12 rounded overflow-hidden bg-[#EEEAE1] border border-[#E7E4DB] flex-shrink-0">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="truncate">
                      <h5 className="font-serif text-xs font-medium text-[#26332D] truncate">
                        {item.name}
                      </h5>
                      <span className="text-[11px] text-[#727A70]">
                        {item.color}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => loadItemsIntoStudio([item.id], `Look featuring ${item.name}`)}
                    className="p-1.5 text-[#727A70] hover:text-[#26332D] hover:bg-[#E5E8DF]/70 rounded flex-shrink-0"
                    title="Assemble look with this piece"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#7D8379]" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-[#727A70] italic">
              All pieces in your wardrobe are integrated into at least one saved outfit!
            </div>
          )}
        </div>
      </div>

      {/* Transparent Color Pairing Recommendations */}
      <div className="bg-[#FBFAF6] border border-[#E7E4DB] p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E7E4DB]">
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-medium text-[#26332D]">
              Color Harmony Formulas
            </h3>
            <p className="text-xs text-[#727A70] mt-0.5">
              Transparent, rule-based combinations tested against your available wardrobe pieces.
            </p>
          </div>
          <span className="text-xs text-[#727A70] hidden sm:inline">
            Deterministic logic
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pairingSuggestions.map((rule, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-[#FBFAF6]/60 border border-[#E7E4DB] flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  {rule.colors.map(c => (
                    <span
                      key={c}
                      className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-inner"
                      style={{ backgroundColor: getColorHex(c) }}
                      title={c}
                    />
                  ))}
                </div>
                <h4 className="font-serif text-sm font-medium text-[#26332D]">
                  {rule.name}
                </h4>
                <p className="text-xs text-[#677168] mt-1 leading-relaxed">
                  {rule.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const itemIds = rule.availableItems.slice(0, 4).map(i => i.id);
                  loadItemsIntoStudio(itemIds, rule.name);
                }}
                className="w-full py-2 bg-[#FBFAF6] hover:bg-[#E5E8DF] text-[#26332D] text-xs uppercase tracking-wider font-semibold rounded border border-[#E7E4DB] transition-colors flex items-center justify-center gap-1.5"
              >
                <Palette className="w-3 h-3 text-[#B95F43]" />
                <span>Try this combination</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
