// frontend/components/chat/ChatMessage.js
import React, { useState, useEffect } from 'react';
import { Copy, ThumbsUp, ThumbsDown, RefreshCw, Check, Edit, MessageSquare } from 'react-feather';

const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user';
  const [isCopied, setIsCopied] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (message.sender === 'bot' && message.animate) {
      setIsTyping(true);
      setDisplayText('');
      
      let index = 0;
      const text = message.text;
      const typingInterval = setInterval(() => {
        if (index < text.length) {
          setDisplayText(prev => prev + text.charAt(index));
          index++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 10);
      
      return () => clearInterval(typingInterval);
    } else {
      setDisplayText(message.text);
    }
  }, [message.text, message.sender, message.animate]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`flex items-start gap-4 my-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${isUser ? 'bg-blue-500' : 'bg-pink-500'}`}>
        {isUser ? (message.name ? message.name.charAt(0).toUpperCase() : 'U') : 'AI'}
      </div>
      <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-5 py-3 rounded-2xl shadow-md ${isUser ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
          <p className="whitespace-pre-wrap break-words leading-relaxed">
            {displayText}
            {isTyping && <span className="animate-pulse">▍</span>}
          </p>
        </div>
        <div className={`flex items-center mt-2 text-gray-400 dark:text-gray-500 space-x-3 ${isUser ? 'justify-end' : ''}`}>
          {isUser ? (
            <>
              {message.meta && (
                <div className="text-xs">
                  {message.meta.tokens && <span>{message.meta.tokens} tokens</span>}
                </div>
              )}
              <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" title="Edit">
                <Edit size={14} />
              </button>
            </>
          ) : (
            <>
              <button onClick={handleCopy} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" title={isCopied ? "Copied!" : "Copy"}>
                {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
              <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" title="Good response">
                <ThumbsUp size={14} />
              </button>
              <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" title="Bad response">
                <ThumbsDown size={14} />
              </button>
              <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" title="Regenerate">
                <RefreshCw size={14} />
              </button>
              <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" title="Reply">
                <MessageSquare size={14} />
              </button>
              {message.meta && (
                <div className="text-xs">
                  {message.meta.tokens && <span>{message.meta.tokens} tokens</span>}
                  {message.meta.cost && <span className="ml-2">{message.meta.cost}</span>}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;