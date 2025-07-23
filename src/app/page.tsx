"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ThreePanelLayout } from "@/components/three-panel-layout";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Ensure client-side only rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle authentication redirect
  useEffect(() => {
    if (mounted && status !== "loading") {
      if (!session) {
        router.push("/login");
      }
    }
  }, [mounted, session, status, router]);

  if (!mounted || status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, show loading while redirecting
  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <ThreePanelLayout />;
}
