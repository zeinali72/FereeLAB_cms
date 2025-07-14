// frontend/pages/index.js
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

const ChatPage = () => {
  const { theme, toggleTheme, setTheme } = useTheme();
  const {
    conversations,
    activeConversationId,
    projects,
    activeProjectId,
    activeProjectChatId,
    messages,
    handleSendMessage,
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

  // Get the currently selected model ID
  const selectedModelId = selectedModels.length > 0 ? selectedModels[0].id : null;

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <ResizablePanel
          isOpen={isSidebarOpen}
          direction="horizontal"
          initialSize={sidebarWidth}
          minSize={240}
          maxSize={400}
          onResize={handleSidebarResize}
        >
          <Sidebar
            isOpen={isSidebarOpen}
            onToggle={toggleSidebar}
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

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <ChatHeader
            onToggleTheme={toggleTheme}
            isDarkMode={theme === 'dark'}
            onToggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
            onToggleModelPanel={toggleModelPanel}
            onNewConversation={handleNewConversation}
            chatTitle={getActiveChatTitle()}
          />

          {/* Chat Messages */}
          <div className="flex-1 relative">
            <ChatLog messages={messages} />
          </div>

          {/* Chat Input */}
          <ChatInput
            onToggleCanvas={toggleCanvas}
            onSendMessage={handleSendMessage}
            isCanvasOpen={isCanvasOpen}
            selectedModel={selectedModelId}
          />
        </div>

        {/* Inspector Panel */}
        {isCanvasOpen && (
          <ResizablePanel
            direction="horizontal"
            initialSize={canvasWidth}
            minSize={300}
            maxSize={600}
            onResize={handleCanvasResize}
            className="bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex-shrink-0"
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

      {/* Models Panel Modal */}
      <ModelPanel
        isOpen={isModelPanelOpen}
        onClose={toggleModelPanel}
        onOpenMarketplace={handleOpenMarketplace}
        selectedModels={selectedModels.map(model => model.id)}
      />

      {/* Marketplace Panel Modal */}
      {isMarketplaceOpen && (
        <MarketplacePanel
          onClose={handleCloseMarketplace}
          selectedModels={selectedModels.map(model => model.id)}
          onApplyModels={handleApplyModels}
        />
      )}
    </div>
  );
};

export default ChatPage;
