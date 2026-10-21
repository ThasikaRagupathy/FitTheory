export const COLOR_PALETTE_MAP: Record<string, string> = {
  White: "#FFFFFF",
  Cream: "#F5F2EB",
  Black: "#1A1A1A",
  Sage: "#89917A",
  "Denim Blue": "#4C6B8B",
  Beige: "#D8C7B0",
  Taupe: "#B8A895",
  "Champagne / Taupe": "#D5C8B8",
  Brown: "#8B5A2B",
  Gold: "#D4AF37",
  "Beige / Oatmeal": "#E2D9CC",
  Charcoal: "#3A3935",
  "Tortoise Brown": "#5E4834",
  Navy: "#1E2A38",
  Grey: "#8E8E93",
  Olive: "#556B2F",
};

export const getColorHex = (colorName: string): string => {
  return COLOR_PALETTE_MAP[colorName] || "#A39E93";
};

export interface ColorHarmonyRule {
  name: string;
  colors: string[];
  description: string;
}

export const HARMONY_RULES: ColorHarmonyRule[] = [
  {
    name: "Tonal Warm Neutrals",
    colors: ["Cream", "Beige", "Taupe"],
    description: "Soft, monochromatic depth that creates a quiet, understated presence."
  },
  {
    name: "Sage & Ivory Contrast",
    colors: ["Sage", "White", "Cream"],
    description: "A calming organic accent paired with crisp, clean foundations."
  },
  {
    name: "Architectural Noir & Gold",
    colors: ["Black", "Charcoal", "Gold"],
    description: "High-contrast precision where metallic hardware cuts through deep textures."
  },
  {
    name: "Denim & Classic Poplin",
    colors: ["Denim Blue", "White", "Brown"],
    description: "Timeless Parisian ease pairing cool cotton, structured denim, and warm leather."
  },
  {
    name: "Earth & Tailored Charcoal",
    colors: ["Charcoal", "Cream", "Brown"],
    description: "Grounding autumnal warmth combining structured suiting with rich leather accents."
  }
];

export const analyzeOutfitColors = (colors: string[]): {
  palette: { name: string; hex: string }[];
  isHarmonious: boolean;
  notes: string;
} => {
  const uniqueColors = Array.from(new Set(colors));
  const palette = uniqueColors.map(c => ({
    name: c,
    hex: getColorHex(c)
  }));

  const neutralNames = ["White", "Cream", "Black", "Beige", "Taupe", "Charcoal", "Beige / Oatmeal"];
  const neutralCount = uniqueColors.filter(c => neutralNames.includes(c)).length;
  
  let notes = "Balanced tonal palette";
  if (neutralCount >= 2 && uniqueColors.length <= 4) {
    notes = "Harmonious balance of neutral anchors";
  } else if (uniqueColors.includes("Sage")) {
    notes = "Earthy sage provides a subtle organic focal point";
  } else if (uniqueColors.includes("Denim Blue")) {
    notes = "Classic denim base coordinates effortlessly";
  }

  return {
    palette,
    isHarmonious: true,
    notes
  };
};
