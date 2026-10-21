import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ClothingItem, Outfit, Collection, OutfitPlan, ViewRoute } from "../types";
import { SAMPLE_WARDROBE } from "../data/sampleWardrobe";
import { SAMPLE_OUTFITS } from "../data/sampleOutfits";
import { SAMPLE_COLLECTIONS } from "../data/sampleCollections";
import { generateSamplePlans } from "../data/samplePlans";

interface ToastNotification {
  id: string;
  type: "success" | "info" | "warning";
  message: string;
}

interface StudioDraft {
  outfitId?: string;
  name: string;
  occasion: string;
  season: Outfit["season"];
  tags: string[];
  notes?: string;
  collectionIds: string[];
  slots: {
    tops?: string;
    bottoms?: string;
    outerwear?: string;
    shoes?: string;
    bags?: string;
    accessories?: string;
  };
}

interface WardrobeContextType {
  // Navigation
  currentView: ViewRoute;
  setCurrentView: (view: ViewRoute) => void;

  // Data
  wardrobe: ClothingItem[];
  outfits: Outfit[];
  collections: Collection[];
  plans: OutfitPlan[];

  // Clothing Item Actions
  addItem: (item: Omit<ClothingItem, "id" | "createdAt" | "wearCount">) => ClothingItem;
  updateItem: (id: string, updates: Partial<ClothingItem>) => void;
  deleteItem: (id: string) => void;

  // Outfit Actions
  saveOutfit: (outfitData: Omit<Outfit, "id" | "createdAt"> & { id?: string }) => Outfit;
  deleteOutfit: (id: string) => void;

  // Collection Actions
  addCollection: (col: Omit<Collection, "id" | "createdAt" | "outfitIds">) => Collection;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  toggleOutfitInCollection: (collectionId: string, outfitId: string) => void;

  // Plan Actions
  savePlan: (plan: Omit<OutfitPlan, "id"> & { id?: string }) => OutfitPlan;
  deletePlan: (id: string) => void;

  // Studio Staging
  studioDraft: StudioDraft;
  setStudioDraft: React.Dispatch<React.SetStateAction<StudioDraft>>;
  loadOutfitIntoStudio: (outfit: Outfit) => void;
  loadItemsIntoStudio: (itemIds: string[], outfitName?: string) => void;
  clearStudio: () => void;

  // Global Modals
  isAddItemModalOpen: boolean;
  setIsAddItemModalOpen: (open: boolean) => void;
  selectedItemIdForDetail: string | null;
  setSelectedItemIdForDetail: (id: string | null) => void;

  // Feedback & Persistence
  toasts: ToastNotification[];
  showToast: (message: string, type?: "success" | "info" | "warning") => void;
  resetToDemoData: () => void;
}

const STORAGE_KEYS = {
  WARDROBE: "fittheory_wardrobe_v1",
  OUTFITS: "fittheory_outfits_v1",
  COLLECTIONS: "fittheory_collections_v1",
  PLANS: "fittheory_plans_v1",
};

const defaultDraft: StudioDraft = {
  name: "",
  occasion: "Casual",
  season: "All-season",
  tags: [],
  notes: "",
  collectionIds: [],
  slots: {},
};

const WardrobeContext = createContext<WardrobeContextType | undefined>(undefined);

