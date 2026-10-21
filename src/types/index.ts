export type ClothingCategory =
  | "Tops"
  | "Bottoms"
  | "Dresses"
  | "Outerwear"
  | "Shoes"
  | "Bags"
  | "Accessories";

export type Season = "All-season" | "Spring" | "Summer" | "Autumn" | "Winter";

export type OccasionTag = "Casual" | "Work" | "Evening" | "Formal" | "Sport";

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  color: string;
  colorHex?: string;
  season: Season[];
  occasions: string[];
  imageUrl: string;
  notes?: string;
  createdAt: string;
  wearCount?: number;
}

export interface Outfit {
  id: string;
  name: string;
  itemIds: string[];
  occasion: string;
  season: Season;
  tags: string[];
  createdAt: string;
  collectionIds: string[];
  notes?: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  outfitIds: string[];
  coverImageUrl?: string;
  createdAt: string;
}

export interface OutfitPlan {
  id: string;
  date: string; // YYYY-MM-DD local date
  outfitId: string;
  occasion?: string;
  note?: string;
}

export type ViewRoute =
  | "dashboard"
  | "wardrobe"
  | "studio"
  | "collections"
  | "calendar"
  | "insights";

export interface SlotDefinition {
  id: "tops" | "bottoms" | "outerwear" | "shoes" | "bags" | "accessories";
  label: string;
  category: ClothingCategory | ("Tops" | "Bottoms" | "Dresses");
  description: string;
}
