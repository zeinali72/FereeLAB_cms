import React from 'react';
import { ChevronsLeft } from 'react-feather';
import SearchWithSuggestions from './SearchWithSuggestions';
import ProjectList from './ProjectList';
import ConversationHistory from './ConversationHistory';
import UserProfile from './UserProfile';

// Accept and pass down conversation-related props
const Sidebar = ({ 
  isOpen, 
  onToggle, 
  theme, 
  setTheme, 
  width, 
  conversations = [],
  activeConversationId,
  onNewConversation,
  onSwitchConversation
}) => {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div
        className={`flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 transition-opacity duration-200 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h1 className="text-lg font-bold text-gray-800 dark:text-white">FereeLAB</h1>
        <button
          onClick={onToggle}
          className="p-1 text-gray-500 rounded-md hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          title="Collapse sidebar"
        >
          <ChevronsLeft size={20} />
        </button>
      </div>

      <div
        className={`flex-grow flex flex-col min-h-0 transition-opacity duration-200 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <SearchWithSuggestions />
        <div className="flex-grow overflow-y-auto">
          <ProjectList />
          <ConversationHistory 
            conversations={conversations}
            activeConversationId={activeConversationId}
            onNewConversation={onNewConversation}
            onSwitchConversation={onSwitchConversation}
          />
        </div>
      </div>

      <div
        className={`flex-shrink-0 transition-opacity duration-200 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Pass the props down to UserProfile */}
        <UserProfile theme={theme} setTheme={setTheme} />
      </div>
    </div>
  );
};

export default Sidebar;