"use client";

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIModel } from '@/data/models';
import { cn } from '@/lib/utils';
import { AnimatedIcon } from '@/components/ui/animated-icon';

interface ModelCardProps {
  model: AIModel;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  className?: string;
}

export const ModelCard: React.FC<ModelCardProps> = ({ 
  model, 
  isSelected = false, 
  onToggleSelect,
  className = ''
}) => {
  // Format context length for better readability
  const formatContext = (tokens: number): string => {
    if (tokens >= 1000000) {
      return `${(tokens / 1000000).toFixed(1)}M tokens`;
    }
    if (tokens >= 1000) {
      return `${Math.round(tokens / 1000)}K tokens`;
    }
    return `${tokens} tokens`;
  };

  return (
    <motion.div 
      className={cn(
        "relative p-4 rounded-xl border cursor-pointer transition-all duration-200",
        isSelected 
          ? "border-primary bg-primary/10 shadow-md" 
          : "border-border bg-card hover:shadow-sm hover:border-border/60",
        className
      )}
      onClick={onToggleSelect}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      layout
    >
      <AnimatePresence>
        {isSelected && (
          <motion.div 
            className="absolute bottom-3 right-3 text-primary bg-background rounded-full"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <AnimatedIcon icon={CheckCircle} size={22} animate="bounce" className="text-primary" />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {model.icon && (
            <span className="text-lg">{model.icon}</span>
          )}
          <div>
            <h2 className="text-lg font-semibold text-foreground">{model.name}</h2>
            <p className="text-sm text-muted-foreground">by {model.provider.name}</p>
          </div>
        </div>
        <div className="flex-shrink-0 ml-4 mt-1 px-3 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground">
          {formatContext(model.context_length)}
        </div>
      </div>
      
      <p className="mt-3 text-sm text-foreground line-clamp-3">
        {model.description}
      </p>
      
      <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <div className="text-muted-foreground">
          Input: <span className="font-mono text-foreground">${model.pricing.prompt}/M</span>
        </div>
        <div className="text-muted-foreground">
          Output: <span className="font-mono text-foreground">${model.pricing.completion}/M</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          Context: <span className="ml-1 font-mono text-foreground">{formatContext(model.context_length)}</span>
        </div>
      </div>
    </motion.div>
  );
};
