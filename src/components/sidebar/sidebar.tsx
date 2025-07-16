"use client";

import { useState } from "react";
import { MoreVertical, Plus, Search, Ghost } from "lucide-react";
import ConversationList from "./conversation-list";
import AgentsList from "./agents-list";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onNewChat?: () => void;
  onTemporaryChat?: () => void;
}

export function Sidebar({ onNewChat, onTemporaryChat }: SidebarProps = {}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<"chat" | "agents">("chat");

  return (
    <div className="h-screen flex flex-col bg-card">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h1 className="text-lg font-semibold">FereeLAB</h1>
      </div>

      {/* Chat Buttons */}
      <div className="p-3 space-y-2">
        <button
          className="w-full flex items-center justify-between rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors"
          onClick={onNewChat}
        >
          <span className="font-medium">New Chat</span>
          <Plus className="w-4 h-4" />
        </button>
        
        <button
          className="w-full flex items-center justify-between rounded-lg bg-muted/60 border border-border px-4 py-2 text-foreground hover:bg-muted/80 transition-colors"
          onClick={onTemporaryChat}
          title="Start a temporary chat that won't be saved to history"
        >
          <span className="font-medium">Temporary Chat</span>
          <Ghost className="w-4 h-4" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-3 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex border-b border-border">
        <button
          className={cn(
            "flex-1 py-2 text-sm font-medium transition-colors border-b-2",
            activeSection === "chat"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setActiveSection("chat")}
        >
          Chat
        </button>
        <button
          className={cn(
            "flex-1 py-2 text-sm font-medium transition-colors border-b-2",
            activeSection === "agents"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setActiveSection("agents")}
        >
          Agents
        </button>
      </div>

      {/* Conversations and Agents Lists */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeSection === "chat" ? <ConversationList /> : <AgentsList />}
      </div>

      {/* User Profile Section */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
              U
            </div>
            <div>
              <p className="text-sm font-medium">User</p>
              <p className="text-xs text-muted-foreground">Free Plan</p>
            </div>
          </div>
          <button className="p-1 rounded-full hover:bg-muted transition-colors">
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
