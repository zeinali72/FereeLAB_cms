import React, { useState, useEffect } from 'react'; // Import useEffect
import Sidebar from '../components/sidebar/Sidebar.js';
import InspectorPanel from '../components/shared/InspectorPanel';
import ChatHeader from '../components/chat/ChatHeader';
import ChatLog from '../components/chat/ChatLog';
import ChatInput from '../components/chat/ChatInput';
import ModelPanel from '../components/modals/ModelPanel.js';
import ResizablePanel from '../components/shared/ResizablePanel';

const ChatPage = () => {
  // --- Start Theme Management Update ---
  const [theme, setTheme] = useState('light'); // 'light', 'dark'
  
  // Sample projects data
  const initialProjects = [
    { 
      id: 'proj-1', 
      name: 'Project A', 
      children: [
        { id: 'chat-1', name: 'Initial discussion', type: 'chat', messages: [
          {
            id: 101,
            sender: 'user',
            text: 'Project A - Initial discussion message',
            meta: { tokens: 7, cost: '$0.0001' },
            name: 'User'
          },
          {
            id: 102,
            sender: 'bot',
            text: "This is a response in the Project A initial discussion.",
            meta: { tokens: 10, cost: '$0.0001' },
          },
        ] }, 
        { id: 'chat-2', name: 'Design meeting', type: 'chat', messages: [] }
      ] 
    },
    { 
      id: 'proj-2', 
      name: 'Project B', 
      children: [
        { id: 'chat-3', name: 'API planning', type: 'chat', messages: [] }
      ] 
    },
  ];

  // Project state
  const [projects, setProjects] = useState(initialProjects);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [activeProjectChatId, setActiveProjectChatId] = useState(null);
  
  // Sample conversations data
  const initialConversations = [
    {
      id: 'conv-1',
      title: 'First Chat Session',
      timestamp: new Date(),
      messages: [
        {
          id: 1,
          sender: 'user',
          text: 'This is my first prompt',
          meta: { tokens: 4, cost: '$0.0001' },
          name: 'User'
        },
        {
          id: 2,
          sender: 'bot',
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae ex feugiat, varius nunc viverra in bibendum. Duis sit cursus pulvinar sit faucibus. Vitae vitae at tellus ultrices in. Commodo sed convallis in sit. Sed ut sed proin neque. Eget netus ipsum morbi condimentum quis amet sit. Varius et feugiat placerat in accumsan iaculis massa. Nibh neque feugiat faucibus interdum vitae varius in nibh. Non enim odio odio pellentesque risus congue a. A mauris imperdiet adipiscing cursus nunc. At arcu sem orci feugiat in massa massa. Liberum dignissim quis convallis aliquet magna nec fermentum sit. Velit turpis dui sagittis egestas duis aliquet. Duis donec urna iaculis et.",
          meta: { tokens: 152, cost: '$0.002' },
        },
      ]
    },
    {
      id: 'conv-2',
      title: 'Second Chat Session',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 1)),
      messages: [
        {
          id: 1,
          sender: 'user',
          text: 'Tell me about artificial intelligence',
          meta: { tokens: 5, cost: '$0.0002' },
          name: 'User'
        },
        {
          id: 2,
          sender: 'bot',
          text: "Artificial intelligence (AI) refers to the simulation of human intelligence processes by machines, especially computer systems. These processes include learning (acquiring information and rules for using the information), reasoning (using the rules to reach approximate or definite conclusions), and self-correction.",
          meta: { tokens: 42, cost: '$0.0008' },
        },
      ]
    }
  ];
  
  // Conversations state
  const [conversations, setConversations] = useState(initialConversations);
  
  // Current active conversation
  const [activeConversationId, setActiveConversationId] = useState(initialConversations[0].id);
  
  // Current messages (from the active conversation)
  const [messages, setMessages] = useState(initialConversations[0].messages);

  // Handle switching to a project chat
  const handleSwitchToProjectChat = (projectId, chatId) => {
    // Find the project and chat
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const chat = project.children.find(c => c.id === chatId);
    if (!chat) return;
    
    // Update active ids
    setActiveProjectId(projectId);
    setActiveProjectChatId(chatId);
    setActiveConversationId(null);
    
    // Set messages from this chat
    setMessages(chat.messages || []);
  };
  
  // Update messages when active conversation or project chat changes
  useEffect(() => {
    if (activeConversationId) {
      const activeConversation = conversations.find(c => c.id === activeConversationId);
      if (activeConversation) {
        setMessages(activeConversation.messages);
      }
    } else if (activeProjectId && activeProjectChatId) {
      const project = projects.find(p => p.id === activeProjectId);
      if (project) {
        const chat = project.children.find(c => c.id === activeProjectChatId);
        if (chat) {
          setMessages(chat.messages || []);
        }
      }
    }
  }, [activeConversationId, conversations, activeProjectId, activeProjectChatId, projects]);
  
  // Function to handle sending a new message
  const handleSendMessage = (text) => {
    // Create a new user message
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: text,
      meta: { tokens: text.split(' ').length, cost: '$0.0001' },
      name: 'User'
    };
    
    // Add user message to chat
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    if (activeConversationId) {
      // Update the conversation in the conversations list
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === activeConversationId 
            ? { ...conv, messages: updatedMessages, timestamp: new Date() }
            : conv
        )
      );
    } else if (activeProjectId && activeProjectChatId) {
      // Update the project chat messages
      setProjects(prevProjects => 
        prevProjects.map(proj => 
          proj.id === activeProjectId
            ? {
                ...proj,
                children: proj.children.map(chat => 
                  chat.id === activeProjectChatId
                    ? { ...chat, messages: updatedMessages }
                    : chat
                )
              }
            : proj
        )
      );
    }
    
    // Simulate bot response with "Hello world!"
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        sender: 'bot',
        text: "Hello world!",
        meta: { tokens: 2, cost: '$0.00005' },
      };
      
      const updatedMessagesWithResponse = [...updatedMessages, botResponse];
      setMessages(updatedMessagesWithResponse);
      
      if (activeConversationId) {
        // Update the conversation in the conversations list again with the bot response
        setConversations(prevConversations => 
          prevConversations.map(conv => 
            conv.id === activeConversationId 
              ? { ...conv, messages: updatedMessagesWithResponse }
              : conv
          )
        );
      } else if (activeProjectId && activeProjectChatId) {
        // Update the project chat messages with the bot response
        setProjects(prevProjects => 
          prevProjects.map(proj => 
            proj.id === activeProjectId
              ? {
                  ...proj,
                  children: proj.children.map(chat => 
                    chat.id === activeProjectChatId
                      ? { ...chat, messages: updatedMessagesWithResponse }
                      : chat
                  )
                }
              : proj
          )
        );
      }
    }, 500);
  };
  
  // Function to start a new conversation
  const handleNewConversation = () => {
    const newConversationId = `conv-${Date.now()}`;
    const newConversation = {
      id: newConversationId,
      title: `New Chat ${conversations.length + 1}`,
      timestamp: new Date(),
      messages: []
    };
    
    setConversations([newConversation, ...conversations]);
    setActiveConversationId(newConversationId);
    setActiveProjectId(null);
    setActiveProjectChatId(null);
    setMessages([]);
  };
  
  // Function to switch to an existing conversation
  const handleSwitchConversation = (conversationId) => {
    setActiveConversationId(conversationId);
    setActiveProjectId(null);
    setActiveProjectChatId(null);
  };
  
  // Function to rename a conversation
  const handleRenameConversation = (conversationId, newTitle) => {
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversationId 
          ? { ...conv, title: newTitle }
          : conv
      )
    );
  };
  
  // Function to handle project actions
  const handleProjectAction = {
    addProject: () => {
      const newProject = {
        id: `proj-${Date.now()}`,
        name: `New Project`,
        children: []
      };
      setProjects([newProject, ...projects]);
    },
    
    renameProject: (projectId, newName) => {
      setProjects(prevProjects => 
        prevProjects.map(proj => 
          proj.id === projectId
            ? { ...proj, name: newName }
            : proj
        )
      );
    },
    
    addChat: (projectId) => {
      const newChat = {
        id: `chat-${Date.now()}`,
        name: `New Chat`,
        type: 'chat',
        messages: []
      };
      
      setProjects(prevProjects => 
        prevProjects.map(proj => 
          proj.id === projectId
            ? { ...proj, children: [...proj.children, newChat] }
            : proj
        )
      );
      
      // Switch to the new chat
      handleSwitchToProjectChat(projectId, newChat.id);
    },
    
    renameChat: (projectId, chatId, newName) => {
      setProjects(prevProjects => 
        prevProjects.map(proj => 
          proj.id === projectId
            ? {
                ...proj,
                children: proj.children.map(chat => 
                  chat.id === chatId
                    ? { ...chat, name: newName }
                    : chat
                )
              }
            : proj
        )
      );
    }
  };
  
  // Get the active chat title (either from conversation or project)
  const getActiveChatTitle = () => {
    if (activeConversationId) {
      const conv = conversations.find(c => c.id === activeConversationId);
      return conv ? conv.title : "New Chat";
    } else if (activeProjectId && activeProjectChatId) {
      const project = projects.find(p => p.id === activeProjectId);
      if (project) {
        const chat = project.children.find(c => c.id === activeProjectChatId);
        return chat ? `${project.name} › ${chat.name}` : "New Chat";
      }
    }
    return "New Chat";
  };
  
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
        className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden h-screen"
        handlePosition="right"
      >
        <Sidebar 
          isOpen={isSidebarOpen} 
          onToggle={toggleSidebar} 
          theme={theme}
          setTheme={setTheme}
          width={sidebarWidth}
          conversations={conversations}
          activeConversationId={activeConversationId}
          onNewConversation={handleNewConversation}
          onSwitchConversation={handleSwitchConversation}
          onRenameConversation={handleRenameConversation}
          projects={projects}
          activeProjectId={activeProjectId}
          activeProjectChatId={activeProjectChatId}
          onProjectAction={handleProjectAction}
          onSwitchToProjectChat={handleSwitchToProjectChat}
        />
      </ResizablePanel>
      
      <ModelPanel isOpen={isModelPanelOpen} onClose={toggleModelPanel} />

      <div className="relative flex-grow flex flex-col flex-1">
        <main className="flex-grow flex flex-col h-full">
          <ChatHeader
            onToggleTheme={() => setTheme(isDarkMode ? 'light' : 'dark')} // Simple toggle for header button
            isDarkMode={isDarkMode}
            onToggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
            onToggleModelPanel={toggleModelPanel}
            onNewConversation={handleNewConversation}
            chatTitle={getActiveChatTitle()}
          />
          <div className="flex-grow overflow-hidden relative">
            <ChatLog messages={messages} />
          </div>
          <ChatInput onToggleCanvas={toggleCanvas} onSendMessage={handleSendMessage} />
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