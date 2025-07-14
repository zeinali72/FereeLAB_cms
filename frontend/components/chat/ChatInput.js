// frontend/components/chat/ChatInput.js
import React, { useState, useRef, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Paperclip, Layers, Send, Zap } from 'react-feather'; 
import PromptSuggestions from './PromptSuggestions';
import { mockModels } from '../../data/mockModels';

const ChatInput = ({ onToggleCanvas, onSendMessage, isCanvasOpen, selectedModel }) => {
  const [message, setMessage] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [isPromptGeneratorOpen, setIsPromptGeneratorOpen] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);
  
  // Get context length from the selected model, or use a default value
  const getMaxContextLength = () => {
    if (selectedModel) {
      const model = mockModels.find(m => m.id === selectedModel);
      return model ? model.context_length : 4000;
    }
    return 4000; // Default value if no model is selected
  };
  
  const maxChars = getMaxContextLength();
  const maxHeight = 200; // Maximum height in pixels before scrolling

  const handleSendMessage = () => {
    if (message.trim() || attachedFile) {
      onSendMessage(message, attachedFile);
      setMessage('');
      setCharCount(0);
      setAttachedFile(null);
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
    setCharCount(suggestion.length);
    textareaRef.current?.focus();
  };

  const togglePromptGenerator = () => {
    setIsPromptGeneratorOpen(!isPromptGeneratorOpen);
  };

  // Update character count when message changes
  useEffect(() => {
    setCharCount(message.length);
  }, [message]);

  // Manage textarea height and scrolling behavior
  useEffect(() => {
    if (textareaRef.current) {
      // Let the component handle its own height initially
      const height = textareaRef.current.scrollHeight;
      
      // If height exceeds max, enforce scrolling behavior
      if (height > maxHeight) {
        textareaRef.current.style.overflow = 'auto';
        textareaRef.current.style.maxHeight = `${maxHeight}px`;
      } else {
        textareaRef.current.style.overflow = 'hidden';
      }
      
      // Always scroll to bottom when typing
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [message, maxHeight]);

  const handleFileAttach = () => {
    // This is a placeholder for file attachment logic
    setAttachedFile({ name: 'attached-file.txt' });
  };

  const canSendMessage = message.trim() || attachedFile;
  const isNearLimit = charCount > maxChars * 0.9;
  const isOverLimit = charCount > maxChars;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <PromptSuggestions onSuggestionClick={handleSuggestionClick} />
      <div ref={containerRef} className="relative flex flex-col mt-4 bg-gray-100 dark:bg-gray-700 rounded-xl p-2">
        <div className="flex items-end">
          <button onClick={togglePromptGenerator} className={`p-2 transition-colors ${isPromptGeneratorOpen ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'}`}>
            <Zap size={20} />
          </button>
          <TextareaAutosize
            ref={textareaRef}
            className={`flex-1 bg-transparent resize-none focus:outline-none px-2 text-base text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 self-center ${isOverLimit ? 'border-red-500 border' : ''}`}
            placeholder="Ask anything..."
            rows="1"
            minRows={1}
            maxRows={8}
            value={message}
            onChange={(e) => {
              // Prevent input if over the character limit
              if (e.target.value.length <= maxChars || e.target.value.length < message.length) {
                setMessage(e.target.value);
              }
            }}
            onKeyDown={handleKeyDown}
            style={{ 
              resize: 'none',
            }}
          />
          <div className="flex items-center space-x-1">
            <button
              onClick={onToggleCanvas}
              className={`p-2 transition-colors ${isCanvasOpen ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'}`}
              title="Toggle Canvas"
            >
              <Layers size={20} />
            </button>
            <button onClick={handleFileAttach} className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors" title="Attach File">
              <Paperclip size={20} />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!canSendMessage || isOverLimit}
              className={`p-2 transition-colors duration-200 ${
                canSendMessage && !isOverLimit
                  ? 'text-blue-500 hover:text-blue-600'
                  : 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
        
        {/* Character counter */}
        <div className={`text-xs text-right pr-2 mt-1 ${
          isNearLimit 
            ? isOverLimit 
              ? 'text-red-500' 
              : 'text-yellow-500 dark:text-yellow-400'
            : 'text-gray-500 dark:text-gray-400'
        }`}>
          {charCount}/{maxChars} characters
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
