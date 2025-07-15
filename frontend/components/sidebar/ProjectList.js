// frontend/components/sidebar/ProjectList.js
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, ChevronRight, ChevronDown, Check, X, Edit, Trash2 } from 'react-feather';
import { FolderPlusIcon, PlusIcon } from '@heroicons/react/24/outline';

const ProjectList = ({ 
  projects = [], 
  activeProjectId, 
  activeProjectChatId,
  onProjectAction = {},
  onSwitchToProjectChat,
  onContextMenu
}) => {
  const [isSectionOpen, setIsSectionOpen] = useState(true);
  const [openProjects, setOpenProjects] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editingChildId, setEditingChildId] = useState(null);
  const [editName, setEditName] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const inputRef = useRef(null);

  // Initialize open state for projects with content
  useEffect(() => {
    const initialOpenState = {};
    projects.forEach(project => {
      if (project.children && project.children.length > 0) {
        initialOpenState[project.id] = true;
      }
    });
    setOpenProjects(initialOpenState);
  }, []);

  // Open the project containing the active chat
  useEffect(() => {
    if (activeProjectId) {
      setOpenProjects(prev => ({
        ...prev,
        [activeProjectId]: true
      }));
    }
  }, [activeProjectId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
        if (e.key === 'Delete') {
            if (selectedId && onProjectAction.deleteProject) {
                onProjectAction.deleteProject(selectedId);
                setSelectedId(null);
            } else if (selectedChildId && onProjectAction.deleteChat) {
                onProjectAction.deleteChat(selectedChildId);
                setSelectedChildId(null);
            }
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedId, selectedChildId, onProjectAction]);

  const toggleProject = (projectId, e) => {
    e.stopPropagation();
    setOpenProjects(prev => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  const handleAddProject = () => {
    if (onProjectAction.addProject) {
      onProjectAction.addProject();
    }
  };

  const handleAddChat = (projectId) => {
    if (onProjectAction.addChat) {
      onProjectAction.addChat(projectId);
    }
  };

  // Start renaming a project
  const handleStartRenameProject = (project, e) => {
    if(e) e.stopPropagation();
    setEditingId(project.id);
    setEditName(project.name);
  };

  // Start renaming a chat
  const handleStartRenameChat = (chat, e) => {
    if(e) e.stopPropagation();
    setEditingChildId(chat.id);
    setEditName(chat.name);
  };

  // Save the new name
  const handleSaveName = (e) => {
    e.preventDefault();
    
    if (editName.trim()) {
      if (editingId && onProjectAction.renameProject) {
        onProjectAction.renameProject(editingId, editName.trim());
      } else if (editingChildId && onProjectAction.renameChat) {
        onProjectAction.renameChat(editingChildId, editName.trim());
      }
    }
    
    setEditingId(null);
    setEditingChildId(null);
  };

  // Cancel renaming
  const handleCancelRename = () => {
    setEditingId(null);
    setEditingChildId(null);
  };

  // Focus input when editing starts
  useEffect(() => {
    if ((editingId || editingChildId) && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId, editingChildId]);

  const handleProjectContextMenu = (e, project) => {
    e.preventDefault();
    e.stopPropagation();
    const items = [
        { label: 'Rename', icon: <Edit size={14} />, action: () => handleStartRenameProject(project) },
        { separator: true },
        { label: 'Delete', icon: <Trash2 size={14} />, action: () => onProjectAction.deleteProject && onProjectAction.deleteProject(project.id) },
    ];
    onContextMenu(e, items);
  };

  const handleChatContextMenu = (e, chat) => {
    e.preventDefault();
    e.stopPropagation();
    const items = [
        { label: 'Rename', icon: <Edit size={14} />, action: () => handleStartRenameChat(chat) },
        { separator: true },
        { label: 'Delete', icon: <Trash2 size={14} />, action: () => onProjectAction.deleteChat && onProjectAction.deleteChat(chat.id) },
    ];
    onContextMenu(e, items);
  };

  if (projects.length === 0) return null;

  return (
    <div className="mt-2">
      <div className="px-4 py-2">
        <button
          onClick={() => setIsSectionOpen(!isSectionOpen)}
          className="w-full flex items-center justify-between text-sm font-medium p-1 hover:bg-[var(--bg-tertiary)] rounded-md transition-colors text-[var(--text-secondary)]"
        >
          <span>Projects</span>
          {isSectionOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {isSectionOpen && (
        <div className="mt-1">
          <button
            onClick={handleAddProject}
            className="flex items-center justify-between w-full text-sm px-4 py-2 hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-primary)]"
          >
            <div className="flex items-center">
              <FolderPlusIcon className="h-4 w-4 mr-2" />
              <span>New project</span>
            </div>
          </button>

          <div className="mt-1">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className={`my-1 rounded-md ${selectedId === project.id ? 'bg-[var(--bg-tertiary)]' : ''}`}
                onClick={() => {setSelectedId(project.id); setSelectedChildId(null);}}
                onContextMenu={(e) => handleProjectContextMenu(e, project)}
              >
                {/* Project title row */}
                <div className="flex items-center">
                  {editingId === project.id ? (
                    // Editing project name
                    <form onSubmit={handleSaveName} className="px-2 py-1 flex items-center w-full bg-[var(--bg-tertiary)] rounded-md">
                      <button
                        type="button"
                        onClick={(e) => toggleProject(project.id, e)}
                        className="mr-1 p-1 hover:bg-[var(--bg-secondary)] rounded transition-colors flex-shrink-0 text-[var(--text-secondary)]"
                      >
                        {openProjects[project.id] ? (
                          <ChevronDown size={14} />
                        ) : (
                          <ChevronRight size={14} />
                        )}
                      </button>
                      <input
                        ref={inputRef}
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-grow text-sm bg-[var(--bg-tertiary)] p-1 rounded focus:ring-1 focus:ring-primary-500 focus:outline-none text-[var(--text-primary)]"
                      />
                      <button 
                        type="submit"
                        className="ml-1 p-1 hover:bg-[var(--bg-secondary)] rounded-md transition-colors text-primary-500"
                        title="Save"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelRename}
                        className="p-1 hover:bg-[var(--bg-secondary)] rounded-md transition-colors text-[var(--text-secondary)]"
                        title="Cancel"
                      >
                        <X size={14} />
                      </button>
                    </form>
                  ) : (
                    // Normal project display
                    <div className="flex items-center justify-between w-full group">
                      <button 
                        onClick={() => {
                          if (project.children && project.children.length > 0) {
                            onSwitchToProjectChat(project.id, project.children[0].id);
                          }
                        }}
                        onDoubleClick={(e) => handleStartRenameProject(project, e)}
                        className={`flex items-center flex-grow px-4 py-1 text-sm hover:bg-[var(--bg-tertiary)] transition-colors rounded-md ${activeProjectId === project.id ? 'font-medium text-primary-500' : 'text-[var(--text-primary)]'}`}
                      >
                        <span 
                          onClick={(e) => toggleProject(project.id, e)}
                          className="mr-1"
                        >
                          {openProjects[project.id] ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronRight size={14} />
                          )}
                        </span>
                        <span className="truncate">{project.name}</span>
                      </button>

                      <button
                        onClick={() => handleAddChat(project.id)}
                        className="p-1 mr-2 hover:bg-[var(--bg-tertiary)] rounded transition-colors text-primary-500 hover:text-primary-700"
                        title="Add chat to project"
                      >
                        <PlusIcon className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Project children (chats) - sorted by date (newest first) */}
                {openProjects[project.id] && project.children && project.children.length > 0 && (
                  <ul className="ml-6 mt-1">
                    {[...project.children]
                      .sort((a, b) => {
                        // Sort by date in descending order (newest first)
                        const dateA = new Date(a.updatedAt || a.createdAt || 0);
                        const dateB = new Date(b.updatedAt || b.createdAt || 0);
                        return dateB - dateA;
                      })
                      .map((chat) => (
                      <li 
                        key={chat.id}
                        className={`rounded-md ${selectedChildId === chat.id ? 'bg-[var(--bg-tertiary)]' : ''}`}
                        onClick={(e) => {e.stopPropagation(); setSelectedId(null); setSelectedChildId(chat.id);}}
                        onContextMenu={(e) => handleChatContextMenu(e, chat)}
                      >
                        {editingChildId === chat.id ? (
                          // Editing chat name
                          <form onSubmit={handleSaveName} className="px-4 py-1 flex items-center">
                            <MessageSquare size={16} className="mr-2 flex-shrink-0 text-[var(--text-secondary)]" />
                            <input
                              ref={inputRef}
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="flex-grow text-sm bg-[var(--bg-tertiary)] p-1 rounded focus:ring-1 focus:ring-primary-500 focus:outline-none"
                            />
                            <button 
                              type="submit"
                              className="ml-1 p-1 hover:bg-[var(--bg-tertiary)] rounded-md transition-colors"
                              title="Save"
                            >
                              <Check size={14} className="text-primary-500" />
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelRename}
                              className="p-1 hover:bg-[var(--bg-tertiary)] rounded-md transition-colors"
                              title="Cancel"
                            >
                              <X size={14} />
                            </button>
                          </form>
                        ) : (
                          // Normal chat display
                          <button
                            onClick={() => onSwitchToProjectChat(project.id, chat.id)}
                            onDoubleClick={(e) => handleStartRenameChat(chat, e)}
                            className={`flex items-center w-full px-4 py-2 text-sm rounded-md ${
                              activeProjectId === project.id && activeProjectChatId === chat.id 
                                ? 'list-item-active' 
                                : 'hover:bg-[var(--bg-tertiary)]'
                            } transition-colors`}
                          >
                            <MessageSquare size={16} className="mr-2 flex-shrink-0" />
                            <span className="truncate">{chat.name}</span>
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
