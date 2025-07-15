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
  replyActive,
  messages // Added messages prop
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
  const [showControls, setShowControls] = useState(false);
  const textareaRef = useRef(null);
  const messageRef = useRef(null);

  useEffect(() => {
    // Always animate the first message (regardless of the animate flag)
    const shouldAnimate = message.animate || (messages && messages.length === 1);
    
    if (shouldAnimate) {
      // Set animation class based on sender
      setAnimationClass(isUser ? 'animate-slide-in-left' : 'animate-slide-in-right');
      setTimeout(() => setAnimationClass(''), 500);

      // Start with empty text for typing animation
      setDisplayText('');
      setIsTyping(true);
      
      // Simulate typing animation for both bot and user messages
      const typingSpeed = isUser ? 20 : 10; // User messages type faster
      let visibleLength = 0;
      const typingInterval = setInterval(() => {
        if (visibleLength < message.text.length) {
          visibleLength++;
          setDisplayText(message.text.substring(0, visibleLength));
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, typingSpeed);
      
      return () => clearInterval(typingInterval);
    } else {
      // No animation, just show the full text
      setDisplayText(message.text);
      setAnimationClass('');
      setIsTyping(false);
    }
  }, [message.text, message.sender, message.animate, isUser, messages]);

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

  // Show reply info if this message is being replied to
  const renderReplyInfo = () => {
    if (!message.replyTo) return null;
    
    const replyText = message.replyTo.text.length > 60 
      ? message.replyTo.text.substring(0, 60) + '...' 
      : message.replyTo.text;
    
    return (
      <div className="mb-1 text-xs text-[var(--text-secondary)] flex items-center">
        <span className="bg-[var(--bg-secondary)] px-2 py-1 rounded-lg">
          Replying to: "{replyText}"
        </span>
      </div>
    );
  };

  // Display model info for bot messages
  const renderModelInfo = () => {
    if (isUser || !message.meta?.model) return null;
    
    return (
      <div className="text-xs text-[var(--text-tertiary)] ml-2">
        via {message.meta.model}
      </div>
    );
  };

  return (
    <div 
      className={`flex items-start gap-3 my-4 ${isUser ? 'flex-row-reverse' : ''} message-container`}
      ref={messageRef}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${isUser ? 'bg-primary-500' : 'bg-gray-500'} ${message.animate ? 'animate-fade-in' : ''}`}>
        {isUser ? (message.name ? message.name.charAt(0).toUpperCase() : 'U') : 'AI'}
      </div>
      <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${isUser ? 'items-end' : 'items-start'} ${animationClass}`}>
        {renderReplyInfo()}
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
        <div className={`flex flex-wrap items-center mt-2 text-[var(--text-secondary)] gap-x-3 gap-y-1 ${isUser ? 'justify-end' : ''} ${showControls ? 'opacity-100' : 'opacity-0 md:opacity-100'} transition-opacity message-controls`}>
          {isUser ? (
            <>
              {message.meta && (
                <div className="text-xs flex space-x-2 order-first w-full sm:w-auto sm:order-none">
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
                <div className="text-xs flex flex-wrap gap-x-2 gap-y-1 order-last w-full sm:w-auto mt-1 sm:mt-0">
                  {message.meta.tokens && <span>{message.meta.tokens} tokens</span>}
                  {message.meta.outputCost && <span>Output: {message.meta.outputCost}</span>}
                  {message.meta.cost && !message.meta.outputCost && <span>{message.meta.cost}</span>}
                  {renderModelInfo()}
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
