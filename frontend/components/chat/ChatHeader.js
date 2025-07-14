import React from 'react';
import { ChevronDown, Sun, Moon, Menu, Plus, ChevronsLeft } from 'react-feather';

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
    <div className="flex items-center justify-between p-4 bg-surface border-b border-outline-variant h-16 flex-shrink-0">
      <div className="flex items-center space-x-2">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-full hover:bg-surface-secondary text-on-surface-variant transition-colors"
          title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isSidebarOpen ? <ChevronsLeft size={20} /> : <Menu size={20} />}
        </button>
        
        <div className="font-semibold text-lg text-on-surface truncate">
          {chatTitle || "New Chat"}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button 
          onClick={onToggleModelPanel}
          className="flex items-center px-4 py-2 bg-surface-secondary rounded-lg text-sm font-medium text-on-surface-secondary hover:bg-surface-tertiary transition-colors"
        >
          <span>Models</span>
          <ChevronDown size={16} className="ml-2" />
        </button>

        <button 
          onClick={onNewConversation}
          className="flex items-center px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-dark transition-colors"
        >
          <Plus size={16} className="mr-1" />
          <span className="text-sm font-medium">New Chat</span>
        </button>
        
        <button 
          onClick={onToggleTheme} 
          className="p-2 rounded-full hover:bg-surface-secondary text-on-surface-variant transition-colors"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
