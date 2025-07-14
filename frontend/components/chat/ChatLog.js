// frontend/components/chat/ChatLog.js
import React, { useRef, useEffect, useState } from 'react';
import ChatMessage from './ChatMessage';
import { ArrowDown } from 'react-feather';

const ChatLog = ({ messages = [] }) => {
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [processedMessages, setProcessedMessages] = useState([]);
  
  // Process messages to ensure correct animation state
  useEffect(() => {
    // Check if this is a page reload
    const isPageReload = !sessionStorage.getItem('pageHasLoaded');
    
    // Mark the page as loaded
    if (isPageReload) {
      sessionStorage.setItem('pageHasLoaded', 'true');
    }
    
    // Create a flag to track if this is a new message being added
    // We only want animation for newly added messages
    const isNewMessageAdded = sessionStorage.getItem('lastMessageCount') && 
                             parseInt(sessionStorage.getItem('lastMessageCount')) < messages.length;
    
    // Store the current message count for future comparison
    sessionStorage.setItem('lastMessageCount', messages.length.toString());
    
    const updatedMessages = messages.map((msg, index) => {
      // Disable all animations when:
      // 1. Page is being reloaded OR
      // 2. This is not a new message being added OR
      // 3. This isn't the last message (we only animate the newest message)
      const shouldAnimate = 
        msg.animate && // Message was marked for animation
        !isPageReload && // Not a page reload
        isNewMessageAdded && // New message was added
        index === messages.length - 1; // Only animate the last message
        
      return {
        ...msg,
        animate: shouldAnimate
      };
    });
    
    setProcessedMessages(updatedMessages);
  }, [messages]);

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    // Scroll to bottom when messages change, but only if user is already near the bottom
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isScrolledToBottom = scrollHeight - scrollTop <= clientHeight + 100; // 100px tolerance
      if (isScrolledToBottom) {
        scrollToBottom();
      }
    }
  }, [processedMessages]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setShowScrollToBottom(!isAtBottom);
    }
  };

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    chatContainer?.addEventListener('scroll', handleScroll);
    return () => {
      chatContainer?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative h-full">
      <div 
        ref={chatContainerRef}
        className="absolute inset-0 p-4 md:p-6 lg:p-8 space-y-6 overflow-y-auto custom-scrollbar"
      >
        {processedMessages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} className="h-1" />
      </div>
      {showScrollToBottom && (
        <button
          onClick={() => scrollToBottom()}
          className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all animate-fade-in"
          aria-label="Scroll to bottom"
        >
          <ArrowDown size={20} />
        </button>
      )}
    </div>
  );
};

export default ChatLog;