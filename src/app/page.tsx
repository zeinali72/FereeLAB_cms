"use client";

import { useState, useEffect } from "react";
import { ThreePanelLayout } from "@/components/three-panel-layout";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  // Ensure client-side only rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <ThreePanelLayout />;
}
