// frontend/components/sidebar/ConversationHistory.js
import React, { useState } from 'react';
import { MessageSquare, ChevronDown, ChevronRight } from 'react-feather';
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
    onSwitchConversation 
}) => {
    const [isSectionOpen, setIsSectionOpen] = useState(true);

    const groupedConversations = conversations.reduce((acc, conv) => {
        const dateKey = formatDateGroup(conv.timestamp);
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(conv);
        return acc;
    }, {});

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
                                            <button 
                                                onClick={() => onSwitchConversation(conv.id)}
                                                className={`flex items-center w-full p-2 text-base font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200
                                                    ${activeConversationId === conv.id 
                                                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' 
                                                        : 'text-gray-900 dark:text-white'}`}
                                            >
                                                <MessageSquare size={20} className={`${activeConversationId === conv.id ? 'text-blue-500' : 'text-gray-500'}`} />
                                                <span className="ml-3 flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis text-left">
                                                    {conv.title}
                                                </span>
                                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                                    {conv.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </button>
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