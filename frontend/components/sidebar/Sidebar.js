// frontend/components/sidebar/Sidebar.js
import React from 'react';
import SearchWithSuggestions from './SearchWithSuggestions';
import ProjectList from './ProjectList';
import ConversationHistory from './ConversationHistory';
import UserProfile from './UserProfile';

const Sidebar = () => {
  return (
    <aside className="w-64 md:w-80 lg:w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shrink-0">
      <SearchWithSuggestions />
      <div className="flex-grow overflow-y-auto">
        <ProjectList />
        <ConversationHistory />
      </div>
      <UserProfile />
    </aside>
  );
};

export default Sidebar;