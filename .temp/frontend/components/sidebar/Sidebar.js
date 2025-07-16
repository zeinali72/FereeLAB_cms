// frontend/components/sidebar/Sidebar.js
import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'react-feather';
import SearchWithSuggestions from './SearchWithSuggestions';
import ProjectList from './ProjectList';
import ConversationHistory from './ConversationHistory';
import UserMenuPanel from '../modals/UserMenuPanel';
import ContextMenu from '../shared/ContextMenu';

const Sidebar = ({
  theme,
  setTheme,
  conversations = [],
  activeConversationId,
  onNewConversation,
  onSwitchConversation,
  onRenameConversation,
  onDeleteConversation,
  onAddToProject,
  projects = [],
  activeProjectId,
  activeProjectChatId,
  onProjectAction,
  onSwitchToProjectChat,
}) => {
  const [contextMenu, setContextMenu] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleContextMenu = (e, items) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items: items,
    });
  };
  
  const handleSearchResults = (results, query = '') => {
    if (results && results.length > 0) {
      setFilteredConversations(results);
      setIsSearchActive(true);
      setSearchQuery(query);
    } else {
      setFilteredConversations([]);
      setIsSearchActive(false);
      setSearchQuery('');
    }
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleMenuToggle = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({ top: rect.top, right: window.innerWidth - rect.right });
    }
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="h-full flex flex-col bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] shadow-lg overflow-visible">
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)] flex-shrink-0">
        <h1 className="text-lg font-bold text-[var(--text-primary)]">FereeLAB</h1>
      </div>

      <div className="flex-grow flex flex-col min-h-0 overflow-hidden">
        <div className="p-4 border-b border-[var(--border-primary)]">
          <SearchWithSuggestions 
            conversations={conversations} 
            onSearchResults={handleSearchResults} 
          />
        </div>
        <div className="flex-grow overflow-y-auto custom-scrollbar">
          {!isSearchActive && (
            <ProjectList
              projects={projects}
              activeProjectId={activeProjectId}
              activeProjectChatId={activeProjectChatId}
              onProjectAction={onProjectAction}
              onSwitchToProjectChat={onSwitchToProjectChat}
              onContextMenu={handleContextMenu}
            />
          )}
          <ConversationHistory
            conversations={isSearchActive ? filteredConversations : conversations}
            activeConversationId={activeConversationId}
            onSwitchConversation={onSwitchConversation}
            onRenameConversation={onRenameConversation}
            onDeleteConversation={onDeleteConversation}
            onAddToProject={onAddToProject}
            onNewConversation={onNewConversation}
            onContextMenu={handleContextMenu}
            searchTerm={searchQuery}
            isSearchResult={isSearchActive}
          />
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-t border-[var(--border-primary)] flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold">
                U
              </div>
              <span className="ml-3 font-semibold text-[var(--text-primary)]">User</span>
            </div>
            <div className="relative" ref={menuRef}>
              <button
                ref={buttonRef}
                onClick={handleMenuToggle}
                className="p-1 rounded-full hover:bg-[var(--bg-tertiary)] transition-colors"
                aria-label="Open user menu"
              >
                <MoreVertical size={20} className="text-[var(--text-secondary)]" />
              </button>

              <UserMenuPanel
                isOpen={isMenuOpen}
                position={menuPosition}
                theme={theme}
                setTheme={setTheme}
                onClose={() => setIsMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      </div>
      {contextMenu && (
        <ContextMenu
          items={contextMenu.items}
          position={{ x: contextMenu.x, y: contextMenu.y }}
          onClose={closeContextMenu}
        />
      )}
    </div>
  );
};

export default Sidebar;

