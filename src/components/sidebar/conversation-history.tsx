"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, ChevronDown, ChevronRight, Check, X, Edit, Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
  messages?: Array<{ text: string }>;
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
  const inputRef = useRef<HTMLInputElement>(null);

  // Start renaming a conversation
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
      console.log('Renamed conversation to:', editTitle.trim());
    }
    setEditingId(null);
  };

  // Cancel renaming
  const handleCancelRename = () => {
    console.log('Cancelled renaming conversation');
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
      if (e.key === 'Escape' && editingId) {
        handleCancelRename();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editingId]);

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
          onClick={() => {
            setIsSectionOpen(!isSectionOpen);
            console.log('Toggled conversations section:', !isSectionOpen ? 'opened' : 'closed');
          }}
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
              onClick={() => {
                onNewConversation?.();
                console.log('New conversation button clicked from history');
              }}
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
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={cn(
                    "flex items-center w-full text-sm px-4 py-2 hover:bg-muted transition-colors cursor-pointer rounded-md mx-2",
                    conv.id === activeConversationId && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => {
                    onSwitchConversation?.(conv.id);
                    console.log('Switched to conversation:', conv.title);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, conv)}
                  onContextMenu={(e) => onContextMenu?.(e, conv)}
                  tabIndex={0}
                >
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
              Object.entries(groupedConversations).map(([dateGroup, convs]) => (
                <div key={dateGroup} className="mb-2">
                  <div className="px-4 py-1 text-xs font-medium text-muted-foreground">
                    {dateGroup}
                  </div>
                  {convs.map((conv) => (
                    <div
                      key={conv.id}
                      className={cn(
                        "flex items-center w-full text-sm px-4 py-2 hover:bg-muted transition-colors cursor-pointer rounded-md mx-2",
                        conv.id === activeConversationId && "bg-accent text-accent-foreground"
                      )}
                      onClick={() => {
                        if (editingId !== conv.id) {
                          onSwitchConversation?.(conv.id);
                          setSelectedId(conv.id);
                          console.log('Switched to conversation:', conv.title);
                        }
                      }}
                      onKeyDown={(e) => handleKeyDown(e, conv)}
                      onContextMenu={(e) => onContextMenu?.(e, conv)}
                      tabIndex={0}
                    >
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
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
