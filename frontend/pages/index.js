// frontend/pages/index.js
import React, { useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar.js';
import InspectorPanel from '../components/shared/InspectorPanel';
import ChatHeader from '../components/chat/ChatHeader';
import ChatLog from '../components/chat/ChatLog';
import PromptSuggestions from '../components/chat/PromptSuggestions';
import ChatInput from '../components/chat/ChatInput';

const ChatPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleCanvas = () => {
    setIsCanvasOpen(!isCanvasOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <Sidebar />
      <main className="flex-grow flex flex-col flex-1">
        <ChatHeader onToggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <div className="flex-grow overflow-y-auto">
          <ChatLog />
        </div>
        <PromptSuggestions />
        <ChatInput onToggleCanvas={toggleCanvas} />
      </main>
      <InspectorPanel isOpen={isCanvasOpen} onClose={toggleCanvas} />
    </div>
  );
};

export default ChatPage;