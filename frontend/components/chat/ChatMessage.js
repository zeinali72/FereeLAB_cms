import React, { useState, useEffect, useRef, useContext } from 'react';
import { Copy, ThumbsUp, ThumbsDown, RefreshCw, Check, Edit, X, MessageSquare } from 'react-feather';
import TextareaAutosize from 'react-textarea-autosize';
import { estimateTokenCount } from '../../utils/tokenCalculator';

const ChatMessage = ({ 
  message, 
  onEdit, 
  onRegenerate, 
  onFeedback, 
  onReply,
  replyActive
}) => {
  const isUser = message.sender === 'user';
  const [isCopied, setIsCopied] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.text);
  const [feedback, setFeedback] = useState(null); // 'good' or 'bad'
  const [liveTokenCount, setLiveTokenCount] = useState(message.meta?.tokens || 0);
  const [liveTokenCost, setLiveTokenCost] = useState(message.meta?.cost || '$0.0000');
  const textareaRef = useRef(null);

  useEffect(() => {
    // Set the full message text immediately to prevent the first character issue
    setDisplayText(message.text);
    
    if (message.animate) {
      setAnimationClass(isUser ? 'animate-slide-in-left' : 'animate-slide-in-right');
      setTimeout(() => setAnimationClass(''), 500);

      if (message.sender === 'bot') {
        setIsTyping(true);
        // Start with a fully visible message but simulate typing
        let visibleLength = 0;
        const typingInterval = setInterval(() => {
          if (visibleLength < message.text.length) {
            visibleLength++;
            // No need to update displayText here as it's already set
          } else {
            clearInterval(typingInterval);
            setIsTyping(false);
          }
        }, 10);
        
        return () => clearInterval(typingInterval);
      }
    } else {
      setAnimationClass('');
      setIsTyping(false);
    }
  }, [message.text, message.sender, message.animate, isUser]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
      
      // Initialize live token count
      const tokens = estimateTokenCount(message.text);
      setLiveTokenCount(tokens);
      setLiveTokenCost(`$${(tokens * 0.0001).toFixed(4)}`);
    }
  }, [isEditing, message.text]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedText(message.text);
  };

  const handleSaveEdit = () => {
    if (editedText.trim()) {
      onEdit(message.id, editedText.trim());
      setIsEditing(false);
    }
  };

  const handleFeedback = (newFeedback) => {
    const finalFeedback = feedback === newFeedback ? null : newFeedback;
    setFeedback(finalFeedback);
    if (onFeedback) {
      onFeedback(message.id, finalFeedback);
    }
  };

  return (
    <div className={`flex items-start gap-3 my-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${isUser ? 'bg-primary-500' : 'bg-gray-500'} ${message.animate ? 'animate-fade-in' : ''}`}>
        {isUser ? (message.name ? message.name.charAt(0).toUpperCase() : 'U') : 'AI'}
      </div>
      <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${isUser ? 'items-end' : 'items-start'} ${animationClass}`}>
        <div className={`px-4 py-2 rounded-lg shadow-md ${isUser ? 'bg-primary-500 text-white rounded-br-none' : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-bl-none'}`}>
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <TextareaAutosize
                ref={textareaRef}
                value={editedText}
                onChange={(e) => {
                  const newText = e.target.value;
                  setEditedText(newText);
                  // Update live token count
                  const tokens = estimateTokenCount(newText);
                  setLiveTokenCount(tokens);
                  setLiveTokenCost(`$${(tokens * 0.0001).toFixed(4)}`);
                }}
                className="w-full bg-transparent focus:outline-none resize-none"
                minRows={1}
              />
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs">
                  <span>{liveTokenCount} tokens | {liveTokenCost}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSaveEdit} className="p-1 rounded-full hover:bg-[var(--bg-secondary)] transition-colors" title="Save">
                    <Check size={14} />
                  </button>
                  <button onClick={handleCancelEdit} className="p-1 rounded-full hover:bg-[var(--bg-secondary)] transition-colors" title="Cancel">
                    <X size={14} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="whitespace-pre-wrap break-words leading-relaxed">
              {displayText}
              {isTyping && <span className="animate-pulse">▍</span>}
            </p>
          )}
        </div>
        <div className={`flex items-center mt-2 text-[var(--text-secondary)] space-x-3 ${isUser ? 'justify-end' : ''}`}>
          {isUser ? (
            <>
              {message.meta && (
                <div className="text-xs flex space-x-2">
                  {message.meta.tokens && <span>{message.meta.tokens} tokens</span>}
                  {message.meta.inputCost && <span>Input: {message.meta.inputCost}</span>}
                  {message.meta.cost && !message.meta.inputCost && <span>{message.meta.cost}</span>}
                </div>
              )}
              <button onClick={handleEdit} className="p-1 rounded-full hover:bg-[var(--bg-secondary)] transition-colors" title="Edit">
                <Edit size={14} />
              </button>
            </>
          ) : (
            <>
              <button onClick={handleCopy} className="p-1 rounded-full hover:bg-[var(--bg-secondary)] transition-colors" title={isCopied ? "Copied!" : "Copy"}>
                {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
              <button onClick={() => handleFeedback('good')} className={`p-1 rounded-full hover:bg-[var(--bg-secondary)] transition-colors ${feedback === 'good' ? 'text-green-500' : ''}`} title="Good response">
                <ThumbsUp size={14} />
              </button>
              <button onClick={() => handleFeedback('bad')} className={`p-1 rounded-full hover:bg-[var(--bg-secondary)] transition-colors ${feedback === 'bad' ? 'text-red-500' : ''}`} title="Bad response">
                <ThumbsDown size={14} />
              </button>
              <button onClick={() => onRegenerate(message.id)} className="p-1 rounded-full hover:bg-[var(--bg-secondary)] transition-colors" title="Regenerate">
                <RefreshCw size={14} />
              </button>
              <button 
                onClick={() => onReply(message)} 
                className={`p-1 rounded-full hover:bg-[var(--bg-secondary)] transition-colors ${replyActive ? 'text-primary-500' : ''}`} 
                title={replyActive ? "Cancel Reply" : "Reply"}
              >
                <MessageSquare size={14} />
              </button>
              {message.meta && (
                <div className="text-xs flex space-x-2">
                  {message.meta.tokens && <span>{message.meta.tokens} tokens</span>}
                  {message.meta.outputCost && <span>Output: {message.meta.outputCost}</span>}
                  {message.meta.cost && !message.meta.outputCost && <span className="ml-2">{message.meta.cost}</span>}
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
