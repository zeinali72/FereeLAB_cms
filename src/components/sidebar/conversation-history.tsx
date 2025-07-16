"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, ChevronDown, ChevronRight, Check, X, Edit, Trash2, Plus, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContextMenu, ContextMenuItem } from '@/components/shared/context-menu';
import { DeleteConfirmationModal } from '@/components/modals/delete-confirmation-modal';

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
  messages?: Array<{ text: string }>;
  isDeleted?: boolean;
  deletedAt?: Date;
  isPermanentlyDeleted?: boolean;
}

interface ConversationHistoryProps {
  conversations?: Conversation[];
  activeConversationId?: string | null;
  onNewConversation?: () => void;
  onSwitchConversation?: (id: string) => void;
  onRenameConversation?: (id: string, newTitle: string) => void;
  onDeleteConversation?: (id: string) => void;
  onAddToProject?: (id: string) => void;
  onContextMenu?: (e: React.MouseEvent, conversation: Conversation) => void;
  isSearchResult?: boolean;
  searchTerm?: string;
}

const formatDateGroup = (date: Date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString();
};

// Utility to highlight search term in text
const highlightText = (text: string, searchTerm: string) => {
  if (!searchTerm || typeof text !== 'string') return text;
  
  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
  return parts.map((part, i) => 
    part.toLowerCase() === searchTerm.toLowerCase() ? 
    <span key={i} className="bg-yellow-300 text-black dark:bg-yellow-600 dark:text-white rounded-sm px-0.5">{part}</span> : part
  );
};

