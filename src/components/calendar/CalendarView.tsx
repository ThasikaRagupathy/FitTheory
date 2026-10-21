import React, { useState, useMemo } from "react";
import { useWardrobe } from "../../context/WardrobeContext";
import {
  getMonthDays,
  formatDateKey,
  formatFullDate,
  formatDisplayDate,
  isDateInThisWeek
} from "../../utils/dates";
import { MonthGrid } from "./MonthGrid";
import { PlanDetailModal } from "./PlanDetailModal";
import { EmptyState } from "../ui/EmptyState";
import {
  CalendarDays,
  Plus,
  Layers,
  Calendar as CalendarIcon,
  Clock,
  List,
  Grid3X3,
  ChevronRight
} from "lucide-react";

export const CalendarView: React.FC = () => {
  const { outfits, plans, wardrobe, loadOutfitIntoStudio, setCurrentView } = useWardrobe();

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string>(() => formatDateKey(new Date()));
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "agenda">("grid");

  // Generate month days
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthDays = useMemo(() => getMonthDays(year, month), [year, month]);

  // Fast plan lookup map
  const plansMap = useMemo(() => {
    const map = new Map();
    plans.forEach(plan => {
      const outfit = outfits.find(o => o.id === plan.outfitId);
      map.set(plan.date, { plan, outfit });
    });
    return map;
  }, [plans, outfits]);

  const selectedPlanInfo = plansMap.get(selectedDateKey);

  // This week planned looks
  const thisWeekPlans = useMemo(() => {
    return plans
      .filter(p => isDateInThisWeek(p.date))
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(p => ({
        plan: p,
        outfit: outfits.find(o => o.id === p.outfitId),
      }));
  }, [plans, outfits]);

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateKey(formatDateKey(today));
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.19em] text-[#B95F43] font-semibold block">
            Wardrobe Planning
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-medium text-[#26332D] tracking-[-0.04em]">
            Style Calendar
          </h2>
          <p className="text-xs sm:text-sm text-[#727A70] mt-1 font-sans">
            Schedule your outfits ahead of time, avoid morning indecision, and coordinate with events.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View mode toggle (Grid / Agenda) */}
          <div className="bg-[#E5E8DF]/70 p-1 rounded-lg border border-[#E7E4DB] flex items-center">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "grid" ? "bg-[#244A3B] text-white" : "text-[#727A70]"
              }`}
              title="Calendar Grid View"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("agenda")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "agenda" ? "bg-[#244A3B] text-white" : "text-[#727A70]"
              }`}
              title="Agenda List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsPlanModalOpen(true)}
            disabled={outfits.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#244A3B] hover:bg-[#193B2F] disabled:opacity-50 text-white rounded text-xs uppercase tracking-widest font-semibold transition-all shadow-subtle"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Look</span>
          </button>
        </div>
      </div>

      {outfits.length === 0 && (
        <div className="p-4 bg-[#E5E8DF]/70 rounded-lg border border-[#E7E4DB] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-[#B95F43]" />
            <div>
              <p className="text-xs font-medium text-[#26332D]">
                You haven't saved any outfits to schedule yet.
              </p>
              <p className="text-[11px] text-[#727A70]">
                Build a look in Outfit Studio, then schedule it for upcoming calendar dates.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentView("studio")}
            className="px-3 py-1.5 bg-[#244A3B] text-white rounded text-xs uppercase tracking-wider font-semibold"
          >
            Open Studio
          </button>
        </div>
      )}

      {/* Main Content Layout */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Calendar Grid (8 cols) */}
          <div className="lg:col-span-8">
            <MonthGrid
              currentDate={currentDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onToday={handleToday}
              days={monthDays}
              plansMap={plansMap}
              selectedDateKey={selectedDateKey}
              onSelectDate={(key) => setSelectedDateKey(key)}
            />
          </div>

          {/* Selected Date Detail & This Week Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Selected Date Card */}
            <div className="bg-[#FBFAF6] border border-[#E7E4DB] p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E4DB]">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.19em] text-[#B95F43] font-semibold block">
                    Selected Date
                  </span>
                  <h4 className="font-serif text-lg font-medium text-[#26332D]">
                    {formatDisplayDate(selectedDateKey)}
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(true)}
                  className="px-2.5 py-1 text-xs uppercase tracking-wider font-semibold text-[#26332D] bg-[#E5E8DF]/70 hover:bg-[#DDE4DA] rounded border border-[#E7E4DB]"
                >
                  {selectedPlanInfo ? "Edit" : "Schedule"}
                </button>
              </div>

              {selectedPlanInfo ? (
                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-[#727A70]">
                      Scheduled Outfit
                    </span>
                    <h5 className="font-serif text-base font-medium text-[#26332D] mt-0.5">
                      {selectedPlanInfo.outfit?.name || "Custom Look"}
                    </h5>
                  </div>

                  {selectedPlanInfo.plan.occasion && (
                    <div className="p-2.5 bg-[#FBFAF6] rounded border border-[#E7E4DB]">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-[#727A70] block">
                        Event
                      </span>
                      <p className="text-xs text-[#34493E] font-medium">
                        {selectedPlanInfo.plan.occasion}
                      </p>
                    </div>
                  )}

                  {selectedPlanInfo.plan.note && (
                    <p className="text-xs text-[#677168] italic">
                      "{selectedPlanInfo.plan.note}"
                    </p>
                  )}

                  {/* Outfits items miniatures */}
                  {selectedPlanInfo.outfit && (
                    <div className="pt-2">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-[#727A70] block mb-1.5">
                        Assembled Pieces ({selectedPlanInfo.outfit.itemIds.length})
                      </span>
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                        {selectedPlanInfo.outfit.itemIds.map((id: string) => {
                          const item = wardrobe.find(w => w.id === id);
                          if (!item) return null;
                          return (
                            <div key={id} className="w-10 h-12 rounded bg-[#EEEAE1] overflow-hidden border border-[#E7E4DB] flex-shrink-0" title={item.name}>
                              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (selectedPlanInfo.outfit) {
                        loadOutfitIntoStudio(selectedPlanInfo.outfit);
                      }
                    }}
                    className="w-full py-2 bg-[#244A3B] hover:bg-[#193B2F] text-white rounded text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1.5 mt-2"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#E9C5A8]" />
                    <span>View in Studio</span>
                  </button>
                </div>
              ) : (
                <div className="py-6 text-center space-y-2">
                  <p className="text-xs text-[#727A70] italic">
                    No outfit scheduled for this date.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsPlanModalOpen(true)}
                    className="px-3.5 py-1.5 bg-[#244A3B] text-white rounded text-xs uppercase tracking-wider font-semibold shadow-sm"
                  >
                    Plan Outfit
                  </button>
                </div>
              )}
            </div>

            {/* This Week Section */}
            <div className="bg-[#FBFAF6] border border-[#E7E4DB] p-4 sm:p-5 space-y-3">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#26332D] font-sans block">
                This Week's Roster ({thisWeekPlans.length})
              </span>
              {thisWeekPlans.length > 0 ? (
                <div className="space-y-2">
                  {thisWeekPlans.map(({ plan, outfit }) => (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedDateKey(plan.date)}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors flex items-center justify-between ${
                        selectedDateKey === plan.date
                          ? "bg-[#E5E8DF]/70 border-[#B8B8AA]"
                          : "bg-[#FBFAF6]/50 hover:bg-[#EEEAE1] border-[#E7E4DB]"
                      }`}
                    >
                      <div>
                        <span className="text-[11px] uppercase font-semibold text-[#727A70] block">
                          {formatDisplayDate(plan.date)}
                        </span>
                        <span className="font-serif font-medium text-[#26332D]">
                          {outfit?.name || "Planned Look"}
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#7D8379]" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#727A70] italic">
                  No plans scheduled for the current week yet.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Agenda List View */
        <div className="bg-[#FBFAF6] border border-[#E7E4DB] p-6 shadow-subtle space-y-4">
          <h3 className="font-serif text-lg font-medium text-[#26332D] pb-3 border-b border-[#E7E4DB]">
            Agenda Calendar Schedule
          </h3>
          {plans.length > 0 ? (
            <div className="divide-y divide-hairline">
              {[...plans]
                .sort((a, b) => a.date.localeCompare(b.date))
                .map(plan => {
                  const outfit = outfits.find(o => o.id === plan.outfitId);
                  return (
                    <div
                      key={plan.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <span className="text-[11px] uppercase tracking-widest text-[#727A70] font-semibold">
                          {formatFullDate(plan.date)}
                        </span>
                        <h4 className="font-serif text-base font-medium text-[#26332D]">
                          {outfit?.name || "Custom Look"}
                        </h4>
                        {plan.occasion && (
                          <span className="inline-block px-2 py-0.5 text-[11px] bg-[#E5E8DF]/70 text-[#26332D] rounded">
                            {plan.occasion}
                          </span>
                        )}
                        {plan.note && (
                          <p className="text-xs text-[#727A70] italic">"{plan.note}"</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {outfit && (
                          <button
                            type="button"
                            onClick={() => loadOutfitIntoStudio(outfit)}
                            className="px-3 py-1.5 bg-[#EEEAE1] hover:bg-[#E5E8DF]/70 text-[#26332D] rounded text-xs uppercase tracking-wider font-semibold border border-[#E7E4DB]"
                          >
                            Studio
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDateKey(plan.date);
                            setIsPlanModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-[#E5E8DF]/70 hover:bg-[#DDE4DA] text-[#26332D] rounded text-xs uppercase tracking-wider font-semibold border border-[#E7E4DB]"
                        >
                          Modify
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-xs text-[#727A70] italic py-6 text-center">
              No calendar entries scheduled.
            </p>
          )}
        </div>
      )}

      {/* Plan Detail / Schedule Modal */}
      <PlanDetailModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        dateKey={selectedDateKey}
        existingPlan={selectedPlanInfo?.plan}
      />
    </div>
  );
};
