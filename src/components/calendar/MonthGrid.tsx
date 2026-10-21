import React from "react";
import { CalendarDayInfo, formatMonthYear } from "../../utils/dates";
import { OutfitPlan, Outfit } from "../../types";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

interface MonthGridProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  days: CalendarDayInfo[];
  plansMap: Map<string, { plan: OutfitPlan; outfit?: Outfit }>;
  selectedDateKey: string;
  onSelectDate: (dateKey: string) => void;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const MonthGrid: React.FC<MonthGridProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  days,
  plansMap,
  selectedDateKey,
  onSelectDate,
}) => {
  return (
    <div className="bg-[#FBFAF6] border border-[#E7E4DB] p-3 sm:p-5 space-y-4">
      {/* Month Navigation Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E7E4DB]">
        <div className="flex items-center gap-3">
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#26332D]">
            {formatMonthYear(currentDate)}
          </h3>
          <button
            type="button"
            onClick={onToday}
            className="px-2.5 py-1 text-[11px] uppercase tracking-wider font-semibold text-[#26332D] bg-[#E5E8DF]/70 hover:bg-[#DDE4DA] rounded border border-[#E7E4DB] transition-colors"
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onPrevMonth}
            className="p-1.5 text-[#26332D] hover:bg-[#E5E8DF]/70 rounded border border-[#E7E4DB] transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            className="p-1.5 text-[#26332D] hover:bg-[#E5E8DF]/70 rounded border border-[#E7E4DB] transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map(day => (
          <div
            key={day}
            className="text-[11px] uppercase tracking-widest font-semibold text-[#727A70] py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map(day => {
          const planInfo = plansMap.get(day.dateKey);
          const isSelected = selectedDateKey === day.dateKey;

          return (
            <div
              key={day.dateKey}
              onClick={() => onSelectDate(day.dateKey)}
              className={`min-h-[70px] sm:min-h-[96px] p-1.5 sm:p-2 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                !day.isCurrentMonth ? "opacity-35 bg-[#FBFAF6]/50" : "bg-[#FBFAF6]"
              } ${
                isSelected
                  ? "ring-2 ring-[#244A3B] border-transparent shadow-sm bg-[#E5E8DF]/60"
                  : "border-[#E7E4DB] hover:border-[#B8B8AA] hover:bg-[#FBFAF6]"
              }`}
            >
              {/* Day Number and Today dot */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-sans font-medium ${
                    day.isToday
                      ? "w-5 h-5 rounded-full bg-[#244A3B] text-white flex items-center justify-center font-bold"
                      : isSelected
                      ? "text-[#26332D] font-bold"
                      : "text-[#34493E]"
                  }`}
                >
                  {day.dayNumber}
                </span>

                {planInfo && (
                  <span className="w-2 h-2 rounded-full bg-[#315B4A] flex-shrink-0" title="Look scheduled" />
                )}
              </div>

              {/* Planned Outfit Pill / Thumbnail */}
              {planInfo ? (
                <div className="mt-1 p-1 bg-[#EEEAE1] rounded border border-[#E7E4DB] truncate">
                  <div className="flex items-center gap-1">
                    <span className="font-serif text-[11px] sm:text-xs font-medium text-[#26332D] truncate block">
                      {planInfo.outfit?.name || "Planned"}
                    </span>
                  </div>
                  {planInfo.plan.occasion && (
                    <span className="hidden sm:block text-[11px] text-[#727A70] truncate">
                      {planInfo.plan.occasion}
                    </span>
                  )}
                </div>
              ) : (
                <div className="h-4" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
