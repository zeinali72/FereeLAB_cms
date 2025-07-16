import React, { useState, useRef, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Paperclip, Layers, Send, Zap, X } from 'react-feather';
import PromptSuggestions from './PromptSuggestions';
import { mockModels } from '../../data/mockModels';
import { estimateTokenCount } from '../../utils/tokenCalculator';

const ChatInput = ({ 
  onSendMessage, 
  onToggleCanvas, 
  isCanvasOpen, 
  selectedModel, 
  replyTo, 
  cancelReply 
}) => {
  const [message, setMessage] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [isPromptGeneratorOpen, setIsPromptGeneratorOpen] = useState(false);
  const textareaRef = useRef(null);

  const getMaxContextLength = () => {
    const model = mockModels.find(m => m.id === selectedModel);
    return model ? model.context_length : 4000;
  };

  const maxTokens = getMaxContextLength();
  const tokenCount = estimateTokenCount(message);

  const handleSendMessage = () => {
    if (message.trim() || attachedFile) {
      onSendMessage(message, attachedFile);
      setMessage('');
      setAttachedFile(null);
      if (cancelReply) cancelReply();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    if (e.key === 'Escape' && replyTo) {
        cancelReply();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setMessage(suggestion);
    textareaRef.current?.focus();
  };

  const handleFileAttach = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
  };

  useEffect(() => {
    if (replyTo) {
      textareaRef.current?.focus();
    }
  }, [replyTo]);

  const canSendMessage = message.trim() || attachedFile;
  const isOverLimit = tokenCount > maxTokens;

  return (
    <div className="p-4 bg-[var(--bg-secondary)] border-t border-[var(--border-primary)]">
      {!replyTo && <PromptSuggestions onSuggestionClick={handleSuggestionClick} />}
      
      <div className="relative flex flex-col mt-4 bg-[var(--bg-tertiary)] rounded-xl p-2 border border-[var(--border-primary)]">
        {replyTo && (
          <div className="flex items-center justify-between p-2 mb-2 bg-[var(--bg-secondary)] rounded-md text-sm">
            <div className="text-[var(--text-secondary)]">
              Replying to: <span className="font-medium text-[var(--text-primary)]">"{replyTo.text.substring(0, 50)}..."</span>
            </div>
            <button onClick={cancelReply} className="p-1 hover:bg-[var(--bg-tertiary)] rounded-full">
              <X size={16} />
            </button>
          </div>
        )}

        {attachedFile && (
          <div className="flex items-center justify-between p-2 mb-2 bg-[var(--bg-secondary)] rounded-md text-sm">
            <div className="text-[var(--text-secondary)]">
              Attached: <span className="font-medium text-[var(--text-primary)]">{attachedFile.name}</span>
            </div>
            <button onClick={removeAttachedFile} className="p-1 hover:bg-[var(--bg-tertiary)] rounded-full">
              <X size={16} />
            </button>
          </div>
        )}

        <div className="flex items-end">
          <button onClick={() => setIsPromptGeneratorOpen(!isPromptGeneratorOpen)} className={`p-2 transition-colors ${isPromptGeneratorOpen ? 'text-primary-500' : 'text-[var(--text-secondary)] hover:text-primary-500'}`}>
            <Zap size={20} />
          </button>
          <TextareaAutosize
            ref={textareaRef}
            className={`flex-1 bg-transparent resize-none focus:outline-none px-2 text-base text-[var(--text-primary)] placeholder-[var(--text-secondary)] self-center ${isOverLimit ? 'border-red-500 border' : ''}`}
            placeholder="Ask anything..."
            rows="1"
            minRows={1}
            maxRows={8}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center space-x-1">
            <button
              onClick={onToggleCanvas}
              className={`p-2 transition-colors ${isCanvasOpen ? 'text-primary-500' : 'text-[var(--text-secondary)] hover:text-primary-500'}`}
              title="Toggle Canvas"
            >
              <Layers size={20} />
            </button>
            <label className="p-2 text-[var(--text-secondary)] hover:text-primary-500 transition-colors cursor-pointer" title="Attach File">
              <Paperclip size={20} />
              <input type="file" onChange={handleFileAttach} className="hidden" />
            </label>
            <button
              onClick={handleSendMessage}
              disabled={!canSendMessage || isOverLimit}
              className={`p-2 transition-colors duration-200 ${canSendMessage && !isOverLimit ? 'text-primary-500 hover:text-primary-600' : 'text-gray-400 cursor-not-allowed'}`}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
        
        <div className={`text-xs text-right pr-2 mt-1 ${isOverLimit ? 'text-red-500' : 'text-[var(--text-secondary)]'}`}>
          {tokenCount} tokens
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
