import React, { useState, useEffect } from 'react'; // Import useEffect
import Sidebar from '../components/sidebar/Sidebar.js';
import InspectorPanel from '../components/shared/InspectorPanel';
import ChatHeader from '../components/chat/ChatHeader';
import ChatLog from '../components/chat/ChatLog';
import PromptSuggestions from '../components/chat/PromptSuggestions';
import ChatInput from '../components/chat/ChatInput';
import ModelPanel from '../components/modals/ModelPanel.js';

const ChatPage = () => {
  // --- Start Theme Management Update ---
  const [theme, setTheme] = useState('light'); // 'light', 'dark'
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);
  
  const isDarkMode = theme === 'dark';
  // --- End Theme Management Update ---

  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModelPanelOpen, setIsModelPanelOpen] = useState(false);
  
  const toggleCanvas = () => setIsCanvasOpen(!isCanvasOpen);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleModelPanel = () => setIsModelPanelOpen(!isModelPanelOpen);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={toggleSidebar} 
        theme={theme}
        setTheme={setTheme}
      />
      
      <ModelPanel isOpen={isModelPanelOpen} onClose={toggleModelPanel} />

      <div className="relative flex-grow flex flex-col flex-1">
        <main className="flex-grow flex flex-col flex-1">
          <ChatHeader
            onToggleTheme={() => setTheme(isDarkMode ? 'light' : 'dark')} // Simple toggle for header button
            isDarkMode={isDarkMode}
            onToggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
            onToggleModelPanel={toggleModelPanel}
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