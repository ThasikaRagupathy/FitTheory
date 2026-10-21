import React, { useMemo } from "react";
import { useWardrobe } from "../../context/WardrobeContext";
import { isDateInThisWeek } from "../../utils/dates";
import { ClothingCard } from "../wardrobe/ClothingCard";
import { ArrowRight, ArrowUpRight, CalendarDays, Plus, Shirt } from "lucide-react";

export const Dashboard: React.FC = () => {
  const {
    wardrobe,
    outfits,
    collections,
    plans,
    setCurrentView,
    setIsAddItemModalOpen,
  } = useWardrobe();

  const recentItems = useMemo(
    () => [...wardrobe].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4),
    [wardrobe]
  );
  const weekCount = useMemo(() => plans.filter(plan => isDateInThisWeek(plan.date)).length, [plans]);
  const featuredCollection = collections[0];

  return (
    <div className="space-y-10 sm:space-y-14 animate-fade-in pb-16">
      <section className="grid overflow-hidden border border-[#E7E4DB] bg-[#EEE9E0] lg:min-h-[390px] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col items-start justify-center px-6 py-9 sm:px-10 sm:py-12 lg:px-12">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#727A70]">FitTheory / your personal department store</span>
          <h2 className="mt-5 max-w-xl font-serif text-4xl font-medium leading-[1.05] tracking-tight text-[#26332D] sm:text-5xl xl:text-6xl">
            The best new thing is a new combination.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-[#677168] sm:text-base">
            Shop your own closet by piece, then bring the good finds together into a look you'll wear again.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={() => setCurrentView("wardrobe")} className="inline-flex min-h-11 items-center gap-2 bg-[#244A3B] px-5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#193B2F]">
              Browse the rack <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => setIsAddItemModalOpen(true)} className="inline-flex min-h-11 items-center gap-2 border border-charcoal/20 bg-white/60 px-4 text-xs font-semibold uppercase tracking-widest text-[#26332D] transition-colors hover:bg-white">
              <Plus className="h-4 w-4" /> Add a piece
            </button>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-charcoal/15 pt-4 text-xs text-[#677168]">
            <span><strong className="font-semibold text-[#26332D]">{wardrobe.length}</strong> pieces on the rack</span>
            <span><strong className="font-semibold text-[#26332D]">{outfits.length}</strong> saved looks</span>
            <span><strong className="font-semibold text-[#26332D]">{weekCount}</strong> planned this week</span>
          </div>
        </div>

        <div className="grid min-h-[290px] grid-cols-[1.05fr_0.95fr] gap-2 p-2 sm:min-h-[360px] sm:gap-3 sm:p-3">
          {recentItems[0] ? (
            <button onClick={() => setCurrentView("wardrobe")} className="group relative min-h-0 overflow-hidden bg-[#D8D0C4] text-left">
              <img src={recentItems[0].imageUrl} alt={recentItems[0].name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              <span className="absolute bottom-3 left-3 bg-white/90 px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#26332D] sm:bottom-4 sm:left-4">Just added |  {recentItems[0].category}</span>
            </button>
          ) : (
            <div className="flex min-h-[290px] flex-col items-center justify-center bg-[#D8D0C4] p-6 text-center text-[#677168]">
              <Shirt className="h-8 w-8" />
              <p className="mt-3 max-w-40 font-serif text-lg">Your first piece starts the collection.</p>
            </div>
          )}
          <div className="grid min-h-0 grid-rows-2 gap-2 sm:gap-3">
            {recentItems[1] ? (
              <button onClick={() => setCurrentView("wardrobe")} className="group relative min-h-0 overflow-hidden bg-[#D8D0C4] text-left">
                <img src={recentItems[1].imageUrl} alt={recentItems[1].name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                <span className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 text-[11px] font-medium text-[#26332D] sm:bottom-3 sm:left-3">{recentItems[1].name}</span>
              </button>
            ) : <div className="bg-[#E2DCD2]" />}
            {recentItems[2] ? (
              <button onClick={() => setCurrentView("wardrobe")} className="group relative min-h-0 overflow-hidden bg-[#D8D0C4] text-left">
                <img src={recentItems[2].imageUrl} alt={recentItems[2].name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                <span className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 text-[11px] font-medium text-[#26332D] sm:bottom-3 sm:left-3">{recentItems[2].name}</span>
              </button>
            ) : <div className="bg-[#E2DCD2]" />}
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4 border-b border-[#E7E4DB] pb-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#727A70]">Fresh from your closet</p>
            <h3 className="mt-1 font-serif text-2xl font-medium tracking-tight text-[#26332D] sm:text-3xl">New on the rack</h3>
          </div>
          <button onClick={() => setCurrentView("wardrobe")} className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#26332D] hover:text-[#677168]">
            Shop all <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        {recentItems.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
            {recentItems.map(item => <ClothingCard key={item.id} item={item} />)}
          </div>
        ) : (
          <div className="flex flex-col items-start gap-3 border border-dashed border-[#B8B8AA]/50 bg-white/60 p-6 sm:p-8">
            <p className="font-serif text-xl text-[#26332D]">Nothing on the rack yet.</p>
            <p className="max-w-md text-sm leading-6 text-[#727A70]">Add a few pieces you own. They'll be ready to browse and style here.</p>
            <button onClick={() => setIsAddItemModalOpen(true)} className="inline-flex min-h-10 items-center gap-2 bg-[#244A3B] px-4 text-xs font-semibold uppercase tracking-widest text-white hover:bg-[#193B2F]"><Plus className="h-4 w-4" /> Add your first piece</button>
          </div>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <button onClick={() => setCurrentView("studio")} className="group flex min-h-52 flex-col items-start justify-between bg-[#34332F] p-6 text-left text-white transition-colors hover:bg-[#282724] sm:p-8">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#D8C7B0]">The fitting room</span>
            <h3 className="mt-3 max-w-md font-serif text-3xl leading-tight sm:text-4xl">Make a look from what's already here.</h3>
          </div>
          <span className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest">Open outfit builder <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
        </button>

        <div className="flex min-h-52 flex-col justify-between border border-[#E7E4DB] bg-white p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#727A70]">Your style desk</span>
              <h3 className="mt-3 font-serif text-3xl leading-tight text-[#26332D]">A little planning goes a long way.</h3>
            </div>
            <CalendarDays className="h-5 w-5 shrink-0 text-[#B95F43]" />
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-[#E7E4DB] pt-4">
            <span className="text-sm text-[#677168]">{weekCount} {weekCount === 1 ? "look" : "looks"} planned this week</span>
            <button onClick={() => setCurrentView("calendar")} className="inline-flex items-center gap-1 text-xs font-semibold text-[#26332D] hover:text-[#677168]">Open calendar <ArrowUpRight className="h-4 w-4" /></button>
          </div>
        </div>
      </section>

      {featuredCollection && (
        <section className="flex flex-col gap-5 border-t border-[#E7E4DB] pt-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#727A70]">A saved edit</p>
            <h3 className="mt-2 font-serif text-3xl font-medium tracking-tight text-[#26332D]">{featuredCollection.name}</h3>
            <p className="mt-2 text-sm leading-6 text-[#677168]">{featuredCollection.description}</p>
          </div>
          <button onClick={() => setCurrentView("collections")} className="inline-flex min-h-10 items-center gap-2 self-start border border-[#E7E4DB] px-4 text-xs font-semibold uppercase tracking-widest text-[#26332D] hover:bg-white sm:self-auto">Explore collections <ArrowRight className="h-4 w-4" /></button>
        </section>
      )}
    </div>
  );
};