export const WardrobeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewRoute>("dashboard");

  // Load state from localStorage or fallback to initial samples
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WARDROBE);
      return saved ? JSON.parse(saved) : SAMPLE_WARDROBE;
    } catch {
      return SAMPLE_WARDROBE;
    }
  });

  const [outfits, setOutfits] = useState<Outfit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OUTFITS);
      return saved ? JSON.parse(saved) : SAMPLE_OUTFITS;
    } catch {
      return SAMPLE_OUTFITS;
    }
  });

  const [collections, setCollections] = useState<Collection[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
      return saved ? JSON.parse(saved) : SAMPLE_COLLECTIONS;
    } catch {
      return SAMPLE_COLLECTIONS;
    }
  });

  const [plans, setPlans] = useState<OutfitPlan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLANS);
      return saved ? JSON.parse(saved) : generateSamplePlans();
    } catch {
      return generateSamplePlans();
    }
  });

  const [studioDraft, setStudioDraft] = useState<StudioDraft>(defaultDraft);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [selectedItemIdForDetail, setSelectedItemIdForDetail] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WARDROBE, JSON.stringify(wardrobe));
    } catch (e) {
      console.warn("Storage quota exceeded or storage disabled for wardrobe", e);
    }
  }, [wardrobe]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.OUTFITS, JSON.stringify(outfits));
    } catch (e) {
      console.warn("Storage error for outfits", e);
    }
  }, [outfits]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
    } catch (e) {
      console.warn("Storage error for collections", e);
    }
  }, [collections]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
    } catch (e) {
      console.warn("Storage error for plans", e);
    }
  }, [plans]);

  const showToast = (message: string, type: "success" | "info" | "warning" = "success") => {
    const id = "toast-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const addItem = (itemData: Omit<ClothingItem, "id" | "createdAt" | "wearCount">): ClothingItem => {
    const newItem: ClothingItem = {
      ...itemData,
      id: "item-" + Date.now(),
      createdAt: new Date().toISOString(),
      wearCount: 0,
    };
    setWardrobe(prev => [newItem, ...prev]);
    showToast(`Added "${newItem.name}" to your wardrobe`);
    return newItem;
  };

  const updateItem = (id: string, updates: Partial<ClothingItem>) => {
    setWardrobe(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
    showToast("Wardrobe item updated");
  };

  const deleteItem = (id: string) => {
    const target = wardrobe.find(i => i.id === id);
    setWardrobe(prev => prev.filter(i => i.id !== id));
    // Also remove from any studio drafts
    setStudioDraft(prev => {
      const nextSlots = { ...prev.slots };
      for (const key of Object.keys(nextSlots) as (keyof typeof nextSlots)[]) {
        if (nextSlots[key] === id) {
          delete nextSlots[key];
        }
      }
      return { ...prev, slots: nextSlots };
    });
    showToast(target ? `Removed "${target.name}"` : "Item removed", "info");
  };

  const saveOutfit = (outfitData: Omit<Outfit, "id" | "createdAt"> & { id?: string }): Outfit => {
    const isEdit = Boolean(outfitData.id);
    const outfitId = outfitData.id || "outfit-" + Date.now();
    const newOutfit: Outfit = {
      ...outfitData,
      id: outfitId,
      createdAt: isEdit
        ? outfits.find(o => o.id === outfitId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
    };

    if (isEdit) {
      setOutfits(prev => prev.map(o => (o.id === outfitId ? newOutfit : o)));
      showToast(`Updated outfit "${newOutfit.name}"`);
    } else {
      setOutfits(prev => [newOutfit, ...prev]);
      showToast(`Saved outfit "${newOutfit.name}"`);
    }

    // Increment wear/appearance count on participating items
    setWardrobe(prev =>
      prev.map(item => {
        if (outfitData.itemIds.includes(item.id)) {
          return { ...item, wearCount: (item.wearCount || 0) + 1 };
        }
        return item;
      })
    );

    // Sync outfit into designated collections
    if (outfitData.collectionIds && outfitData.collectionIds.length > 0) {
      setCollections(prev =>
        prev.map(col => {
          if (outfitData.collectionIds.includes(col.id)) {
            if (!col.outfitIds.includes(outfitId)) {
              return { ...col, outfitIds: [...col.outfitIds, outfitId] };
            }
          } else {
            // Remove if deselected
            if (col.outfitIds.includes(outfitId)) {
              return { ...col, outfitIds: col.outfitIds.filter(id => id !== outfitId) };
            }
          }
          return col;
        })
      );
    }

    return newOutfit;
  };

  const deleteOutfit = (id: string) => {
    const target = outfits.find(o => o.id === id);
    setOutfits(prev => prev.filter(o => o.id !== id));
    // Remove from collections
    setCollections(prev =>
      prev.map(col => ({
        ...col,
        outfitIds: col.outfitIds.filter(oId => oId !== id),
      }))
    );
    // Remove from calendar plans
    setPlans(prev => prev.filter(p => p.outfitId !== id));
    showToast(target ? `Deleted outfit "${target.name}"` : "Outfit deleted", "info");
  };

  const addCollection = (colData: Omit<Collection, "id" | "createdAt" | "outfitIds">): Collection => {
    const newCol: Collection = {
      ...colData,
      id: "col-" + Date.now(),
      outfitIds: [],
      createdAt: new Date().toISOString(),
    };
    setCollections(prev => [...prev, newCol]);
    showToast(`Created collection "${newCol.name}"`);
    return newCol;
  };

  const updateCollection = (id: string, updates: Partial<Collection>) => {
    setCollections(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast("Collection updated");
  };

  const deleteCollection = (id: string) => {
    const target = collections.find(c => c.id === id);
    setCollections(prev => prev.filter(c => c.id !== id));
    // Unlink collectionId from outfits
    setOutfits(prev =>
      prev.map(o => ({
        ...o,
        collectionIds: o.collectionIds.filter(cId => cId !== id),
      }))
    );
    showToast(target ? `Deleted collection "${target.name}"` : "Collection deleted", "info");
  };

  const toggleOutfitInCollection = (collectionId: string, outfitId: string) => {
    setCollections(prev =>
      prev.map(col => {
        if (col.id === collectionId) {
          const exists = col.outfitIds.includes(outfitId);
          return {
            ...col,
            outfitIds: exists
              ? col.outfitIds.filter(id => id !== outfitId)
              : [...col.outfitIds, outfitId],
          };
        }
        return col;
      })
    );
    setOutfits(prev =>
      prev.map(outfit => {
        if (outfit.id === outfitId) {
          const exists = outfit.collectionIds.includes(collectionId);
          return {
            ...outfit,
            collectionIds: exists
              ? outfit.collectionIds.filter(id => id !== collectionId)
              : [...outfit.collectionIds, collectionId],
          };
        }
        return outfit;
      })
    );
  };

  const savePlan = (planData: Omit<OutfitPlan, "id"> & { id?: string }): OutfitPlan => {
    const isEdit = Boolean(planData.id);
    const planId = planData.id || "plan-" + Date.now();
    const newPlan: OutfitPlan = {
      ...planData,
      id: planId,
    };

    if (isEdit) {
      setPlans(prev => prev.map(p => (p.id === planId ? newPlan : p)));
      showToast("Updated calendar plan");
    } else {
      // If a plan already exists for this date, replace or update it
      const existing = plans.find(p => p.date === planData.date);
      if (existing) {
        setPlans(prev => prev.map(p => (p.id === existing.id ? { ...newPlan, id: existing.id } : p)));
        showToast("Updated outfit for date");
      } else {
        setPlans(prev => [...prev, newPlan]);
        showToast("Look scheduled to calendar");
      }
    }
    return newPlan;
  };

  const deletePlan = (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id));
    showToast("Removed planned look", "info");
  };

  // Helper to map item list into studio slots
  const mapItemsToSlots = (itemIds: string[]) => {
    const slots: StudioDraft["slots"] = {};
    const items = itemIds
      .map(id => wardrobe.find(w => w.id === id))
      .filter((i): i is ClothingItem => Boolean(i));

    for (const item of items) {
      if (item.category === "Dresses") {
        slots.bottoms = item.id;
      } else if (item.category === "Tops" && !slots.tops) {
        slots.tops = item.id;
      } else if (item.category === "Bottoms" && !slots.bottoms) {
        slots.bottoms = item.id;
      } else if (item.category === "Outerwear" && !slots.outerwear) {
        slots.outerwear = item.id;
      } else if (item.category === "Shoes" && !slots.shoes) {
        slots.shoes = item.id;
      } else if (item.category === "Bags" && !slots.bags) {
        slots.bags = item.id;
      } else if (item.category === "Accessories" && !slots.accessories) {
        slots.accessories = item.id;
      }
    }
    return slots;
  };

  const loadOutfitIntoStudio = (outfit: Outfit) => {
    const slots = mapItemsToSlots(outfit.itemIds);
    setStudioDraft({
      outfitId: outfit.id,
      name: outfit.name,
      occasion: outfit.occasion,
      season: outfit.season,
      tags: outfit.tags,
      notes: outfit.notes || "",
      collectionIds: outfit.collectionIds || [],
      slots,
    });
    setCurrentView("studio");
    showToast(`Loaded "${outfit.name}" into Outfit Studio`, "info");
  };

  const loadItemsIntoStudio = (itemIds: string[], outfitName?: string) => {
    const slots = mapItemsToSlots(itemIds);
    setStudioDraft({
      name: outfitName || "Curated Editorial Look",
      occasion: "Casual",
      season: "All-season",
      tags: ["Curated"],
      notes: "Assembled from FitTheory recommendations.",
      collectionIds: [],
      slots,
    });
    setCurrentView("studio");
    showToast("Assembled look in Outfit Studio", "info");
  };

  const clearStudio = () => {
    setStudioDraft(defaultDraft);
  };

  const resetToDemoData = () => {
    setWardrobe(SAMPLE_WARDROBE);
    setOutfits(SAMPLE_OUTFITS);
    setCollections(SAMPLE_COLLECTIONS);
    setPlans(generateSamplePlans());
    setStudioDraft(defaultDraft);
    localStorage.removeItem(STORAGE_KEYS.WARDROBE);
    localStorage.removeItem(STORAGE_KEYS.OUTFITS);
    localStorage.removeItem(STORAGE_KEYS.COLLECTIONS);
    localStorage.removeItem(STORAGE_KEYS.PLANS);
    showToast("Wardrobe reset to original sample collection", "info");
  };

  return (
    <WardrobeContext.Provider
      value={{
        currentView,
        setCurrentView,
        wardrobe,
        outfits,
        collections,
        plans,
        addItem,
        updateItem,
        deleteItem,
        saveOutfit,
        deleteOutfit,
        addCollection,
        updateCollection,
        deleteCollection,
        toggleOutfitInCollection,
        savePlan,
        deletePlan,
        studioDraft,
        setStudioDraft,
        loadOutfitIntoStudio,
        loadItemsIntoStudio,
        clearStudio,
        isAddItemModalOpen,
        setIsAddItemModalOpen,
        selectedItemIdForDetail,
        setSelectedItemIdForDetail,
        toasts,
        showToast,
        resetToDemoData,
      }}
    >
      {children}
    </WardrobeContext.Provider>
  );
};

export const useWardrobe = (): WardrobeContextType => {
  const context = useContext(WardrobeContext);
  if (!context) {
    throw new Error("useWardrobe must be used within a WardrobeProvider");
  }
  return context;
};
