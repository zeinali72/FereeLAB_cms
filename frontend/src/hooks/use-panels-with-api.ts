"use client";

import { useState, useEffect, useCallback } from "react";
import { api, AIModel as APIModel, Conversation, Message as APIMessage, UsageDashboard } from "@/lib/api";

// Frontend types (adapting from API types)
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
  // Additional fields from API
  model_id?: string;
  quality_score?: number;
  speed_score?: number;
  popularity_score?: number;
  supports_functions?: boolean;
  supports_vision?: boolean;
  is_featured?: boolean;
}

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  tokens?: number;
  cost?: number;
  model?: string;
  animate?: boolean;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  error_message?: string;
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
  conversation?: Conversation;
}

export interface PanelState {
  sidebar: boolean;
  canvas: boolean;
  modelPanel: boolean;
  marketplace: boolean;
  userMenu: boolean;
  usagePanel: boolean;
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
  isLoading: boolean;
  currentConversation: Conversation | null;
}

export interface ProjectState {
  projects: Project[];
  activeProjectId: string | null;
  activeProjectChatId: string | null;
  conversations: Conversation[];
  isLoading: boolean;
}

export interface UsageState {
  dashboard: UsageDashboard | null;
  isLoading: boolean;
  error: string | null;
}

// Convert API model to frontend model
function convertAPIModelToFrontend(apiModel: APIModel): AIModel {
  return {
    id: apiModel.model_id,
    name: apiModel.display_name,
    description: apiModel.description,
    context_length: apiModel.context_length,
    pricing: {
      prompt: apiModel.prompt_cost.toString(),
      completion: apiModel.completion_cost.toString(),
    },
    provider: {
      id: apiModel.provider.name,
      name: apiModel.provider.display_name,
    },
    icon: getModelIcon(apiModel.provider.name),
    maxTokens: apiModel.context_length,
    inputPrice: apiModel.prompt_cost,
    outputPrice: apiModel.completion_cost,
    model_id: apiModel.model_id,
    quality_score: apiModel.quality_score,
    speed_score: apiModel.speed_score,
    popularity_score: apiModel.popularity_score,
    supports_functions: apiModel.supports_functions,
    supports_vision: apiModel.supports_vision,
    is_featured: apiModel.is_featured,
  };
}

// Get icon for model provider
function getModelIcon(providerName: string): string {
  const icons: Record<string, string> = {
    'switchpoint': '🔄',
    'openai': '🤖',
    'anthropic': '🎭',
    'google': '✨',
    'mistralai': '🌊',
    'moonshot': '🌙',
  };
  return icons[providerName] || '🔮';
}

// Convert API message to frontend message
function convertAPIMessageToFrontend(apiMessage: APIMessage): Message {
  return {
    id: apiMessage.id,
    content: apiMessage.content,
    role: apiMessage.role as "user" | "assistant",
    timestamp: new Date(apiMessage.created_at),
    tokens: apiMessage.tokens_used,
    cost: apiMessage.cost,
    model: apiMessage.model_used,
    status: apiMessage.status,
    error_message: apiMessage.error_message,
  };
}

// Default model
const defaultModel: AIModel = {
  id: 'switchpoint/openrouter-4b',
  name: 'Switchpoint Router',
  description: 'Intelligent routing to the best model for your request',
  context_length: 128000,
  pricing: {
    prompt: '0.5',
    completion: '1.5'
  },
  provider: {
    id: 'switchpoint',
    name: 'Switchpoint'
  },
  icon: '🔄',
  maxTokens: 128000,
  inputPrice: 0.5,
  outputPrice: 1.5
};

