// frontend/components/sidebar/ConversationHistory.js
import React from 'react';
import { MessageSquare } from 'react-feather';

// Sample data for demonstration
const conversations = [
  { id: 'conv-1', title: 'User Chat 1', timestamp: new Date() },
  { id: 'conv-2', title: 'User Chat 2', timestamp: new Date(new Date().setDate(new Date().getDate() - 1)) },
  { id: 'conv-3', title: 'A much older chat', timestamp: new Date(new Date().setDate(new Date().getDate() - 7)) },
];

// Helper to format dates
const formatDateGroup = (date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  return date.toLocaleDateString();
};

const ConversationHistory = () => {
  const groupedConversations = conversations.reduce((acc, conv) => {
    const dateKey = formatDateGroup(conv.timestamp);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(conv);
    return acc;
  }, {});

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Conversation History
      </h2>
      <ul className="mt-2 space-y-4">
        {Object.entries(groupedConversations).map(([date, convs]) => (
          <li key={date}>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-2">{date}</p>
            <ul className="space-y-1">
              {convs.map((conv) => (
                <li key={conv.id}>
                  <a
                    href="#"
                    className="flex items-center p-2 text-base font-normal text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <MessageSquare size={20} className="text-gray-500" />
                    <span className="ml-3 flex-1 whitespace-nowrap">{conv.title}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {conv.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationHistory;