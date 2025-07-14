import React from 'react';
import { ChevronsLeft } from 'react-feather';
import SearchWithSuggestions from './SearchWithSuggestions';
import ProjectList from './ProjectList';
import ConversationHistory from './ConversationHistory';
import UserProfile from './UserProfile';

// Accept and pass down conversation and project-related props
const Sidebar = ({ 
  isOpen, 
  onToggle, 
  theme, 
  setTheme, 
  width, 
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
    <div className="h-full flex flex-col overflow-hidden sidebar">
      <div
        className={`flex items-center justify-between p-4 border-b flex-shrink-0 transition-opacity duration-200 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h1 className="text-lg font-bold">FereeLAB</h1>
        <button
          onClick={onToggle}
          className="p-1 rounded-md hover:bg-surface-secondary"
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
        <UserProfile theme={theme} setTheme={setTheme} />
      </div>
    </div>
  );
};

export default Sidebar;