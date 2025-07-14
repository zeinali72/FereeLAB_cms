import React from 'react';
import { ChevronDown, Sun, Moon, Menu, ChevronsRight, Plus } from 'react-feather';

const ChatHeader = ({ 
  onToggleTheme, 
  isDarkMode, 
  onToggleSidebar, 
  isSidebarOpen, 
  onToggleModelPanel,
  onNewConversation,
  chatTitle
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        {!isSidebarOpen && (
          <button
            onClick={onToggleSidebar}
            className="p-2 mr-2 text-gray-500 rounded-md hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
            title="Open sidebar"
          >
            <ChevronsRight size={24} />
          </button>
        )}
        
        <button 
          onClick={onToggleSidebar} 
          className={`p-2 mr-2 text-gray-500 rounded-md hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
        >
          <Menu size={24} />
        </button>

        {/* Display active chat title */}
        <div className="mr-4 font-medium text-gray-800 dark:text-white truncate max-w-[150px] md:max-w-xs">
          {chatTitle || "New Chat"}
        </div>

        {/* This button now opens the Model Panel */}
        <button 
          onClick={onToggleModelPanel}
          className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <span>Models</span>
          <ChevronDown size={16} className="ml-2" />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        {/* New Chat Button */}
        <button 
          onClick={onNewConversation}
          className="flex items-center px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm transition-colors duration-200"
          title="Start a new chat"
        >
          <Plus size={16} className="mr-1" />
          <span className="hidden sm:inline">New Chat</span>
        </button>

        <button onClick={onToggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;