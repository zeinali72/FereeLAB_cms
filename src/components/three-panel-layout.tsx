"use client";

import { useState, useEffect } from "react";
import { Activity } from "lucide-react";
import { Sidebar } from "@/components/sidebar/sidebar";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatLog } from "@/components/chat/chat-log";
import { ModelPanel } from "@/components/modals/model-panel";
import { MarketplacePanel } from "@/components/modals/marketplace-panel";
import { SettingsPanel } from "@/components/modals/settings-panel";
import { UserMenuPanel } from "@/components/modals/user-menu-panel";
import { ResizablePanel } from "@/components/shared/resizable-panel";
import { usePanels, Message } from "@/hooks/use-panels";
import { useChatManager } from "@/hooks/useChatManager";
import { useUIStore } from "@/store/useUIStore";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { MarkdownCanvas } from "./shared/markdown-canvas";
import { PromptSuggestions } from "./chat/prompt-suggestions";
import { HelpButton } from "./shared/help-button";
import { AttachmentPanel } from "./shared/progressive-blur-backdrop";

export function ThreePanelLayout() {
  // Use the comprehensive panels hook for UI state
  const {
    // Panel state
    panels,
    dimensions,
    
    // Chat state (keeping some for compatibility)
    chat,
    
    // Panel actions
    toggleSidebar,
    toggleCanvas,
    toggleModelPanel,
    toggleMarketplace,
    toggleUserMenu,
    closeAllPanels,
    handleSidebarResize,
    handleCanvasResize,
    
    // Chat actions from old hook (some will be replaced)
    editMessage,
    regenerateMessage,
    // replyToMessage, // Now using from chat manager
    // cancelReply,   // Now using from chat manager
    handleApplyModels,
    
    // Project state
    projects,
    projectActions,
    switchToProjectChat,
  } = usePanels();

  // Use the new chat manager for actual chat functionality
  const {
    messages,
    selectedModel,
    models,
    isLoading,
    isStreaming,
    conversations,
    currentConversation,
    replyTo,
    sendMessage,
    setSelectedModel,
    startNewConversation,
    switchToConversation,
    deleteConversation,
    replyToMessage,
    cancelReply,
  } = useChatManager();

  // UI store for additional UI state
  const { 
    showLoginModal,
    showSignupModal,
    setShowLoginModal,
    setShowSignupModal 
  } = useUIStore();

  const { theme, setTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
  const [userMenuPosition, setUserMenuPosition] = useState({ top: 0, right: 0 });
  const [attachmentPanelOpen, setAttachmentPanelOpen] = useState(false);
  
  // Determine if this is a new conversation (no messages)
  const isNewConversation = messages.length === 0;
  
  // Check if processing (loading or streaming)
  const isProcessing = isLoading || isStreaming;

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
    startNewConversation();
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

  const handleAssignToProject = (message: Message) => {
    // TODO: Implement project assignment functionality
    console.log('Assigning message to project:', message);
  };

  const handleQuoteInReply = (message: Message) => {
    // Set up a quoted reply
    replyToMessage({
      ...message,
      content: `> ${message.content}\n\n`
    });
  };

  const handleAttachFile = (source: string) => {
    console.log('Attaching file from:', source);
    // TODO: Implement file attachment based on source
    setAttachmentPanelOpen(false);
  };

  // Handle message sending with our new chat manager
  const handleSendWithProcessing = async (message: string) => {
    try {
      await sendMessage(message);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };
  
  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Left Panel: Sidebar */}
      {!isMobile && panels.sidebar && (
        <div className="flex-shrink-0 transition-all duration-300 ease-in-out">
          <ResizablePanel
            initialSize={dimensions.sidebarWidth}
            minSize={240}
            maxSize={400}
            onResize={handleSidebarResize}
            className="panel-sidebar border-r-0"
          >
            <Sidebar 
              onOpenSettings={() => setSettingsPanelOpen(true)} 
              onNewConversation={handleNewConversation}
            />
          </ResizablePanel>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && panels.sidebar && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="flex-1 bg-black/20 backdrop-blur-sm"
            onClick={toggleSidebar}
          />
          <div className="w-[280px] h-full panel-sidebar border-r-0">
            <Sidebar 
              onOpenSettings={() => setSettingsPanelOpen(true)} 
              onNewConversation={handleNewConversation}
            />
          </div>
        </div>
      )}

      {/* Gap between sidebar and chat */}
      {!isMobile && panels.sidebar && (
        <div className="w-3 panel-gap flex items-center justify-center">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-border/30 to-transparent"></div>
        </div>
      )}

      {/* Center Panel: Chat Area */}
      <div className={cn(
        "flex flex-col min-w-0 relative transition-all duration-500 ease-in-out flex-1 panel-chat",
        panels.canvas && !isMobile && "mr-0", // Remove margin when canvas is open since it's fixed position
        panels.canvas && !isMobile && `pr-[${dimensions.canvasWidth + 16}px]` // Add padding to make room for fixed canvas
      )}
      style={{
        paddingRight: panels.canvas && !isMobile ? `${dimensions.canvasWidth + 16}px` : '0'
      }}
      >
        {/* Chat Header */}
        <ChatHeader
          title="FereeLAB Chat"
          currentModel={selectedModel}
          onToggleModelPanel={toggleModelPanel}
          onNewConversation={handleNewConversation}
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={panels.sidebar}
          onUserMenuToggle={handleUserMenuToggle}
        />

        {/* Chat Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto">
            {isNewConversation ? (
              <div className="h-full flex flex-col items-center justify-center px-6 relative">
                {/* Welcome Section */}
                <div className="text-center mb-16 max-w-lg animate-fade-in surface-elevated rounded-2xl p-8 gradient-overlay-subtle">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6 depth-2">
                    <Activity className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent text-display">
                    Welcome to FereeLab Chat
                  </h3>
                  <p className="text-muted-foreground text-lg text-body">
                    Choose a prompt below to get started, or type your own message
                  </p>
                </div>

                {/* Prompt Suggestions - Centered on screen */}
                <div className="w-full max-w-2xl mb-20 animate-fade-in animation-delay-200">
                  <PromptSuggestions 
                    onSuggestionClick={(suggestion) => {
                      handleSendWithProcessing(suggestion);
                    }}
                    isFloating={false}
                  />
                </div>
              </div>
            ) : (
              <ChatLog
                messages={messages}
                onEditMessage={editMessage}
                onRegenerate={regenerateMessage}
                onReply={replyToMessage}
                onAssignToProject={handleAssignToProject}
                onQuoteInReply={handleQuoteInReply}
                replyTo={replyTo}
                onSuggestionClick={(suggestion) => {
                  handleSendWithProcessing(suggestion);
                }}
              />
            )}
          </div>

          {/* Chat Input - Positioned at bottom, enhanced with depth */}
          <div className="flex-shrink-0 p-4 bg-gradient-to-t from-background via-background to-transparent border-t border-border/50">
            <div className="max-w-4xl mx-auto">
              <ChatInput
                onSendMessage={handleSendWithProcessing}
                selectedModel={selectedModel}
                replyTo={replyTo ? {
                  id: replyTo.id,
                  content: replyTo.content,
                  role: replyTo.role
                } : undefined}
                onCancelReply={cancelReply}
                onToggleCanvas={toggleCanvas}
                isCanvasOpen={panels.canvas}
                isFloating={false}
                isNewConversation={isNewConversation}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Markdown Canvas - Fixed to right wall */}
      {!isMobile && panels.canvas && (
        <div className={cn(
          "fixed right-0 top-0 h-full panel-floating border-l border-border/50 transition-all duration-500 ease-in-out z-20 glass-strong",
          panels.canvas ? 'animate-canvas-in' : 'animate-canvas-out'
        )}
        style={{ width: `${dimensions.canvasWidth}px` }}
        >
          <ResizablePanel
            initialSize={dimensions.canvasWidth}
            minSize={300}
            maxSize={600}
            onResize={handleCanvasResize}
            className="h-full depth-transition"
            handlePosition="left"
          >
            <MarkdownCanvas
              isOpen={panels.canvas}
              onClose={toggleCanvas}
              messages={messages}
            />
          </ResizablePanel>
        </div>
      )}

      {/* Mobile Canvas as Overlay */}
      {isMobile && panels.canvas && (
        <div className={`fixed inset-0 z-40 panel-modal ${panels.canvas ? 'animate-slide-in-right' : 'animate-slide-out-right'}`}>
          <MarkdownCanvas
            isOpen={panels.canvas}
            onClose={toggleCanvas}
            messages={messages}
          />
        </div>
      )}

      {/* Modal Panels */}
      <ModelPanel
        isOpen={panels.modelPanel}
        onClose={toggleModelPanel}
        selectedModel={selectedModel}
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

      {/* Attachment Panel */}
      <AttachmentPanel
        isOpen={attachmentPanelOpen}
        onClose={() => setAttachmentPanelOpen(false)}
        onAttachFile={handleAttachFile}
      />

      {/* Help Button */}
      <HelpButton />
    </div>
  );
}
