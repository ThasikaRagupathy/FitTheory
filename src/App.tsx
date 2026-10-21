import React from "react";
import { WardrobeProvider } from "./context/WardrobeContext";
import { AppShell } from "./components/layout/AppShell";

export const App: React.FC = () => {
  return (
    <WardrobeProvider>
      <AppShell />
    </WardrobeProvider>
  );
};

export default App;
