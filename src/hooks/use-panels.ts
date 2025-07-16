"use client";

import { useState, useEffect } from "react";
import { AIModel, availableModels } from "@/data/models";
import { Message } from "@/components/chat/chat-message";

export interface PanelState {
  sidebar: boolean;
  canvas: boolean;
  modelPanel: boolean;
  marketplace: boolean;
}

export interface ChatState {
  selectedModel: AIModel;
  marketplaceModels: AIModel[];
  messages: Message[];
  replyTo: Message | null;
}

export function usePanels() {
  const [panels, setPanels] = useState<PanelState>({
    sidebar: true,
    canvas: false,
    modelPanel: false,
    marketplace: false,
  });

  const [chat, setChat] = useState<ChatState>({
    selectedModel: availableModels[0],
    marketplaceModels: [],
    messages: [
      {
        id: '1',
        content: 'Hello! How can I help you today?',
        role: 'assistant',
        timestamp: new Date(),
      }
    ],
    replyTo: null,
  });

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

  // Panel toggles
  const toggleSidebar = () => 
    setPanels(prev => ({ ...prev, sidebar: !prev.sidebar }));
  
  const toggleCanvas = () => 
    setPanels(prev => ({ ...prev, canvas: !prev.canvas }));
  
  const toggleModelPanel = () => 
    setPanels(prev => ({ ...prev, modelPanel: !prev.modelPanel }));
  
  const toggleMarketplace = () => 
    setPanels(prev => ({ ...prev, marketplace: !prev.marketplace, modelPanel: false }));

  // Chat actions
  const sendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: `I received your message: "${content}". This is a simulated response using ${chat.selectedModel.name}.`,
      role: 'assistant',
      timestamp: new Date(),
    };

    setChat(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage, assistantMessage],
      replyTo: null,
    }));
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
    const regeneratedContent = `This is a regenerated response using ${chat.selectedModel.name}. [Regenerated at ${new Date().toLocaleTimeString()}]`;
    setChat(prev => ({
      ...prev,
      messages: prev.messages.map(msg => 
        msg.id === messageId ? { ...msg, content: regeneratedContent } : msg
      ),
    }));
  };

  const replyToMessage = (message: Message) => {
    setChat(prev => ({ ...prev, replyTo: message }));
  };

  const cancelReply = () => {
    setChat(prev => ({ ...prev, replyTo: null }));
  };

  const selectModel = (model: AIModel) => {
    setChat(prev => ({ ...prev, selectedModel: model }));
  };

  const applyMarketplaceModels = (models: AIModel[]) => {
    setChat(prev => ({
      ...prev,
      marketplaceModels: models,
      selectedModel: models.length > 0 ? models[0] : prev.selectedModel,
    }));
    setPanels(prev => ({ ...prev, marketplace: false }));
  };

  const newConversation = () => {
    setChat(prev => ({
      ...prev,
      messages: [
        {
          id: Date.now().toString(),
          content: 'Hello! How can I help you today?',
          role: 'assistant',
          timestamp: new Date(),
        }
      ],
      replyTo: null,
    }));
  };

  return {
    // State
    panels,
    chat,
    
    // Panel actions
    toggleSidebar,
    toggleCanvas,
    toggleModelPanel,
    toggleMarketplace,
    
    // Chat actions
    sendMessage,
    editMessage,
    regenerateMessage,
    replyToMessage,
    cancelReply,
    selectModel,
    applyMarketplaceModels,
    newConversation,
  };
}
