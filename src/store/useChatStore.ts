import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  model?: string;
  conversationId?: string;
  replyTo?: string;
  isStreaming?: boolean;
}

export interface ChatModel {
  id: string;
  name: string;
  description: string;
  provider: {
    id: string;
    name: string;
  };
  maxTokens: number;
  inputPrice: number;
  outputPrice: number;
  context_length: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  model: ChatModel | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  selectedModel: ChatModel | null;
  models: ChatModel[];
  isLoading: boolean;
  isStreaming: boolean;
  
  // Actions
  setConversations: (conversations: Conversation[]) => void;
  setCurrentConversation: (conversation: Conversation | null) => void;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, content: string) => void;
  deleteMessage: (messageId: string) => void;
  setMessages: (messages: Message[]) => void;
  setSelectedModel: (model: ChatModel | null) => void;
  setModels: (models: ChatModel[]) => void;
  setLoading: (loading: boolean) => void;
  setStreaming: (streaming: boolean) => void;
  createNewConversation: () => void;
  clearMessages: () => void;
  regenerateMessage: (messageId: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversation: null,
      messages: [],
      selectedModel: null,
      models: [],
      isLoading: false,
      isStreaming: false,

      setConversations: (conversations) =>
        set(() => ({ conversations })),

      setCurrentConversation: (conversation) =>
        set(() => ({
          currentConversation: conversation,
          messages: conversation?.messages || [],
        })),

      addMessage: (message) =>
        set((state) => {
          const newMessages = [...state.messages, message];
          const updatedConversation = state.currentConversation
            ? {
                ...state.currentConversation,
                messages: newMessages,
                updatedAt: new Date(),
              }
            : null;

          return {
            messages: newMessages,
            currentConversation: updatedConversation,
            conversations: state.conversations.map((conv) =>
              conv.id === updatedConversation?.id ? updatedConversation : conv
            ),
          };
        }),

      updateMessage: (messageId, content) =>
        set((state) => {
          const updatedMessages = state.messages.map((msg) =>
            msg.id === messageId ? { ...msg, content } : msg
          );
          const updatedConversation = state.currentConversation
            ? {
                ...state.currentConversation,
                messages: updatedMessages,
                updatedAt: new Date(),
              }
            : null;

          return {
            messages: updatedMessages,
            currentConversation: updatedConversation,
            conversations: state.conversations.map((conv) =>
              conv.id === updatedConversation?.id ? updatedConversation : conv
            ),
          };
        }),

      deleteMessage: (messageId) =>
        set((state) => {
          const filteredMessages = state.messages.filter((msg) => msg.id !== messageId);
          const updatedConversation = state.currentConversation
            ? {
                ...state.currentConversation,
                messages: filteredMessages,
                updatedAt: new Date(),
              }
            : null;

          return {
            messages: filteredMessages,
            currentConversation: updatedConversation,
            conversations: state.conversations.map((conv) =>
              conv.id === updatedConversation?.id ? updatedConversation : conv
            ),
          };
        }),

      setMessages: (messages) =>
        set(() => ({ messages })),

      setSelectedModel: (model) =>
        set(() => ({ selectedModel: model })),

      setModels: (models) =>
        set(() => ({ models })),

      setLoading: (loading) =>
        set(() => ({ isLoading: loading })),

      setStreaming: (streaming) =>
        set(() => ({ isStreaming: streaming })),

      createNewConversation: () =>
        set((state) => {
          const newConversation: Conversation = {
            id: `conv_${Date.now()}`,
            title: 'New Chat',
            messages: [],
            model: state.selectedModel,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          return {
            currentConversation: newConversation,
            messages: [],
            conversations: [newConversation, ...state.conversations],
          };
        }),

      clearMessages: () =>
        set(() => ({ messages: [] })),

      regenerateMessage: (messageId) => {
        // This will be implemented with the actual API call
        console.log('Regenerating message:', messageId);
      },
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        conversations: state.conversations,
        selectedModel: state.selectedModel,
        models: state.models,
      }),
    }
  )
);