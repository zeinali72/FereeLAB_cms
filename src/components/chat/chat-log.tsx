"use client";

import { useRef, useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatMessage, Message } from "./chat-message";
import { PromptSuggestions } from "./prompt-suggestions";
import { AnimatedButton } from "@/components/ui/animated-button";

interface ChatLogProps {
  messages: Message[];
  onEditMessage?: (messageId: string, newContent: string) => void;
  onRegenerate?: (messageId: string) => void;
  onReply?: (message: Message) => void;
  onAssignToProject?: (message: Message) => void;
  onQuoteInReply?: (message: Message) => void;
  replyTo?: Message | null;
  onSuggestionClick?: (suggestion: string) => void;
}

export function ChatLog({ 
  messages, 
  onEditMessage, 
  onRegenerate, 
  onReply, 
  onAssignToProject,
  onQuoteInReply,
  replyTo,
  onSuggestionClick
}: ChatLogProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [processedMessages, setProcessedMessages] = useState<Message[]>([]);
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isReplyMode, setIsReplyMode] = useState(false);
  const [showPromptSuggestions, setShowPromptSuggestions] = useState(true);
  const [promptSuggestionAnimation, setPromptSuggestionAnimation] = useState('');

  // Track reply mode changes
  useEffect(() => {
    const wasInReplyMode = isReplyMode;
    const nowInReplyMode = Boolean(replyTo);
    
    // If entering reply mode, save scroll position
    if (!wasInReplyMode && nowInReplyMode) {
      setScrollPosition(chatContainerRef.current?.scrollTop || 0);
    }
    
    // If exiting reply mode, restore normal scrolling behavior
    if (wasInReplyMode && !nowInReplyMode) {
      setUserHasScrolled(false);
    }
    
    setIsReplyMode(nowInReplyMode);
  }, [replyTo, isReplyMode]);

  // Handle prompt suggestions visibility based on messages
  useEffect(() => {
    if (messages.length === 0) {
      // Show prompt suggestions for new conversations
      setShowPromptSuggestions(true);
      setPromptSuggestionAnimation('animate-fade-in');
    } else if (messages.length > 0 && showPromptSuggestions) {
      // Hide with animation when first message appears
      setPromptSuggestionAnimation('animate-fade-out');
      setTimeout(() => {
        setShowPromptSuggestions(false);
      }, 300); // Match animation duration
    }
  }, [messages.length, showPromptSuggestions]);

  // Handle suggestion click with animation
  const handleSuggestionClick = (suggestion: string) => {
    if (onSuggestionClick) {
      // Start fade out animation immediately
      setPromptSuggestionAnimation('animate-fade-out');
      setTimeout(() => {
        setShowPromptSuggestions(false);
        // Call the suggestion handler after animation starts
        onSuggestionClick(suggestion);
      }, 150); // Start the action mid-animation for better UX
    }
  };

  // Maintain scroll position when in reply mode
  useEffect(() => {
    if (isReplyMode && chatContainerRef.current) {
      // Ensure scroll position is maintained in reply mode
      requestAnimationFrame(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = scrollPosition;
        }
      });
    }
  }, [scrollPosition, isReplyMode, messages, processedMessages]);

  // Process messages with animation flags
  useEffect(() => {
    // Check if this is a page reload
    const isPageReload = !sessionStorage.getItem('pageHasLoaded');
    
    // Mark the page as loaded
    if (isPageReload) {
      sessionStorage.setItem('pageHasLoaded', 'true');
    }
    
    // Create a flag to track if this is a new message being added
    const previousMessageCount = parseInt(sessionStorage.getItem('lastMessageCount') || '0');
    const isNewMessageAdded = previousMessageCount < messages.length;
    
    // Store the current message count for future comparison
    sessionStorage.setItem('lastMessageCount', messages.length.toString());
    setLastMessageCount(messages.length);
    
    const updatedMessages = messages.map((msg, index) => {
      // Always animate new messages that are added
      // But don't animate on page reload or when showing history
      const shouldAnimate = 
        !isPageReload && // Not a page reload
        isNewMessageAdded && // New message was added
        index === messages.length - 1 && // Only animate the last message
        (msg.animate !== false); // Respect explicit animation setting
        
      return {
        ...msg,
        animate: shouldAnimate
      };
    });
    
    setProcessedMessages(updatedMessages);
    
    // If a new message arrived, check if we should scroll
    if (isNewMessageAdded && !userHasScrolled && !isSelecting && !isReplyMode) {
      // Reset userHasScrolled when a new message arrives
      setUserHasScrolled(false);
    }
  }, [messages, userHasScrolled, isSelecting, isReplyMode]);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
      setShowScrollToBottom(false);
    }
  };

  // Effect for handling new messages and scrolling
  useEffect(() => {
    if (!chatContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100; // 100px tolerance
    
    // If in reply mode, maintain the scroll position
    if (isReplyMode) {
      chatContainerRef.current.scrollTop = scrollPosition;
      return;
    }
    
    // If user hasn't manually scrolled or we're already at bottom, scroll to bottom
    if (!userHasScrolled || isAtBottom) {
      scrollToBottom('auto');
    }
    
    // If new message appeared and user has scrolled away, show the scroll button
    if (messages.length > lastMessageCount && !isAtBottom) {
      setShowScrollToBottom(true);
    }
  }, [processedMessages, userHasScrolled, lastMessageCount, messages.length, isReplyMode, scrollPosition]);

  // Handle scrolling - detect when user manually scrolls
  const handleScroll = () => {
    if (!chatContainerRef.current || isReplyMode) return;
    
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    
    // Only set userHasScrolled to true if we're not at the bottom
    // This way, when user scrolls to bottom manually, auto-scrolling is re-enabled
    setUserHasScrolled(!isAtBottom);
    setShowScrollToBottom(!isAtBottom);
  };
  
  // Detect when user is selecting text
  const handleMouseDown = () => {
    setIsSelecting(true);
  };
  
  const handleMouseUp = () => {
    // Delayed reset to allow for click events to complete
    setTimeout(() => {
      setIsSelecting(false);
      
      // Check if text is selected
      const selection = window.getSelection();
      if (!selection || selection.toString().length === 0) {
        // If no text is selected after mouseup, we can consider this a normal click
        if (chatContainerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
          const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
          
          // If user clicked and we're at the bottom, re-enable auto-scrolling
          if (isAtBottom) {
            setUserHasScrolled(false);
          }
        }
      }
    }, 100);
  };

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;
    
    chatContainer.addEventListener('scroll', handleScroll);
    chatContainer.addEventListener('mousedown', handleMouseDown);
    chatContainer.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      chatContainer.removeEventListener('scroll', handleScroll);
      chatContainer.removeEventListener('mousedown', handleMouseDown);
      chatContainer.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isReplyMode]);

  return (
    <div className="relative h-full bg-background">
      <div 
        ref={chatContainerRef}
        className="absolute inset-0 p-4 md:p-6 lg:p-8 space-y-6 overflow-y-auto custom-scrollbar"
      >
        {processedMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2 text-muted-foreground">Ready to chat</h3>
              <p className="text-muted-foreground text-sm max-w-md">
                Your conversation will appear here once you send your first message.
              </p>
            </div>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {processedMessages.map((message, index) => (
              <motion.div
                key={message.id}
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.9 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 200,
                      damping: 20
                    }
                  }
                }}
              >
                <ChatMessage 
                  message={message}
                  isLast={index === processedMessages.length - 1}
                  onEdit={onEditMessage}
                  onRegenerate={onRegenerate}
                  onReply={onReply}
                  onAssignToProject={onAssignToProject}
                  onQuoteInReply={onQuoteInReply}
                  replyActive={replyTo?.id === message.id}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
        <div ref={messagesEndRef} className="h-1" />
      </div>
      
      <AnimatePresence>
        {showScrollToBottom && !isReplyMode && (
          <motion.div
            className="absolute bottom-4 right-4 z-10"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <AnimatedButton
              icon={ArrowDown}
              iconAnimation="bounce"
              variant="glass"
              size="md"
              onClick={() => {
                scrollToBottom();
                setUserHasScrolled(false); // Re-enable auto-scrolling when clicking this button
              }}
              className="w-10 h-10 rounded-full shadow-lg hover-lift"
              title="Scroll to bottom"
              glow
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
