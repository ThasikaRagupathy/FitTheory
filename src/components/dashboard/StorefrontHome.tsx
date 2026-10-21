import React, { useEffect, useMemo, useState } from "react";
import { useWardrobe } from "../../context/WardrobeContext";
import { ClothingCategory, ClothingItem } from "../../types";
import { StoreProduct } from "../../types/store";
import { StoreManager } from "./StoreManager";
import { getFallbackImageDataUri } from "../../utils/imageFallback";
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Heart, Menu, Minus, Plus, Search, ShoppingBag, X } from "lucide-react";

type StoreCategory = ClothingCategory | "All" | "Clothing";
const categories: StoreCategory[] = ["All", "Clothing", "Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Bags", "Accessories"];
const basePrices: Record<ClothingCategory, number> = { Tops: 14400, Bottoms: 21600, Dresses: 32400, Outerwear: 38400, Shoes: 26400, Bags: 23400, Accessories: 10200 };
const productPrice = (item: ClothingItem, index: number) => basePrices[item.category] + (index % 4) * 1200;
const formatPrice = (price: number) => new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(price);
const CATALOG_KEY = "fittheory_store_catalog_lkr_v2";
const LEGACY_CATALOG_KEY = "fittheory_store_catalog_v1";
const LEGACY_USD_TO_LKR = 300;

interface ProductTileProps {
  product: StoreProduct;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onAddToBag: () => void;
}

const ProductTile: React.FC<ProductTileProps> = ({ product, isWishlisted, onToggleWishlist, onAddToBag }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const image = imageFailed ? getFallbackImageDataUri(product.name, product.category, undefined) : product.imageUrl;
  return (
    <article className="group min-w-0">
      <div className="relative overflow-hidden bg-[#EEEAE1]">
        <img src={image} alt={product.name} onError={() => setImageFailed(true)} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.035]" />
        <span className="absolute left-3 top-3 bg-[#F8F6F0] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#315B4A]">{product.category}</span>
        <button type="button" onClick={onToggleWishlist} aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`} className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-[#F8F6F0]/95 transition-colors hover:bg-white ${isWishlisted ? "text-[#B95F43]" : "text-[#29332E]"}`}><Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} strokeWidth={1.6} /></button>
        <button type="button" onClick={onAddToBag} disabled={product.stock < 1} className="absolute inset-x-2 bottom-2 flex min-h-10 items-center justify-center gap-2 bg-[#244A3B] px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white opacity-100 transition-[background-color,transform] hover:bg-[#193B2F] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#8A9289] sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">{product.stock > 0 ? <><Plus className="h-3.5 w-3.5" /> Add to bag</> : "Out of stock"}</button>
      </div>
      <div className="flex items-start justify-between gap-2 pt-3"><div className="min-w-0"><p className="truncate text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7D8379]">FitTheory</p><h3 className="mt-1 line-clamp-2 min-h-10 font-serif text-sm leading-5 text-[#262A26] sm:text-base">{product.name}</h3><p className="mt-1 text-xs text-[#777A72]">{product.color}</p></div><span className="shrink-0 pt-4 text-xs font-semibold tabular-nums text-[#262A26]">{formatPrice(product.price)}</span></div>
    </article>
  );
};

