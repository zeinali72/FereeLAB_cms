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
    <div className="flex items-center justify-between p-4 chat-header">
      <div className="flex items-center">
        {!isSidebarOpen && (
          <button
            onClick={onToggleSidebar}
            className="p-2 mr-2 rounded-md hover:bg-surface-secondary"
            title="Open sidebar"
          >
            <ChevronsRight size={24} />
          </button>
        )}
        
        <button 
          onClick={onToggleSidebar} 
          className={`p-2 mr-2 rounded-md hover:bg-surface-secondary md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
        >
          <Menu size={24} />
        </button>

        {/* Display active chat title */}
        <div className="mr-4 font-medium truncate max-w-[150px] md:max-w-xs">
          {chatTitle || "New Chat"}
        </div>

        {/* This button now opens the Model Panel */}
        <button 
          onClick={onToggleModelPanel}
          className="flex items-center px-4 py-2 bg-surface-secondary rounded-md text-sm font-medium hover:bg-surface-tertiary transition-colors"
        >
          <span>Models</span>
          <ChevronDown size={16} className="ml-2" />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        {/* New Chat Button */}
        <button 
          onClick={onNewConversation}
          className="flex items-center px-3 py-2 rounded-md bg-primary-500 text-white hover:bg-primary-600 transition-colors"
        >
          <Plus size={16} className="mr-1" />
          <span className="text-sm">New Chat</span>
        </button>
        
        {/* Theme Toggle Button */}
        <button 
          onClick={onToggleTheme} 
          className="p-2 rounded-md hover:bg-surface-secondary"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;