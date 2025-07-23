"use client";

import React, { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import { ChatArea } from "@/components/chat/chat-area";

// Define dummy data for initial development
const dummyConversations = [
  { id: "1", title: "Conversation 1", timestamp: new Date() },
  { id: "2", title: "Conversation 2", timestamp: new Date(Date.now() - 3600000) },
  { id: "3", title: "Conversation 3", timestamp: new Date(Date.now() - 7200000) },
];

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export function AppLayout() {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState(dummyConversations);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleNewConversation = () => {
    const newId = Date.now().toString();
    const newConversation = {
      id: newId,
      title: "New Conversation",
      timestamp: new Date(),
    };
    
    setConversations([newConversation, ...conversations]);
    setActiveConversationId(newId);
    setMessages([]);
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;
    
    // Create user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };
    
    // Add user message to the messages
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    
    // Simulate AI response after a brief delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: `This is a simulated response to: "${content}"`,
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    }, 1000);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewConversation={handleNewConversation}
        onSwitchConversation={setActiveConversationId}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      
      <ChatArea
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
    </div>
  );
}
