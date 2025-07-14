// frontend/components/chat/ChatInput.js
import React, { useState } from 'react';
import { Paperclip, Layers, Send, Zap } from 'react-feather'; // Changed Zap for Lightbulb
import PromptSuggestions from './PromptSuggestions';

const ChatInput = ({ onToggleCanvas, onSendMessage }) => {
  const [message, setMessage] = useState('');
  
  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleSuggestionClick = (suggestion) => {
    setMessage(suggestion);
    // Focus on the textarea after setting the suggestion
    document.querySelector('textarea').focus();
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 border-t border-gray-200 dark:border-gray-700">
      <PromptSuggestions onSuggestionClick={handleSuggestionClick} />
      <div className="relative mt-4">
        <textarea
          className="w-full h-12 p-3 pr-40 bg-gray-100 dark:bg-gray-800 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write your prompt..."
          rows="1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        ></textarea>
        <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center space-x-2">
          <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <Zap size={20} />
          </button>
          <button
            onClick={onToggleCanvas}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <Layers size={20} />
          </button>
          <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <Paperclip size={20} />
          </button>
          <button 
            onClick={handleSendMessage} 
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
        The information represented here might has mistakes. Please check for use them.
      </p>
    </div>
  );
};

export default ChatInput;