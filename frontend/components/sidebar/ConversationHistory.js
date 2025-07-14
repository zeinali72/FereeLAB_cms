// components/sidebar/ConversationHistory.js
import React from 'react';
import { MessageSquare } from 'react-feather';

const conversations = [
  { id: 1, title: 'User Chat 1', time: '10:00 AM' },
  { id: 2, title: 'User Chat 2', time: 'Yesterday' },
];

const ConversationHistory = () => {
  return (
    <div className="space-y-2">
      {conversations.map((convo) => (
        <div key={convo.id} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{convo.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{convo.time}</p>
        </div>
      ))}
    </div>
  );
};

export default ConversationHistory;
