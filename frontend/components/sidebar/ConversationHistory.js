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
            e.preventDefault();
            handleStartRename(conv, e);
        }
    };

    // Focus the input when editing starts
    useEffect(() => {
        if (editingId && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editingId]);

    const groupedConversations = conversations.reduce((acc, conv) => {
        const dateKey = formatDateGroup(conv.timestamp);
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(conv);
        return acc;
    }, {});

    // Handle clicks outside the editing field to cancel
    useEffect(() => {
        function handleClickOutside(event) {
            if (editingId && inputRef.current && !inputRef.current.contains(event.target)) {
                handleCancelRename();
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [editingId]);

    return (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col flex-grow">
             <div className="flex items-center justify-between cursor-pointer flex-shrink-0">
                <div onClick={() => setIsSectionOpen(!isSectionOpen)} className="flex items-center flex-grow">
                    <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Conversation History
                    </h2>
                    {isSectionOpen ? <ChevronDown size={20} className="ml-2 text-gray-400" /> : <ChevronRight size={20} className="ml-2 text-gray-400" />}
                </div>
                <button onClick={onNewConversation} className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200" aria-label="Add new conversation">
                    <PlusIcon className="h-6 w-6" />
                </button>
            </div>
            {isSectionOpen && (
                <div className="mt-2 overflow-y-auto flex-grow">
                    <ul className="space-y-4">
                        {Object.entries(groupedConversations).map(([date, convs]) => (
                            <li key={date}>
                                <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-2">{date}</p>
                                <ul className="space-y-1">
                                    {convs.map((conv) => (
                                        <li key={conv.id}>
                                            {editingId === conv.id ? (
                                                <form onSubmit={handleSaveTitle} className="flex items-center w-full p-1 rounded-lg bg-gray-200 dark:bg-gray-700">
                                                    <MessageSquare size={20} className="ml-1 text-blue-500" />
                                                    <input
                                                        ref={inputRef}
                                                        type="text"
                                                        value={editTitle}
                                                        onChange={(e) => setEditTitle(e.target.value)}
                                                        className="ml-3 flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-gray-900 dark:text-white"
                                                    />
                                                    <button 
                                                        type="submit"
                                                        className="p-1 text-green-500 hover:text-green-600"
                                                        title="Save"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button 
                                                        type="button"
                                                        onClick={handleCancelRename}
                                                        className="p-1 text-red-500 hover:text-red-600 mr-1"
                                                        title="Cancel"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </form>
                                            ) : (
                                                <button 
                                                    onClick={() => onSwitchConversation(conv.id)}
                                                    onDoubleClick={(e) => handleStartRename(conv, e)}
                                                    onKeyDown={(e) => handleKeyDown(e, conv)}
                                                    className={`flex items-center w-full p-2 text-base font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200
                                                        ${activeConversationId === conv.id 
                                                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' 
                                                            : 'text-gray-900 dark:text-white'}`}
                                                    tabIndex={0}
                                                >
                                                    <MessageSquare size={20} className={`${activeConversationId === conv.id ? 'text-blue-500' : 'text-gray-500'}`} />
                                                    <span className="ml-3 flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis text-left">
                                                        {conv.title}
                                                    </span>
                                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                                        {conv.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ConversationHistory;