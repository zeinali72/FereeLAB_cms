// components/chat/ChatHeader.js
import React from 'react';
import { ChevronDown, Sun, Moon } from 'react-feather';

const ChatHeader = ({ onToggleTheme, isDarkMode }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <div>
        <button className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600">
          <span>Models</span>
          <ChevronDown size={16} className="ml-2" />
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={onToggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
