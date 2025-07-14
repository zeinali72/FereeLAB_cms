import React, { useState, useEffect } from 'react'; // Import useEffect
import Sidebar from '../components/sidebar/Sidebar.js';
import InspectorPanel from '../components/shared/InspectorPanel';
import ChatHeader from '../components/chat/ChatHeader';
import ChatLog from '../components/chat/ChatLog';
import PromptSuggestions from '../components/chat/PromptSuggestions';
import ChatInput from '../components/chat/ChatInput';
import ModelPanel from '../components/modals/ModelPanel.js';
import ResizablePanel from '../components/shared/ResizablePanel';

const ChatPage = () => {
  // --- Start Theme Management Update ---
  const [theme, setTheme] = useState('light'); // 'light', 'dark'
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Add global style for resize operation
    const style = document.createElement('style');
    style.innerHTML = `
      .resize-active {
        user-select: none !important;
        cursor: col-resize !important;
      }
      .resize-active * {
        user-select: none !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [theme]);
  
  const isDarkMode = theme === 'dark';
  // --- End Theme Management Update ---

  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModelPanelOpen, setIsModelPanelOpen] = useState(false);
  
  // State for panel sizes with localStorage persistence
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('sidebarWidth');
    return saved ? parseInt(saved, 10) : 280;
  });
  const [canvasWidth, setCanvasWidth] = useState(() => {
    const saved = localStorage.getItem('canvasWidth');
    return saved ? parseInt(saved, 10) : 380;
  });
  
  // Save sizes to localStorage when they change
  useEffect(() => {
    localStorage.setItem('sidebarWidth', sidebarWidth);
  }, [sidebarWidth]);
  
  useEffect(() => {
    localStorage.setItem('canvasWidth', canvasWidth);
  }, [canvasWidth]);
  
  const toggleCanvas = () => setIsCanvasOpen(!isCanvasOpen);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleModelPanel = () => setIsModelPanelOpen(!isModelPanelOpen);

  const handleSidebarResize = (newWidth) => {
    setSidebarWidth(newWidth);
  };

  const handleCanvasResize = (newWidth) => {
    setCanvasWidth(newWidth);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      {/* Resizable Sidebar */}
      <ResizablePanel 
        direction="horizontal"
        initialSize={sidebarWidth}
        minSize={250}
        maxSize={450}
        isOpen={isSidebarOpen}
        onResize={handleSidebarResize}
        className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden"
        handlePosition="right"
      >
        <Sidebar 
          isOpen={isSidebarOpen} 
          onToggle={toggleSidebar} 
          theme={theme}
          setTheme={setTheme}
          width={sidebarWidth}
        />
      </ResizablePanel>
      
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

      {/* Resizable Canvas/Inspector Panel */}
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
  );
};

export default ChatPage;