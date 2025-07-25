"use client";

import { useState, useRef } from "react";
import { MoreVertical, Plus, Search, Settings, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import ConversationList from "./conversation-list";
import { UserMenuPanel } from "@/components/modals/user-menu-panel";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onOpenSettings?: () => void;
  onNewConversation?: () => void;
}

export function Sidebar({ onOpenSettings, onNewConversation }: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<"chat">("chat");
  const [isToggled, setIsToggled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userMenuPosition, setUserMenuPosition] = useState({ top: 0, right: 0 });
  const userButtonRef = useRef<HTMLButtonElement>(null);

  const handleUserMenuToggle = () => {
    if (userButtonRef.current) {
      const rect = userButtonRef.current.getBoundingClientRect();
      setUserMenuPosition({
        top: rect.top,
        right: window.innerWidth - rect.right,
      });
    }
    setUserMenuOpen(!userMenuOpen);
  };

  const handleSettingsOpen = () => {
    setUserMenuOpen(false); // Close user menu first
    onOpenSettings?.();
  };

  return (
    <div className="h-screen flex flex-col bg-card">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h1 className="text-lg font-semibold">FereeLAB</h1>
        
        {/* Toggle Button */}
        <button
          onClick={() => {
            setIsToggled(!isToggled);
            console.log('Toggle button clicked:', !isToggled ? 'ON' : 'OFF');
          }}
          className={cn(
            "p-2 rounded-full transition-all duration-200",
            isToggled 
              ? "bg-primary text-primary-foreground" 
              : "hover:bg-muted text-muted-foreground"
          )}
          title={isToggled ? "Turn off" : "Turn on"}
        >
          <div className={cn(
            "w-3 h-3 rounded-full border-2 transition-colors",
            isToggled ? "bg-primary-foreground border-primary-foreground" : "border-current"
          )} />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          className="w-full flex items-center justify-between rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors"
          onClick={() => {
            onNewConversation?.();
            console.log('New Chat button clicked');
          }}
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
            onChange={(e) => {
              setSearchQuery(e.target.value);
              console.log('Searching for:', e.target.value);
            }}
          />
        </div>
      </div>

      {/* Section Tabs - Removed for simplicity */}
      <div className="border-b border-border">
        <div className="py-2 px-4">
          <h3 className="text-sm font-medium text-primary">Chat History</h3>
        </div>
      </div>

      {/* Conversations and Agents Lists */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <ConversationList />
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
          <button 
            ref={userButtonRef}
            onClick={handleUserMenuToggle}
            className="p-1 rounded-full hover:bg-muted transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* User Menu Panel */}
      <UserMenuPanel
        isOpen={userMenuOpen}
        position={userMenuPosition}
        theme={(theme === 'dark' ? 'dark' : 'light') as 'light' | 'dark'}
        setTheme={(newTheme: 'light' | 'dark') => setTheme(newTheme)}
        onClose={() => setUserMenuOpen(false)}
        onOpenSettings={handleSettingsOpen}
      />
    </div>
  );
}
