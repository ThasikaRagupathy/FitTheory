import React from "react";
import { CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { useWardrobe } from "../../context/WardrobeContext";

export const ToastContainer: React.FC = () => {
  const { toasts } = useWardrobe();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map(toast => {
        let icon = <CheckCircle2 className="w-4 h-4 text-sage flex-shrink-0" />;
        let borderColor = "border-sage/40";
        if (toast.type === "warning") {
          icon = <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />;
          borderColor = "border-amber-300";
        } else if (toast.type === "info") {
          icon = <Info className="w-4 h-4 text-[#727A70] flex-shrink-0" />;
          borderColor = "border-[#B8B8AA]/40";
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-white/95 backdrop-blur-md px-4 py-3 rounded border ${borderColor} shadow-elevated flex items-center gap-3 animate-fade-in transition-all`}
          >
            {icon}
            <span className="text-xs sm:text-sm font-medium text-[#26332D] font-sans">
              {toast.message}
            </span>
          </div>
        );
      })}
    </div>
  );
};
