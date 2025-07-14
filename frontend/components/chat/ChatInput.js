// frontend/components/chat/ChatInput.js
import React, { useState, useRef, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Paperclip, Layers, Send, Zap } from 'react-feather'; 
import PromptSuggestions from './PromptSuggestions';

const ChatInput = ({ onToggleCanvas, onSendMessage, isCanvasOpen }) => {
  const [message, setMessage] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [isPromptGeneratorOpen, setIsPromptGeneratorOpen] = useState(false);
  const textareaRef = useRef(null);
  
  const handleSendMessage = () => {
    if (message.trim() || attachedFile) {
      onSendMessage(message, attachedFile);
      setMessage('');
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
    textareaRef.current?.focus();
  };

  const togglePromptGenerator = () => {
    setIsPromptGeneratorOpen(!isPromptGeneratorOpen);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleFileAttach = () => {
    // This is a placeholder for file attachment logic
    setAttachedFile({ name: 'attached-file.txt' });
  };

  const canSendMessage = message.trim() || attachedFile;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <PromptSuggestions onSuggestionClick={handleSuggestionClick} />
      <div className="relative flex items-end mt-4 bg-gray-100 dark:bg-gray-700 rounded-xl p-2">
        <button onClick={togglePromptGenerator} className={`p-2 transition-colors ${isPromptGeneratorOpen ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'}`}>
          <Zap size={20} />
        </button>
        <TextareaAutosize
          ref={textareaRef}
          className="flex-1 bg-transparent resize-none focus:outline-none px-2 text-base text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 self-center"
          placeholder="Ask anything..."
          rows="1"
          minRows={1}
          maxRows={8}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ resize: 'vertical' }}
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
            disabled={!canSendMessage}
            className={`p-2 transition-colors duration-200 ${
              canSendMessage
                ? 'text-blue-500 hover:text-blue-600'
                : 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
