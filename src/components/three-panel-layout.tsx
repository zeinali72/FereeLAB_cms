"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar/sidebar";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatLog } from "@/components/chat/chat-log";
import { ModelPanel } from "@/components/modals/model-panel";
import { MarketplacePanel } from "@/components/modals/marketplace-panel";
import { SettingsPanel } from "@/components/modals/settings-panel";
import { UserMenuPanel } from "@/components/modals/user-menu-panel";
import { ResizablePanel } from "@/components/shared/resizable-panel";
import { usePanels } from "@/hooks/use-panels";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { MarkdownCanvas } from "./shared/markdown-canvas";

export function ThreePanelLayout() {
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
      {/* Left Panel: Sidebar */}
      {!isMobile && panels.sidebar && (
        <ResizablePanel
          initialSize={dimensions.sidebarWidth}
          minSize={240}
          maxSize={400}
          onResize={handleSidebarResize}
          className="border-r border-border flex-shrink-0"
        >
          <Sidebar />
        </ResizablePanel>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && panels.sidebar && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="flex-1 bg-black/20 backdrop-blur-sm"
            onClick={toggleSidebar}
          />
          <div className="w-[280px] h-full bg-background border-r border-border">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Center Panel: Chat Area (1/3 width on desktop) */}
      <div className={cn(
        "flex flex-col min-w-0 border-r border-border",
        isMobile 
          ? "flex-1" 
          : panels.canvas 
            ? "w-1/3 flex-shrink-0" 
            : "flex-1"
      )}>
        {/* Chat Header */}
        <ChatHeader
          title="FereeLAB Chat"
          currentModel={chat.selectedModel}
          onToggleModelPanel={toggleModelPanel}
          onNewConversation={handleNewConversation}
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={panels.sidebar}
        />

        {/* Chat Messages - Full height without input */}
        <div className="flex-1 overflow-y-auto pb-40">
          <ChatLog
            messages={chat.messages}
            onEditMessage={editMessage}
            onRegenerate={regenerateMessage}
            onReply={replyToMessage}
            replyTo={chat.replyTo}
            onSuggestionClick={(suggestion) => {
              // Use the sendMessage function to handle the suggestion
              sendMessage(suggestion);
            }}
          />
        </div>
      </div>

      {/* Floating Chat Input Bar */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className={cn(
          "w-full max-w-3xl mx-auto px-6",
          isMobile ? "max-w-[calc(100vw-2rem)]" : 
          panels.sidebar && panels.canvas ? "max-w-2xl" :
          panels.sidebar || panels.canvas ? "max-w-3xl" : "max-w-4xl"
        )}>
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
            isFloating={true}
          />
        </div>
      </div>

      {/* Right Panel: Markdown Canvas */}
      {!isMobile && panels.canvas && (
        <div className="flex-1 min-w-0">
          <MarkdownCanvas
            isOpen={panels.canvas}
            onClose={toggleCanvas}
            messages={chat.messages}
          />
        </div>
      )}

      {/* Mobile Canvas as Overlay */}
      {isMobile && panels.canvas && (
        <div className="fixed inset-0 z-40 bg-background">
          <MarkdownCanvas
            isOpen={panels.canvas}
            onClose={toggleCanvas}
            messages={chat.messages}
          />
        </div>
      )}

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
