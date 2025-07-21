"use client";

import { useState, useRef, useEffect } from "react";
import { Paperclip, Layers, Send, Zap, X, Activity } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { estimateTokenCount, calculateTokenCost } from "@/utils/token-calculator";
import { PromptSuggestions } from "./prompt-suggestions";
import { AIModel } from "@/data/models";
import { AnimatedIcon, LoadingIcon, TypingIcon } from "../ui/animated-icon";
import { AnimatedButton, PrimaryButton, MinimalButton } from "../ui/animated-button";
import { motion } from "framer-motion";

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
  isProcessing?: boolean;
}

export function ChatInput({ 
  onSendMessage, 
  selectedModel, 
  replyTo, 
  onCancelReply,
  onToggleCanvas,
  isCanvasOpen,
  isFloating = false,
  isNewConversation = false,
  isProcessing = false
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [showPrompts, setShowPrompts] = useState(true);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isPromptGeneratorOpen, setIsPromptGeneratorOpen] = useState(false);
  const [replyPanelVisible, setReplyPanelVisible] = useState(false);
  const [showReplyGlow, setShowReplyGlow] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate token metrics
  const tokenCount = estimateTokenCount(message);
  const maxTokens = selectedModel?.context_length || 4000;
  const isOverLimit = tokenCount > maxTokens * 0.8; // Warning at 80% of limit
  
  const tokenCost = selectedModel 
    ? calculateTokenCost(message, selectedModel.inputPrice || 0)
    : { tokenCount: 0, inputCost: 0, totalCost: 0 };

  const handleSendMessage = async () => {
    if (message.trim() || attachedFile) {
      setIsSending(true);
      setIsTyping(false);
      
      // Simulate sending delay for animation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      onSendMessage(message, attachedFile);
      setMessage("");
      setAttachedFile(null);
      setShowPrompts(false);
      handleCancelReply();
      setIsSending(false);
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
    
    // Show typing indicator
    if (!isTyping && message.length > 0) {
      setIsTyping(true);
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
            glass-overlay-medium gradient-overlay-subtle transition-all duration-300 rounded-xl p-4
            ${replyPanelVisible ? 'animate-reply-panel-show' : 'animate-reply-panel-hide'}
            ${showReplyGlow ? 'animate-reply-panel-glow' : ''}
          `}>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-caption mb-1">
                  Replying to {replyTo.role === "user" ? "your message" : "assistant"}
                </div>
                <div className="text-sm text-body italic opacity-80">
                  &ldquo;{replyTo.content.length > 100 ? replyTo.content.substring(0, 100) + "..." : replyTo.content}&rdquo;
                </div>
              </div>
              <MinimalButton
                icon={X}
                onClick={handleCancelReply}
                className="flex-shrink-0"
                iconAnimation="scale"
                title="Cancel reply"
              />
            </div>
          </div>
        )}

        {/* File Attachment Display */}
        {attachedFile && (
          <motion.div 
            className="glass-overlay-light rounded-xl p-4 gradient-overlay-subtle"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-caption mb-1">Attached file</div>
                <div className="text-sm text-foreground font-medium truncate text-heading">
                  {attachedFile.name}
                </div>
                <div className="text-xs text-caption">
                  {(attachedFile.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
              <MinimalButton
                icon={X}
                onClick={removeAttachedFile}
                className="flex-shrink-0"
                iconAnimation="scale"
                title="Remove file"
              />
            </div>
          </motion.div>
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
          depth-transition glass-border-gradient transition-all duration-500
          ${isFloating 
            ? 'glass-panel-floating p-6 depth-4' 
            : 'glass-input-bar p-3 depth-1'
          }
          ${isProcessing 
            ? 'animate-glow-pulse ring-2 ring-primary/30' 
            : ''
          }
        `}>
          {/* Input Area */}
          <div className="flex items-end gap-2">
            {/* Left side buttons */}
            <div className="flex items-center gap-1">
              <MinimalButton
                icon={Zap}
                onClick={handlePromptGeneratorToggle}
                iconAnimation={isPromptGeneratorOpen ? "glow" : "pulse"}
                title="Prompt suggestions"
                className={`transition-all duration-200 ${
                  isPromptGeneratorOpen ? 'text-primary bg-primary/10' : ''
                }`}
              />
            </div>

            {/* Text Input */}
            <div className="flex-1 relative">
              <TextareaAutosize
                ref={textareaRef}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setIsTyping(e.target.value.length > 0);
                }}
                onKeyDown={handleKeyDown}
                onBlur={() => setIsTyping(false)}
                placeholder="Ask anything..."
                className={`w-full resize-none bg-transparent focus:outline-none placeholder:text-muted-foreground transition-all duration-300 text-base py-2 text-body ${
                  isOverLimit ? 'text-destructive' : 'text-foreground'
                }`}
                minRows={1}
                maxRows={6}
              />
              
              {/* Typing indicator */}
              {isTyping && message.trim() && (
                <motion.div
                  className="absolute right-2 top-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <TypingIcon className="text-primary" />
                </motion.div>
              )}
            </div>
            
            {/* Right side buttons */}
            <div className="flex items-center gap-1">
              <MinimalButton
                icon={Paperclip}
                onClick={() => fileInputRef.current?.click()}
                iconAnimation="bounce"
                title="Attach file"
                className="hover-lift"
              />
              <input 
                ref={fileInputRef}
                type="file" 
                onChange={handleFileAttach} 
                className="hidden" 
                accept="image/*,text/*,.pdf,.doc,.docx"
              />
              
              {onToggleCanvas && (
                <MinimalButton
                  icon={Layers}
                  onClick={onToggleCanvas}
                  iconAnimation={isCanvasOpen ? "float" : "scale"}
                  title="Toggle Canvas"
                  className={isCanvasOpen ? 'text-primary bg-primary/10' : ''}
                />
              )}
              
              <PrimaryButton
                icon={isSending ? undefined : Send}
                onClick={handleSendMessage}
                disabled={(!canSendMessage || isOverLimit) && !isSending}
                loading={isSending}
                title={isSending ? "Sending..." : "Send message"}
                size="md"
                className="min-w-[40px]"
              >
                {isSending && <LoadingIcon size={16} />}
              </PrimaryButton>
            </div>
          </div>
          
          {/* Token Count and Cost Display - Compact version */}
          {(!isFloating || message.trim() || isOverLimit) && (
            <div className="flex items-center justify-between text-xs text-caption mt-2 pt-2 border-t border-border/20">
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
