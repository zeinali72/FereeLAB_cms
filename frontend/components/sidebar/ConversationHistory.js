import React, { useState } from 'react';
import { MessageSquare, ChevronDown, ChevronRight } from 'react-feather';

// Sample data
const conversations = [
    { id: 'conv-1', title: 'User Chat 1', timestamp: new Date() },
    { id: 'conv-2', title: 'User Chat 2', timestamp: new Date(new Date().setDate(new Date().getDate() - 1)) },
    { id: 'conv-3', title: 'A much older chat', timestamp: new Date(new Date().setDate(new Date().getDate() - 7)) },
    { id: 'conv-4', title: 'Another chat today', timestamp: new Date() },
    { id: 'conv-5', title: 'Yesterday\'s follow-up', timestamp: new Date(new Date().setDate(new Date().getDate() - 1)) },
    { id: 'conv-6', title: 'Last week\'s planning', timestamp: new Date(new Date().setDate(new Date().getDate() - 7)) },
    { id: 'conv-7', title: 'Final review session', timestamp: new Date(new Date().setDate(new Date().getDate() - 8)) },
    { id: 'conv-8', title: 'API key discussion', timestamp: new Date(new Date().setDate(new Date().getDate() - 9)) },
];

const formatDateGroup = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString();
};

const ConversationHistory = () => {
    const [isSectionOpen, setIsSectionOpen] = useState(true);

    const groupedConversations = conversations.reduce((acc, conv) => {
        const dateKey = formatDateGroup(conv.timestamp);
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(conv);
        return acc;
    }, {});

    return (
        // This component will now grow and manage its own layout
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col flex-grow">
             <div 
                onClick={() => setIsSectionOpen(!isSectionOpen)}
                className="flex items-center justify-between cursor-pointer flex-shrink-0"
            >
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Conversation History
                </h2>
                {isSectionOpen ? <ChevronDown size={20} className="text-gray-400" /> : <ChevronRight size={20} className="text-gray-400" />}
            </div>
            {isSectionOpen && (
                // This list container will grow and scroll
                <div className="mt-2 overflow-y-auto flex-grow">
                    <ul className="space-y-4">
                        {Object.entries(groupedConversations).map(([date, convs]) => (
                            <li key={date}>
                                <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-2">{date}</p>
                                <ul className="space-y-1">
                                    {convs.map((conv) => (
                                        <li key={conv.id}>
                                            <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <MessageSquare size={20} className="text-gray-500" />
                                                <span className="ml-3 flex-1 whitespace-nowrap">{conv.title}</span>
                                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                                    {conv.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </a>
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