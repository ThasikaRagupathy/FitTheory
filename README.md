# FitTheory — Your Wardrobe, Reimagined

> A digital wardrobe and visual outfit-planning web application built with React 19, TypeScript, Vite, and Tailwind CSS. Embodying a premium, minimal editorial fashion magazine aesthetic.

---

## ✨ Features & Architecture

### 1. Overview / Dashboard (`/`)
- **Live Summary Metrics**: Instant counts of total wardrobe items, saved looks, curated collections, and planned looks for the current week derived dynamically from state.
- **Outfits to Try**: 3 curated, rule-based combinations with instant "Style in Studio" one-click action.
- **Recently Cataloged**: High-resolution editorial cards with quick detail inspection.
- **Weekly Schedule**: Upcoming planned looks linked directly to the calendar.
- **Editorial Brand Philosophy**: Curated perspective on capsule wardrobes.

### 2. My Wardrobe (`/wardrobe`)
- **Interactive Library**: Cataloged clothing pieces displaying photos, category labels, color chips, and wear counts.
- **Multi-dimensional Filters**:
  - Search by piece name, style tags, or notes.
  - Category pill filter tabs (All, Tops, Bottoms, Dresses, Outerwear, Shoes, Bags, Accessories) with dynamic item count badges.
  - Seasonality filter (All-season, Spring, Summer, Autumn, Winter).
  - Tonal color filter.
  - Sorting (Recently Added, Alphabetical A-Z, Alphabetical Z-A, Most Worn).
- **Add / Edit Modal**: Form with validation, local image file upload (`FileReader` preview), curated high-fashion image presets, category, colorway, season, and occasion tags.
- **Detail Panel**: High-resolution view, styling notes, wear count, and list of saved outfits that feature the piece.

### 3. Outfit Studio (`/studio`) — Signature Atelier Feature
- **Atelier Mannequin Visualizer**:
  - Full standing tailor's dress-form mannequin with pedestal and soft studio spotlighting.
  - Layered garment draping:
    - *Head / Neck*: Accessories (hoop earrings, fringe scarves) with floating luxury tags.
    - *Shoulders*: Draped outerwear (trench, wool blazer, cardigan).
    - *Torso*: Top (poplin shirt, ribbed knit) or Full Dress.
    - *Waist / Hips*: Tailored trousers, straight denim, or bias midi skirt.
    - *Hands / Arm*: Handbags & shoulder bags.
    - *Base*: Footwear (loafers, sneakers, strappy sandals).
- **Flexible Studio View Modes**:
  - **Flat Lay**: Classic editorial tabletop flat-lay spread.
  - **Mannequin**: 3D-depth standing mannequin atelier visualizer with interactive droppable regions.
  - **Dual View**: Real-time side-by-side spread combining tabletop slots and the live dressed mannequin simultaneously.
- **Drag-and-Drop & Click-to-Add**: Dropping items directly onto mannequin body regions or canvas slots.
- **"Surprise Me" Curatorial Generator**: Deterministic rule-based formula generator with celebratory champagne & gold confetti burst.
- **Look Specifications & Color Harmony**:
  - Live color balance analysis with hex chips and palette harmony notes.
  - Look title, occasion selector, season selector, style tags.
  - Assign looks directly to one or more thematic collections.
  - One-click saved outfit editing and updates.

### 4. Collections (`/collections`)
- **Editorial Cover Cards**: Themed capsules including *Everyday Ease*, *Work, Reimagined*, *Weekend Plans*, *Soft Neutrals*, and *Evening Edit*.
- **Capsule Explorer**: Inspect all outfits saved to a collection with piece flat-lays.
- **Collection Management**: Create new collections, edit titles/descriptions/covers, and toggle outfits in/out of capsules.

### 5. Style Calendar (`/calendar`)
- **Interactive Month Grid**: Navigate months, return to Today, and view scheduled outfit thumbnails on specific dates.
- **Date Inspector & Scheduler**: Select any date to view scheduled looks, change outfits, assign occasion labels (e.g. "Creative Review", "Dinner Date"), or add weather notes.
- **Agenda / List Mode**: Switch between 7-column calendar grid and a clean agenda list view (optimized for mobile).
- **This Week Summary**: Dedicated roster of upcoming outfits for the current week.

### 6. Style Insights (`/insights`)
- **Transparent Wardrobe Calculations**:
  - Category distribution with progress bars and percentage shares.
  - Most prominent tones and colorway frequency.
  - Most integrated pieces (by wear count).
  - *Underused Pieces*: Explicit calculation of items appearing in 0 saved looks with quick "Try in Studio" buttons.
  - *Color Harmony Formulas*: Transparent rules (e.g. *Tonal Warm Neutrals*, *Sage & Ivory Contrast*, *Architectural Noir & Gold*) with one-click combination staging.

