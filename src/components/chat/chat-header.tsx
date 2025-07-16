"use client";

import { useState, useEffect } from "react";
import { 
  Edit2, 
  MoreHorizontal, 
  Share2, 
  ChevronDown, 
  Plus, 
  Menu, 
  ChevronsLeft,
  Sun,
  Moon,
  Cpu,
  Sparkles
} from "lucide-react";
import { AIModel } from "@/data/models";
import { useTheme } from "next-themes";

interface ChatHeaderProps {
  title: string;
  currentModel?: AIModel;
  onToggleModelPanel: () => void;
  onNewConversation: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onUserMenuToggle?: (event: React.MouseEvent) => void;
}

export function ChatHeader({ 
  title, 
  currentModel,
  onToggleModelPanel,
  onNewConversation,
  onToggleSidebar,
  isSidebarOpen,
  onUserMenuToggle
}: ChatHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border bg-background">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isSidebarOpen ? <ChevronsLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        
        <h2 className="text-lg font-semibold truncate">{title}</h2>
        
        <button className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors">
          <Edit2 className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Model Indicator */}
        {currentModel && (
          <button
            onClick={onToggleModelPanel}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-all duration-200 hover:scale-105"
            title="Change model"
          >
            <span className="text-sm">{currentModel.icon}</span>
            <Cpu className="h-3 w-3 text-primary" />
            <span className="text-xs font-medium">{currentModel.name}</span>
            <span className="hidden md:inline text-xs text-muted-foreground border-l border pl-2 ml-1">
              {currentModel.provider.name}
            </span>
          </button>
        )}

        {/* New Chat Button */}
        <button 
          onClick={onNewConversation}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-105 hover:shadow-lg shadow-primary/25"
          title="Start new conversation"
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">New Chat</span>
        </button>
        
        <div className="flex items-center gap-1">
          {/* Theme Toggle */}
          {mounted ? (
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          ) : (
            <div className="p-2 rounded-full">
              <div className="h-5 w-5" />
            </div>
          )}

          <button className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
