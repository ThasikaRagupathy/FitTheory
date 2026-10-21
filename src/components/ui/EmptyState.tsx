import React, { ReactNode } from "react";
import { Layers } from "lucide-react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-[#E7E4DB] rounded-lg bg-[#FBFAF6]/50 my-6">
      <div className="w-12 h-12 rounded-full bg-[#E5E8DF]/30 flex items-center justify-center text-[#677168] mb-4">
        {icon || <Layers className="w-5 h-5 text-[#7D8379]" />}
      </div>
      <h3 className="font-serif text-lg sm:text-xl font-medium text-[#26332D] tracking-tight">
        {title}
      </h3>
      <p className="mt-1 text-xs sm:text-sm text-[#727A70] max-w-md font-sans">
        {description}
      </p>
      
      {(actionLabel || secondaryActionLabel) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="px-4 py-2 bg-[#244A3B] hover:bg-[#193B2F] text-white rounded text-xs uppercase tracking-widest font-semibold transition-colors focus:ring-2 focus:ring-[#B95F43]"
            >
              {actionLabel}
            </button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="px-4 py-2 border border-[#E7E4DB] text-[#26332D] hover:bg-[#EEEAE1] rounded text-xs uppercase tracking-widest font-medium transition-colors"
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
