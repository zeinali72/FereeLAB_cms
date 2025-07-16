"use client";

import { useState, useEffect } from "react";

// Types
export interface AIModel {
  id: string;
  name: string;
  description: string;
  context_length: number;
  pricing: {
    prompt: string;
    completion: string;
  };
  provider: {
    id: string;
    name: string;
  };
  icon?: string;
  maxTokens?: number;
  inputPrice?: number;
  outputPrice?: number;
}

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  tokens?: number;
  inputCost?: number;
  outputCost?: number;
  model?: string;
  animate?: boolean;
  replyTo?: {
    id: string;
    content: string;
    role: "user" | "assistant";
  };
}

export interface Project {
  id: string;
  name: string;
  children?: Chat[];
}

export interface Chat {
  id: string;
  name: string;
  projectId: string;
}

export interface PanelState {
  sidebar: boolean;
  canvas: boolean;
  modelPanel: boolean;
  marketplace: boolean;
  userMenu: boolean;
}

export interface PanelDimensions {
  sidebarWidth: number;
  canvasWidth: number;
}

export interface ChatState {
  selectedModel: AIModel;
  marketplaceModels: AIModel[];
  messages: Message[];
  replyTo: Message | null;
  isTemporary: boolean;
}

export interface ProjectState {
  projects: Project[];
  activeProjectId: string | null;
  activeProjectChatId: string | null;
}

// Default model
const defaultModel: AIModel = {
  id: 'openrouter/switchpoint-router',
  name: 'Switchpoint Router',
  description: 'Switchpoint AI routes instantly analyzes your request and directs it to the optimal AI from an ever-evolving library.',
  context_length: 162000,
  pricing: {
    prompt: '0.0',
    completion: '0.0'
  },
  provider: {
    id: 'switchpoint',
    name: 'Switchpoint'
  },
  icon: '🔄',
  maxTokens: 162000,
  inputPrice: 0.0,
  outputPrice: 0.0
};

