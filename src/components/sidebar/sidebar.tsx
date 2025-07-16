"use client";

import { useState, useEffect, useRef } from "react";
import { MoreVertical, Plus, Search, LogOut, Settings, User } from "lucide-react";
import ConversationList from "./conversation-list";
import AgentsList from "./agents-list";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<"chat" | "agents">("chat");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  const handleLogout = () => {
    console.log("Logging out...");
    // Add logout logic here
    setUserMenuOpen(false);
  };

  const handleSettings = () => {
    console.log("Opening settings...");
    // Add settings logic here
    setUserMenuOpen(false);
  };

  return (
    <div className="h-screen flex flex-col bg-card">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h1 className="text-lg font-semibold">FereeLAB</h1>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          className="w-full flex items-center justify-between rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors"
          onClick={() => {/* Add new chat logic */}}
        >
          <span className="font-medium">New Chat</span>
          <Plus className="w-4 h-4" />
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
        <div className="relative" ref={menuRef}>
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
            <button 
              className="p-1 rounded-full hover:bg-muted transition-colors"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <MoreVertical className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          
          {/* User Menu Dropdown */}
          {userMenuOpen && (
            <div className="absolute bottom-full mb-2 right-0 w-48 bg-card border border-border rounded-md shadow-lg py-1 z-50">
              <button
                onClick={handleSettings}
                className="w-full flex items-center px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </button>
              <button
                onClick={() => {
                  console.log("Account clicked");
                  setUserMenuOpen(false);
                }}
                className="w-full flex items-center px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <User className="w-4 h-4 mr-3" />
                Account
              </button>
              <hr className="my-1 border-border" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
