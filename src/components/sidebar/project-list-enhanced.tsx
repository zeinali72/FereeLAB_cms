"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, ChevronRight, ChevronDown, Check, X, Edit, Trash2, Folder, FolderPlus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Project {
  id: string;
  name: string;
  children?: ProjectChat[];
}

interface ProjectChat {
  id: string;
  name: string;
  projectId: string;
  messages?: Array<{ text: string }>;
}

interface ProjectListProps {
  projects?: Project[];
  activeProjectId?: string | null;
  activeProjectChatId?: string | null;
  onProjectAction?: {
    addProject?: () => void;
    addChat?: (projectId: string) => void;
    renameProject?: (projectId: string, newName: string) => void;
    renameChat?: (chatId: string, newName: string) => void;
    deleteProject?: (projectId: string) => void;
    deleteChat?: (chatId: string) => void;
  };
  onSwitchToProjectChat?: (projectId: string, chatId: string) => void;
  onContextMenu?: (e: React.MouseEvent, item: Project | ProjectChat, type: 'project' | 'chat') => void;
}

export function ProjectList({ 
  projects = [], 
  activeProjectId, 
  activeProjectChatId,
  onProjectAction = {},
  onSwitchToProjectChat,
  onContextMenu
}: ProjectListProps) {
  const [isSectionOpen, setIsSectionOpen] = useState(true);
  const [openProjects, setOpenProjects] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingChildId, setEditingChildId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize open state for projects with content
  useEffect(() => {
    const initialOpenState: Record<string, boolean> = {};
    projects.forEach(project => {
      if (project.children && project.children.length > 0) {
        initialOpenState[project.id] = true;
      }
    });
    setOpenProjects(initialOpenState);
  }, [projects]);

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
    const handleKeyDown = (e: KeyboardEvent) => {
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

  const toggleProject = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenProjects(prev => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  const handleAddProject = () => {
    if (onProjectAction.addProject) {
      onProjectAction.addProject();
    }
  };

  const handleAddChat = (projectId: string) => {
    if (onProjectAction.addChat) {
      onProjectAction.addChat(projectId);
    }
  };

  // Start renaming a project
  const handleStartRenameProject = (project: Project, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingId(project.id);
    setEditName(project.name);
  };

  // Start renaming a chat
  const handleStartRenameChat = (chat: ProjectChat, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingChildId(chat.id);
    setEditName(chat.name);
  };

  // Save the new name
  const handleSaveName = (e: React.FormEvent) => {
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
    setEditName('');
  };

  // Cancel renaming
  const handleCancelRename = () => {
    setEditingId(null);
    setEditingChildId(null);
    setEditName('');
  };

  // Focus input when editing starts
  useEffect(() => {
    if ((editingId || editingChildId) && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId, editingChildId]);

  return (
    <div className="mt-2">
      <div className="px-4 py-2">
        <button
          onClick={() => setIsSectionOpen(!isSectionOpen)}
          className="w-full flex items-center justify-between text-sm font-medium p-1 hover:bg-muted rounded-md transition-colors"
        >
          <span className="text-muted-foreground">Projects</span>
          {isSectionOpen ? (
            <ChevronDown size={16} className="text-muted-foreground" />
          ) : (
            <ChevronRight size={16} className="text-muted-foreground" />
          )}
        </button>
      </div>

      {isSectionOpen && (
        <div className="mt-1">
          <button
            onClick={handleAddProject}
            className="flex items-center justify-between w-full text-sm px-4 py-2 hover:bg-muted transition-colors text-foreground"
          >
            <div className="flex items-center">
              <FolderPlus className="h-4 w-4 mr-2" />
              <span>New project</span>
            </div>
          </button>

          <div className="mt-1">
            {projects.map((project) => (
              <div key={project.id} className="mb-1">
                <div
                  className={cn(
                    "flex items-center w-full text-sm px-4 py-2 hover:bg-muted transition-colors cursor-pointer rounded-md mx-2",
                    project.id === activeProjectId && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => {
                    setSelectedId(project.id);
                    setSelectedChildId(null);
                  }}
                  onContextMenu={(e) => onContextMenu?.(e, project, 'project')}
                >
                  <button
                    onClick={(e) => toggleProject(project.id, e)}
                    className="p-0.5 hover:bg-muted rounded mr-1"
                  >
                    {openProjects[project.id] ? (
                      <ChevronDown size={14} className="text-muted-foreground" />
                    ) : (
                      <ChevronRight size={14} className="text-muted-foreground" />
                    )}
                  </button>
                  
                  <Folder className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    {editingId === project.id ? (
                      <form onSubmit={handleSaveName} className="flex items-center space-x-1">
                        <input
                          ref={inputRef}
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 bg-background border border-border rounded px-1 py-0.5 text-sm"
                          onBlur={handleSaveName}
                        />
                        <button
                          type="submit"
                          className="p-0.5 hover:bg-muted rounded text-green-600"
                        >
                          <Check size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelRename}
                          className="p-0.5 hover:bg-muted rounded text-red-600"
                        >
                          <X size={12} />
                        </button>
                      </form>
                    ) : (
                      <div
                        className="font-medium truncate"
                        onDoubleClick={(e) => handleStartRenameProject(project, e)}
                      >
                        {project.name}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddChat(project.id);
                    }}
                    className="p-1 hover:bg-muted rounded text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Add chat"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* Project Chats */}
                {openProjects[project.id] && project.children && (
                  <div className="ml-6 border-l border-border pl-2">
                    {project.children.map((chat) => (
                      <div
                        key={chat.id}
                        className={cn(
                          "flex items-center w-full text-sm px-3 py-1.5 hover:bg-muted transition-colors cursor-pointer rounded-md mx-1",
                          chat.id === activeProjectChatId && "bg-accent text-accent-foreground"
                        )}
                        onClick={() => {
                          onSwitchToProjectChat?.(project.id, chat.id);
                          setSelectedChildId(chat.id);
                          setSelectedId(null);
                        }}
                        onContextMenu={(e) => onContextMenu?.(e, chat, 'chat')}
                      >
                        <MessageSquare className="h-3.5 w-3.5 mr-2 text-muted-foreground flex-shrink-0" />
                        
                        <div className="flex-1 min-w-0">
                          {editingChildId === chat.id ? (
                            <form onSubmit={handleSaveName} className="flex items-center space-x-1">
                              <input
                                ref={inputRef}
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="flex-1 bg-background border border-border rounded px-1 py-0.5 text-xs"
                                onBlur={handleSaveName}
                              />
                              <button
                                type="submit"
                                className="p-0.5 hover:bg-muted rounded text-green-600"
                              >
                                <Check size={10} />
                              </button>
                              <button
                                type="button"
                                onClick={handleCancelRename}
                                className="p-0.5 hover:bg-muted rounded text-red-600"
                              >
                                <X size={10} />
                              </button>
                            </form>
                          ) : (
                            <div
                              className="text-sm truncate"
                              onDoubleClick={(e) => handleStartRenameChat(chat, e)}
                            >
                              {chat.name}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
