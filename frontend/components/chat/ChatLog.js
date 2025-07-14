// components/chat/ChatLog.js
import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';

const ChatLog = ({ messages = [] }) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to the most recent message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="absolute inset-0 p-4 md:p-6 lg:p-8 pb-10 space-y-4 overflow-y-auto">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      <div ref={messagesEndRef} className="h-4" />
    </div>
  );
};

export default ChatLog;