### 7. LocalStorage Persistence & Resilience
- Persistent storage for wardrobe library, outfits, collections, and calendar plans.
- Initial seed data (20 realistic pieces, 5 collections, 6 outfits, and calendar schedule) automatically populated on first run.
- **Reset Demo Data** action with confirmation dialog.
- Graceful SVG fallback images preventing broken image states.

---

## 🎨 Visual System & Brand Palette

- **Ivory Background**: `#F8F6F1`
- **Warm Sand**: `#E7DED2`
- **Taupe**: `#B8A895`
- **Charcoal**: `#282724`
- **Muted Sage**: `#89917A`
- **White Surface**: `#FFFFFF`
- **Muted Text**: `#77736C`
- **Hairline Border**: `#E5E0D8`
- **Typography**: Editorial serif (*Playfair Display*) paired with clean geometric sans-serif (*Plus Jakarta Sans* / *Inter*).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended, verified on v25.2.0)
- npm (v9+ recommended, verified on v11.6.2)

### Installation & Run

1. **Clone or enter the project directory**:
   ```bash
   cd d:\FitTheory
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application will be live at `http://localhost:3000/`.

4. **Build for production**:
   ```bash
   npm run build
   ```
   Outputs optimized static assets to `dist/`.

5. **Preview production build**:
   ```bash
   npm run preview
   ```

---

## 📁 Project Structure

```text
src/
├── types/
│   └── index.ts                 # TypeScript types (ClothingItem, Outfit, Collection, Plan, etc.)
├── data/
│   ├── sampleWardrobe.ts        # 20 curated sample pieces with realistic imagery
│   ├── sampleOutfits.ts         # Sample outfits connecting items and capsules
│   ├── sampleCollections.ts     # Curated collections
│   └── samplePlans.ts           # Dynamic calendar plans
├── context/
│   └── WardrobeContext.tsx      # Central state, localStorage sync, actions, toasts
├── utils/
│   ├── dates.ts                 # Calendar calculations, formatting, week bounds
│   ├── colorMatching.ts         # Color palette mapping, harmony rules, analysis
│   ├── outfitSuggestions.ts     # Transparent rule-based styling algorithms
│   └── imageFallback.ts         # Graceful SVG placeholder generator
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx         # Responsive application shell
│   │   ├── Sidebar.tsx          # Editorial navigation sidebar
│   │   ├── Topbar.tsx           # Breadcrumb, actions, and global Add Item
│   │   └── MobileNav.tsx        # Mobile drawer and fixed bottom bar
│   ├── ui/
│   │   ├── Modal.tsx            # Accessible modal dialog with backdrop
│   │   ├── ConfirmDialog.tsx    # Confirmation dialog for critical actions
│   │   ├── Toast.tsx            # Feedback toast notification stack
│   │   └── EmptyState.tsx       # Graceful empty state illustration
│   ├── wardrobe/
│   │   ├── ClothingCard.tsx     # Editorial card with photo, badges, and quick actions
│   │   ├── ClothingGrid.tsx     # Wardrobe library view with search, filter, and sort
│   │   ├── ClothingFilters.tsx  # Filter controls and category pill tabs
│   │   ├── ClothingFormModal.tsx# Add/edit form with file upload and presets
│   │   └── ClothingDetailModal.tsx # Item inspector, wear count, and matching outfits
│   ├── studio/
│   │   ├── OutfitStudio.tsx     # Master 3-column / responsive studio container
│   │   ├── OutfitCanvas.tsx     # Flat-lay tabletop mood board
│   │   ├── OutfitSlot.tsx       # Drag-and-drop droppable slot
│   │   ├── WardrobePicker.tsx   # Side panel with draggable wardrobe cards
│   │   └── OutfitSummaryPanel.tsx # Look title, tags, color balance, collections, save
│   ├── dashboard/
│   │   └── Dashboard.tsx        # Overview with live counts and curated formulas
│   ├── collections/
│   │   ├── CollectionsView.tsx  # Thematic capsules overview
│   │   ├── CollectionDetailModal.tsx # Capsule outfit explorer and management
│   │   └── NewCollectionModal.tsx # Create/edit collection modal
│   ├── calendar/
│   │   ├── CalendarView.tsx     # Style calendar with agenda switch and week roster
│   │   ├── MonthGrid.tsx        # 7-day monthly interactive grid
│   │   └── PlanDetailModal.tsx  # Schedule and modify planned outfits
│   └── insights/
│       └── InsightsView.tsx     # Category charts, color palettes, underused pieces
├── styles/
│   └── index.css                # Tailwind directives and editorial typography
├── App.tsx                      # Root component
└── main.tsx                     # React 19 entry point
```
#   F i t T h e o r y  
 