import React, { useState } from "react";
import { ClothingCategory } from "../../types";
import { StoreProduct } from "../../types/store";
import { ArrowLeft, ImagePlus, Pencil, Plus, Trash2, Upload, X } from "lucide-react";

interface StoreManagerProps {
  products: StoreProduct[];
  onSave: (product: StoreProduct) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

const categories: ClothingCategory[] = ["Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Bags", "Accessories"];
const emptyProduct = (): StoreProduct => ({ id: "", name: "", category: "Tops", color: "", price: 14400, imageUrl: "", description: "", stock: 1, createdAt: "" });

const compressImage = (file: File) => new Promise<string>((resolve, reject) => {
  const source = URL.createObjectURL(file);
  const image = new Image();
  image.onload = () => {
    const scale = Math.min(1, 1400 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.naturalWidth * scale);
    canvas.height = Math.round(image.naturalHeight * scale);
    const context = canvas.getContext("2d");
    if (!context) {
      URL.revokeObjectURL(source);
      reject(new Error("Could not read this image."));
      return;
    }
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL("image/jpeg", 0.82);
    URL.revokeObjectURL(source);
    resolve(data);
  };
  image.onerror = () => {
    URL.revokeObjectURL(source);
    reject(new Error("This image could not be opened. Try another file."));
  };
  image.src = source;
});

export const StoreManager: React.FC<StoreManagerProps> = ({ products, onSave, onDelete, onBack }) => {
  const [draft, setDraft] = useState<StoreProduct | null>(null);
  const [imageBusy, setImageBusy] = useState(false);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const openNew = () => { setError(""); setDraft(emptyProduct()); };
  const openEdit = (product: StoreProduct) => { setError(""); setDraft({ ...product }); };
  const setField = <K extends keyof StoreProduct>(key: K, value: StoreProduct[K]) => setDraft(current => current ? { ...current, [key]: value } : current);

  const saveDraft = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft) return;
    if (!draft.imageUrl) { setError("Choose a product image before saving."); return; }
    if (!draft.name.trim() || !draft.color.trim() || !Number.isFinite(draft.price) || draft.price < 0 || draft.stock < 0) {
      setError("Add a name, color, valid price, and stock quantity.");
      return;
    }
    onSave({ ...draft, id: draft.id || `product-${Date.now()}`, name: draft.name.trim(), color: draft.color.trim(), createdAt: draft.createdAt || new Date().toISOString() });
    setDraft(null);
  };

  return (
    <div className="min-h-dvh bg-[#F8F6F0] text-[#262A26]">
      <div className="bg-[#244A3B] px-4 py-2 text-center text-[11px] font-medium tracking-[0.13em] text-[#F8F6F0] sm:text-[11px]">STORE PREVIEW  |  SAMPLE PRICES AND STOCK  |  CHECKOUT NOT ENABLED</div>
      <header className="border-b border-[#E7E4DB] bg-[#FBFAF6]"><div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:h-[84px] sm:px-8 lg:px-12"><div><p className="font-serif text-[24px] font-semibold leading-none tracking-[-0.055em] text-[#244A3B] sm:text-[29px]">fit theory</p><p className="mt-1 hidden text-[11px] uppercase tracking-[0.25em] text-[#81847B] sm:block">Store manager</p></div><button onClick={onBack} className="inline-flex min-h-10 items-center gap-2 border border-[#D8D9D1] px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#34493E] hover:bg-[#EEEAE1]"><ArrowLeft className="h-4 w-4" /> Back to shop</button></div></header>
      <main className="mx-auto min-h-[65vh] max-w-[1440px] px-4 py-8 sm:px-8 sm:py-10 lg:px-12">
        <div className="flex flex-col gap-4 border-b border-[#DCDDD5] pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B95F43]">Your storefront</p><h1 className="mt-2 font-serif text-4xl tracking-tight text-[#26332D] sm:text-5xl">Manage products</h1><p className="mt-3 max-w-lg text-sm leading-6 text-[#72776F]">Add pieces, update details, and choose the images shoppers see. Prices and stock start as sample values. Changes are saved in this browser.</p></div><button onClick={openNew} className="inline-flex min-h-11 items-center justify-center gap-2 self-start bg-[#244A3B] px-5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white hover:bg-[#193B2F] sm:self-auto"><Plus className="h-4 w-4" /> Add product</button></div>
        <div className="mt-7 flex items-center justify-between text-[11px] text-[#7D8379]"><span>{products.length} {products.length === 1 ? "product" : "products"}</span><span className="hidden sm:inline">Images are resized and stored locally in this browser.</span></div>
        {products.length ? <div className="mt-4 divide-y divide-[#E6E3DA] border-y border-[#E6E3DA] bg-[#FBFAF6]">{products.map(product => <article key={product.id} className="grid grid-cols-[72px_1fr_auto] items-center gap-3 p-3 sm:grid-cols-[88px_1fr_auto_auto] sm:gap-5 sm:p-4"><img src={product.imageUrl} alt={product.name} className="aspect-[4/5] w-[72px] bg-[#EEEAE1] object-cover sm:w-[88px]" /><div className="min-w-0"><p className="truncate font-serif text-base text-[#26332D] sm:text-lg">{product.name}</p><p className="mt-1 truncate text-[11px] text-[#7D8379]">{product.category} | {product.color}</p><p className="mt-1 text-[11px] text-[#7D8379] sm:hidden">{product.stock} in stock | {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(product.price)}</p></div><div className="hidden text-right text-xs text-[#60695F] sm:block"><p>{new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(product.price)}</p><p className="mt-1 text-[11px]">{product.stock} in stock</p></div><div className="flex flex-col gap-2 sm:flex-row"><button onClick={() => openEdit(product)} className="inline-flex min-h-9 items-center justify-center gap-1.5 border border-[#D8D9D1] px-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#34493E] hover:bg-[#EEEAE1] sm:px-3"><Pencil className="h-3.5 w-3.5" /><span className="hidden sm:inline">Edit</span></button>{pendingDelete === product.id ? <div className="flex items-center gap-1"><button onClick={() => { onDelete(product.id); setPendingDelete(null); }} className="min-h-9 bg-[#B95F43] px-2 text-[11px] font-semibold text-white">Remove</button><button onClick={() => setPendingDelete(null)} aria-label="Cancel delete" className="grid h-9 w-9 place-items-center text-[#58665B]"><X className="h-4 w-4" /></button></div> : <button onClick={() => setPendingDelete(product.id)} aria-label={`Delete ${product.name}`} className="grid h-9 w-9 place-items-center border border-[#E2D8D1] text-[#B95F43] hover:bg-[#F5E9E3]"><Trash2 className="h-4 w-4" /></button>}</div></article>)}</div> : <div className="mt-5 border border-dashed border-[#C9C9BF] bg-[#FBFAF6] px-5 py-14 text-center"><p className="font-serif text-2xl text-[#34493E]">Your product list is empty.</p><p className="mt-2 text-xs text-[#777A72]">Add a product and upload the image you want to use.</p><button onClick={openNew} className="mt-5 bg-[#244A3B] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">Add a product</button></div>}
      </main>

      <footer className="bg-[#244A3B] px-5 py-5 text-center text-[11px] uppercase tracking-[0.12em] text-white/70">FitTheory | Front-end store preview. Checkout is not enabled.</footer>
      {draft && <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#1F2923]/45 sm:items-center sm:p-5" onMouseDown={event => { if (event.target === event.currentTarget) setDraft(null); }}><form onSubmit={saveDraft} className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto bg-[#FBFAF6] p-5 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B95F43]">Store listing</p><h2 className="mt-1 font-serif text-3xl text-[#26332D]">{draft.id ? "Edit product" : "Add a product"}</h2></div><button type="button" onClick={() => setDraft(null)} aria-label="Close product editor" className="grid h-9 w-9 place-items-center text-[#526257] hover:bg-[#EEEAE1]"><X className="h-5 w-5" /></button></div>
        <div className="mt-6 grid gap-5 sm:grid-cols-[0.8fr_1.2fr]">
          <div><div className="relative aspect-[4/5] overflow-hidden bg-[#EEEAE1]">{draft.imageUrl ? <img src={draft.imageUrl} alt="Product preview" className="h-full w-full object-cover" /> : <div className="flex h-full flex-col items-center justify-center text-[#899188]"><ImagePlus className="h-8 w-8" strokeWidth={1.3} /><span className="mt-3 text-[11px] font-semibold uppercase tracking-[0.15em]">Image preview</span></div>}</div><label className="mt-3 flex min-h-11 cursor-pointer items-center justify-center gap-2 bg-[#DDE4DA] px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2B4A3C] hover:bg-[#D2DBD0]">{imageBusy ? "Preparing image..." : <><Upload className="h-4 w-4" /> Choose your image</>}<input type="file" accept="image/*" className="sr-only" disabled={imageBusy} onChange={async event => { const file = event.target.files?.[0]; if (!file) return; setError(""); setImageBusy(true); try { setField("imageUrl", await compressImage(file)); } catch (uploadError) { setError(uploadError instanceof Error ? uploadError.message : "Could not load this image."); } finally { setImageBusy(false); event.target.value = ""; } }} /></label><p className="mt-2 text-[11px] leading-4 text-[#82867E]">Choose an image from your device. It is resized and saved in this browser.</p></div>
          <div className="grid content-start gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2"><span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#677168]">Product name</span><input autoFocus value={draft.name} onChange={event => setField("name", event.target.value)} required maxLength={80} className="h-11 w-full border border-[#D8D9D1] bg-white px-3 text-sm text-[#26332D] outline-none focus:border-[#244A3B]" placeholder="e.g. Relaxed cotton shirt" /></label>
            <label><span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#677168]">Category</span><select value={draft.category} onChange={event => setField("category", event.target.value as ClothingCategory)} className="h-11 w-full border border-[#D8D9D1] bg-white px-3 text-xs text-[#26332D] outline-none focus:border-[#244A3B]">{categories.map(category => <option key={category}>{category}</option>)}</select></label>
            <label><span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#677168]">Color</span><input value={draft.color} onChange={event => setField("color", event.target.value)} required maxLength={32} className="h-11 w-full border border-[#D8D9D1] bg-white px-3 text-sm text-[#26332D] outline-none focus:border-[#244A3B]" placeholder="Olive" /></label>
            <label><span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#677168]">Price (LKR)</span><input type="number" min="0" step="1" value={draft.price} onChange={event => setField("price", Number(event.target.value))} required className="h-11 w-full border border-[#D8D9D1] bg-white px-3 text-sm text-[#26332D] outline-none focus:border-[#244A3B]" /></label>
            <label><span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#677168]">Stock</span><input type="number" min="0" step="1" value={draft.stock} onChange={event => setField("stock", Number(event.target.value))} required className="h-11 w-full border border-[#D8D9D1] bg-white px-3 text-sm text-[#26332D] outline-none focus:border-[#244A3B]" /></label>
            <label className="sm:col-span-2"><span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#677168]">Description</span><textarea value={draft.description} onChange={event => setField("description", event.target.value)} rows={3} maxLength={400} className="w-full resize-y border border-[#D8D9D1] bg-white px-3 py-2.5 text-sm text-[#26332D] outline-none focus:border-[#244A3B]" placeholder="A few details about the piece" /></label>
          </div>
        </div>
        {error && <p role="alert" className="mt-4 text-xs text-[#A84735]">{error}</p>}
        <div className="mt-6 flex justify-end gap-2 border-t border-[#E7E4DB] pt-4"><button type="button" onClick={() => setDraft(null)} className="min-h-11 px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#677168]">Cancel</button><button type="submit" disabled={imageBusy} className="min-h-11 bg-[#244A3B] px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#193B2F] disabled:opacity-50">{draft.id ? "Save changes" : "Add product"}</button></div>
      </form></div>}
    </div>
  );
};
