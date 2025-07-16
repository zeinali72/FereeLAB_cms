"use client";

import { Lightbulb, Code2, MessageSquare, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedIcon } from "@/components/ui/animated-icon";
import { 
  UI_ANIMATION,
  CHAT_LOG_ANIMATION,
  getReducedMotionVariant
} from "@/lib/animations";

interface PromptSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
  isVisible?: boolean;
  isFloating?: boolean;
}

const suggestions = [
  {
    icon: MessageSquare,
    text: "Explain quantum computing in simple terms",
    category: "Educational"
  },
  {
    icon: Code2,
    text: "What are the best practices for writing clean code?",
    category: "Programming"
  },
  {
    icon: FileText,
    text: "Generate a business plan for a tech startup",
    category: "Business"
  },
  {
    icon: Lightbulb,
    text: "Help me brainstorm creative solutions for reducing plastic waste",
    category: "Creative"
  }
];

export function PromptSuggestions({ onSuggestionClick, isVisible = true, isFloating = false }: PromptSuggestionsProps) {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className={`space-y-3 ${isFloating ? 'backdrop-blur-xl bg-background/90 border border-border/50 rounded-2xl p-4 shadow-2xl shadow-black/10 dark:shadow-black/25' : ''}`}
        {...getReducedMotionVariant(UI_ANIMATION.slideUp)}
      >
        <motion.div 
          className="flex items-center gap-2 text-sm text-muted-foreground"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AnimatedIcon icon={Lightbulb} size={16} animate="glow" className="text-primary" />
          <span>Suggested prompts</span>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
          {...getReducedMotionVariant(CHAT_LOG_ANIMATION.container)}
        >
          {suggestions.map((suggestion, index) => {
            const IconComponent = suggestion.icon;
            return (
              <motion.div
                key={index}
                {...getReducedMotionVariant(CHAT_LOG_ANIMATION.item)}
              >
                <motion.button
                  onClick={() => onSuggestionClick(suggestion.text)}
                  className="group flex items-start gap-3 p-4 rounded-xl border-border border hover:border-primary/50 hover:bg-muted/50 transition-all duration-200 text-left h-20 w-full"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <motion.div 
                    className="flex-shrink-0 p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors"
                    whileHover={{ rotate: 5 }}
                  >
                    <AnimatedIcon 
                      icon={IconComponent} 
                      size={20} 
                      animate="float"
                      className="text-muted-foreground group-hover:text-primary transition-colors" 
                    />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {suggestion.text}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{suggestion.category}</p>
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
