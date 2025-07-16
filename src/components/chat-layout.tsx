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
    
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleCanvas = () => {
    setCanvasOpen(!canvasOpen);
  };

  const toggleModelPanel = () => {
    setModelPanelOpen(!modelPanelOpen);
  };

  const toggleMarketplacePanel = () => {
    setMarketplacePanelOpen(!marketplacePanelOpen);
  };

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: `I received your message: "${content}". This is a simulated response using ${selectedModel.name}.`,
      role: 'assistant',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setReplyTo(null);
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, content: newContent } : msg
    ));
  };

  const handleRegenerate = (messageId: string) => {
    // Regenerate the message (in a real app, this would call the AI API)
    const regeneratedContent = `This is a regenerated response using ${selectedModel.name}. Original message ID: ${messageId}`;
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, content: regeneratedContent } : msg
    ));
  };

  const handleReply = (message: Message) => {
    setReplyTo(message);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
  };

  const handleModelSelect = (model: AIModel) => {
    setSelectedModel(model);
  };

  const handleMarketplaceModels = (models: AIModel[]) => {
    setMarketplaceModels(models);
    if (models.length > 0) {
      setSelectedModel(models[0]);
    }
  };

  const handleNewConversation = () => {
    setMessages([
      {
        id: Date.now().toString(),
        content: 'Hello! How can I help you today?',
        role: 'assistant',
        timestamp: new Date(),
      }
    ]);
    setReplyTo(null);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div 
        className={cn(
          "relative transition-all duration-300 ease-in-out bg-card",
          sidebarOpen 
            ? "w-[280px] flex-shrink-0" 
            : "w-0 flex-shrink-0",
          isMobile && sidebarOpen && "fixed inset-0 z-40"
        )}
      >
        <div className={cn(
          "h-full w-[280px] border-r border-border",
          !sidebarOpen && "translate-x-[-100%]",
          isMobile && sidebarOpen && "absolute inset-0 z-50 translate-x-0"
        )}>
          <Sidebar />
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
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
          currentModel={selectedModel}
          onToggleModelPanel={toggleModelPanel}
          onNewConversation={handleNewConversation}
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={sidebarOpen}
        />

        {/* Chat Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Messages */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            <div className="flex-1 overflow-y-auto">
              <ChatLog 
                messages={messages}
                onEditMessage={handleEditMessage}
                onRegenerate={handleRegenerate}
                onReply={handleReply}
              />
            </div>
            
            {/* Chat Input */}
            <ChatInput
              onSendMessage={handleSendMessage}
              selectedModel={selectedModel}
              replyTo={replyTo ? {
                id: replyTo.id,
                content: replyTo.content,
                role: replyTo.role
              } : undefined}
              onCancelReply={handleCancelReply}
            />
          </div>

          {/* Canvas Panel */}
          {canvasOpen && (
            <div className="flex-shrink-0">
              <CanvasPanel
                isOpen={canvasOpen}
                onClose={toggleCanvas}
                width={400}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ModelPanel
        isOpen={modelPanelOpen}
        onClose={() => setModelPanelOpen(false)}
        selectedModel={selectedModel}
        onModelSelect={handleModelSelect}
        onOpenMarketplace={toggleMarketplacePanel}
        selectedMarketplaceModels={marketplaceModels}
      />

      <MarketplacePanel
        isOpen={marketplacePanelOpen}
        onClose={() => setMarketplacePanelOpen(false)}
        selectedModels={marketplaceModels.map(m => m.id)}
        onApplyModels={handleMarketplaceModels}
      />
    </div>
  );
}