export function usePanelsWithAPI() {
  const [panels, setPanels] = useState<PanelState>({
    sidebar: true,
    canvas: false,
    modelPanel: false,
    marketplace: false,
    userMenu: false,
    usagePanel: false,
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
    isLoading: false,
    currentConversation: null,
  });

  const [projects, setProjects] = useState<ProjectState>({
    projects: [],
    activeProjectId: null,
    activeProjectChatId: null,
    conversations: [],
    isLoading: false,
  });

  const [usage, setUsage] = useState<UsageState>({
    dashboard: null,
    isLoading: false,
    error: null,
  });

  const [shouldStartNewConversation, setShouldStartNewConversation] = useState(false);

  // Load initial data
  useEffect(() => {
    loadMarketplaceModels();
    loadConversations();
    loadUsageDashboard();
  }, []);

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

  // API functions
  const loadMarketplaceModels = useCallback(async () => {
    try {
      const apiModels = await api.getModels();
      const frontendModels = apiModels.map(convertAPIModelToFrontend);
      
      setChat(prev => ({
        ...prev,
        marketplaceModels: frontendModels,
        selectedModel: frontendModels[0] || defaultModel,
      }));
    } catch (error) {
      console.error('Failed to load marketplace models:', error);
      // Use default model if API fails
      setChat(prev => ({ ...prev, selectedModel: defaultModel }));
    }
  }, []);

  const loadConversations = useCallback(async () => {
    setProjects(prev => ({ ...prev, isLoading: true }));
    try {
      const conversations = await api.getConversations();
      setProjects(prev => ({ 
        ...prev, 
        conversations,
        isLoading: false,
        projects: [{
          id: 'main-project',
          name: 'Conversations',
          children: conversations.map(conv => ({
            id: conv.id,
            name: conv.title,
            projectId: 'main-project',
            conversation: conv,
          }))
        }]
      }));
    } catch (error) {
      console.error('Failed to load conversations:', error);
      setProjects(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const loadUsageDashboard = useCallback(async () => {
    setUsage(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const dashboard = await api.getUsageDashboard();
      setUsage(prev => ({ ...prev, dashboard, isLoading: false }));
    } catch (error) {
      console.error('Failed to load usage dashboard:', error);
      setUsage(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to load usage data'
      }));
    }
  }, []);

  const loadConversationMessages = useCallback(async (conversationId: string) => {
    try {
      const apiMessages = await api.getMessages(conversationId);
      const frontendMessages = apiMessages.map(convertAPIMessageToFrontend);
      
      setChat(prev => ({
        ...prev,
        messages: frontendMessages,
      }));
    } catch (error) {
      console.error('Failed to load conversation messages:', error);
    }
  }, []);

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

  const toggleUsagePanel = () =>
    setPanels(prev => ({ ...prev, usagePanel: !prev.usagePanel }));

  const closeAllPanels = () =>
    setPanels(prev => ({ 
      ...prev, 
      modelPanel: false, 
      marketplace: false, 
      userMenu: false,
      usagePanel: false,
    }));

  // Dimension handlers
  const handleSidebarResize = (newWidth: number) => {
    setDimensions(prev => ({ ...prev, sidebarWidth: newWidth }));
  };

  const handleCanvasResize = (newWidth: number) => {
    setDimensions(prev => ({ ...prev, canvasWidth: newWidth }));
  };

  // Chat actions
  const sendMessage = async (content: string, file?: File | null) => {
    setChat(prev => ({ ...prev, isLoading: true }));

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

    // Add user message immediately
    setChat(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      replyTo: null,
    }));

    try {
      const response = await api.sendMessage({
        message: content,
        conversation_id: chat.currentConversation?.id,
        model_id: chat.selectedModel.model_id || chat.selectedModel.id,
        temperature: 0.7,
        max_tokens: 2048,
      });

      if (response.success) {
        const assistantMessage = convertAPIMessageToFrontend(response.message);
        assistantMessage.animate = true;

        setChat(prev => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
          currentConversation: response.conversation,
          isLoading: false,
        }));

        // Refresh usage data after successful message
        loadUsageDashboard();
      } else {
        // Handle API error
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `Error: ${response.error || 'Failed to send message'}`,
          role: 'assistant',
          timestamp: new Date(),
          status: 'failed',
          error_message: response.error,
        };

        setChat(prev => ({
          ...prev,
          messages: [...prev.messages, errorMessage],
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Error: ${error instanceof Error ? error.message : 'Failed to send message'}`,
        role: 'assistant',
        timestamp: new Date(),
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      };

      setChat(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false,
      }));
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

  const regenerateMessage = async (messageId: string) => {
    try {
      const newMessage = await api.regenerateMessage(messageId);
      const frontendMessage = convertAPIMessageToFrontend(newMessage);
      frontendMessage.animate = true;

      const messageIndex = chat.messages.findIndex(msg => msg.id === messageId);
      if (messageIndex !== -1) {
        setChat(prev => ({
          ...prev,
          messages: [
            ...prev.messages.slice(0, messageIndex),
            frontendMessage,
            ...prev.messages.slice(messageIndex + 1)
          ],
        }));

        // Refresh usage data
        loadUsageDashboard();
      }
    } catch (error) {
      console.error('Failed to regenerate message:', error);
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
      currentConversation: null,
    }));
  };

  // Project actions
  const addProject = () => {
    // In API mode, projects are managed differently
    // This could trigger creating a new conversation group
    console.log('Add project functionality would be implemented here');
  };

  const addChat = async (projectId: string) => {
    try {
      const conversation = await api.createConversation({
        title: `New Chat ${Date.now()}`,
        model_id: chat.selectedModel.model_id || chat.selectedModel.id,
      });

      // Reload conversations to include the new one
      loadConversations();
    } catch (error) {
      console.error('Failed to create new chat:', error);
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

  const deleteChat = async (chatId: string) => {
    try {
      await api.deleteConversation(chatId);
      
      setProjects(prev => ({
        ...prev,
        projects: prev.projects.map(p => ({
          ...p,
          children: p.children?.filter(c => c.id !== chatId),
        })),
        activeProjectChatId: prev.activeProjectChatId === chatId ? null : prev.activeProjectChatId,
      }));

      // If this was the active chat, clear messages
      if (projects.activeProjectChatId === chatId) {
        setChat(prev => ({
          ...prev,
          messages: [],
          currentConversation: null,
        }));
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const switchToProjectChat = async (projectId: string, chatId: string) => {
    setProjects(prev => ({
      ...prev,
      activeProjectId: projectId,
      activeProjectChatId: chatId,
    }));

    // Load messages for this conversation
    const conversation = projects.conversations.find(c => c.id === chatId);
    if (conversation) {
      setChat(prev => ({
        ...prev,
        currentConversation: conversation,
      }));
      await loadConversationMessages(chatId);
    }
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
    
    // Usage state
    usage,
    
    // Flags
    shouldStartNewConversation,
    consumeNewConversationFlag,
    
    // Panel actions
    toggleSidebar,
    toggleCanvas,
    toggleModelPanel,
    toggleMarketplace,
    toggleUserMenu,
    toggleUsagePanel,
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
    
    // API actions
    loadMarketplaceModels,
    loadConversations,
    loadUsageDashboard,
    loadConversationMessages,
  };
}