export const StorefrontHome: React.FC = () => {
  const { wardrobe, setCurrentView, showToast } = useWardrobe();
  const [catalogData] = useState<StoreProduct[] | null>(() => {
    try {
      const saved = localStorage.getItem(CATALOG_KEY);
      if (saved !== null) return JSON.parse(saved) as StoreProduct[];
      const legacy = localStorage.getItem(LEGACY_CATALOG_KEY);
      if (legacy === null) return null;
      const products = JSON.parse(legacy) as StoreProduct[];
      return products.map(product => ({ ...product, price: Math.round(product.price * LEGACY_USD_TO_LKR) }));
    } catch { return null; }
  });
  const [storeProducts, setStoreProducts] = useState<StoreProduct[]>(catalogData || []);
  const [catalogReady, setCatalogReady] = useState(catalogData !== null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<StoreCategory>("All");
  const [sortBy, setSortBy] = useState<"new" | "popular">("new");
  const [bag, setBag] = useState<Record<string, number>>({});
  const [wishlist, setWishlist] = useState<Set<string>>(() => new Set());
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isManaging, setIsManaging] = useState(false);

  useEffect(() => {
    if (catalogReady) return;
    const initialProducts = wardrobe.map((item, index): StoreProduct => ({
      id: item.id, name: item.name, category: item.category, color: item.color,
      price: productPrice(item, index), imageUrl: item.imageUrl,
      description: item.notes || "", stock: 8 + (index % 13), createdAt: item.createdAt,
    }));
    setStoreProducts(initialProducts);
    setCatalogReady(true);
  }, [catalogReady, wardrobe]);

  useEffect(() => {
    if (!catalogReady) return;
    try { localStorage.setItem(CATALOG_KEY, JSON.stringify(storeProducts)); }
    catch { showToast("Catalog could not be saved. Try a smaller image.", "warning"); }
  }, [catalogReady, storeProducts]);

  const products = useMemo(() => storeProducts.filter(product => {
    const matchesCategory = activeCategory === "All" || (activeCategory === "Clothing" ? !["Shoes", "Bags", "Accessories"].includes(product.category) : product.category === activeCategory);
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || product.name.toLowerCase().includes(query) || product.color.toLowerCase().includes(query) || product.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  }).sort((a, b) => sortBy === "new" ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : b.stock - a.stock), [storeProducts, activeCategory, search, sortBy]);

  const bagProducts = Object.entries(bag).flatMap(([id, quantity]) => {
    const product = storeProducts.find(item => item.id === id);
    return product && quantity ? [{ product, quantity }] : [];
  });
  const bagCount = Object.values(bag).reduce((sum, quantity) => sum + quantity, 0);
  const subtotal = bagProducts.reduce((sum, entry) => sum + entry.product.price * entry.quantity, 0);
  const heroProduct = storeProducts.find(product => product.category === "Dresses") || storeProducts[0];
  const sideProduct = storeProducts.find(product => product.id !== heroProduct?.id && product.category === "Outerwear") || storeProducts.find(product => product.id !== heroProduct?.id);
  const addToBag = (product: StoreProduct) => {
    setBag(current => ({ ...current, [product.id]: Math.min(product.stock, (current[product.id] || 0) + 1) }));
    showToast(`${product.name} added to your bag`);
  };
  const toggleWishlist = (id: string) => setWishlist(current => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const chooseCategory = (category: StoreCategory) => {
    setActiveCategory(category);
    setIsMobileMenuOpen(false);
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };
  const updateQuantity = (id: string, quantity: number) => setBag(current => {
    if (quantity <= 0) { const next = { ...current }; delete next[id]; return next; }
    const product = storeProducts.find(item => item.id === id);
    return { ...current, [id]: Math.min(quantity, product?.stock || quantity) };
  });
  const saveProduct = (product: StoreProduct) => {
    setStoreProducts(current => current.some(item => item.id === product.id) ? current.map(item => item.id === product.id ? product : item) : [product, ...current]);
    setIsManaging(false);
    showToast("Product saved");
  };
  const deleteProduct = (id: string) => {
    setStoreProducts(current => current.filter(product => product.id !== id));
    setBag(current => { const next = { ...current }; delete next[id]; return next; });
    setWishlist(current => { const next = new Set(current); next.delete(id); return next; });
    showToast("Product removed");
  };

  if (!catalogReady) return <div className="min-h-dvh bg-[#F8F6F0]" />;
  if (isManaging) return <StoreManager products={storeProducts} onSave={saveProduct} onDelete={deleteProduct} onBack={() => setIsManaging(false)} />;

  return (
    <div className="min-h-dvh bg-[#F8F6F0] text-[#262A26]">
      <div className="bg-[#244A3B] px-4 py-2 text-center text-[11px] font-medium tracking-[0.13em] text-[#F8F6F0] sm:text-[11px]">STORE PREVIEW  |  SAMPLE PRICES AND STOCK  |  CHECKOUT NOT ENABLED</div>
      <header className="relative z-30 border-b border-[#E7E4DB] bg-[#FBFAF6]">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:h-[84px] sm:px-8 lg:px-12">
          <button className="grid h-10 w-8 place-items-center lg:hidden" aria-label="Open menu" onClick={() => setIsMobileMenuOpen(value => !value)}>{isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
          <button onClick={() => { setActiveCategory("All"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-left"><span className="block font-serif text-[24px] font-semibold leading-none tracking-[-0.055em] text-[#244A3B] sm:text-[29px]">fit theory</span><span className="mt-1 hidden text-[11px] uppercase tracking-[0.25em] text-[#81847B] sm:block">Wear your own rhythm</span></button>
          <nav className="hidden items-center gap-7 lg:flex">{["New in", "Clothing", "Shoes", "Bags", "Accessories"].map((label, index) => <button key={label} onClick={() => chooseCategory(index === 0 ? "All" : label as StoreCategory)} className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#596057] transition-colors hover:text-[#B95F43]">{label}</button>)}</nav>
          <div className="flex items-center gap-2 sm:gap-4">
            <label className="hidden h-10 items-center gap-2 border-b border-[#D6D6CC] sm:flex"><Search className="h-4 w-4 text-[#72796F]" /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search pieces" className="w-28 bg-transparent text-xs outline-none placeholder:text-[#96988F] md:w-36" /></label>
            <button onClick={() => setIsManaging(true)} className="hidden text-[11px] font-semibold uppercase tracking-[0.12em] text-[#496353] hover:text-[#B95F43] sm:block">Manage products</button>
            <button onClick={() => setIsBagOpen(true)} className="relative grid h-10 w-10 place-items-center text-[#26332D]" aria-label={`Open bag, ${bagCount} items`}><ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.5} />{bagCount > 0 && <span className="absolute right-0 top-0 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-[#B95F43] px-1 text-[11px] text-white">{bagCount}</span>}</button>
          </div>
        </div>
        {isMobileMenuOpen && <div className="absolute inset-x-0 top-full border-b border-[#E7E4DB] bg-[#FBFAF6] px-5 py-5 shadow-lg lg:hidden"><label className="mb-5 flex h-10 items-center gap-2 border-b border-[#D6D6CC] sm:hidden"><Search className="h-4 w-4 text-[#72796F]" /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search pieces" className="w-full bg-transparent text-sm outline-none" /></label><div className="grid grid-cols-2 gap-y-4">{categories.map(category => <button key={category} onClick={() => chooseCategory(category)} className="text-left text-xs uppercase tracking-[0.1em] text-[#596057]">{category === "All" ? "New in" : category}</button>)}</div><button onClick={() => { setIsManaging(true); setIsMobileMenuOpen(false); }} className="mt-5 border-t border-[#E7E4DB] pt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#244A3B]">Manage products</button></div>}
      </header>
      <main className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <section className="grid gap-3 py-4 sm:gap-4 sm:py-6 lg:grid-cols-[1.45fr_0.75fr]">
          <div className="relative min-h-[430px] overflow-hidden bg-[#DDE2D7] sm:min-h-[530px] lg:min-h-[590px]">
            {heroProduct ? <img src={heroProduct.imageUrl || getFallbackImageDataUri(heroProduct.name, heroProduct.category)} alt={heroProduct.name} className="absolute inset-0 h-full w-full object-cover object-center" onError={event => { event.currentTarget.src = getFallbackImageDataUri(heroProduct.name, heroProduct.category); }} /> : <img src="/store-hero-fallback.svg" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center" />}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1C3029]/70 via-[#1C3029]/25 to-transparent" />
            <div className="relative flex h-full min-h-[430px] max-w-[560px] flex-col items-start justify-end px-6 pb-9 text-white sm:min-h-[530px] sm:px-10 sm:pb-12 lg:min-h-[590px] lg:px-14 lg:pb-16"><span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E9C5A8]">The considered edit / 01</span><h1 className="mt-4 max-w-[480px] font-serif text-[48px] leading-[0.98] tracking-[-0.045em] sm:text-[66px] lg:text-[76px]">Good pieces.<br />Long stories.</h1><p className="mt-4 max-w-[335px] text-xs leading-5 text-white/85 sm:text-sm sm:leading-6">Thoughtful shapes and honest textures, chosen for the everyday moments that make a wardrobe yours.</p><button onClick={() => chooseCategory("All")} className="mt-7 inline-flex min-h-12 items-center gap-7 border border-white/80 px-4 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors hover:bg-white hover:text-[#244A3B]">Explore the collection <ArrowRight className="h-4 w-4" /></button></div>
            <span className="absolute right-4 top-4 hidden border border-white/45 px-3 py-2 text-[11px] uppercase tracking-[0.15em] text-white sm:block">A wardrobe in good company</span>
          </div>
          <div className="relative min-h-[280px] overflow-hidden bg-[#E9E2D7] sm:min-h-[380px] lg:min-h-0">
            {sideProduct ? <img src={sideProduct.imageUrl || getFallbackImageDataUri(sideProduct.name, sideProduct.category)} alt={sideProduct.name} className="absolute inset-0 h-full w-full object-cover" onError={event => { event.currentTarget.src = getFallbackImageDataUri(sideProduct.name, sideProduct.category); }} /> : <img src="/store-hero-fallback.svg" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-t from-[#202921]/70 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7"><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E9C5A8]">A little more considered</p><h2 className="mt-2 font-serif text-3xl leading-tight sm:text-4xl">The layers edit</h2><button onClick={() => chooseCategory("Outerwear")} className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]">Find your layer <ArrowUpRight className="h-3.5 w-3.5" /></button></div>
          </div>
        </section>

        <section id="catalog" className="scroll-mt-4 pb-16 pt-10 sm:pb-20 sm:pt-14">
          <div className="flex flex-col justify-between gap-5 border-b border-[#DCDCD2] pb-5 sm:flex-row sm:items-end sm:pb-6"><div><p className="text-[11px] font-semibold uppercase tracking-[0.19em] text-[#B95F43]">Good things, found</p><h2 className="mt-2 font-serif text-4xl tracking-[-0.04em] text-[#26332D] sm:text-5xl">The collection</h2><p className="mt-2 text-xs text-[#7E8179]">A small collection made for getting out there.</p></div><div className="flex items-center justify-between gap-4 sm:justify-end"><div className="flex max-w-full gap-1 overflow-x-auto">{categories.map(category => <button key={category} onClick={() => setActiveCategory(category)} className={`shrink-0 px-2.5 py-2 text-[11px] uppercase tracking-[0.1em] transition-colors sm:px-3 ${activeCategory === category ? "bg-[#244A3B] text-white" : "text-[#636A60] hover:bg-[#EAE9E0]"}`}>{category}</button>)}</div><label className="hidden shrink-0 items-center gap-1.5 text-[11px] uppercase tracking-[0.1em] text-[#777A72] sm:flex">Sort <ChevronDown className="h-3 w-3" /><select value={sortBy} onChange={event => setSortBy(event.target.value as "new" | "popular")} className="max-w-28 bg-transparent text-[11px] text-[#39483E] outline-none"><option value="new">New arrivals</option><option value="popular">In stock first</option></select></label></div></div>
          {products.length ? <div className="grid grid-cols-2 gap-x-3 gap-y-8 pt-6 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">{products.map(product => <ProductTile key={product.id} product={product} isWishlisted={wishlist.has(product.id)} onToggleWishlist={() => toggleWishlist(product.id)} onAddToBag={() => addToBag(product)} />)}</div> : <div className="border-b border-[#E7E4DB] py-16 text-center"><p className="font-serif text-2xl text-[#34493E]">Nothing here just yet.</p><p className="mt-2 text-xs text-[#777A72]">Try another search or add your first product.</p><button onClick={() => setIsManaging(true)} className="mt-5 bg-[#244A3B] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">Manage products</button></div>}
        </section>

        <section className="mb-12 grid overflow-hidden bg-[#E5E8DF] sm:mb-16 sm:grid-cols-[1.05fr_1fr]">
          <div className="flex min-h-[260px] flex-col items-start justify-center px-6 py-9 sm:px-10 lg:px-14"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B95F43]">FitTheory, thoughtfully</p><h2 className="mt-3 max-w-md font-serif text-4xl leading-[1.03] tracking-[-0.035em] text-[#26332D] sm:text-5xl">Less rush.<br />More getting dressed.</h2><p className="mt-4 max-w-sm text-xs leading-5 text-[#687067]">Pieces with room to move, wear, repeat, and make your own. That's the whole idea.</p><button onClick={() => { setCurrentView("studio"); }} className="mt-6 inline-flex items-center gap-2 border-b border-[#244A3B] pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#244A3B]">Visit the style studio <ArrowRight className="h-3.5 w-3.5" /></button></div>
          <div className="relative min-h-[250px] bg-[#D8DCD2] sm:min-h-[350px]">{heroProduct ? <img src={heroProduct.imageUrl || getFallbackImageDataUri(heroProduct.name, heroProduct.category)} alt={heroProduct.name} className="absolute inset-0 h-full w-full object-cover" onError={event => { event.currentTarget.src = getFallbackImageDataUri(heroProduct.name, heroProduct.category); }} /> : <img src="/store-hero-fallback.svg" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />}<div className="absolute bottom-3 right-3 bg-[#F8F6F0] px-3 py-2 text-[11px] uppercase tracking-[0.15em] text-[#566357]">Selected for everyday</div></div>
        </section>
      </main>

      <footer className="bg-[#244A3B] text-[#F8F6F0]"><div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-9 sm:grid-cols-[1.2fr_1fr_auto] sm:items-end sm:px-8 sm:py-12 lg:px-12"><div><p className="font-serif text-3xl tracking-[-0.05em]">fit theory</p><p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-white/65">Wear your own rhythm.</p></div><p className="max-w-xs text-[11px] leading-5 text-white/70">A considered closet, with room for the pieces you'll reach for again and again.</p><div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.12em] text-white/75"><button onClick={() => setIsManaging(true)} className="hover:text-white">Manage products</button><button onClick={() => setCurrentView("wardrobe")} className="hover:text-white">My closet</button></div></div><div className="border-t border-white/15 px-5 py-3 text-center text-[11px] tracking-[0.08em] text-white/55">FitTheory | Front-end store preview. Checkout is not enabled.</div></footer>
      {isBagOpen && <div className="fixed inset-0 z-50 flex justify-end bg-[#1F2923]/35" onMouseDown={event => { if (event.target === event.currentTarget) setIsBagOpen(false); }}><aside role="dialog" aria-modal="true" aria-label="Shopping bag" className="flex h-full w-full max-w-md flex-col bg-[#FBFAF6] shadow-2xl"><div className="flex items-center justify-between border-b border-[#E7E4DB] px-5 py-5 sm:px-7"><div><p className="text-[11px] font-semibold uppercase tracking-[0.17em] text-[#B95F43]">Your picks</p><h2 className="mt-1 font-serif text-3xl text-[#26332D]">The bag <span className="text-lg text-[#7D8379]">({bagCount})</span></h2></div><button onClick={() => setIsBagOpen(false)} aria-label="Close bag" className="grid h-10 w-10 place-items-center hover:bg-[#EEEAE1]"><X className="h-5 w-5" /></button></div><div className="flex-1 overflow-auto px-5 sm:px-7">{bagProducts.length ? bagProducts.map(({ product, quantity }) => <div key={product.id} className="flex gap-4 border-b border-[#E7E4DB] py-5"><img src={product.imageUrl || getFallbackImageDataUri(product.name, product.category)} alt={product.name} className="h-28 w-[82px] bg-[#EEEAE1] object-cover" /><div className="flex min-w-0 flex-1 flex-col"><p className="font-serif text-base text-[#26332D]">{product.name}</p><p className="mt-1 text-[11px] text-[#7D8379]">{product.color}   {formatPrice(product.price)}</p><div className="mt-auto flex items-center justify-between"><div className="flex items-center border border-[#D8D9D1]"><button onClick={() => updateQuantity(product.id, quantity - 1)} aria-label="Decrease quantity" className="grid h-8 w-8 place-items-center"><Minus className="h-3 w-3" /></button><span className="w-6 text-center text-xs">{quantity}</span><button onClick={() => updateQuantity(product.id, quantity + 1)} aria-label="Increase quantity" disabled={quantity >= product.stock} className="grid h-8 w-8 place-items-center disabled:opacity-30"><Plus className="h-3 w-3" /></button></div><span className="text-xs font-semibold">{formatPrice(product.price * quantity)}</span></div></div></div>) : <div className="grid h-full content-center justify-items-center text-center"><div className="grid h-14 w-14 place-items-center rounded-full bg-[#E5E8DF] text-[#244A3B]"><ShoppingBag className="h-6 w-6" /></div><h3 className="mt-4 font-serif text-2xl text-[#26332D]">A little room for something good.</h3><p className="mt-2 text-xs text-[#7D8379]">Your bag is waiting for its first piece.</p><button onClick={() => setIsBagOpen(false)} className="mt-5 border-b border-[#244A3B] pb-1 text-[11px] font-semibold uppercase tracking-[0.13em] text-[#244A3B]">Continue browsing</button></div>}</div>{bagProducts.length > 0 && <div className="border-t border-[#E7E4DB] px-5 py-5 sm:px-7"><div className="flex justify-between text-sm"><span className="text-[#737A71]">Subtotal</span><span className="font-semibold">{formatPrice(subtotal)}</span></div><p className="mt-2 text-[11px] text-[#82867E]">Shipping and taxes are calculated at checkout.</p><button disabled className="mt-5 flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-2 bg-[#244A3B] text-[11px] font-semibold uppercase tracking-[0.15em] text-white opacity-75">Checkout unavailable in this preview <Check className="h-4 w-4" /></button><p className="mt-2 text-center text-[11px] text-[#82867E]">This demo does not process payment.</p></div>}</aside></div>}
    </div>
  );
};






