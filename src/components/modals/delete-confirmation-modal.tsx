"use client";

import React, { useState } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (permanent: boolean) => void;
  selectedCount: number;
  conversationTitles?: string[];
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
  conversationTitles = []
}: DeleteConfirmationModalProps) {
  const [permanentDelete, setPermanentDelete] = useState(false);

  const handleConfirm = () => {
    onConfirm(permanentDelete);
    setPermanentDelete(false);
    onClose();
  };

  const handleClose = () => {
    setPermanentDelete(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="relative w-full max-w-md mx-4 bg-background border border-border rounded-lg shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
              </div>
              <h2 className="text-lg font-semibold">
                Delete {selectedCount === 1 ? 'Conversation' : 'Conversations'}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-muted rounded-md transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Warning message */}
            <div className="text-sm text-muted-foreground">
              {selectedCount === 1 ? (
                <p>
                  Are you sure you want to delete <span className="font-medium text-foreground">&quot;{conversationTitles[0]}&quot;</span>?
                </p>
              ) : (
                <p>
                  Are you sure you want to delete <span className="font-medium text-foreground">{selectedCount} conversations</span>?
                </p>
              )}
            </div>

            {/* Recycle bin info */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-start space-x-2">
                <Trash2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">
                    The chat history will be moved to a recycle bin for 30 days before permanent deletion.
                  </p>
                  <p className="text-muted-foreground mt-1">
                    You can restore deleted conversations from the recycle bin within this period.
                  </p>
                </div>
              </div>

              {/* Permanent delete checkbox */}
              <div className="flex items-center space-x-2 pt-2 border-t border-border/50">
                <input
                  type="checkbox"
                  id="permanent-delete"
                  checked={permanentDelete}
                  onChange={(e) => setPermanentDelete(e.target.checked)}
                  className="h-4 w-4 text-destructive focus:ring-destructive border-border rounded"
                />
                <label 
                  htmlFor="permanent-delete" 
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Permanently delete now (cannot be undone)
                </label>
              </div>
            </div>

            {/* Selected conversations preview (if multiple) */}
            {selectedCount > 1 && conversationTitles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected conversations:</p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {conversationTitles.slice(0, 5).map((title, index) => (
                    <div key={index} className="text-sm text-muted-foreground truncate">
                      • {title}
                    </div>
                  ))}
                  {conversationTitles.length > 5 && (
                    <div className="text-sm text-muted-foreground">
                      ... and {conversationTitles.length - 5} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-border">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md transition-colors"
            >
              {permanentDelete ? 'Delete Permanently' : 'Move to Recycle Bin'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}