// components/chat/ChatMessage.js
import React from 'react';
import { Copy,ThumbsUp, ThumbsDown, RefreshCw } from 'react-feather';

const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user';

  const UserAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center text-white font-bold">
      {message.name ? message.name.charAt(0).toUpperCase() : 'U'}
    </div>
  );

  const BotAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-pink-500 flex-shrink-0 flex items-center justify-center text-white">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
    </div>
  );

  return (
    <div className={`flex items-start gap-4 mb-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && <BotAvatar />}
      <div className={`flex flex-col max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`w-full p-4 rounded-lg ${
            isUser
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
          }`}
        >
          <p className="text-sm leading-relaxed">{message.text}</p>
        </div>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-4">
          <span>{`no. of output tokens: ${message.meta.tokens} | output cost: ${message.meta.cost}`}</span>
          {!isUser && (
            <div className="flex items-center space-x-2">
              <button className="hover:text-gray-700 dark:hover:text-gray-200"><Copy size={14} /></button>
              <button className="hover:text-gray-700 dark:hover:text-gray-200"><ThumbsUp size={14} /></button>
              <button className="hover:text-gray-700 dark:hover:text-gray-200"><ThumbsDown size={14} /></button>
              <button className="hover:text-gray-700 dark:hover:text-gray-200"><RefreshCw size={14} /></button>
            </div>
          )}
        </div>
      </div>
      {isUser && <UserAvatar />}
    </div>
  );
};

export default ChatMessage;
