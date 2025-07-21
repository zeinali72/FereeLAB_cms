"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, ChevronRight, ChevronDown, Check, X, Edit, Trash2, FolderPlus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContextMenu, ContextMenuItem } from '@/components/shared/context-menu';
import { Project, Chat } from '@/hooks/use-panels';

interface ProjectActionsProps {
  addProject?: () => void;
  addChat?: (projectId: string) => void;
  renameProject?: (projectId: string, newName: string) => void;
  renameChat?: (chatId: string, newName: string) => void;
  deleteProject?: (projectId: string) => void;
  deleteChat?: (chatId: string) => void;
}

interface ProjectListProps {
  projects?: Project[];
  activeProjectId?: string;
  activeProjectChatId?: string;
  onProjectAction?: ProjectActionsProps;
  onSwitchToProjectChat?: (projectId: string, chatId: string) => void;
}

export function ProjectList({ 
  projects = [], 
  activeProjectId, 
  activeProjectChatId,
  onProjectAction = {},
  onSwitchToProjectChat
}: ProjectListProps) {
  const [isSectionOpen, setIsSectionOpen] = useState(true);
  const [openProjects, setOpenProjects] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingChildId, setEditingChildId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    position: { x: number; y: number };
    items: ContextMenuItem[];
  } | null>(null);
  
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
  const handleStartRenameChat = (chat: Chat, e?: React.MouseEvent) => {
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

  const handleProjectContextMenu = (e: React.MouseEvent, project: Project) => {
    e.preventDefault();
    e.stopPropagation();
    const items: ContextMenuItem[] = [
      { label: 'Rename', icon: <Edit size={14} />, action: () => handleStartRenameProject(project) },
      { separator: true },
      { label: 'Delete', icon: <Trash2 size={14} />, action: () => onProjectAction.deleteProject && onProjectAction.deleteProject(project.id) },
    ];
    setContextMenu({
      position: { x: e.clientX, y: e.clientY },
      items
    });
  };

  const handleChatContextMenu = (e: React.MouseEvent, chat: Chat) => {
    e.preventDefault();
    e.stopPropagation();
    const items: ContextMenuItem[] = [
      { label: 'Rename', icon: <Edit size={14} />, action: () => handleStartRenameChat(chat) },
      { separator: true },
      { label: 'Delete', icon: <Trash2 size={14} />, action: () => onProjectAction.deleteChat && onProjectAction.deleteChat(chat.id) },
    ];
    setContextMenu({
      position: { x: e.clientX, y: e.clientY },
      items
    });
  };

  if (projects.length === 0) return null;

  return (
    <div className="mt-2">
      <div className="px-4 py-2">
        <button
          onClick={() => setIsSectionOpen(!isSectionOpen)}
          className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>Projects</span>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddProject();
              }}
              className="p-1 rounded hover:bg-accent transition-colors"
              title="Add Project"
            >
              <FolderPlus size={14} />
            </button>
            <ChevronDown 
              size={16} 
              className={cn(
                "transition-transform",
                isSectionOpen ? "rotate-0" : "-rotate-90"
              )}
            />
          </div>
        </button>
      </div>

      {isSectionOpen && (
        <div className="space-y-1">
          {projects.map((project) => (
            <div key={project.id} className="px-2">
              <div
                className={cn(
                  "flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer group",
                  activeProjectId === project.id && !activeProjectChatId 
                    ? "bg-accent text-accent-foreground" 
                    : "hover:bg-accent/50"
                )}
                onClick={() => setSelectedId(project.id)}
                onContextMenu={(e) => handleProjectContextMenu(e, project)}
              >
                <div className="flex items-center flex-1 min-w-0">
                  {project.children && project.children.length > 0 && (
                    <button
                      onClick={(e) => toggleProject(project.id, e)}
                      className="mr-1 p-0.5 rounded hover:bg-background/80 transition-colors"
                    >
                      <ChevronRight 
                        size={12} 
                        className={cn(
                          "transition-transform",
                          openProjects[project.id] ? "rotate-90" : "rotate-0"
                        )}
                      />
                    </button>
                  )}
                  
                  {editingId === project.id ? (
                    <form onSubmit={handleSaveName} className="flex items-center gap-1 flex-1">
                      <input
                        ref={inputRef}
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 bg-background border border rounded px-1 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        onBlur={handleCancelRename}
                      />
                      <button type="submit" className="p-0.5 hover:bg-background/80 rounded">
                        <Check size={10} />
                      </button>
                      <button type="button" onClick={handleCancelRename} className="p-0.5 hover:bg-background/80 rounded">
                        <X size={10} />
                      </button>
                    </form>
                  ) : (
                    <span 
                      className="text-sm truncate flex-1"
                      onDoubleClick={(e) => handleStartRenameProject(project, e)}
                    >
                      {project.name}
                    </span>
                  )}
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddChat(project.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-background/80 transition-all"
                  title="Add Chat"
                >
                  <Plus size={12} />
                </button>
              </div>

              {/* Project Children */}
              {openProjects[project.id] && project.children && (
                <div className="ml-4 mt-1 space-y-1">
                  {project.children.map((chat) => (
                    <div
                      key={chat.id}
                      className={cn(
                        "flex items-center px-2 py-1.5 rounded-md cursor-pointer group",
                        activeProjectChatId === chat.id 
                          ? "bg-accent text-accent-foreground" 
                          : "hover:bg-accent/50"
                      )}
                      onClick={() => {
                        setSelectedChildId(chat.id);
                        if (onSwitchToProjectChat) {
                          onSwitchToProjectChat(project.id, chat.id);
                        }
                      }}
                      onContextMenu={(e) => handleChatContextMenu(e, chat)}
                    >
                      <MessageSquare size={14} className="mr-2 text-muted-foreground flex-shrink-0" />
                      
                      {editingChildId === chat.id ? (
                        <form onSubmit={handleSaveName} className="flex items-center gap-1 flex-1">
                          <input
                            ref={inputRef}
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="flex-1 bg-background border border rounded px-1 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            onBlur={handleCancelRename}
                          />
                          <button type="submit" className="p-0.5 hover:bg-background/80 rounded">
                            <Check size={10} />
                          </button>
                          <button type="button" onClick={handleCancelRename} className="p-0.5 hover:bg-background/80 rounded">
                            <X size={10} />
                          </button>
                        </form>
                      ) : (
                        <span 
                          className="text-sm truncate flex-1"
                          onDoubleClick={(e) => handleStartRenameChat(chat, e)}
                        >
                          {chat.name}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          items={contextMenu.items}
          position={contextMenu.position}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
