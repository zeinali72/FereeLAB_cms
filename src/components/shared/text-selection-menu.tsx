"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextSelectionMenuProps {
  isVisible: boolean;
  position: { x: number; y: number };
  selectedText: string;
  onReply: () => void;
  onQuote: () => void;
  onClose: () => void;
}

export function TextSelectionMenu({
  isVisible,
  position,
  selectedText,
  onReply,
  onQuote,
  onClose,
}: TextSelectionMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  // Adjust position if menu would go off-screen
  useEffect(() => {
    if (!isVisible || !menuRef.current) return;

    const menu = menuRef.current;
    const rect = menu.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let newX = position.x;
    let newY = position.y;

    // Adjust horizontal position
    if (position.x + rect.width > viewport.width) {
      newX = position.x - rect.width;
    }

    // Adjust vertical position (show above selection)
    newY = position.y - rect.height - 8;
    if (newY < 0) {
      newY = position.y + 24; // Show below if no space above
    }

    // Ensure menu doesn't go off edges
    if (newX < 8) newX = 8;
    if (newX + rect.width > viewport.width - 8) {
      newX = viewport.width - rect.width - 8;
    }

    setAdjustedPosition({ x: newX, y: newY });
  }, [isVisible, position]);

  // Close menu on click outside or escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, onClose]);

  if (!selectedText.trim()) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="fixed z-50 flex items-center gap-1 bg-popover border rounded-lg shadow-lg px-2 py-1"
          style={{
            left: adjustedPosition.x,
            top: adjustedPosition.y,
          }}
        >
          <button
            onClick={onReply}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm rounded-md",
              "text-foreground hover:bg-accent/10 hover:text-accent-foreground",
              "transition-colors duration-150 focus:outline-none focus:bg-accent/10"
            )}
            title="Reply to selection"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="font-medium">Reply</span>
          </button>
          
          <div className="w-px h-6 bg-border/50" />
          
          <button
            onClick={onQuote}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm rounded-md",
              "text-foreground hover:bg-accent/10 hover:text-accent-foreground",
              "transition-colors duration-150 focus:outline-none focus:bg-accent/10"
            )}
            title="Quote selection"
          >
            <Quote className="w-4 h-4" />
            <span className="font-medium">Quote</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}