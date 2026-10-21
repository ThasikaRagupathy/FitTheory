import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileNavDrawer, MobileBottomBar } from "./MobileNav";
import { ToastContainer } from "../ui/Toast";
import { ClothingFormModal } from "../wardrobe/ClothingFormModal";
import { useWardrobe } from "../../context/WardrobeContext";
import { StorefrontHome } from "../dashboard/StorefrontHome";
import { WardrobeView } from "../wardrobe/ClothingGrid";
import { OutfitStudio } from "../studio/OutfitStudio";
import { CollectionsView } from "../collections/CollectionsView";
import { CalendarView } from "../calendar/CalendarView";
import { InsightsView } from "../insights/InsightsView";

export const AppShell: React.FC = () => {
  const { currentView, isAddItemModalOpen, setIsAddItemModalOpen } = useWardrobe();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isStorefront = currentView === "dashboard";

  const renderActiveView = () => {
    switch (currentView) {
      case "dashboard": return <StorefrontHome />;
      case "wardrobe": return <WardrobeView />;
      case "studio": return <OutfitStudio />;
      case "collections": return <CollectionsView />;
      case "calendar": return <CalendarView />;
      case "insights": return <InsightsView />;
      default: return <StorefrontHome />;
    }
  };

  return (
    <div className={`min-h-dvh overflow-x-hidden bg-[#F8F6F0] ${isStorefront ? "flex flex-col" : "flex"}`}>
      {!isStorefront && <Sidebar />}
      <div className="flex-1 flex flex-col min-w-0">
        {!isStorefront && <Topbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />}
        {isStorefront ? renderActiveView() : (
          <main className="flex-1 px-4 sm:px-7 lg:px-8 py-5 sm:py-7 pb-24 lg:pb-8 max-w-screen-2xl w-full mx-auto">
            {renderActiveView()}
          </main>
        )}
        {!isStorefront && <MobileNavDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />}
        {!isStorefront && <MobileBottomBar />}
      </div>
      <ClothingFormModal isOpen={isAddItemModalOpen} onClose={() => setIsAddItemModalOpen(false)} />
      <ToastContainer />
    </div>
  );
};