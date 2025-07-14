import React from 'react';
import Sidebar from '../components/sidebar/Sidebar.js';
import InspectorPanel from '../components/shared/InspectorPanel';
import ChatHeader from '../components/chat/ChatHeader';
import ChatLog from '../components/chat/ChatLog';
import ChatInput from '../components/chat/ChatInput';
import ModelPanel from '../components/modals/ModelPanel.js';
import ResizablePanel from '../components/shared/ResizablePanel';
import MarketplacePanel from '../components/marketplace/MarketplacePanel.js';
import { useChatState } from '../hooks/useChatState.js';
import { useTheme } from '../hooks/useTheme.js';
import { usePanels } from '../hooks/usePanels.js';
import { mockModels } from '../data/mockModels.js';

const ChatPage = () => {
  const { theme, toggleTheme, setTheme } = useTheme();
  const {
    conversations,
    activeConversationId,
    projects,
    activeProjectId,
    activeProjectChatId,
    messages,
    replyTo,
    handleSendMessage,
    handleEditMessage,
    handleRegenerateResponse,
    handleFeedback,
    handleReply,
    cancelReply,
    handleNewConversation,
    handleSwitchConversation,
    handleRenameConversation,
    handleDeleteConversation,
    handleAddToProject,
    handleSwitchToProjectChat,
    handleProjectAction,
    getActiveChatTitle,
  } = useChatState();

  const {
    isCanvasOpen,
    isSidebarOpen,
    isModelPanelOpen,
    isMarketplaceOpen,
    selectedModels,
    sidebarWidth,
    canvasWidth,
    toggleCanvas,
    toggleSidebar,
    toggleModelPanel,
    handleOpenMarketplace,
    handleCloseMarketplace,
    handleSidebarResize,
    handleCanvasResize,
    handleApplyModels,
  } = usePanels();

  const selectedModelId = selectedModels.length > 0 ? selectedModels[0].id : null;

  const providers = React.useMemo(() => [...new Set(mockModels.map(m => m.provider.name))].map(name => ({ id: name, name })).sort((a,b) => a.name.localeCompare(b.name)), []);
  const categories = React.useMemo(() => [...new Set(mockModels.flatMap(m => m.categories))].map(name => ({ id: name, name })).sort((a,b) => a.name.localeCompare(b.name)), []);

  return (
    <div className={`h-screen flex flex-col bg-background text-on-background ${theme}`}>
      <div className="flex flex-1 overflow-hidden">
        <ResizablePanel
          isOpen={isSidebarOpen}
          direction="horizontal"
          initialSize={sidebarWidth}
          minSize={240}
          maxSize={400}
          onResize={handleSidebarResize}
        >
          <Sidebar
            theme={theme}
            setTheme={setTheme}
            conversations={conversations}
            activeConversationId={activeConversationId}
            onNewConversation={handleNewConversation}
            onSwitchConversation={handleSwitchConversation}
            onRenameConversation={handleRenameConversation}
            onDeleteConversation={handleDeleteConversation}
            onAddToProject={handleAddToProject}
            projects={projects}
            activeProjectId={activeProjectId}
            activeProjectChatId={activeProjectChatId}
            onProjectAction={handleProjectAction}
            onSwitchToProjectChat={handleSwitchToProjectChat}
          />
        </ResizablePanel>

        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatHeader
            onToggleTheme={toggleTheme}
            isDarkMode={theme === 'dark'}
            onToggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
            onToggleModelPanel={toggleModelPanel}
            onNewConversation={handleNewConversation}
            chatTitle={getActiveChatTitle()}
          />

          <div className="flex-1 relative">
            <ChatLog
              messages={messages}
              onEditMessage={handleEditMessage}
              onRegenerateResponse={handleRegenerateResponse}
              onFeedback={handleFeedback}
              onReply={handleReply}
            />
          </div>

          <ChatInput
            onSendMessage={handleSendMessage}
            onToggleCanvas={toggleCanvas}
            isCanvasOpen={isCanvasOpen}
            selectedModel={selectedModelId}
            replyTo={replyTo}
            cancelReply={cancelReply}
          />
        </div>

        {isCanvasOpen && (
          <ResizablePanel
            direction="horizontal"
            initialSize={canvasWidth}
            minSize={300}
            maxSize={600}
            onResize={handleCanvasResize}
            className="bg-surface border-l border-outline-variant flex-shrink-0"
            handlePosition="left"
          >
            <InspectorPanel
              isOpen={isCanvasOpen}
              onClose={toggleCanvas}
              width={canvasWidth}
            />
          </ResizablePanel>
        )}
      </div>

      <ModelPanel
        isOpen={isModelPanelOpen}
        onClose={toggleModelPanel}
        onOpenMarketplace={handleOpenMarketplace}
        selectedModels={selectedModels.map(model => model.id)}
      />

      {isMarketplaceOpen && (
        <MarketplacePanel
          onClose={handleCloseMarketplace}
          selectedModels={selectedModels.map(model => model.id)}
          onApplyModels={handleApplyModels}
          providers={providers}
          categories={categories}
          mockModels={mockModels}
        />
      )}
    </div>
  );
};

export default ChatPage;
