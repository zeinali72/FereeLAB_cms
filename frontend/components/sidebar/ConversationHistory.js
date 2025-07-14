// frontend/components/sidebar/ConversationHistory.js
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, ChevronDown, ChevronRight, Check, X } from 'react-feather';
import { PlusIcon } from '@heroicons/react/24/outline';

const formatDateGroup = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString();
};

const ConversationHistory = ({ 
    conversations = [], 
    activeConversationId, 
    onNewConversation, 
    onSwitchConversation,
    onRenameConversation 
}) => {
    const [isSectionOpen, setIsSectionOpen] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const inputRef = useRef(null);

    // Start renaming a conversation
    const handleStartRename = (conv, e) => {
        e.stopPropagation();
        setEditingId(conv.id);
        setEditTitle(conv.title);
    };

    // Save the new conversation title
    const handleSaveTitle = (e) => {
        e.preventDefault();
        if (editTitle.trim() && onRenameConversation) {
            onRenameConversation(editingId, editTitle.trim());
        }
        setEditingId(null);
    };

    // Cancel renaming
    const handleCancelRename = () => {
        setEditingId(null);
    };

    // Handle keyboard events for renaming
    const handleKeyDown = (e, conv) => {
        if (e.key === 'F2') {
            handleStartRename(conv, e);
        } else if (e.key === 'Escape') {
            handleCancelRename();
        } else if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSaveTitle(e);
        }
    };

    // Focus input when editing starts
    useEffect(() => {
        if (editingId && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
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
    }, {});

    return (
        <div className="mt-2">
            <div className="px-4 py-2">
                <button
                    onClick={() => setIsSectionOpen(!isSectionOpen)}
                    className="w-full flex items-center justify-between text-sm font-medium p-1 hover:bg-surface-secondary rounded-md transition-colors"
                >
                    <span>Conversations</span>
                    {isSectionOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
            </div>

            {isSectionOpen && (
                <div className="mt-1">
                    <button
                        onClick={onNewConversation}
                        className="flex items-center justify-between w-full text-sm px-4 py-2 hover:bg-surface-secondary transition-colors"
                    >
                        <div className="flex items-center">
                            <PlusIcon className="h-4 w-4 mr-2" />
                            <span>New conversation</span>
                        </div>
                    </button>

                    {Object.entries(groupedConversations).map(([dateGroup, convs]) => (
                        <div key={dateGroup} className="mt-2">
                            <div className="px-4 py-1">
                                <p className="text-xs font-medium text-tertiary">{dateGroup}</p>
                            </div>

                            <ul>
                                {convs.map((conv) => (
                                    <li key={conv.id} tabIndex={0} onKeyDown={(e) => handleKeyDown(e, conv)}>
                                        {editingId === conv.id ? (
                                            // Editing state
                                            <form onSubmit={handleSaveTitle} className="px-4 py-1 flex items-center">
                                                <MessageSquare size={16} className="mr-2 flex-shrink-0 text-tertiary" />
                                                <input
                                                    ref={inputRef}
                                                    type="text"
                                                    value={editTitle}
                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                    className="flex-grow text-sm bg-surface-secondary p-1 rounded focus:ring-1 focus:ring-primary-500 focus:outline-none"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Escape') {
                                                            handleCancelRename();
                                                        }
                                                    }}
                                                />
                                                <button 
                                                    type="submit"
                                                    className="ml-1 p-1 hover:bg-surface-secondary rounded-md transition-colors"
                                                    title="Save"
                                                >
                                                    <Check size={14} className="text-primary-500" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleCancelRename}
                                                    className="p-1 hover:bg-surface-secondary rounded-md transition-colors"
                                                    title="Cancel"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </form>
                                        ) : (
                                            // Normal state
                                            <button
                                                onClick={() => onSwitchConversation(conv.id)}
                                                onDoubleClick={(e) => handleStartRename(conv, e)}
                                                className={`flex items-center w-full px-4 py-2 text-sm ${
                                                    activeConversationId === conv.id ? 'list-item-active' : 'hover:bg-surface-secondary'
                                                }`}
                                            >
                                                <MessageSquare size={16} className="mr-2 flex-shrink-0" />
                                                <span className="truncate">{conv.title}</span>
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ConversationHistory;