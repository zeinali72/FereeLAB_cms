"use client";

import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { ChatHeader } from "./chat-header";
import { ChatLog } from "./chat-log";
import { ChatInput } from "./chat-input";
import { Message } from "./chat-message";

interface ChatAreaProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export function ChatArea({ 
  sidebarOpen, 
  toggleSidebar 
}: ChatAreaProps) {
  // Initialize with a welcome message
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      content: "Hello! How can I assist you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [chatTitle, setChatTitle] = useState("New Chat");

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      role: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    // Simulate assistant response (in real app, this would be an API call)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: "I'm a simulated response. In a real application, this would be a response from the AI chatbot API.",
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Set chat title from first user message if it's still the default
      if (chatTitle === "New Chat" && messages.length <= 2) {
        const newTitle = content.length > 30 
          ? `${content.substring(0, 30)}...` 
          : content;
        setChatTitle(newTitle);
      }
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden glass-panel-chat">
      {/* Custom header with hamburger menu for mobile */}
      <div className="glass-overlay-light border-b border-border/20 p-4 flex items-center md:hidden progressive-blur-bottom">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-muted/50 mr-3 transition-all duration-200"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <MenuIcon size={20} />
        </button>
        <h2 className="font-semibold text-lg glass-text-medium">FereeLAB</h2>
      </div>
      
      {/* Regular chat header (hidden on mobile) */}
      <div className="hidden md:block">
        <ChatHeader 
          title={chatTitle} 
          onToggleModelPanel={() => {}}
          onNewConversation={() => {}}
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={sidebarOpen}
        />
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-hidden progressive-blur-top progressive-blur-bottom">
        <ChatLog messages={messages} />
      </div>
      
      {/* Chat input */}
      <div className="glass-overlay-medium border-t border-border/20">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
