"use client";

import { useState, useRef, useEffect } from "react";
import { Paperclip, Sparkles, Send, Zap, X } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { estimateTokenCount, calculateTokenCost } from "@/utils/token-calculator";
import { PromptSuggestions } from "./prompt-suggestions";
import { AIModel } from "@/data/models";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  selectedModel?: AIModel;
  replyTo?: {
    id: string;
    content: string;
    role: "user" | "assistant";
  };
  onCancelReply?: () => void;
}

export function ChatInput({ onSendMessage, selectedModel, replyTo, onCancelReply }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [showPrompts, setShowPrompts] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Calculate token metrics
  const tokenCount = estimateTokenCount(message);
  const maxTokens = selectedModel?.context_length || 4000;
  const isOverLimit = tokenCount > maxTokens * 0.8; // Warning at 80% of limit
  
  const tokenCost = selectedModel 
    ? calculateTokenCost(message, selectedModel.inputPrice || 0)
    : { tokenCount: 0, inputCost: 0, totalCost: 0 };

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      setShowPrompts(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    setShowPrompts(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Show prompts only when message is empty
  const shouldShowPrompts = showPrompts && !message.trim() && !replyTo;

  return (
    <div className="border-t border-border p-4">
      <div className="flex flex-col space-y-3 max-w-3xl mx-auto">
        {/* Reply Context */}
        {replyTo && (
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground mb-1">
                Replying to {replyTo.role === "user" ? "your message" : "assistant"}
              </div>
              <div className="text-sm text-foreground truncate">
                "{replyTo.content.length > 100 ? replyTo.content.substring(0, 100) + "..." : replyTo.content}"
              </div>
            </div>
            <button
              onClick={onCancelReply}
              className="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Prompt Suggestions */}
        {shouldShowPrompts && (
          <PromptSuggestions onSuggestionClick={handleSuggestionClick} />
        )}

        {/* Input Area */}
        <div className={`flex items-end rounded-lg border border-input bg-background p-2 shadow-sm focus-within:ring-1 focus-within:ring-ring ${isOverLimit ? 'border-destructive' : ''}`}>
          <div className="flex-1">
            <TextareaAutosize
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className={`min-h-10 w-full resize-none bg-transparent px-2 py-1.5 text-sm focus:outline-none ${isOverLimit ? 'text-destructive' : ''}`}
              maxRows={10}
            />
          </div>
          
          <div className="flex items-center gap-1 px-1">
            <button className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <Paperclip className="h-5 w-5" />
            </button>
            <button className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <Sparkles className="h-5 w-5" />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isOverLimit}
              className="p-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Token Count and Cost Display */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className={`flex items-center ${isOverLimit ? 'text-destructive' : ''}`}>
              <Zap className="h-3 w-3 mr-1" />
              {tokenCount.toLocaleString()} tokens
              {maxTokens && ` / ${Math.floor(maxTokens * 0.8).toLocaleString()}`}
            </span>
            {tokenCost.inputCost > 0 && (
              <span>
                ~${tokenCost.inputCost.toFixed(4)} cost
              </span>
            )}
          </div>
          <div className="flex items-center">
            <Sparkles className="h-3 w-3 mr-1" />
            {selectedModel ? `Using ${selectedModel.name}` : 'No model selected'}
          </div>
        </div>
      </div>
    </div>
  );
}
