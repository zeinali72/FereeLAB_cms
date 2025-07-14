import React from 'react';
import { ChevronsLeft } from 'react-feather';
import SearchWithSuggestions from './SearchWithSuggestions';
import ProjectList from './ProjectList';
import ConversationHistory from './ConversationHistory';
import UserProfile from './UserProfile';

const Sidebar = ({ isOpen, onToggle }) => {
  return (
    <aside
      className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shrink-0 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-80' : 'w-0'
      }`}
    >
      {/* Wrapper to prevent content from overflowing during collapse animation */}
      <div className="w-80 h-full flex flex-col overflow-hidden">
        {/* Sidebar Header */}
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

        {/* Main Content Area (scrollable) */}
        <div
          className={`flex-grow flex flex-col min-h-0 transition-opacity duration-200 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <SearchWithSuggestions />
          <div className="flex-grow overflow-y-auto">
            <ProjectList />
            <ConversationHistory />
          </div>
        </div>

        {/* User Profile Footer */}
        <div
          className={`flex-shrink-0 transition-opacity duration-200 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <UserProfile />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;