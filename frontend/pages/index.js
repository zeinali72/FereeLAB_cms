import React, { useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar.js';
import InspectorPanel from '../components/shared/InspectorPanel';
import ChatHeader from '../components/chat/ChatHeader';
import ChatLog from '../components/chat/ChatLog';
import PromptSuggestions from '../components/chat/PromptSuggestions';
import ChatInput from '../components/chat/ChatInput';
import ModelPanel from '../components/modals/ModelPanel.js'; // Import the new component

const ChatPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModelPanelOpen, setIsModelPanelOpen] = useState(false); // State for the new panel

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleCanvas = () => {
    setIsCanvasOpen(!isCanvasOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleModelPanel = () => {
    setIsModelPanelOpen(!isModelPanelOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      
      {/* Conditionally render the Model Panel */}
      <ModelPanel isOpen={isModelPanelOpen} onClose={toggleModelPanel} />

      <div className="relative flex-grow flex flex-col flex-1">
        <main className="flex-grow flex flex-col flex-1">
          <ChatHeader
            onToggleTheme={toggleTheme}
            isDarkMode={isDarkMode}
            onToggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
            onToggleModelPanel={toggleModelPanel} // Pass the toggle function
          />
          <div className="flex-grow overflow-y-auto">
            <ChatLog />
          </div>
          <PromptSuggestions />
          <ChatInput onToggleCanvas={toggleCanvas} />
        </main>
      </div>
      <InspectorPanel isOpen={isCanvasOpen} onClose={toggleCanvas} />
    </div>
  );
};

export default ChatPage;