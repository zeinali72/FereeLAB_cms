"use client";

import { Copy, ThumbsDown, ThumbsUp, Edit2, RefreshCw, MessageSquare, Check, X, Cpu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { estimateTokenCount } from "@/utils/token-calculator";
import { Message } from "@/hooks/use-panels";

interface ChatMessageProps {
  message: Message;
  isLast?: boolean;
  isFirst?: boolean;
  onEdit?: (messageId: string, newContent: string) => void;
  onRegenerate?: (messageId: string) => void;
  onReply?: (message: Message) => void;
  onFeedback?: (messageId: string, feedback: "like" | "dislike" | null) => void;
  replyActive?: boolean;
}

export function ChatMessage({ 
  message, 
  isFirst,
  onEdit, 
  onRegenerate, 
  onReply, 
  onFeedback,
  replyActive = false
}: ChatMessageProps) {
  const [showControls, setShowControls] = useState(false);
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [isCopied, setIsCopied] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  
  const isUser = message.role === "user";
  const tokenCount = message.tokens || estimateTokenCount(message.content);

  // Typing animation effect
  useEffect(() => {
    const shouldAnimate = message.animate || isFirst;
    
    if (shouldAnimate) {
      // Set animation class based on sender
      setAnimationClass(isUser ? 'message-slide-in-user' : 'message-slide-in-bot');
      setTimeout(() => setAnimationClass(''), 500);

      // Start with empty text for typing animation
      setDisplayText('');
      setIsTyping(true);
      
      // Simulate typing animation
      const typingSpeed = isUser ? 15 : 8; // User messages type faster
      let visibleLength = 0;
      const typingInterval = setInterval(() => {
        if (visibleLength < message.content.length) {
          visibleLength++;
          setDisplayText(message.content.substring(0, visibleLength));
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, typingSpeed);
      
      return () => clearInterval(typingInterval);
    } else {
      // No animation, just show the full text
      setDisplayText(message.content);
      setAnimationClass('');
      setIsTyping(false);
    }
  }, [message.content, message.animate, isFirst, isUser]);

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleEdit = () => {
    if (isEditing && onEdit) {
      onEdit(message.id, editContent);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(message.content);
  };

  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate(message.id);
    }
  };

  const handleReply = () => {
    if (onReply) {
      onReply(message);
    }
  };

  const handleFeedbackClick = (newFeedback: "like" | "dislike") => {
    const finalFeedback = feedback === newFeedback ? null : newFeedback;
    setFeedback(finalFeedback);
    if (onFeedback) {
      onFeedback(message.id, finalFeedback);
    }
  };

  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(message.timestamp);

  // Show reply info if this message is being replied to
  const renderReplyInfo = () => {
    if (!message.replyTo) return null;
    
    const replyText = message.replyTo.content.length > 60 
      ? message.replyTo.content.substring(0, 60) + '...' 
      : message.replyTo.content;
    
    return (
      <div className="mb-2 text-xs text-muted-foreground flex items-center">
        <div className="bg-muted px-2 py-1 rounded-lg">
          Replying to: &ldquo;{replyText}&rdquo;
        </div>
      </div>
    );
  };

  // Display model info for bot messages
  const renderModelInfo = () => {
    if (isUser || !message.model) return null;
    
    return (
      <div className="flex items-center text-xs text-muted-foreground ml-2 bg-muted px-2 py-0.5 rounded-full">
        <Cpu size={10} className="mr-1 text-primary" />
        {message.model}
      </div>
    );
  };

  return (
    <div 
      ref={messageRef}
      className={cn(
        "flex items-start gap-3 my-6 group relative",
        isUser ? "flex-row-reverse" : "",
        animationClass
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0",
        isUser ? "bg-primary" : "bg-muted-foreground",
        message.animate ? "animate-fade-in" : ""
      )}>
        {isUser ? (
          "U"
        ) : (
          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className={cn(
        "flex flex-col max-w-[85%] md:max-w-[75%]",
        isUser ? "items-end" : "items-start"
      )}>
        {renderReplyInfo()}
        
        {/* Message Bubble */}
        <div className={cn(
          "px-4 py-3 rounded-2xl shadow-sm break-words",
          isUser 
            ? "bg-primary text-primary-foreground rounded-br-md" 
            : "bg-muted text-foreground rounded-bl-md"
        )}>
          {isEditing ? (
            <div className="flex flex-col gap-3">
              <textarea
                ref={textareaRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[60px] resize-none bg-transparent border-none p-0 focus:outline-none text-inherit w-full"
              />
              <div className="flex justify-between items-center">
                <div className="text-xs opacity-70">
                  <span>{estimateTokenCount(editContent)} tokens</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleEdit}
                    className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    title="Save"
                  >
                    <Check size={12} />
                  </button>
                  <button 
                    onClick={handleCancelEdit}
                    className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    title="Cancel"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="whitespace-pre-wrap leading-relaxed">
              {displayText}
              {isTyping && <span className="animate-pulse ml-1">▍</span>}
            </div>
          )}
        </div>

        {/* Message Controls */}
        <div className={cn(
          "flex flex-wrap items-center mt-2 gap-1 text-xs text-muted-foreground transition-opacity",
          isUser ? "justify-end flex-row-reverse" : "",
          showControls ? "opacity-100" : "opacity-0 md:opacity-60"
        )}>
          {/* Metadata */}
          <div className={cn(
            "flex items-center gap-2 text-xs",
            isUser ? "order-first" : "order-last"
          )}>
            <span>{formattedTime}</span>
            {tokenCount > 0 && <span>•</span>}
            {tokenCount > 0 && <span>{tokenCount} tokens</span>}
            {message.inputCost && <span>• Input: {message.inputCost}</span>}
            {message.outputCost && <span>• Output: {message.outputCost}</span>}
            {renderModelInfo()}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {isUser ? (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 rounded hover:bg-muted transition-colors"
                title="Edit message"
              >
                <Edit2 size={12} />
              </button>
            ) : (
              <>
                <button
                  onClick={handleCopyToClipboard}
                  className="p-1 rounded hover:bg-muted transition-colors"
                  title={isCopied ? "Copied!" : "Copy"}
                >
                  {isCopied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                </button>
                <button
                  onClick={() => handleFeedbackClick("like")}
                  className={cn(
                    "p-1 rounded hover:bg-muted transition-colors",
                    feedback === "like" && "text-green-500"
                  )}
                  title="Good response"
                >
                  <ThumbsUp size={12} />
                </button>
                <button
                  onClick={() => handleFeedbackClick("dislike")}
                  className={cn(
                    "p-1 rounded hover:bg-muted transition-colors",
                    feedback === "dislike" && "text-red-500"
                  )}
                  title="Bad response"
                >
                  <ThumbsDown size={12} />
                </button>
                <button
                  onClick={handleRegenerate}
                  className="p-1 rounded hover:bg-muted transition-colors"
                  title="Regenerate"
                >
                  <RefreshCw size={12} />
                </button>
                <button
                  onClick={handleReply}
                  className={cn(
                    "p-1 rounded hover:bg-muted transition-colors",
                    replyActive && "text-primary"
                  )}
                  title={replyActive ? "Cancel Reply" : "Reply"}
                >
                  <MessageSquare size={12} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { type Message };
