"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { 
  PanelLeft, 
  MessageCircle, 
  Search, 
  Code, 
  FileEdit, 
  Presentation,
  Plus,
  ChevronRight,
  Settings,
  LogOut
} from "lucide-react";

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
}

interface Agent {
  id: string;
  name: string;
  icon: string;
}

interface SidebarProps {
  conversations: Conversation[];
  agents: Agent[];
  activeConversationId: string | null;
  onNewConversation: () => void;
  onSwitchConversation: (id: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({
  conversations,
  agents,
  activeConversationId,
  onNewConversation,
  onSwitchConversation,
  isOpen,
  toggleSidebar,
}: SidebarProps) {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const filteredConversations = conversations.filter((conversation) =>
    conversation.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "MessageCircle":
        return <MessageCircle size={20} />;
      case "Search":
        return <Search size={20} />;
      case "Code":
        return <Code size={20} />;
      case "FileEdit":
        return <FileEdit size={20} />;
      case "LayoutPresentation":
        return <Presentation size={20} />;
      default:
        return <MessageCircle size={20} />;
    }
  };

  if (!isOpen) {
    return (
      <div className="hidden md:flex h-full fixed left-0 top-0 bottom-0 z-20">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-background border shadow-sm absolute -right-5 top-5"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "flex flex-col h-screen glass-panel-sidebar border-r border-border/30 w-[260px] relative z-20",
        !isOpen && "hidden"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border/20 glass-overlay-light">
        <h1 className="text-lg font-semibold glass-text-medium">FereeLAB</h1>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-muted/50 transition-all duration-200"
          aria-label="Close sidebar"
        >
          <PanelLeft size={18} />
        </button>
      </div>

      {/* Agents section */}
      <div className="p-2">
        <h2 className="text-xs uppercase text-muted-foreground font-medium mb-2 px-2">Agents</h2>
        <div className="space-y-1">
          {agents.map((agent) => (
            <button
              key={agent.id}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-sm"
            >
              <span className="text-muted-foreground">{getIconComponent(agent.icon)}</span>
              <span>{agent.name}</span>
            </button>
          ))}
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-sm">
            <span className="text-muted-foreground">
              <span className="flex items-center justify-center w-5 h-5">···</span>
            </span>
            <span>More</span>
          </button>
        </div>
      </div>
      
      {/* Wisebase section */}
      <div className="p-2 mt-2">
        <div className="flex items-center justify-between px-2 mb-2">
          <h2 className="text-xs uppercase text-muted-foreground font-medium">Wisebase</h2>
          <button className="text-muted-foreground hover:text-foreground">
            <Plus size={16} />
          </button>
        </div>
        <div className="space-y-1">
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-sm">
            <span className="text-muted-foreground">
              <MessageCircle size={18} />
            </span>
            <span>AI Inbox</span>
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="px-2 py-4">
        <div className="relative glass-input-bar p-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <input
            type="text"
            placeholder="Search"
            className="w-full py-2 pl-9 pr-4 bg-transparent border-none rounded-md text-sm focus:outline-none glass-text-light"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Chat history */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="flex justify-between items-center px-2 mb-2">
          <h2 className="text-xs uppercase text-muted-foreground font-medium">Chat history</h2>
          <button
            onClick={onNewConversation}
            className="text-muted-foreground hover:text-foreground"
            aria-label="New chat"
          >
            <Plus size={16} />
          </button>
        </div>
        
        {filteredConversations.length > 0 ? (
          <div className="space-y-1">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                className={cn(
                  "w-full flex items-center px-3 py-2 rounded-md text-sm text-left",
                  activeConversationId === conversation.id
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted"
                )}
                onClick={() => onSwitchConversation(conversation.id)}
              >
                <span className="truncate">{conversation.title}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground text-sm">
            {searchQuery ? "No matching conversations" : "No conversations yet"}
          </div>
        )}
      </div>

      {/* User section */}
      <div className="p-2 border-t border-border/20 glass-overlay-medium">
        <div className="relative">
          <div 
            className="flex items-center justify-between p-2 rounded-md hover:bg-muted/30 cursor-pointer transition-all duration-200"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground glass-border-gradient">
                U
              </div>
              <span className="text-sm font-medium glass-text-medium">User</span>
            </div>
          </div>
          
          {userMenuOpen && (
            <div className="absolute bottom-full mb-2 left-0 right-0 glass-overlay-strong border border-border/30 rounded-md shadow-lg">
              <div className="p-1">
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-muted/30 text-left transition-all duration-200">
                  <Settings size={16} className="text-muted-foreground" />
                  <span className="glass-text-light">Settings</span>
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-muted/30 text-destructive text-left transition-all duration-200">
                  <LogOut size={16} />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
