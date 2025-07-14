// frontend/pages/index.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar/Sidebar.js';
import InspectorPanel from '../components/shared/InspectorPanel';
import ChatHeader from '../components/chat/ChatHeader';
import ChatLog from '../components/chat/ChatLog';
import ChatInput from '../components/chat/ChatInput';
import ModelPanel from '../components/modals/ModelPanel.js';
import ResizablePanel from '../components/shared/ResizablePanel';
import MarketplacePanel from '../components/marketplace/MarketplacePanel.js'; // Import the new Marketplace Panel

const ChatPage = () => {
  // --- Start Theme Management Update ---
  const [theme, setTheme] = useState('light'); // 'light', 'dark'
  
  // State for selected models from marketplace
  const [selectedModels, setSelectedModels] = useState([]);

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
        text: "Hello world! I'm an AI assistant ready to help you with any questions you might have. Feel free to ask me anything!",
        meta: { tokens: 20, cost: '$0.0002' },
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
  
  // Set theme in both state and document
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Initialize theme on component mount
  useEffect(() => {
    // Check for system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    // Set initial theme based on saved preference or system preference
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    handleThemeChange(initialTheme);
    
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        handleThemeChange(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Save theme preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModelPanelOpen, setIsModelPanelOpen] = useState(false);
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false); // <-- New state for Marketplace
  
  // State for panel sizes with localStorage persistence
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [canvasWidth, setCanvasWidth] = useState(380);

  // Load sizes from localStorage on the client side
  useEffect(() => {
    const savedSidebarWidth = localStorage.getItem('sidebarWidth');
    if (savedSidebarWidth) {
      setSidebarWidth(parseInt(savedSidebarWidth, 10));
    }

    const savedCanvasWidth = localStorage.getItem('canvasWidth');
    if (savedCanvasWidth) {
      setCanvasWidth(parseInt(savedCanvasWidth, 10));
    }
  }, []);

  
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
  
  // --- New handler for Marketplace ---
  const handleOpenMarketplace = () => {
    setIsModelPanelOpen(false); // Close the model panel
    setIsMarketplaceOpen(true); // Open the marketplace
  };

  const handleCloseMarketplace = () => {
    setIsMarketplaceOpen(false);
  };
  // ------------------------------------

  const handleSidebarResize = (newWidth) => {
    setSidebarWidth(newWidth);
  };

  const handleCanvasResize = (newWidth) => {
    setCanvasWidth(newWidth);
  };

  // Function to handle applying selected models from marketplace
  const handleApplyModels = (models) => {
    setSelectedModels(models);
    setIsMarketplaceOpen(false);
  };

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <ResizablePanel
          isOpen={isSidebarOpen}
          direction="horizontal"
          initialSize={280}
          minSize={240}
          maxSize={400}
        >
          <Sidebar
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            theme={theme}
            setTheme={handleThemeChange}
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

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <ChatHeader
            onToggleTheme={() => handleThemeChange(theme === 'light' ? 'dark' : 'light')}
            isDarkMode={theme === 'dark'}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
            onToggleModelPanel={() => setIsModelPanelOpen(true)}
            onNewConversation={handleNewConversation}
            chatTitle={getActiveChatTitle()}
          />

          {/* Chat Messages */}
          <div className="flex-1 relative">
            <ChatLog messages={messages} />
          </div>

          {/* Chat Input */}
          <ChatInput
            onToggleCanvas={() => setIsCanvasOpen(!isCanvasOpen)}
            onSendMessage={handleSendMessage}
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
        onClose={() => setIsModelPanelOpen(false)}
        onOpenMarketplace={() => {
          setIsModelPanelOpen(false);
          setIsMarketplaceOpen(true);
        }}
        selectedModels={selectedModels.map(model => model.id)}
      />

      {/* Marketplace Panel Modal */}
      {isMarketplaceOpen && (
        <MarketplacePanel
          onClose={() => setIsMarketplaceOpen(false)}
          selectedModels={selectedModels.map(model => model.id)}
          onApplyModels={handleApplyModels}
        />
      )}
    </div>
  );
};

export default ChatPage;