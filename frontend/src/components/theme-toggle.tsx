"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-2 rounded-full hover:bg-muted transition-colors w-9 h-9" />
    );
  }

  return (
    <motion.button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative p-2 rounded-full hover:bg-muted transition-colors overflow-hidden hover-lift"
      aria-label="Toggle theme"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="relative w-5 h-5"
        animate={{ rotate: theme === "dark" ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{
            scale: theme === "light" ? 1 : 0,
            opacity: theme === "light" ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Sun className="h-5 w-5" />
        </motion.div>
        
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{
            scale: theme === "dark" ? 1 : 0,
            opacity: theme === "dark" ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Moon className="h-5 w-5" />
        </motion.div>
      </motion.div>

      {/* Subtle glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: theme === "dark" 
            ? "0 0 20px rgba(139, 92, 246, 0.3)" 
            : "0 0 20px rgba(251, 191, 36, 0.3)"
        }}
        transition={{ duration: 0.5 }}
      />
    </motion.button>
  );
}
