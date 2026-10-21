import { ClothingItem, Season } from "../types";

export interface SuggestionResult {
  title: string;
  itemIds: string[];
  rationale: string;
  missingCategories?: string[];
  slots: {
    top?: ClothingItem;
    bottom?: ClothingItem;
    dress?: ClothingItem;
    outerwear?: ClothingItem;
    shoes?: ClothingItem;
    bag?: ClothingItem;
    accessories?: ClothingItem;
  };
}

export const generateOutfitSuggestion = (
  wardrobe: ClothingItem[],
  options?: {
    preferredSeason?: Season;
    preferredOccasion?: string;
    useDress?: boolean;
    seedOffset?: number;
  }
): SuggestionResult => {
  const { preferredSeason, preferredOccasion, useDress = false, seedOffset = 0 } = options || {};

  // Filter candidate pool if specific filters requested
  let candidates = wardrobe;
  if (preferredSeason && preferredSeason !== "All-season") {
    const seasonFiltered = wardrobe.filter(
      item => item.season.includes("All-season") || item.season.includes(preferredSeason)
    );
    if (seasonFiltered.length >= 3) candidates = seasonFiltered;
  }

  if (preferredOccasion) {
    const occasionFiltered = candidates.filter(item =>
      item.occasions.includes(preferredOccasion)
    );
    if (occasionFiltered.length >= 3) candidates = occasionFiltered;
  }

  const getCategoryItems = (cat: string) => candidates.filter(i => i.category === cat);
  const fallbackCategoryItems = (cat: string) => wardrobe.filter(i => i.category === cat);

  const pickItem = (category: string, offset: number): ClothingItem | undefined => {
    let pool = getCategoryItems(category);
    if (pool.length === 0) pool = fallbackCategoryItems(category);
    if (pool.length === 0) return undefined;
    const index = (seedOffset + offset) % pool.length;
    return pool[index];
  };

  const dresses = getCategoryItems("Dresses").length > 0 ? getCategoryItems("Dresses") : fallbackCategoryItems("Dresses");
  const shouldAssembleDress = (useDress || (dresses.length > 0 && (seedOffset % 3 === 2)));

  const selectedSlots: SuggestionResult["slots"] = {};
  const missingCategories: string[] = [];

  if (shouldAssembleDress && dresses.length > 0) {
    const dress = pickItem("Dresses", 0);
    selectedSlots.dress = dress;
  } else {
    const top = pickItem("Tops", 0);
    const bottom = pickItem("Bottoms", 1);
    if (top) selectedSlots.top = top;
    else missingCategories.push("Tops");

    if (bottom) selectedSlots.bottom = bottom;
    else missingCategories.push("Bottoms");
  }

  const shoes = pickItem("Shoes", 2);
  if (shoes) selectedSlots.shoes = shoes;
  else missingCategories.push("Shoes");

  // Optional layers
  const outerwear = pickItem("Outerwear", 3);
  if (outerwear) selectedSlots.outerwear = outerwear;

  const bag = pickItem("Bags", 4);
  if (bag) selectedSlots.bag = bag;

  const accessories = pickItem("Accessories", 5);
  if (accessories) selectedSlots.accessories = accessories;

  const itemIds = Object.values(selectedSlots)
    .filter((i): i is ClothingItem => Boolean(i))
    .map(i => i.id);

  let title = "Tonal Ensemble to Try";
  let rationale = "Balanced silhouette combining versatile neutral anchors with complementary textures.";

  if (selectedSlots.dress) {
    title = "Fluid Silhouette & Light Layer";
    rationale = "Slip silhouette grounded by clean footwear and an optional structured outer layer.";
  } else if (selectedSlots.outerwear?.name.includes("Trench")) {
    title = "Contemporary Tailored Ease";
    rationale = "Structured trench coat draped over clean essentials for architectural proportion.";
  } else if (selectedSlots.outerwear?.name.includes("Cardigan") || selectedSlots.outerwear?.color === "Sage") {
    title = "Soft Organic Knit Pairing";
    rationale = "Muted sage accents bring a serene, earthy touch to everyday neutral foundations.";
  }

  return {
    title,
    itemIds,
    rationale,
    missingCategories: missingCategories.length > 0 ? missingCategories : undefined,
    slots: selectedSlots
  };
};

export const getCuratedSuggestions = (wardrobe: ClothingItem[]): SuggestionResult[] => {
  return [
    generateOutfitSuggestion(wardrobe, { seedOffset: 0, preferredOccasion: "Casual" }),
    generateOutfitSuggestion(wardrobe, { seedOffset: 1, preferredOccasion: "Work" }),
    generateOutfitSuggestion(wardrobe, { seedOffset: 2, useDress: true, preferredOccasion: "Evening" })
  ];
};
