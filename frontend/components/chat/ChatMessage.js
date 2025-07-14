import React, { useState, useEffect, useRef } from 'react';
import { Copy, ThumbsUp, ThumbsDown, RefreshCw, Check, Edit, X, MessageSquare } from 'react-feather';
import TextareaAutosize from 'react-textarea-autosize';

const ChatMessage = ({ 
  message, 
  onEdit, 
  onRegenerate, 
  onFeedback, 
  onReply 
}) => {
  const isUser = message.sender === 'user';
  const [isCopied, setIsCopied] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.text);
  const [feedback, setFeedback] = useState(null); // 'good' or 'bad'
  const textareaRef = useRef(null);

  useEffect(() => {
    if (message.animate) {
      setAnimationClass(isUser ? 'animate-slide-in-left' : 'animate-slide-in-right');
      setTimeout(() => setAnimationClass(''), 500);

      if (message.sender === 'bot') {
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
      }
    } else {
      setAnimationClass('');
      setDisplayText(message.text);
      setIsTyping(false);
    }
  }, [message.text, message.sender, message.animate, isUser]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

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
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full bg-transparent focus:outline-none resize-none"
                minRows={1}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={handleSaveEdit} className="p-1 rounded-full hover:bg-[var(--bg-secondary)] transition-colors" title="Save">
                  <Check size={14} />
                </button>
                <button onClick={handleCancelEdit} className="p-1 rounded-full hover:bg-[var(--bg-secondary)] transition-colors" title="Cancel">
                  <X size={14} />
                </button>
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
                <div className="text-xs">
                  {message.meta.tokens && <span>{message.meta.tokens} tokens</span>}
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
              <button onClick={() => onReply(message)} className="p-1 rounded-full hover:bg-[var(--bg-secondary)] transition-colors" title="Reply">
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
