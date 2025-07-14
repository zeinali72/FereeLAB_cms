import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'react-feather';
import SearchWithSuggestions from './SearchWithSuggestions';
import ProjectList from './ProjectList';
import ConversationHistory from './ConversationHistory';
import UserMenuPanel from '../modals/UserMenuPanel';

// Accept and pass down conversation and project-related props
const Sidebar = ({
  isOpen,
  onToggle,
  theme,
  setTheme,
  conversations = [],
  activeConversationId,
  onNewConversation,
  onSwitchConversation,
  onRenameConversation,
  projects = [],
  activeProjectId,
  activeProjectChatId,
  onProjectAction,
  onSwitchToProjectChat
}) => {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg overflow-visible">
      <div
        className={`flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0`}
      >
        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">FereeLAB</h1>
      </div>

      <div
        className={`flex-grow flex flex-col min-h-0 overflow-hidden`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <SearchWithSuggestions />
        </div>
        <div className="flex-grow overflow-y-auto custom-scrollbar">
          <ProjectList
            projects={projects}
            activeProjectId={activeProjectId}
            activeProjectChatId={activeProjectChatId}
            onProjectAction={onProjectAction}
            onSwitchToProjectChat={onSwitchToProjectChat}
          />
          <ConversationHistory
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSwitchConversation={onSwitchConversation}
            onRenameConversation={onRenameConversation}
            onNewConversation={onNewConversation}
          />
        </div>

        {/* User Profile Section */}
        <UserProfileSection theme={theme} setTheme={setTheme} />
      </div>
    </div>
  );
};

// New User Profile section component
const UserProfileSection = ({ theme, setTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0" ref={menuRef}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
            U
          </div>
          <span className="ml-3 font-semibold text-gray-800 dark:text-gray-200">User</span>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Open user menu"
          >
            <MoreVertical size={20} className="text-gray-600 dark:text-gray-400" />
          </button>

          <UserMenuPanel
            isOpen={isMenuOpen}
            theme={theme}
            setTheme={setTheme}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
