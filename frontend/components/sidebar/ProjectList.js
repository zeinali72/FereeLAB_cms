// frontend/components/sidebar/ProjectList.js
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, ChevronRight, ChevronDown, Check, X } from 'react-feather';
import { FolderPlusIcon, PlusIcon } from '@heroicons/react/24/outline';

const ProjectList = ({ 
  projects = [], 
  activeProjectId, 
  activeProjectChatId,
  onProjectAction = {},
  onSwitchToProjectChat 
}) => {
  const [isSectionOpen, setIsSectionOpen] = useState(true);
  const [openProjects, setOpenProjects] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editingChildId, setEditingChildId] = useState(null);
  const [editName, setEditName] = useState('');
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

  const toggleProject = (projectId, e) => {
    e.stopPropagation();
    setOpenProjects(prev => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  const handleAddProject = () => {
    if (onProjectAction.addProject) {
      onProjectAction.addProject();
    }
  };

  const handleAddChat = (projectId, e) => {
    e.stopPropagation();
    if (onProjectAction.addChat) {
      onProjectAction.addChat(projectId);
    }
  };

  // Start renaming a project
  const handleStartRenameProject = (project, e) => {
    e.stopPropagation();
    setEditingId(project.id);
    setEditName(project.name);
  };

  // Start renaming a chat
  const handleStartRenameChat = (chat, e) => {
    e.stopPropagation();
    setEditingChildId(chat.id);
    setEditName(chat.name);
  };

  // Save the new project name
  const handleSaveProjectName = (e) => {
    e.preventDefault();
    if (editName.trim() && onProjectAction.renameProject) {
      onProjectAction.renameProject(editingId, editName.trim());
    }
    setEditingId(null);
  };

  // Save the new chat name
  const handleSaveChatName = (e, projectId) => {
    e.preventDefault();
    if (editName.trim() && onProjectAction.renameChat) {
      onProjectAction.renameChat(projectId, editingChildId, editName.trim());
    }
    setEditingChildId(null);
  };

  // Cancel renaming
  const handleCancelRename = () => {
    setEditingId(null);
    setEditingChildId(null);
  };

  // Handle keyboard events for renaming
  const handleKeyDown = (e, item, projectId) => {
    if (e.key === 'F2') {
      e.preventDefault();
      if (item.type === 'chat') {
        handleStartRenameChat(item, e);
      } else {
        handleStartRenameProject(item, e);
      }
    }
  };

  // Handle switching to a project chat
  const handleSwitchChat = (projectId, chatId, e) => {
    e.preventDefault();
    if (onSwitchToProjectChat) {
      onSwitchToProjectChat(projectId, chatId);
    }
  };

  // Focus the input when editing starts
  useEffect(() => {
    if ((editingId || editingChildId) && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId, editingChildId]);

  // Handle clicks outside the editing field
  useEffect(() => {
    function handleClickOutside(event) {
      if ((editingId || editingChildId) && inputRef.current && !inputRef.current.contains(event.target)) {
        handleCancelRename();
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingId, editingChildId]);

  return (
    <div className="p-4 flex-shrink-0">
      <div className="flex items-center justify-between cursor-pointer">
        <div onClick={() => setIsSectionOpen(!isSectionOpen)} className="flex items-center flex-grow">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Project Folders
            </h2>
            {isSectionOpen ? <ChevronDown size={20} className="ml-2 text-gray-400" /> : <ChevronRight size={20} className="ml-2 text-gray-400" />}
        </div>
        <button onClick={handleAddProject} className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200" aria-label="Add new folder">
            <FolderPlusIcon className="h-6 w-6" />
        </button>
      </div>
      {isSectionOpen && (
        <div className="mt-2 space-y-1 overflow-y-auto max-h-48">
          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                {editingId === project.id ? (
                  <form onSubmit={handleSaveProjectName} className="flex items-center w-full p-1 rounded-lg bg-gray-200 dark:bg-gray-700 ml-5">
                    <input
                      ref={inputRef}
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-gray-900 dark:text-white text-sm"
                    />
                    <button 
                      type="submit"
                      className="p-1 text-green-500 hover:text-green-600"
                      title="Save"
                    >
                      <Check size={14} />
                    </button>
                    <button 
                      type="button"
                      onClick={handleCancelRename}
                      className="p-1 text-red-500 hover:text-red-600 mr-1"
                      title="Cancel"
                    >
                      <X size={14} />
                    </button>
                  </form>
                ) : (
                  <div
                    className={`flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer
                      ${activeProjectId === project.id ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                    tabIndex={0}
                    onDoubleClick={(e) => handleStartRenameProject(project, e)}
                    onKeyDown={(e) => handleKeyDown(e, project)}
                  >
                    <button onClick={(e) => toggleProject(project.id, e)}>
                      {openProjects[project.id] ? <ChevronDown size={16} className="mr-1" /> : <ChevronRight size={16} className="mr-1" />}
                    </button>
                    <MessageSquare size={18} className={`${activeProjectId === project.id ? 'text-blue-500' : 'text-gray-500'}`} />
                    <span className="ml-3 flex-1 whitespace-nowrap">{project.name}</span>
                    <button 
                      onClick={(e) => handleAddChat(project.id, e)} 
                      className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      title="Add new chat"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
                {openProjects[project.id] && (
                  <ul className="pl-8 mt-1 space-y-1">
                    {project.children.map(child => (
                      <li key={child.id}>
                        {editingChildId === child.id ? (
                          <form onSubmit={(e) => handleSaveChatName(e, project.id)} className="flex items-center w-full p-1 rounded-lg bg-gray-200 dark:bg-gray-700">
                            <input
                              ref={inputRef}
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-gray-900 dark:text-white text-xs"
                            />
                            <button 
                              type="submit"
                              className="p-1 text-green-500 hover:text-green-600"
                              title="Save"
                            >
                              <Check size={12} />
                            </button>
                            <button 
                              type="button"
                              onClick={handleCancelRename}
                              className="p-1 text-red-500 hover:text-red-600 mr-1"
                              title="Cancel"
                            >
                              <X size={12} />
                            </button>
                          </form>
                        ) : (
                          <button 
                            className={`flex items-center w-full p-2 text-sm font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700
                              ${activeProjectId === project.id && activeProjectChatId === child.id ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                            onDoubleClick={(e) => handleStartRenameChat(child, e)}
                            onKeyDown={(e) => handleKeyDown(e, child, project.id)}
                            onClick={(e) => handleSwitchChat(project.id, child.id, e)}
                            tabIndex={0}
                          >
                            <MessageSquare 
                              size={14} 
                              className={`${activeProjectId === project.id && activeProjectChatId === child.id ? 'text-blue-500' : 'text-gray-400'}`} 
                            />
                            <span className="ml-3 flex-1 text-left">{child.name}</span>
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProjectList;