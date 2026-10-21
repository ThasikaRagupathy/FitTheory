# FitTheory — Your Wardrobe, Reimagined

> A premium digital wardrobe and visual outfit-planning web application built with React 19, TypeScript, Vite, and Tailwind CSS.

FitTheory helps users make more of the clothes they already own. Organize wardrobe items, compose outfits in a visual studio, curate collections, plan looks on a calendar, and explore wardrobe insights through a clean, editorial fashion-tech experience.

## Features

### Overview Dashboard
- Live metrics for wardrobe items, saved outfits, collections, and planned looks.
- Curated rule-based outfit suggestions with a shortcut to Outfit Studio.
- Recently cataloged clothing and upcoming weekly outfit plans.
- Editorial content about capsule wardrobes and styling with existing pieces.

### My Wardrobe
- Browse clothing cards with photos, categories, colors, and wear counts.
- Search by item name, style tags, and notes.
- Filter by category, season, and color.
- Sort by recently added, alphabetical order, or most worn.
- Add, edit, inspect, and delete clothing items.
- Upload an image or choose a curated image preset.
- Add season, occasion, color, and styling notes.

### Outfit Studio
- Build outfits using a visual flat-lay canvas and/or mannequin view.
- Add, replace, and remove wardrobe items using drag-and-drop or click-to-add.
- Style outfits with tops, bottoms or dresses, outerwear, shoes, bags, and accessories.
- View color chips and basic color-harmony suggestions.
- Name outfits and assign occasions, seasons, tags, and collections.
- Save and edit outfits.
- Use **Surprise Me** for rule-based outfit combinations.

### Collections
- Organize saved outfits into themed capsules such as Everyday Ease, Work, Reimagined, Weekend Plans, Soft Neutrals, and Evening Edit.
- Create, edit, and delete collections.
- View outfits within each collection and add or remove looks.

### Style Calendar
- Navigate between months and return to today.
- Assign saved outfits to specific dates.
- Add occasion labels and notes.
- Edit or remove plans.
- Switch between calendar and agenda views.
- Review upcoming looks for the week.

### Style Insights
- View wardrobe category distribution and color frequency.
- Explore most-used and underused clothing pieces.
- Identify items that are not included in saved outfits.
- Try transparent, rule-based color combinations.

### Local Data Persistence
- Keep wardrobe items, outfits, collections, and plans in browser local storage.
- Start with sample wardrobe data and curated demo outfits.
- Reset demo data using the app's confirmation flow, if available.
- Use image fallbacks to prevent broken-image layouts.

## Technology Stack

| Technology | Purpose |
| --- | --- |
| React 19 | Component-based UI |
| TypeScript | Type safety |
| Vite | Development server and production build |
| Tailwind CSS | Utility-first styling |
| React DnD or equivalent | Outfit composition |
| React Router | Navigation between pages |
| LocalStorage | Client-side persistence |
| Lucide icons | Consistent interface icons |

> The exact libraries and versions depend on the implementation in the project repository. Check `package.json` for installed dependencies.

## Design System

FitTheory uses a premium, minimal, editorial fashion aesthetic.

| Token | Hex value |
| --- | --- |
| Ivory background | `#F8F6F1` |
| Warm sand | `#E7DED2` |
| Taupe | `#B8A895` |
| Charcoal | `#282724` |
| Muted sage | `#89917A` |
| White surface | `#FFFFFF` |
| Muted text | `#77736C` |
| Hairline border | `#E5E0D8` |

Editorial serif headings are paired with clean sans-serif interface typography. The layout prioritizes clothing photography, generous whitespace, subtle borders, restrained motion, accessibility, and responsive behavior.

## Getting Started

### Prerequisites
- Node.js 18 or later recommended.
- npm 9 or later recommended.

### Installation

1. Clone the repository or open the project folder.

   ```bash
   git clone <your-repository-url>
   cd FitTheory
   ```

   If the project already exists locally, simply open its directory in your terminal.

2. Install dependencies.

   ```bash
   npm install
   ```

3. Start the development server.

   ```bash
   npm run dev
   ```

4. Open the local URL printed in your terminal. Vite commonly uses `http://localhost:5173/`; the configured port may differ.

### Production Build

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Suggested Project Structure

The actual files may differ depending on the implementation.

```text
src/
├── types/
│   └── index.ts
├── data/
│   ├── sampleWardrobe.ts
│   ├── sampleOutfits.ts
│   ├── sampleCollections.ts
│   └── samplePlans.ts
├── context/
│   └── WardrobeContext.tsx
├── utils/
│   ├── dates.ts
│   ├── colorMatching.ts
│   ├── outfitSuggestions.ts
│   └── imageFallback.ts
├── components/
│   ├── layout/
│   ├── ui/
│   ├── wardrobe/
│   ├── studio/
│   ├── dashboard/
│   ├── collections/
│   ├── calendar/
│   └── insights/
├── styles/
│   └── index.css
├── App.tsx
└── main.tsx
```

## Data and Privacy

- The prototype is designed to work without a required backend.
- Wardrobe data is stored in browser local storage when persistence is implemented.
- Local storage is specific to the browser and device; it does not automatically sync across devices.
- Clearing browser storage may remove locally saved app data.
- Avoid uploading sensitive personal images to shared or public environments.
- If a backend is added later, review authentication, authorization, image storage, and database security before production use.

## Scope and Limitations

- Outfit suggestions are rule-based and are not presented as AI-generated advice.
- Style insights are calculated from the data available in the application.
- Local storage is suitable for a prototype but is not a replacement for a secure, multi-user backend.
- Background removal, live weather integration, or automatic image analysis require additional implementation if not already present.
- Drag-and-drop should also support click-to-add interactions for accessibility and touch devices.

## Roadmap

- [ ] Complete responsive wardrobe management.
- [ ] Refine the Outfit Studio flat-lay and mannequin experiences.
- [ ] Improve outfit suggestions and color coordination.
- [ ] Complete collections and calendar planning flows.
- [ ] Add automated tests for key interactions.
- [ ] Improve accessibility and keyboard support.
- [ ] Add optional authentication and cloud synchronization.
- [ ] Deploy the application and publish a portfolio case study.

## Contributing

1. Create a feature branch.
2. Make focused changes that match the existing design system.
3. Run the production build and test affected interactions.
4. Submit a pull request with a clear summary and screenshots when relevant.

## License

Choose and add a license before distributing this project publicly. If this is a personal portfolio project, specify your chosen license in a `LICENSE` file.

---

**FitTheory — Your style. Your wardrobe. Your rules.**