export function ConversationHistory({ 
  conversations = [], 
  activeConversationId, 
  onNewConversation, 
  onSwitchConversation,
  onRenameConversation,
  onDeleteConversation,
  onAddToProject,
  onContextMenu,
  isSearchResult = false,
  searchTerm = ''
}: ConversationHistoryProps) {
  const [isSectionOpen, setIsSectionOpen] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [contextMenuConversation, setContextMenuConversation] = useState<Conversation | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle multi-select logic
  const handleConversationClick = (conv: Conversation, index: number, e: React.MouseEvent) => {
    if (editingId === conv.id) return;

    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    const isShift = e.shiftKey;

    if (isCtrlOrCmd) {
      // Ctrl/Cmd + click: toggle selection
      const newSelectedIds = new Set(selectedIds);
      if (newSelectedIds.has(conv.id)) {
        newSelectedIds.delete(conv.id);
      } else {
        newSelectedIds.add(conv.id);
      }
      setSelectedIds(newSelectedIds);
      setIsSelectionMode(newSelectedIds.size > 0);
      setLastSelectedIndex(index);
    } else if (isShift && lastSelectedIndex !== -1 && isSelectionMode) {
      // Shift + click: select range
      const flatConversations = isSearchResult ? conversations : Object.values(groupedConversations).flat();
      const startIndex = Math.min(lastSelectedIndex, index);
      const endIndex = Math.max(lastSelectedIndex, index);
      const newSelectedIds = new Set(selectedIds);
      
      for (let i = startIndex; i <= endIndex; i++) {
        if (flatConversations[i]) {
          newSelectedIds.add(flatConversations[i].id);
        }
      }
      setSelectedIds(newSelectedIds);
    } else if (isSelectionMode && selectedIds.has(conv.id)) {
      // Click on already selected item in selection mode: deselect
      const newSelectedIds = new Set(selectedIds);
      newSelectedIds.delete(conv.id);
      setSelectedIds(newSelectedIds);
      setIsSelectionMode(newSelectedIds.size > 0);
    } else if (isSelectionMode) {
      // Click on unselected item in selection mode: add to selection
      const newSelectedIds = new Set(selectedIds);
      newSelectedIds.add(conv.id);
      setSelectedIds(newSelectedIds);
    } else {
      // Normal click: clear selection and switch conversation
      setSelectedIds(new Set());
      setIsSelectionMode(false);
      onSwitchConversation?.(conv.id);
      setSelectedId(conv.id);
      setLastSelectedIndex(index);
    }
  };

  // Handle context menu
  const handleContextMenu = (e: React.MouseEvent, conv: Conversation) => {
    e.preventDefault();
    
    // If clicked conversation is not selected, select it first
    if (!selectedIds.has(conv.id)) {
      setSelectedIds(new Set([conv.id]));
      setIsSelectionMode(true);
    }
    
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuConversation(conv);
    onContextMenu?.(e, conv);
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    setShowDeleteModal(true);
    setContextMenuPosition(null);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (permanent: boolean) => {
    const selectedConversations = conversations.filter(conv => selectedIds.has(conv.id));
    
    selectedConversations.forEach(conv => {
      if (permanent) {
        // Permanent delete
        onDeleteConversation?.(conv.id);
      } else {
        // Soft delete (move to recycle bin)
        // This would typically update the conversation's deleted status
        // For now, we'll call the delete handler which should implement soft delete logic
        onDeleteConversation?.(conv.id);
      }
    });

    // Clear selection
    setSelectedIds(new Set());
    setIsSelectionMode(false);
    setShowDeleteModal(false);
  };

  // Exit selection mode
  const exitSelectionMode = () => {
    setSelectedIds(new Set());
    setIsSelectionMode(false);
  };

  // Context menu items
  const contextMenuItems: ContextMenuItem[] = [
    {
      label: selectedIds.size > 1 ? `Delete ${selectedIds.size} conversations` : 'Delete conversation',
      icon: <Trash2 className="h-4 w-4" />,
      action: handleBulkDelete
    },
    {
      separator: true
    },
    {
      label: 'Rename',
      icon: <Edit className="h-4 w-4" />,
      action: () => {
        if (contextMenuConversation) {
          handleStartRename(contextMenuConversation);
          setContextMenuPosition(null);
        }
      },
      disabled: selectedIds.size > 1
    }
  ];

  const handleStartRename = (conv: Conversation, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  // Save the new conversation title
  const handleSaveTitle = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTitle.trim() && onRenameConversation && editingId) {
      onRenameConversation(editingId, editTitle.trim());
    }
    setEditingId(null);
  };

  // Cancel renaming
  const handleCancelRename = () => {
    setEditingId(null);
    setEditTitle('');
  };

  // Handle keyboard events for renaming
  const handleKeyDown = (e: React.KeyboardEvent, conv: Conversation) => {
    if (e.key === 'F2') {
      handleStartRename(conv);
    } else if (e.key === 'Escape') {
      handleCancelRename();
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveTitle(e);
    } else if (e.key === 'Delete') {
      if (selectedId && onDeleteConversation) {
        onDeleteConversation(selectedId);
      }
    }
  };

  // Focus input when editing starts
  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  // Handle Escape key and click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (editingId) {
          handleCancelRename();
        } else if (isSelectionMode) {
          exitSelectionMode();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editingId, isSelectionMode]);

  // Group conversations by date
  const groupedConversations = conversations.reduce((groups, conv) => {
    const date = new Date(conv.timestamp);
    const dateKey = formatDateGroup(date);
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(conv);
    return groups;
  }, {} as Record<string, Conversation[]>);

  return (
    <div className="mt-2">
      <div className="px-4 py-2">
        <button
          onClick={() => setIsSectionOpen(!isSectionOpen)}
          className="w-full flex items-center justify-between text-sm font-medium p-1 hover:bg-muted rounded-md transition-colors"
        >
          <span className="text-muted-foreground">Conversations</span>
          {isSectionOpen ? (
            <ChevronDown size={16} className="text-muted-foreground" />
          ) : (
            <ChevronRight size={16} className="text-muted-foreground" />
          )}
        </button>
      </div>

      {isSectionOpen && (
        <div className="mt-1">
          {!isSearchResult && (
            <button
              onClick={onNewConversation}
              className="flex items-center justify-between w-full text-sm px-4 py-2 hover:bg-muted transition-colors text-foreground"
            >
              <div className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                <span>New conversation</span>
              </div>
            </button>
          )}

          <div className="mt-1">
            {isSearchResult ? (
              // Show flat list for search results
              conversations.map((conv, index) => (
                <div
                  key={conv.id}
                  className={cn(
                    "flex items-center w-full text-sm px-4 py-2 hover:bg-muted transition-colors cursor-pointer rounded-md mx-2 relative",
                    conv.id === activeConversationId && "bg-accent text-accent-foreground",
                    selectedIds.has(conv.id) && "bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800"
                  )}
                  onClick={(e) => handleConversationClick(conv, index, e)}
                  onKeyDown={(e) => handleKeyDown(e, conv)}
                  onContextMenu={(e) => handleContextMenu(e, conv)}
                  tabIndex={0}
                >
                  {/* Selection checkbox */}
                  {(isSelectionMode || selectedIds.has(conv.id)) && (
                    <div className="mr-2 flex-shrink-0">
                      <div className={cn(
                        "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
                        selectedIds.has(conv.id) 
                          ? "bg-blue-500 border-blue-500 text-white" 
                          : "border-muted-foreground/30 hover:border-blue-400"
                      )}>
                        {selectedIds.has(conv.id) && <CheckCircle className="h-3 w-3" />}
                      </div>
                    </div>
                  )}
                  
                  <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {highlightText(conv.title, searchTerm)}
                    </div>
                    {conv.messages && conv.messages.length > 0 && (
                      <div className="text-xs text-muted-foreground truncate">
                        {highlightText(conv.messages[conv.messages.length - 1]?.text || '', searchTerm)}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              // Show grouped list for regular view
              Object.entries(groupedConversations).map(([dateGroup, convs]) => {
                const previousGroups = Object.entries(groupedConversations).slice(0, Object.keys(groupedConversations).indexOf(dateGroup));
                const baseIndex = previousGroups.reduce((acc, [, groupConvs]) => acc + groupConvs.length, 0);
                
                return (
                  <div key={dateGroup} className="mb-2">
                    <div className="px-4 py-1 text-xs font-medium text-muted-foreground">
                      {dateGroup}
                    </div>
                    {convs.map((conv, convIndex) => {
                      const globalIndex = baseIndex + convIndex;
                      return (
                        <div
                          key={conv.id}
                          className={cn(
                            "flex items-center w-full text-sm px-4 py-2 hover:bg-muted transition-colors cursor-pointer rounded-md mx-2 relative",
                            conv.id === activeConversationId && "bg-accent text-accent-foreground",
                            selectedIds.has(conv.id) && "bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800"
                          )}
                          onClick={(e) => {
                            if (editingId !== conv.id) {
                              handleConversationClick(conv, globalIndex, e);
                            }
                          }}
                          onKeyDown={(e) => handleKeyDown(e, conv)}
                          onContextMenu={(e) => handleContextMenu(e, conv)}
                          tabIndex={0}
                        >
                          {/* Selection checkbox */}
                          {(isSelectionMode || selectedIds.has(conv.id)) && (
                            <div className="mr-2 flex-shrink-0">
                              <div className={cn(
                                "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
                                selectedIds.has(conv.id) 
                                  ? "bg-blue-500 border-blue-500 text-white" 
                                  : "border-muted-foreground/30 hover:border-blue-400"
                              )}>
                                {selectedIds.has(conv.id) && <CheckCircle className="h-3 w-3" />}
                              </div>
                            </div>
                          )}
                          
                          <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            {editingId === conv.id ? (
                              <form onSubmit={handleSaveTitle} className="flex items-center space-x-1">
                                <input
                                  ref={inputRef}
                                  type="text"
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  className="flex-1 bg-background border border-border rounded px-1 py-0.5 text-sm"
                                  onBlur={handleSaveTitle}
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
                                onDoubleClick={(e) => handleStartRename(conv, e)}
                              >
                                {conv.title}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Context Menu */}
      <ContextMenu
        items={contextMenuItems}
        position={contextMenuPosition}
        onClose={() => setContextMenuPosition(null)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        selectedCount={selectedIds.size}
        conversationTitles={conversations
          .filter(conv => selectedIds.has(conv.id))
          .map(conv => conv.title)
        }
      />

      {/* Selection mode indicator */}
      {isSelectionMode && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 z-40">
          <span className="text-sm font-medium">
            {selectedIds.size} selected
          </span>
          <button
            onClick={exitSelectionMode}
            className="text-white hover:text-blue-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
