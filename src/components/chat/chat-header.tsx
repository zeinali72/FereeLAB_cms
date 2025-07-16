"use client";

import { useState, useEffect } from "react";
import { 
  Edit2, 
  Share2, 
  Menu, 
  ChevronsLeft,
  Sun,
  Moon,
  Cpu,
  Sparkles
} from "lucide-react";
import { AIModel } from "@/data/models";
import { useTheme } from "next-themes";
import { AnimatedIcon } from "../ui/animated-icon";
import { PrimaryButton, MinimalButton } from "../ui/animated-button";
import { motion } from "framer-motion";

interface ChatHeaderProps {
  title: string;
  currentModel?: AIModel;
  onToggleModelPanel: () => void;
  onNewConversation: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export function ChatHeader({ 
  title, 
  currentModel,
  onToggleModelPanel,
  onNewConversation,
  onToggleSidebar,
  isSidebarOpen
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
    <motion.div 
      className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-background via-surface-subtle to-background surface-raised"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-center gap-3">
        <MinimalButton
          icon={isSidebarOpen ? ChevronsLeft : Menu}
          onClick={onToggleSidebar}
          title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          iconAnimation="scale"
        />
        
        <motion.h2 
          className="text-lg font-semibold truncate text-heading"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {title}
        </motion.h2>
        
        <MinimalButton
          icon={Edit2}
          iconAnimation="bounce"
          title="Edit conversation title"
        />
      </div>
      
      <div className="flex items-center gap-2">
        {/* Model Indicator */}
        {currentModel && (
          <motion.button
            onClick={onToggleModelPanel}
            className="card-interactive px-3 py-1.5 rounded-full flex items-center gap-2"
            title="Change model"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <span className="text-sm">{currentModel.icon}</span>
            <AnimatedIcon 
              icon={Cpu} 
              size={12} 
              className="text-primary"
              animate="pulse"
            />
            <span className="text-xs font-medium">{currentModel.name}</span>
            <span className="hidden md:inline text-xs text-muted-foreground border-l border pl-2 ml-1">
              {currentModel.provider.name}
            </span>
          </motion.button>
        )}

        {/* New Chat Button */}
        <PrimaryButton
          icon={Sparkles}
          onClick={onNewConversation}
          title="Start new conversation"
          iconAnimation="glow"
          size="md"
          className="flex items-center gap-2"
        >
          <span className="text-sm font-medium">New Chat</span>
        </PrimaryButton>
        
        <div className="flex items-center gap-1">
          {/* Theme Toggle */}
          {mounted ? (
            <MinimalButton
              icon={theme === "dark" ? Sun : Moon}
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              iconAnimation="float"
            />
          ) : (
            <div className="btn-minimal">
              <div className="h-5 w-5" />
            </div>
          )}

          <MinimalButton
            icon={Share2}
            iconAnimation="bounce"
            title="Share conversation"
          />
        </div>
      </div>
    </motion.div>
  );
}
