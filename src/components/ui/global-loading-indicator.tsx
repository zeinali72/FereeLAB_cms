"use client";

import { useUIStore } from "@/store/useUIStore";
import { motion, AnimatePresence } from "framer-motion";

export function GlobalLoadingIndicator() {
  const { globalLoading } = useUIStore();

  return (
    <AnimatePresence>
      {globalLoading && (
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          exit={{ opacity: 0, scaleX: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20"
          style={{ transformOrigin: "left" }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}