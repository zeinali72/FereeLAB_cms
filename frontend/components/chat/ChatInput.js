// frontend/components/chat/ChatInput.js
import React, { useState } from 'react';
import { Paperclip, Layers, Send, Zap } from 'react-feather'; 
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
    <div className="p-4 md:p-6 lg:p-8 chat-input-area">
      <PromptSuggestions onSuggestionClick={handleSuggestionClick} />
      <div className="relative mt-4">
        <textarea
          className="w-full h-12 p-3 pr-40 bg-surface-secondary rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Write your prompt..."
          rows="1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        ></textarea>
        <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center space-x-2">
          <button className="p-2 hover:text-primary-600 transition-colors">
            <Zap size={20} />
          </button>
          <button
            onClick={onToggleCanvas}
            className="p-2 hover:text-primary-600 transition-colors"
          >
            <Layers size={20} />
          </button>
          <button className="p-2 hover:text-primary-600 transition-colors">
            <Paperclip size={20} />
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className={`flex items-center justify-center h-10 w-10 rounded-full ${
              message.trim()
                ? 'bg-primary-500 hover:bg-primary-600 text-white'
                : 'bg-surface-tertiary text-tertiary cursor-not-allowed'
            } transition-colors`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;