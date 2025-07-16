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
import { usePanels } from "@/hooks/use-panels";
import { useTheme } from "next-themes";

export function ChatLayout() {
  // Use the comprehensive panels hook
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
  
  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      {panels.sidebar && (
        <ResizablePanel
          initialSize={dimensions.sidebarWidth}
          minSize={240}
          maxSize={400}
          onResize={handleSidebarResize}
          className="border-r border-border"
        >
          <Sidebar />
        </ResizablePanel>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <ChatHeader
          title="FereeLAB Chat"
          currentModel={chat.selectedModel}
          onToggleModelPanel={toggleModelPanel}
          onNewConversation={handleNewConversation}
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={panels.sidebar}
        />

        {/* Chat Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Messages */}
          <div className="flex-1 flex flex-col min-w-0">
            <ChatLog
              messages={chat.messages}
              onEditMessage={editMessage}
              onRegenerate={regenerateMessage}
              onReply={replyToMessage}
              replyTo={chat.replyTo}
            />
            
            <ChatInput
              onSendMessage={sendMessage}
              selectedModel={chat.selectedModel}
              replyTo={chat.replyTo ? {
                id: chat.replyTo.id,
                content: chat.replyTo.content,
                role: chat.replyTo.role
              } : undefined}
              onCancelReply={() => {
                // Clear the reply state
                console.log('Cancelling reply');
              }}
              onToggleCanvas={toggleCanvas}
              isCanvasOpen={panels.canvas}
            />
          </div>

          {/* Canvas Panel */}
          {panels.canvas && (
            <ResizablePanel
              initialSize={dimensions.canvasWidth}
              minSize={300}
              maxSize={600}
              onResize={handleCanvasResize}
              handlePosition="left"
              className="border-l border-border"
            >
              <CanvasPanel
                isOpen={panels.canvas}
                onClose={toggleCanvas}
                width={dimensions.canvasWidth}
              />
            </ResizablePanel>
          )}
        </div>
      </div>

      {/* Modal Panels */}
      <ModelPanel
        isOpen={panels.modelPanel}
        onClose={toggleModelPanel}
        selectedModel={chat.selectedModel}
        onModelSelect={(model) => {
          // Handle model selection through the panels hook
          handleApplyModels([model]);
        }}
        onOpenMarketplace={toggleMarketplace}
        selectedMarketplaceModels={chat.marketplaceModels}
      />

      <MarketplacePanel
        isOpen={panels.marketplace}
        onClose={toggleMarketplace}
        selectedModels={chat.marketplaceModels.map(m => m.id)}
        onApplyModels={handleApplyModels}
      />

      <UserMenuPanel
        isOpen={panels.userMenu}
        position={userMenuPosition}
        theme={theme as 'light' | 'dark'}
        setTheme={(newTheme) => setTheme(newTheme)}
        onClose={() => {
          toggleUserMenu();
        }}
        onOpenSettings={handleSettingsOpen}
      />

      <SettingsPanel
        isOpen={settingsPanelOpen}
        onClose={() => setSettingsPanelOpen(false)}
      />
    </div>
  );
}
