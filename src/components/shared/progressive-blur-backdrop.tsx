"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressiveBlurBackdropProps {
  isOpen: boolean;
  onClick?: () => void;
  intensity?: "light" | "medium" | "strong";
  children?: React.ReactNode;
}

export function ProgressiveBlurBackdrop({
  isOpen,
  onClick,
  intensity = "medium",
  children,
}: ProgressiveBlurBackdropProps) {
  const intensityClasses = {
    light: "backdrop-blur-sm bg-black/10 dark:bg-black/20",
    medium: "backdrop-blur-md bg-black/20 dark:bg-black/40",
    strong: "backdrop-blur-lg bg-black/30 dark:bg-black/60",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed inset-0 z-40 flex items-center justify-center",
            intensityClasses[intensity]
          )}
          onClick={onClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface AttachmentPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAttachFile: (source: string) => void;
}

export function AttachmentPanel({ isOpen, onClose, onAttachFile }: AttachmentPanelProps) {
  const attachmentSources = [
    {
      id: "local",
      name: "Local File",
      description: "Upload from your device",
      icon: "📁",
      color: "bg-blue-500",
    },
    {
      id: "google-drive",
      name: "Google Drive",
      description: "Import from Google Drive",
      icon: "🔗",
      color: "bg-green-500",
    },
    {
      id: "onedrive",
      name: "OneDrive",
      description: "Import from OneDrive",
      icon: "☁️",
      color: "bg-blue-600",
    },
    {
      id: "github",
      name: "GitHub",
      description: "Import from repository",
      icon: "🐙",
      color: "bg-gray-700",
    },
  ];

  return (
    <ProgressiveBlurBackdrop isOpen={isOpen} onClick={onClose} intensity="medium">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-background border border-border rounded-xl shadow-2xl p-6 w-96 max-w-[90vw]"
      >
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-2">Attach File</h3>
          <p className="text-sm text-muted-foreground">
            Choose a source to attach files to your message
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {attachmentSources.map((source) => (
            <button
              key={source.id}
              onClick={() => onAttachFile(source.id)}
              className="group relative p-4 rounded-lg border border-border hover:border-primary/50 transition-all duration-200 hover:shadow-md bg-card/50 hover:bg-card text-left"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg",
                  source.color
                )}>
                  {source.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm group-hover:text-primary transition-colors">
                    {source.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {source.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </ProgressiveBlurBackdrop>
  );
}