export function usePanels() {
  const [panels, setPanels] = useState<PanelState>({
    sidebar: true,
    canvas: false,
    modelPanel: false,
    marketplace: false,
    userMenu: false,
  });

  const [dimensions, setDimensions] = useState<PanelDimensions>({
    sidebarWidth: 280,
    canvasWidth: 380,
  });

  const [chat, setChat] = useState<ChatState>({
    selectedModel: defaultModel,
    marketplaceModels: [],
    messages: [],
    replyTo: null,
    isTemporary: false,
  });

  const [projects, setProjects] = useState<ProjectState>({
    projects: [
      {
        id: 'project-1',
        name: 'Sample Project',
        children: [
          { id: 'chat-1', name: 'Main Chat', projectId: 'project-1' },
          { id: 'chat-2', name: 'Secondary Chat', projectId: 'project-1' },
        ]
      }
    ],
    activeProjectId: null,
    activeProjectChatId: null,
  });

  const [shouldStartNewConversation, setShouldStartNewConversation] = useState(false);

  // Load saved dimensions from localStorage
  useEffect(() => {
    const savedSidebarWidth = localStorage.getItem('sidebarWidth');
    const savedCanvasWidth = localStorage.getItem('canvasWidth');
    
    if (savedSidebarWidth || savedCanvasWidth) {
      setDimensions(prev => ({
        sidebarWidth: savedSidebarWidth ? parseInt(savedSidebarWidth, 10) : prev.sidebarWidth,
        canvasWidth: savedCanvasWidth ? parseInt(savedCanvasWidth, 10) : prev.canvasWidth,
      }));
    }
  }, []);

  // Save dimensions to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarWidth', dimensions.sidebarWidth.toString());
  }, [dimensions.sidebarWidth]);
  
  useEffect(() => {
    localStorage.setItem('canvasWidth', dimensions.canvasWidth.toString());
  }, [dimensions.canvasWidth]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setPanels(prev => ({ ...prev, sidebar: false }));
      } else {
        setPanels(prev => ({ ...prev, sidebar: true }));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Restore temporary chat on page refresh
  useEffect(() => {
    const tempMessages = sessionStorage.getItem('tempChatMessages');
    const isTemporaryFlag = sessionStorage.getItem('isTempChat');
    
    if (tempMessages && isTemporaryFlag === 'true') {
      try {
        const parsedMessages = JSON.parse(tempMessages);
        setChat(prev => ({
          ...prev,
          messages: parsedMessages,
          isTemporary: true,
        }));
      } catch (error) {
        console.error('Error parsing temporary chat messages:', error);
        sessionStorage.removeItem('tempChatMessages');
        sessionStorage.removeItem('isTempChat');
      }
    }
  }, []);

  // Save temporary chat flag to sessionStorage
  useEffect(() => {
    if (chat.isTemporary) {
      sessionStorage.setItem('isTempChat', 'true');
    } else {
      sessionStorage.removeItem('isTempChat');
      sessionStorage.removeItem('tempChatMessages');
    }
  }, [chat.isTemporary]);

  // Panel toggles
  const toggleSidebar = () => 
    setPanels(prev => ({ ...prev, sidebar: !prev.sidebar }));
  
  const toggleCanvas = () => 
    setPanels(prev => ({ ...prev, canvas: !prev.canvas }));
  
  const toggleModelPanel = () => 
    setPanels(prev => ({ ...prev, modelPanel: !prev.modelPanel }));
  
  const toggleMarketplace = () => 
    setPanels(prev => ({ 
      ...prev, 
      marketplace: !prev.marketplace, 
      modelPanel: false 
    }));

  const toggleUserMenu = () =>
    setPanels(prev => ({ ...prev, userMenu: !prev.userMenu }));

  const closeAllPanels = () =>
    setPanels(prev => ({ 
      ...prev, 
      modelPanel: false, 
      marketplace: false, 
      userMenu: false 
    }));

  // Dimension handlers
  const handleSidebarResize = (newWidth: number) => {
    setDimensions(prev => ({ ...prev, sidebarWidth: newWidth }));
  };

  const handleCanvasResize = (newWidth: number) => {
    setDimensions(prev => ({ ...prev, canvasWidth: newWidth }));
  };

  // Chat actions
  const sendMessage = (content: string, file?: File | null) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
      animate: true,
    };

    // Add file information if present
    if (file) {
      userMessage.content += ` [Attached: ${file.name}]`;
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: `I received your message: "${content}"${file ? ` with attached file "${file.name}"` : ''}. This is a simulated response using ${chat.selectedModel.name}.`,
      role: 'assistant',
      timestamp: new Date(),
      model: chat.selectedModel.name,
      animate: true,
    };

    const newMessages = [...chat.messages, userMessage, assistantMessage];

    setChat(prev => ({
      ...prev,
      messages: newMessages,
      replyTo: null,
    }));

    // For temporary chats, store in sessionStorage (clears on browser close)
    // For regular chats, would store in localStorage or database
    if (chat.isTemporary) {
      sessionStorage.setItem('tempChatMessages', JSON.stringify(newMessages));
    } else {
      // TODO: Implement persistent storage for regular chats
      // This would typically save to a database or localStorage
      console.log('Regular chat - would save to persistent storage');
    }
  };

  const editMessage = (messageId: string, newContent: string) => {
    setChat(prev => ({
      ...prev,
      messages: prev.messages.map(msg => 
        msg.id === messageId ? { ...msg, content: newContent } : msg
      ),
    }));
  };

  const regenerateMessage = (messageId: string) => {
    const messageIndex = chat.messages.findIndex(msg => msg.id === messageId);
    if (messageIndex !== -1 && chat.messages[messageIndex].role === 'assistant') {
      const newMessage: Message = {
        ...chat.messages[messageIndex],
        id: Date.now().toString(),
        content: `This is a regenerated response using ${chat.selectedModel.name}.`,
        timestamp: new Date(),
        animate: true,
      };
      
      setChat(prev => ({
        ...prev,
        messages: [
          ...prev.messages.slice(0, messageIndex),
          newMessage,
          ...prev.messages.slice(messageIndex + 1)
        ],
      }));
    }
  };

  const replyToMessage = (message: Message) => {
    setChat(prev => ({
      ...prev,
      replyTo: prev.replyTo?.id === message.id ? null : message,
    }));
  };

  const cancelReply = () => {
    setChat(prev => ({
      ...prev,
      replyTo: null,
    }));
  };

    const handleApplyModels = (models: AIModel[]) => {
    // Trigger new conversation when model changes
    if (chat.marketplaceModels.length === 0 || 
        (models.length > 0 && chat.marketplaceModels.length > 0 && models[0].id !== chat.marketplaceModels[0].id)) {
      setShouldStartNewConversation(true);
    }
    
    setChat(prev => ({
      ...prev,
      selectedModel: models[0] || defaultModel,
      marketplaceModels: models,
    }));
    
    setPanels(prev => ({ ...prev, marketplace: false }));
  };

  const startNewConversation = () => {
    setChat(prev => ({
      ...prev,
      messages: [],
      replyTo: null,
      isTemporary: false,
    }));
  };

  const startTemporaryChat = () => {
    setChat(prev => ({
      ...prev,
      messages: [],
      replyTo: null,
      isTemporary: true,
    }));
  };

  // Project actions
  const addProject = () => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: `New Project ${projects.projects.length + 1}`,
      children: [],
    };
    
    setProjects(prev => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
  };

  const addChat = (projectId: string) => {
    const project = projects.projects.find(p => p.id === projectId);
    if (project) {
      const newChat = {
        id: `chat-${Date.now()}`,
        name: `New Chat ${(project.children?.length || 0) + 1}`,
        projectId,
      };
      
      setProjects(prev => ({
        ...prev,
        projects: prev.projects.map(p => 
          p.id === projectId 
            ? { ...p, children: [...(p.children || []), newChat] }
            : p
        ),
      }));
    }
  };

  const renameProject = (projectId: string, newName: string) => {
    setProjects(prev => ({
      ...prev,
      projects: prev.projects.map(p => 
        p.id === projectId ? { ...p, name: newName } : p
      ),
    }));
  };

  const renameChat = (chatId: string, newName: string) => {
    setProjects(prev => ({
      ...prev,
      projects: prev.projects.map(p => ({
        ...p,
        children: p.children?.map(c => 
          c.id === chatId ? { ...c, name: newName } : c
        ),
      })),
    }));
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== projectId),
      activeProjectId: prev.activeProjectId === projectId ? null : prev.activeProjectId,
      activeProjectChatId: prev.activeProjectId === projectId ? null : prev.activeProjectChatId,
    }));
  };

  const deleteChat = (chatId: string) => {
    setProjects(prev => ({
      ...prev,
      projects: prev.projects.map(p => ({
        ...p,
        children: p.children?.filter(c => c.id !== chatId),
      })),
      activeProjectChatId: prev.activeProjectChatId === chatId ? null : prev.activeProjectChatId,
    }));
  };

  const switchToProjectChat = (projectId: string, chatId: string) => {
    setProjects(prev => ({
      ...prev,
      activeProjectId: projectId,
      activeProjectChatId: chatId,
    }));
  };

  // Reset the flag after it's been consumed
  const consumeNewConversationFlag = () => {
    const shouldStart = shouldStartNewConversation;
    setShouldStartNewConversation(false);
    return shouldStart;
  };

  return {
    // Panel state
    panels,
    dimensions,
    
    // Chat state
    chat,
    
    // Project state
    projects,
    
    // Flags
    shouldStartNewConversation,
    consumeNewConversationFlag,
    
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
    cancelReply,
    handleApplyModels,
    startNewConversation,
    startTemporaryChat,
    
    // Project actions
    projectActions: {
      addProject,
      addChat,
      renameProject,
      renameChat,
      deleteProject,
      deleteChat,
    },
    switchToProjectChat,
  };
}
