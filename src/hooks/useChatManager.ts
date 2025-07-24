"use client";

import { useEffect, useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { useToast } from "@/components/ui/toast";
import { chatAPI, modelsAPI, handleStreamingResponse } from "@/lib/api";

export function useChatManager() {
  const { data: session } = useSession();
  const { user, setUser } = useAuthStore();
  const { addToast } = useToast();
  const {
    messages,
    selectedModel,
    models,
    isLoading,
    isStreaming,
    conversations,
    currentConversation,
    addMessage,
    updateMessage,
    setMessages,
    setSelectedModel,
    setModels,
    setLoading,
    setStreaming,
    setConversations,
    setCurrentConversation,
    createNewConversation,
  } = useChatStore();

  const { setGlobalLoading } = useUIStore();
  
  // Add local replyTo state (could be moved to store later)
  const [replyTo, setReplyTo] = useState<any>(null);

  // Sync session with auth store
  useEffect(() => {
    if (session?.user && !user) {
      setUser({
        id: session.user.id || "",
        email: session.user.email || "",
        name: session.user.name || "",
        image: session.user.image || undefined,
      });
    }
  }, [session, user, setUser]);

  // Load models on mount
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const loadModels = async () => {
      try {
        setLoading(true);
        const response = await modelsAPI.getModels();
        if (response.models) {
          setModels(response.models);
          
          // Set default model if none selected
          if (!selectedModel && response.models.length > 0) {
            const defaultModel = response.models.find(
              (model: any) => model.id === 'openrouter/switchpoint-router'
            ) || response.models[0];
            setSelectedModel(defaultModel);
          }
        }
      } catch (error) {
        console.error('Failed to load models:', error);
        // Set a fallback model to prevent null reference
        if (!selectedModel) {
          const fallbackModel = {
            id: 'openrouter/switchpoint-router',
            name: 'Switchpoint Router',
            description: 'Default model',
            provider: { id: 'switchpoint', name: 'Switchpoint' },
            maxTokens: 4000,
            inputPrice: 0,
            outputPrice: 0,
            context_length: 4000,
          };
          setSelectedModel(fallbackModel);
        }
      } finally {
        setLoading(false);
      }
    };

    if (models.length === 0) {
      loadModels();
    }
  }, [models.length, selectedModel, setLoading, setModels, setSelectedModel]);

  // Load chat history on mount for authenticated users
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    if (!session?.user?.id) return;

    const loadChatHistory = async () => {
      try {
        setLoading(true);
        
        console.log('Loading chat history for user:', session.user.id);
        
        // Add a longer delay to ensure session cookies are properly set
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const response = await chatAPI.getChatHistory({ limit: 50 });
        if (response.chats) {
          setConversations(response.chats);
          
          // Set the most recent conversation as current if none is selected
          if (!currentConversation && response.chats.length > 0) {
            setCurrentConversation(response.chats[0]);
          }
        }
        
        console.log('Chat history loaded successfully:', response.chats?.length || 0, 'chats');
      } catch (error) {
        console.error('Failed to load chat history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChatHistory();
  }, [session?.user?.id, setLoading, setConversations, setCurrentConversation]);

  // Send message with streaming support
  const sendMessage = useCallback(async (content: string, file?: File) => {
    if (!content.trim() && !file) return;
    if (!selectedModel) {
      console.error('No model selected');
      return;
    }

    const userMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user' as const,
      content: content.trim(),
      timestamp: new Date(),
      model: selectedModel?.id,
    };

    // Add user message immediately
    addMessage(userMessage);

    // Create assistant message placeholder for streaming
    const assistantMessageId = `msg_${Date.now()}_assistant`;
    const assistantMessage = {
      id: assistantMessageId,
      role: 'assistant' as const,
      content: '',
      timestamp: new Date(),
      isStreaming: true,
      model: selectedModel?.id,
    };

    addMessage(assistantMessage);

    try {
      setStreaming(true);
      setGlobalLoading(true);

      // Prepare messages for API
      const apiMessages = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      // Send streaming request
      const response = await chatAPI.sendMessageStream({
        messages: apiMessages,
        model: selectedModel,
      });

      let fullContent = '';

      // Handle streaming response
      await handleStreamingResponse(
        response,
        (chunk: string) => {
          fullContent += chunk;
          updateMessage(assistantMessageId, fullContent);
        },
        () => {
          // Streaming complete
          updateMessage(assistantMessageId, fullContent);
          setStreaming(false);
        },
        (error: Error) => {
          console.error('Streaming error:', error);
          updateMessage(assistantMessageId, 'Sorry, an error occurred while processing your message.');
          setStreaming(false);
        }
      );

      // Save conversation to database if user is authenticated
      if (session?.user?.id) {
        try {
          const conversationMessages = [...messages, userMessage, {
            ...assistantMessage,
            content: fullContent,
            isStreaming: false,
          }];

          if (currentConversation) {
            // Update existing conversation
            await chatAPI.updateChat({
              chatId: currentConversation.id,
              messages: conversationMessages,
            });
          } else {
            // Create new conversation
            const newConversation = await chatAPI.createChat({
              title: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
              messages: conversationMessages,
              model: selectedModel,
            });
            setCurrentConversation(newConversation);
          }
        } catch (error) {
          console.error('Failed to save conversation:', error);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      updateMessage(assistantMessageId, 'Sorry, an error occurred while processing your message.');
      setStreaming(false);
    } finally {
      setGlobalLoading(false);
    }
  }, [
    selectedModel,
    messages,
    currentConversation,
    session?.user?.id,
    addMessage,
    updateMessage,
    setStreaming,
    setGlobalLoading,
    setCurrentConversation,
  ]);

  // Start new conversation
  const startNewConversation = useCallback(async () => {
    try {
      // Clear current messages immediately for better UX
      setMessages([]);
      setCurrentConversation(null);
      
      // If user is authenticated, create a new chat in the database with optimistic UI
      if (session?.user?.id) {
        // Create optimistic conversation
        const optimisticConversation = {
          id: `temp-${Date.now()}`,
          title: 'New Chat',
          messages: [],
          model: selectedModel,
          userId: session.user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
          isPending: true // Mark as pending
        };
        
        // Update UI immediately
        setCurrentConversation(optimisticConversation);
        const updatedConversations = [optimisticConversation, ...conversations];
        setConversations(updatedConversations);
        
        try {
          // Create actual conversation on server
          const newConversation = await chatAPI.createChat({
            title: 'New Chat',
            messages: [],
            model: selectedModel,
          });
          
          // Replace optimistic conversation with real one
          setCurrentConversation(newConversation);
          const finalConversations = [newConversation, ...conversations];
          setConversations(finalConversations);
          
          // Show success notification
          addToast({
            message: "New conversation created successfully!",
            type: "success",
            duration: 2000
          });
          
        } catch (error) {
          console.error('Failed to create new conversation on server:', error);
          
          // Revert optimistic update
          setCurrentConversation(null);
          setConversations(conversations);
          
          // Show error notification
          addToast({
            message: "Failed to create new conversation. Please try again.",
            type: "error",
            duration: 4000
          });
        }
      } else {
        // For unauthenticated users, just create local conversation
        createNewConversation();
      }
    } catch (error) {
      console.error('Failed to create new conversation:', error);
      // Fallback to local conversation creation
      createNewConversation();
      setMessages([]);
    }
  }, [session?.user?.id, selectedModel, createNewConversation, setMessages, setCurrentConversation, setConversations]);

  // Switch to a conversation
  const switchToConversation = useCallback((conversation: any) => {
    setCurrentConversation(conversation);
    setMessages(conversation.messages || []);
  }, [setCurrentConversation, setMessages]);

  // Delete conversation
  const deleteConversation = useCallback(async (conversationId: string) => {
    if (!session?.user?.id) return;

    try {
      await chatAPI.deleteChat(conversationId);
      
      // Update local state
      const updatedConversations = conversations.filter(conv => conv.id !== conversationId);
      setConversations(updatedConversations);
      
      // If the deleted conversation was current, switch to another or create new
      if (currentConversation?.id === conversationId) {
        if (updatedConversations.length > 0) {
          switchToConversation(updatedConversations[0]);
        } else {
          startNewConversation();
        }
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  }, [
    session?.user?.id,
    conversations,
    currentConversation,
    setConversations,
    switchToConversation,
    startNewConversation,
  ]);

  // Edit message functionality
  const editMessage = useCallback((messageId: string, newContent: string) => {
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === messageId ? { ...msg, content: newContent } : msg
      )
    );
  }, [setMessages]);

  // Regenerate message functionality
  const regenerateMessage = useCallback(async (messageId: string) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex !== -1 && messages[messageIndex].role === 'assistant') {
      try {
        setStreaming(true);
        setGlobalLoading(true);

        // Get all messages up to the one being regenerated
        const previousMessages = messages.slice(0, messageIndex);
        
        // Prepare messages for API
        const apiMessages = previousMessages.map(msg => ({
          role: msg.role,
          content: msg.content,
        }));

        // Send streaming request for regeneration
        const response = await chatAPI.sendMessageStream({
          messages: apiMessages,
          model: selectedModel,
        });

        let fullContent = '';
        const newMessageId = `msg_${Date.now()}_regenerated`;

        // Create new regenerated message
        const regeneratedMessage = {
          id: newMessageId,
          role: 'assistant' as const,
          content: '',
          timestamp: new Date(),
          isStreaming: true,
          model: selectedModel?.id,
        };

        // Replace the old message with the new one
        setMessages(prevMessages => [
          ...prevMessages.slice(0, messageIndex),
          regeneratedMessage,
          ...prevMessages.slice(messageIndex + 1)
        ]);

        // Handle streaming response
        await handleStreamingResponse(
          response,
          (chunk: string) => {
            fullContent += chunk;
            setMessages(prevMessages => 
              prevMessages.map(msg => 
                msg.id === newMessageId ? { ...msg, content: fullContent } : msg
              )
            );
          },
          () => {
            // Streaming complete
            setMessages(prevMessages => 
              prevMessages.map(msg => 
                msg.id === newMessageId ? { ...msg, content: fullContent, isStreaming: false } : msg
              )
            );
            setStreaming(false);
          },
          (error: Error) => {
            console.error('Regeneration error:', error);
            setMessages(prevMessages => 
              prevMessages.map(msg => 
                msg.id === newMessageId ? { ...msg, content: 'Sorry, an error occurred while regenerating the message.', isStreaming: false } : msg
              )
            );
            setStreaming(false);
          }
        );

        // Save updated conversation to database if user is authenticated
        if (session?.user?.id && currentConversation) {
          try {
            const updatedMessages = messages.map((msg, idx) => 
              idx === messageIndex ? { ...msg, content: fullContent, isStreaming: false } : msg
            );

            await chatAPI.updateChat({
              chatId: currentConversation.id,
              messages: updatedMessages,
            });
          } catch (error) {
            console.error('Failed to save regenerated conversation:', error);
          }
        }
      } catch (error) {
        console.error('Failed to regenerate message:', error);
        setStreaming(false);
      } finally {
        setGlobalLoading(false);
      }
    }
  }, [messages, selectedModel, session?.user?.id, currentConversation, setMessages, setStreaming, setGlobalLoading]);

  // Rename conversation
  const renameConversation = useCallback(async (conversationId: string, newTitle: string) => {
    if (!session?.user?.id) return;

    try {
      // Update local state immediately for better UX
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === conversationId ? { ...conv, title: newTitle } : conv
        )
      );

      // Update current conversation if it's the one being renamed
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(prev => prev ? { ...prev, title: newTitle } : null);
      }

      // Update on server
      await chatAPI.updateChat({
        chatId: conversationId,
        title: newTitle,
      });

      addToast({
        message: "Conversation renamed successfully!",
        type: "success",
        duration: 2000
      });
    } catch (error) {
      console.error('Failed to rename conversation:', error);
      
      // Revert local changes on error
      // We could fetch fresh data here, but for now just show an error
      addToast({
        message: "Failed to rename conversation. Please try again.",
        type: "error",
        duration: 4000
      });
    }
  }, [session?.user?.id, currentConversation, setConversations, setCurrentConversation, addToast]);

  // Reply functionality
  const replyToMessage = useCallback((message: any) => {
    setReplyTo(replyTo?.id === message.id ? null : message);
  }, [replyTo]);

  const cancelReply = useCallback(() => {
    setReplyTo(null);
  }, []);

  return {
    // State
    messages,
    selectedModel,
    models,
    isLoading,
    isStreaming,
    conversations,
    currentConversation,
    replyTo,
    
    // Actions
    sendMessage,
    setSelectedModel,
    startNewConversation,
    switchToConversation,
    deleteConversation,
    renameConversation,
    replyToMessage,
    cancelReply,
    editMessage,
    regenerateMessage,
  };
}