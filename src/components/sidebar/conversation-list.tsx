"use client";

import { MessageSquare, MoreVertical, Trash, Edit, ChevronDown, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedIcon } from "../ui/animated-icon";
import { useChatManager } from "@/hooks/useChatManager";

// Context menu component
interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onRename: () => void;
  onDelete: () => void;
}

function ContextMenu({ x, y, onClose, onRename, onDelete }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.1 }}
      className="fixed bg-card border border-border rounded-lg shadow-lg py-1 z-50 min-w-[150px]"
      style={{ left: x, top: y }}
    >
      <button
        onClick={onRename}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors text-left"
      >
        <Edit className="w-4 h-4" />
        Rename
      </button>
      <button
        onClick={onDelete}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors text-left text-destructive"
      >
        <Trash className="w-4 h-4" />
        Delete
      </button>
    </motion.div>
  );
}

export default function ConversationList() {
  const {
    conversations,
    currentConversation,
    switchToConversation,
    deleteConversation,
    renameConversation,
  } = useChatManager();
  
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    conversationId: string;
  } | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleContextMenu = (e: React.MouseEvent, conversationId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      conversationId,
    });
  };

  const handleDelete = (conversationId: string) => {
    deleteConversation(conversationId);
    setContextMenu(null);
  };

  const handleRename = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setEditingId(conversationId);
      setEditTitle(conversation.title);
    }
    setContextMenu(null);
  };

  const handleSaveRename = (conversationId: string) => {
    if (editTitle.trim() && editTitle !== conversations.find(c => c.id === conversationId)?.title) {
      renameConversation(conversationId, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle('');
  };

  const handleSelectConversation = (conversation: any) => {
    if (editingId !== conversation.id) {
      switchToConversation(conversation);
      console.log('Selected conversation:', conversation.title);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const getLastMessage = (messages: any[]) => {
    if (!messages || messages.length === 0) return 'No messages yet';
    const lastMessage = messages[messages.length - 1];
    return lastMessage.content.substring(0, 50) + (lastMessage.content.length > 50 ? '...' : '');
  };

  return (
    <div className="py-2">
      {/* Section Header */}
      <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          Recent Conversations
        </button>
        <span className="text-xs">({conversations.length})</span>
      </div>

      {/* Conversations List */}
      <AnimatePresence>
        {isExpanded && conversations.map((conversation, index) => (
          <motion.div
            key={conversation.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20, height: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.05,
              ease: "easeOut" 
            }}
            layout
            className={`flex items-start justify-between px-3 py-2 cursor-pointer hover:bg-accent/10 rounded-lg transition-colors group ${
              conversation.id === currentConversation?.id ? "bg-accent/10" : ""
            }`}
            whileHover={{ scale: 1.01, x: 2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => handleSelectConversation(conversation)}
            onContextMenu={(e) => handleContextMenu(e, conversation.id)}
          >
            <div className="flex items-start space-x-3 flex-1 min-w-0">
              <div className="flex-shrink-0 pt-1">
                <AnimatedIcon
                  icon={MessageSquare}
                  size={20}
                  className="text-primary"
                  animate={conversation.id === currentConversation?.id ? "pulse" : "none"}
                />
              </div>
              <div className="flex-1 min-w-0">
                {editingId === conversation.id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => handleSaveRename(conversation.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveRename(conversation.id);
                      } else if (e.key === 'Escape') {
                        setEditingId(null);
                        setEditTitle('');
                      }
                    }}
                    className="w-full text-sm font-medium bg-background border border-border rounded px-1 py-0.5"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <p className="text-sm font-medium truncate">{conversation.title}</p>
                )}
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {getLastMessage(conversation.messages)}
                </p>
              </div>
              <div className="flex-shrink-0 flex flex-col items-end">
                <p className="text-xs text-muted-foreground">
                  {formatDate(conversation.updatedAt || conversation.createdAt)}
                </p>
                <div className="flex mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="p-1 hover:bg-muted rounded-full transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(conversation.id);
                    }}
                    title="Delete conversation"
                  >
                    <AnimatedIcon
                      icon={Trash}
                      size={14}
                      className="text-muted-foreground hover:text-destructive"
                      animate="shake"
                    />
                  </button>
                  <button 
                    className="p-1 hover:bg-muted rounded-full transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContextMenu(e, conversation.id);
                    }}
                    title="More options"
                  >
                    <AnimatedIcon
                      icon={MoreVertical}
                      size={14}
                      className="text-muted-foreground"
                      animate="bounce"
                    />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Show empty state if no conversations */}
      {conversations.length === 0 && isExpanded && (
        <div className="px-3 py-8 text-center text-muted-foreground">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No conversations yet</p>
          <p className="text-xs">Start a new chat to begin</p>
        </div>
      )}

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            onRename={() => handleRename(contextMenu.conversationId)}
            onDelete={() => handleDelete(contextMenu.conversationId)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
