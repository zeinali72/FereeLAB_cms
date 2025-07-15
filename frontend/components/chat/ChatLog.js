import React, { useRef, useEffect, useState } from 'react';
import ChatMessage from './ChatMessage';
import { ArrowDown } from 'react-feather';

const ChatLog = ({ 
  messages = [], 
  onEditMessage, 
  onRegenerateResponse, 
  onFeedback, 
  onReply,
  replyTo
}) => {
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [processedMessages, setProcessedMessages] = useState([]);
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isReplyMode, setIsReplyMode] = useState(false);
  
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
  
  // Maintain scroll position when in reply mode
  useEffect(() => {
    if (isReplyMode && chatContainerRef.current) {
      // Ensure scroll position is maintained in reply mode
      requestAnimationFrame(() => {
        chatContainerRef.current.scrollTop = scrollPosition;
      });
    }
  }, [scrollPosition, isReplyMode, messages, processedMessages]);
  
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

  const scrollToBottom = (behavior = 'smooth') => {
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
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
        
        // If user clicked and we're at the bottom, re-enable auto-scrolling
        if (isAtBottom) {
          setUserHasScrolled(false);
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
    <div className="relative h-full bg-[var(--bg-primary)]">
      <div 
        ref={chatContainerRef}
        className="absolute inset-0 p-4 md:p-6 lg:p-8 space-y-6 overflow-y-auto custom-scrollbar"
      >
        {processedMessages.map((msg) => (
          <ChatMessage 
            key={msg.id} 
            message={msg} 
            messages={processedMessages}
            onEdit={onEditMessage}
            onRegenerate={onRegenerateResponse}
            onFeedback={onFeedback}
            onReply={onReply}
            replyActive={replyTo && replyTo.id === msg.id}
          />
        ))}
        <div ref={messagesEndRef} className="h-1" />
      </div>
      {showScrollToBottom && !isReplyMode && (
        <button
          onClick={() => {
            scrollToBottom();
            setUserHasScrolled(false); // Re-enable auto-scrolling when clicking this button
          }}
          className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-[var(--bg-tertiary)] shadow-lg flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all animate-fade-in z-10"
          aria-label="Scroll to bottom"
        >
          <ArrowDown size={20} />
        </button>
      )}
    </div>
  );
};

export default ChatLog;
