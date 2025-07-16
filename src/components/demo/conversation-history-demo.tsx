"use client";

import React, { useState } from 'react';
import { ConversationHistory } from '@/components/sidebar/conversation-history';

// Mock conversations data for testing
const mockConversations = [
  {
    id: "1",
    title: "Getting started with AI",
    timestamp: new Date(),
    messages: [{ text: "How can I use AI in my project?" }],
  },
  {
    id: "2",
    title: "Web development tips",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    messages: [{ text: "What are the best practices for React?" }],
  },
  {
    id: "3",
    title: "Machine learning basics",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    messages: [{ text: "Can you explain how neural networks work?" }],
  },
  {
    id: "4",
    title: "Design systems and UI patterns",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    messages: [{ text: "How do I create a consistent design system?" }],
  },
  {
    id: "5",
    title: "JavaScript performance optimization",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    messages: [{ text: "What are the best practices for optimizing JavaScript performance?" }],
  },
  {
    id: "6",
    title: "Database design principles",
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    messages: [{ text: "How should I structure my database schema?" }],
  },
];

export default function ConversationHistoryDemo() {
  const [conversations, setConversations] = useState(mockConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>("1");

  const handleDeleteConversation = (id: string) => {
    // Simulate soft delete
    setConversations(prev => prev.filter(conv => conv.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  };

  const handleRenameConversation = (id: string, newTitle: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id ? { ...conv, title: newTitle } : conv
      )
    );
  };

  const handleSwitchConversation = (id: string) => {
    setActiveConversationId(id);
  };

  const handleNewConversation = () => {
    const newConv = {
      id: Date.now().toString(),
      title: "New conversation",
      timestamp: new Date(),
      messages: [],
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
  };

  return (
    <div className="h-screen bg-background">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-80 border-r border-border bg-background">
          <div className="p-4">
            <h1 className="text-xl font-semibold mb-4">Chat History Demo</h1>
            <div className="text-sm text-muted-foreground mb-4 space-y-2">
              <p><strong>Multi-select features:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Ctrl/Cmd + click to select multiple conversations</li>
                <li>Shift + click to select a range</li>
                <li>Right-click to open context menu</li>
                <li>Visual selection indicators appear when selecting</li>
                <li>Bulk delete with confirmation dialog</li>
                <li>Options for recycle bin (30 days) or permanent deletion</li>
              </ul>
            </div>
          </div>
          
          <ConversationHistory
            conversations={conversations}
            activeConversationId={activeConversationId}
            onNewConversation={handleNewConversation}
            onSwitchConversation={handleSwitchConversation}
            onRenameConversation={handleRenameConversation}
            onDeleteConversation={handleDeleteConversation}
          />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex items-center justify-center bg-muted/30">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold">
              {activeConversationId 
                ? `Active: ${conversations.find(c => c.id === activeConversationId)?.title}` 
                : "No conversation selected"
              }
            </h2>
            <div className="text-muted-foreground">
              <p>Try the multi-select features in the sidebar:</p>
              <ul className="mt-2 space-y-1">
                <li>• Hold Ctrl/Cmd and click to select multiple items</li>
                <li>• Hold Shift and click to select a range</li>
                <li>• Right-click on selected items for bulk actions</li>
                <li>• Press Escape to exit selection mode</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}