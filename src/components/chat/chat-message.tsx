"use client";

import { Copy, ThumbsDown, ThumbsUp, Edit2, RefreshCw, MessageSquare, Check, X, Cpu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { estimateTokenCount } from "@/utils/token-calculator";
import { Message } from "@/hooks/use-panels";
import { AnimatedIcon } from "@/components/ui/animated-icon";
import { AnimatedButton } from "@/components/ui/animated-button";

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
    <motion.div 
      ref={messageRef}
      className={cn(
        "flex items-start gap-3 my-6 group relative",
        isUser ? "flex-row-reverse" : "",
        animationClass
      )}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: 0.1,
        ease: "easeOut"
      }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Avatar */}
      <motion.div 
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 relative",
          isUser ? "bg-primary" : "bg-muted-foreground"
        )}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 10,
          delay: 0.2
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isUser ? (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            U
          </motion.span>
        ) : (
          <motion.div 
            className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <motion.span 
              className="text-white text-xs font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              S
            </motion.span>
          </motion.div>
        )}
        
        {/* Typing indicator for assistant */}
        {!isUser && isTyping && (
          <motion.div
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Message Content */}
      <div className={cn(
        "flex flex-col transition-all duration-300",
        isUser ? "items-end" : "items-start",
        // Expand max width when editing to accommodate larger editing area
        isEditing ? "max-w-[95%] md:max-w-[90%]" : "max-w-[85%] md:max-w-[75%]"
      )}>
        {renderReplyInfo()}
        
        {/* Message Bubble */}
        <motion.div 
          className={cn(
            "px-4 py-3 rounded-2xl shadow-sm break-words",
            isUser 
              ? "bg-primary text-primary-foreground rounded-br-md" 
              : "bg-muted text-foreground rounded-bl-md"
          )}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 0.3
          }}
          whileHover={{ scale: 1.02 }}
        >
          {isEditing ? (
            <div className="flex flex-col gap-3 w-full">
              <div className="w-full max-w-none">
                <textarea
                  ref={textareaRef}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className={cn(
                    "w-full min-h-[80px] max-h-[300px] resize-none bg-transparent border-none p-0 focus:outline-none text-inherit transition-all duration-300",
                    "overflow-y-auto leading-relaxed",
                    // Dynamic width expansion based on content length
                    editContent.length > 100 ? "min-w-[400px] md:min-w-[500px]" : "min-w-[300px]",
                    editContent.length > 200 ? "min-w-[500px] md:min-w-[600px]" : "",
                    // Height expansion after width reaches max
                    editContent.length > 300 ? "min-h-[120px]" : "",
                    editContent.length > 500 ? "min-h-[160px]" : "",
                    editContent.length > 800 ? "min-h-[200px] overflow-y-scroll" : ""
                  )}
                  placeholder="Edit your message..."
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xs opacity-70 flex items-center gap-2">
                  <span>{estimateTokenCount(editContent)} tokens</span>
                  <span>•</span>
                  <span>{editContent.length} chars</span>
                </div>
                <div className="flex gap-2">
                  <AnimatedIcon
                    icon={Check}
                    size={14}
                    animate="bounce"
                    onClick={handleEdit}
                    className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-200 hover:scale-105 cursor-pointer text-green-500"
                    title="Save changes"
                  />
                  <AnimatedIcon
                    icon={X}
                    size={14}
                    animate="shake"
                    onClick={handleCancelEdit}
                    className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-200 hover:scale-105 cursor-pointer text-red-500"
                    title="Cancel editing"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="whitespace-pre-wrap leading-relaxed">
              {displayText}
              {isTyping && (
                <motion.span 
                  className="ml-1 inline-block"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <motion.span
                    className="inline-block w-2 h-4 bg-current"
                    animate={{ scaleY: [1, 0.3, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                </motion.span>
              )}
            </div>
          )}
        </motion.div>

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
          <motion.div 
            className="flex items-center gap-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: showControls ? 1 : 0, scale: showControls ? 1 : 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {isUser ? (
              <AnimatedIcon
                icon={Edit2}
                size={12}
                animate="pulse"
                onClick={() => setIsEditing(true)}
                className="p-1 rounded hover:bg-muted cursor-pointer"
                title="Edit message"
              />
            ) : (
              <>
                <AnimatedIcon
                  icon={isCopied ? Check : Copy}
                  size={12}
                  animate={isCopied ? "bounce" : "none"}
                  onClick={handleCopyToClipboard}
                  className={cn(
                    "p-1 rounded hover:bg-muted cursor-pointer",
                    isCopied && "text-green-500"
                  )}
                  title={isCopied ? "Copied!" : "Copy"}
                />
                <AnimatedIcon
                  icon={ThumbsUp}
                  size={12}
                  animate={feedback === "like" ? "bounce" : "none"}
                  onClick={() => handleFeedbackClick("like")}
                  className={cn(
                    "p-1 rounded hover:bg-muted cursor-pointer",
                    feedback === "like" && "text-green-500"
                  )}
                  title="Good response"
                />
                <AnimatedIcon
                  icon={ThumbsDown}
                  size={12}
                  animate={feedback === "dislike" ? "shake" : "none"}
                  onClick={() => handleFeedbackClick("dislike")}
                  className={cn(
                    "p-1 rounded hover:bg-muted cursor-pointer",
                    feedback === "dislike" && "text-red-500"
                  )}
                  title="Bad response"
                />
                <AnimatedIcon
                  icon={RefreshCw}
                  size={12}
                  animate="spin"
                  onClick={handleRegenerate}
                  className="p-1 rounded hover:bg-muted cursor-pointer"
                  title="Regenerate"
                />
                <AnimatedIcon
                  icon={MessageSquare}
                  size={12}
                  animate={replyActive ? "pulse" : "none"}
                  onClick={handleReply}
                  className={cn(
                    "p-1 rounded hover:bg-muted cursor-pointer",
                    replyActive && "text-primary"
                  )}
                  title={replyActive ? "Cancel Reply" : "Reply"}
                />
              </>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export { type Message };
