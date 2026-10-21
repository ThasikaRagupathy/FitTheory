import { ClothingCategory } from "../types";

export const getCategoryIconSvg = (category: ClothingCategory): string => {
  switch (category) {
    case "Tops":
      return `<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>`;
    case "Bottoms":
      return `<path d="M6 3h12l1 9-3 9h-3l-1-7-1 7H8l-3-9 1-9z"/>`;
    case "Dresses":
      return `<path d="M9 3h6l2 5-3 13H10L7 8l2-5z"/>`;
    case "Outerwear":
      return `<path d="M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4L12 2 4 4z"/><line x1="12" y1="2" x2="12" y2="22"/>`;
    case "Shoes":
      return `<path d="M4 14l2-4 5 1 5-4 4 2-1 9H4z"/>`;
    case "Bags":
      return `<path d="M6 8V6a4 4 0 0 1 8 0v2"/><rect width="18" height="14" x="3" y="8" rx="2"/>`;
    case "Accessories":
    default:
      return `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>`;
  }
};

export const getFallbackImageDataUri = (name: string, category: ClothingCategory, colorHex?: string): string => {
  const bg = colorHex || "#F2EFE8";
  const iconSvg = getCategoryIconSvg(category);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
    <rect width="100%" height="100%" fill="#F8F6F1"/>
    <rect x="24" y="24" width="352" height="452" rx="4" fill="${bg}" fill-opacity="0.25" stroke="#E5E0D8" stroke-width="1.5"/>
    <g transform="translate(176, 190) scale(2)" fill="none" stroke="#77736C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      ${iconSvg}
    </g>
    <text x="200" y="280" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" letter-spacing="2" text-anchor="middle" fill="#77736C" font-weight="600" text-transform="uppercase">${category}</text>
    <text x="200" y="310" font-family="'Playfair Display', serif" font-size="16" text-anchor="middle" fill="#282724" font-weight="500">${name.length > 25 ? name.substring(0, 23) + '...' : name}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
