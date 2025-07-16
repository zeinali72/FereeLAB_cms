"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar/sidebar";
import { ChatArea } from "@/components/chat/chat-area";
import { cn } from "@/lib/utils";

export function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive sidebar
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-0 z-40 md:relative md:z-0 transition-transform transform-gpu",
          sidebarOpen 
            ? "translate-x-0" 
            : "-translate-x-full md:w-0"
        )}
        style={{ width: sidebarOpen ? "280px" : 0 }}
      >
        <Sidebar />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <ChatArea 
          sidebarOpen={sidebarOpen} 
          toggleSidebar={toggleSidebar}
        />
      </div>
    </div>
  );
}
