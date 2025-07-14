// components/chat/ChatMessage.js
import React, { useState, useEffect } from 'react';
import { Copy, ThumbsUp, ThumbsDown, RefreshCw, Check } from 'react-feather';

const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user';
  const [isCopied, setIsCopied] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Animation effect for bot messages
  useEffect(() => {
    // Only animate bot messages
    if (message.sender === 'bot') {
      setIsTyping(true);
      setDisplayText('');
      
      // Animate the text typing character by character
      const text = message.text;
      let index = 0;
      
      const typingInterval = setInterval(() => {
        if (index < text.length) {
          setDisplayText(prev => prev + text.charAt(index));
          index++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 20); // Speed of typing animation
      
      return () => clearInterval(typingInterval);
    } else {
      setDisplayText(message.text);
    }
  }, [message.text, message.sender]);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setIsCopied(true);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  
  return (
    <div className={`flex ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex flex-shrink-0 items-start ${isUser ? 'ml-3' : 'mr-3'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-text-inverse ${
          isUser ? 'user-avatar' : 'bot-avatar'
        }`}>
          {isUser ? (message.name ? message.name.charAt(0) : 'U') : 'AI'}
        </div>
      </div>
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-3 rounded-lg ${
          isUser 
            ? 'bg-primary-500 text-white' 
            : 'bg-surface-primary'
        } shadow-sm`}>
          <p className="whitespace-pre-wrap break-words">
            {displayText}
            {isTyping && (
              <span className="inline-block animate-pulse-fast">▌</span>
            )}
          </p>
        </div>
        
        {!isUser && (
          <div className="flex items-center mt-2 space-x-2">
            <button 
              className="p-1 rounded-md hover:bg-surface-secondary"
              onClick={handleCopy}
              title={isCopied ? "Copied!" : "Copy to clipboard"}
            >
              {isCopied ? <Check size={14} /> : <Copy size={14} />}
            </button>
            <button 
              className="p-1 rounded-md hover:bg-surface-secondary"
              title="Regenerate response"
            >
              <RefreshCw size={14} />
            </button>
            <button 
              className="p-1 rounded-md hover:bg-surface-secondary"
              title="Good response"
            >
              <ThumbsUp size={14} />
            </button>
            <button 
              className="p-1 rounded-md hover:bg-surface-secondary"
              title="Bad response"
            >
              <ThumbsDown size={14} />
            </button>
            
            {message.meta && (
              <div className="text-xs text-tertiary ml-auto">
                {message.meta.tokens && (
                  <span className="mr-2">{message.meta.tokens} tokens</span>
                )}
                {message.meta.cost && (
                  <span>{message.meta.cost}</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
