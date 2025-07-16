"use client";

import { useState, useRef, useEffect } from "react";
import { Paperclip, Layers, Send, Zap, X, Activity } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { estimateTokenCount, calculateTokenCost } from "@/utils/token-calculator";
import { PromptSuggestions } from "./prompt-suggestions";
import { AIModel } from "@/data/models";

interface ChatInputProps {
  onSendMessage: (message: string, file?: File | null) => void;
  selectedModel?: AIModel;
  replyTo?: {
    id: string;
    content: string;
    role: "user" | "assistant";
  };
  onCancelReply?: () => void;
  onToggleCanvas?: () => void;
  isCanvasOpen?: boolean;
  isFloating?: boolean;
  isNewConversation?: boolean;
}

export function ChatInput({ 
  onSendMessage, 
  selectedModel, 
  replyTo, 
  onCancelReply,
  onToggleCanvas,
  isCanvasOpen,
  isFloating = false,
  isNewConversation = false
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [showPrompts, setShowPrompts] = useState(true);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isPromptGeneratorOpen, setIsPromptGeneratorOpen] = useState(false);
  const [replyPanelVisible, setReplyPanelVisible] = useState(false);
  const [showReplyGlow, setShowReplyGlow] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate token metrics
  const tokenCount = estimateTokenCount(message);
  const maxTokens = selectedModel?.context_length || 4000;
  const isOverLimit = tokenCount > maxTokens * 0.8; // Warning at 80% of limit
  
  const tokenCost = selectedModel 
    ? calculateTokenCost(message, selectedModel.inputPrice || 0)
    : { tokenCount: 0, inputCost: 0, totalCost: 0 };

  const handleSendMessage = () => {
    if (message.trim() || attachedFile) {
      onSendMessage(message, attachedFile);
      setMessage("");
      setAttachedFile(null);
      setShowPrompts(false);
      handleCancelReply();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    if (e.key === "Escape" && replyTo) {
      handleCancelReply();
    }
  };

  const handleCancelReply = () => {
    if (replyTo) {
      setShowReplyGlow(false);
      setReplyPanelVisible(false);
      // Delay the actual cancel to allow exit animation
      setTimeout(() => {
        onCancelReply?.();
      }, 300);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    setShowPrompts(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePromptGeneratorToggle = () => {
    setIsPromptGeneratorOpen(!isPromptGeneratorOpen);
  };

  useEffect(() => {
    if (replyTo && textareaRef.current) {
      setReplyPanelVisible(true);
      // Show glow effect after panel appears
      setTimeout(() => {
        setShowReplyGlow(true);
      }, 300);
      textareaRef.current.focus();
    } else {
      setReplyPanelVisible(false);
      setShowReplyGlow(false);
    }
  }, [replyTo]);

  // Focus on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Show prompts only when message is empty and not replying
  const shouldShowPrompts = showPrompts && !message.trim() && !replyTo;
  const canSendMessage = message.trim() || attachedFile;

  return (
    <div className={isFloating ? "" : "border-t border p-4"}>
      <div className={`flex flex-col space-y-3 ${isFloating ? 'w-full relative' : 'max-w-3xl mx-auto'}`}>
        {/* Reply Context */}
        {replyTo && (
          <div className={`
            flex items-center justify-between p-4 bg-muted/50 rounded-xl border transition-all duration-300
            ${replyPanelVisible ? 'animate-reply-panel-show' : 'animate-reply-panel-hide'}
            ${showReplyGlow ? 'animate-reply-panel-glow' : ''}
          `}>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground mb-1">
                Replying to {replyTo.role === "user" ? "your message" : "assistant"}
              </div>
              <div className="text-sm text-foreground italic opacity-80">
                &ldquo;{replyTo.content.length > 100 ? replyTo.content.substring(0, 100) + "..." : replyTo.content}&rdquo;
              </div>
            </div>
            <button
              onClick={handleCancelReply}
              className="p-2 hover:bg-muted rounded-full transition-all duration-200 text-muted-foreground hover:text-foreground hover:scale-110"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* File Attachment Display */}
        {attachedFile && (
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border/30">
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground mb-1">Attached file</div>
              <div className="text-sm text-foreground font-medium truncate">
                {attachedFile.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {(attachedFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
            <button
              onClick={removeAttachedFile}
              className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Prompt Suggestions - Only show in floating mode and when not new conversation */}
        {isFloating && !replyTo && shouldShowPrompts && !isNewConversation && (
          <PromptSuggestions 
            onSuggestionClick={handleSuggestionClick} 
            isFloating={true}
          />
        )}

        {/* Main Input Container */}
        <div className={`
          transition-all duration-700 ease-out
          ${isFloating 
            ? 'backdrop-blur-xl bg-background/95 border border-border/50 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/25 p-6' 
            : 'rounded-xl border border-border/30 bg-background/50 p-3 shadow-sm'
          }
        `}>
          {/* Input Area */}
          <div className="flex items-end gap-2">
            {/* Left side buttons */}
            <div className="flex items-center gap-1">
              <button 
                onClick={handlePromptGeneratorToggle}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isPromptGeneratorOpen 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                }`}
                title="Prompt suggestions"
              >
                <Zap className="h-4 w-4" />
              </button>
            </div>

            {/* Text Input */}
            <div className="flex-1">
              <TextareaAutosize
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                className={`w-full resize-none bg-transparent focus:outline-none placeholder:text-muted-foreground transition-all duration-300 text-base py-2 ${
                  isOverLimit ? 'text-destructive' : 'text-foreground'
                }`}
                minRows={1}
                maxRows={6}
              />
            </div>
            
            {/* Right side buttons */}
            <div className="flex items-center gap-1">
              <label className="p-2 rounded-lg transition-all duration-200 cursor-pointer text-muted-foreground hover:text-primary hover:bg-primary/5">
                <Paperclip className="h-4 w-4" />
                <input 
                  ref={fileInputRef}
                  type="file" 
                  onChange={handleFileAttach} 
                  className="hidden" 
                  accept="image/*,text/*,.pdf,.doc,.docx"
                />
              </label>
              
              {onToggleCanvas && (
                <button 
                  onClick={onToggleCanvas}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isCanvasOpen 
                      ? 'text-primary bg-primary/10' 
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                  }`}
                  title="Toggle Canvas"
                >
                  <Layers className="h-4 w-4" />
                </button>
              )}
              
              <button
                onClick={handleSendMessage}
                disabled={!canSendMessage || isOverLimit}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  canSendMessage && !isOverLimit
                    ? 'text-primary hover:text-primary-foreground hover:bg-primary hover:scale-105'
                    : 'text-muted-foreground cursor-not-allowed opacity-50'
                }`}
                title="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Token Count and Cost Display - Compact version */}
          {(!isFloating || message.trim() || isOverLimit) && (
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 pt-2 border-t border-border/20">
              <div className="flex items-center gap-3">
                <span className={`flex items-center ${isOverLimit ? 'text-destructive' : ''}`}>
                  <Activity className="h-3 w-3 mr-1" />
                  {tokenCount.toLocaleString()}
                  {maxTokens && ` / ${Math.floor(maxTokens * 0.8).toLocaleString()}`}
                </span>
                {tokenCost.inputCost > 0 && (
                  <span>
                    ~${tokenCost.inputCost.toFixed(4)}
                  </span>
                )}
              </div>
              <div className="text-xs">
                {selectedModel ? selectedModel.name : 'No model'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
