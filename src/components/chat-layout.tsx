"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar/sidebar";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatLog } from "@/components/chat/chat-log";
import { ModelPanel } from "@/components/modals/model-panel";
import { MarketplacePanel } from "@/components/modals/marketplace-panel";
import { CanvasPanel } from "@/components/shared/canvas-panel";
import { SettingsPanel } from "@/components/modals/settings-panel";
import { UserMenuPanel } from "@/components/modals/user-menu-panel";
import { ResizablePanel } from "@/components/shared/resizable-panel";
import { usePanels, Message, AIModel } from "@/hooks/use-panels";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ChatLayout() {
  // Use the comprehensive panels hook instead of individual state
  const {
    // Panel state
    panels,
    dimensions,
    
    // Chat state
    chat,
    
    // Project state
    projects,
    
    // Panel actions
    toggleSidebar,
    toggleCanvas,
    toggleModelPanel,
    toggleMarketplace,
    toggleUserMenu,
    closeAllPanels,
    handleSidebarResize,
    handleCanvasResize,
    
    // Chat actions
    sendMessage,
    editMessage,
    regenerateMessage,
    replyToMessage,
    handleApplyModels,
    
    // Project actions
    projectActions,
    switchToProjectChat,
  } = usePanels();

  const { theme, setTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
  const [userMenuPosition, setUserMenuPosition] = useState({ top: 0, right: 0 });

  // Handle responsive behavior
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  const handleNewConversation = () => {
    // Reset chat to initial state
    console.log('Starting new conversation');
  };

  const handleUserMenuToggle = (event?: React.MouseEvent) => {
    if (event) {
      const rect = event.currentTarget.getBoundingClientRect();
      setUserMenuPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    toggleUserMenu();
  };

  const handleSettingsOpen = () => {
    setSettingsPanelOpen(true);
    closeAllPanels();
  };

  const handleModelSelect = (model: AIModel) => {
    handleApplyModels([model]);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div 
        className={cn(
          "relative transition-all duration-300 ease-in-out bg-card",
          panels.sidebar 
            ? "w-[280px] flex-shrink-0" 
            : "w-0 flex-shrink-0",
          isMobile && panels.sidebar && "fixed inset-0 z-40"
        )}
      >
        <div className={cn(
          "h-full w-[280px] border-r border-border",
          !panels.sidebar && "translate-x-[-100%]",
          isMobile && panels.sidebar && "absolute inset-0 z-50 translate-x-0"
        )}>
          <Sidebar onOpenSettings={handleSettingsOpen} />
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && panels.sidebar && (
        <div 
          className="fixed inset-0 z-30 bg-black/50"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content */}
      <div className={cn(
        "flex-1 flex flex-col overflow-hidden min-w-0",
        "transition-all duration-300 ease-in-out"
      )}>
        {/* Chat Header */}
        <ChatHeader
          title="New Conversation"
          currentModel={chat.selectedModel}
          onToggleModelPanel={toggleModelPanel}
          onNewConversation={handleNewConversation}
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={panels.sidebar}
        />

        {/* Chat Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Messages */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            <div className="flex-1 overflow-y-auto">
              <ChatLog 
                messages={chat.messages}
                onEditMessage={editMessage}
                onRegenerate={regenerateMessage}
                onReply={replyToMessage}
              />
            </div>
            
            {/* Chat Input */}
            <ChatInput
              onSendMessage={sendMessage}
              selectedModel={chat.selectedModel}
              replyTo={chat.replyTo ? {
                id: chat.replyTo.id,
                content: chat.replyTo.content,
                role: chat.replyTo.role
              } : undefined}
              onCancelReply={() => replyToMessage(chat.replyTo!)}
            />
          </div>

          {/* Canvas Panel */}
          {panels.canvas && (
            <div className="flex-shrink-0">
              <CanvasPanel
                isOpen={panels.canvas}
                onClose={toggleCanvas}
                width={400}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ModelPanel
        isOpen={panels.modelPanel}
        onClose={() => toggleModelPanel()}
        selectedModel={chat.selectedModel}
        onModelSelect={handleModelSelect}
        onOpenMarketplace={toggleMarketplace}
        selectedMarketplaceModels={chat.marketplaceModels}
      />

      <MarketplacePanel
        isOpen={panels.marketplace}
        onClose={() => toggleMarketplace()}
        selectedModels={chat.marketplaceModels.map((m: AIModel) => m.id)}
        onApplyModels={handleApplyModels}
      />
    </div>
  );
}
