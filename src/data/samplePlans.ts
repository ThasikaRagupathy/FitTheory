import { OutfitPlan } from "../types";

// Helper to format date as YYYY-MM-DD in local time
export const formatDateKey = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const generateSamplePlans = (): OutfitPlan[] => {
  const now = new Date();
  
  const addDays = (days: number): string => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    return formatDateKey(d);
  };

  return [
    {
      id: "plan-1",
      date: addDays(0), // Today
      outfitId: "outfit-1",
      occasion: "Studio Creative Meeting",
      note: "Meeting with creative directors, casual yet polished."
    },
    {
      id: "plan-2",
      date: addDays(2),
      outfitId: "outfit-2",
      occasion: "Quarterly Strategy Review",
      note: "Smart tailored silhouette with loafers."
    },
    {
      id: "plan-3",
      date: addDays(5),
      outfitId: "outfit-4",
      occasion: "Sunday Farmers Market & Coffee",
      note: "Easy breathable linen trousers and sneakers."
    },
    {
      id: "plan-4",
      date: addDays(-2),
      outfitId: "outfit-6",
      occasion: "Gallery Opening Preview",
      note: "Layered knit and warm cashmere scarf."
    },
    {
      id: "plan-5",
      date: addDays(8),
      outfitId: "outfit-3",
      occasion: "Dinner at Bistro Vivienne",
      note: "Silk slip dress with cardigan over shoulders."
    }
  ];
};
