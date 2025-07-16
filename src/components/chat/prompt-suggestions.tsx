"use client";

import { Lightbulb, Code2, MessageSquare, FileText } from "lucide-react";

interface PromptSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
  isVisible?: boolean;
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
  },
  {
    icon: Code2,
    text: "Review this React component for improvements",
    category: "Code Review"
  },
  {
    icon: MessageSquare,
    text: "Write a professional email to a client",
    category: "Communication"
  }
];

export function PromptSuggestions({ onSuggestionClick, isVisible = true }: PromptSuggestionsProps) {
  if (!isVisible) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Lightbulb className="h-4 w-4" />
        <span>Suggested prompts</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {suggestions.map((suggestion, index) => {
          const IconComponent = suggestion.icon;
          return (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion.text)}
              className="group flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all duration-200 text-left"
            >
              <div className="flex-shrink-0 p-1.5 rounded-md bg-muted group-hover:bg-primary/10 transition-colors">
                <IconComponent className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {suggestion.text}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{suggestion.category}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
