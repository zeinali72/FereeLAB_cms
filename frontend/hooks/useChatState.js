import { useState, useEffect } from 'react';
import { estimateTokenCount } from '../utils/tokenCalculator';

// Default model
const defaultModel = {
  id: 'gemini-flash',
  name: 'Gemini Flash',
  provider: 'Google', 
  icon: '⚡️'
};

// (Keep initialConversations and initialProjects as they are)
const initialConversations = [
  {
    id: 'conv-1',
    title: 'First Chat Session',
    timestamp: new Date(),
    model: defaultModel,
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
    model: defaultModel,
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

const initialProjects = [
  { 
    id: 'proj-1', 
    name: 'Project A', 
    children: [
      { id: 'chat-1', name: 'Initial discussion', type: 'chat', model: defaultModel, messages: [
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
      { id: 'chat-2', name: 'Design meeting', type: 'chat', model: defaultModel, messages: [] }
    ] 
  },
  { 
    id: 'proj-2', 
    name: 'Project B', 
    children: [
      { id: 'chat-3', name: 'API planning', type: 'chat', model: defaultModel, messages: [] }
    ] 
  },
];

export const useChatState = () => {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState(initialConversations[0].id);
  const [projects, setProjects] = useState(initialProjects);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [activeProjectChatId, setActiveProjectChatId] = useState(null);
  const [messages, setMessages] = useState(initialConversations[0].messages);
  const [replyTo, setReplyTo] = useState(null);
  const [currentModel, setCurrentModel] = useState(defaultModel);
  
  // Sync currentModel with the active conversation or project chat
  useEffect(() => {
    if (activeConversationId) {
      const activeConversation = conversations.find(c => c.id === activeConversationId);
      if (activeConversation) {
        setCurrentModel(activeConversation.model || defaultModel);
      }
    } else if (activeProjectId && activeProjectChatId) {
      const project = projects.find(p => p.id === activeProjectId);
      if (project) {
        const chat = project.children.find(c => c.id === activeProjectChatId);
        if (chat) {
          setCurrentModel(chat.model || defaultModel);
        }
      }
    }
  }, [activeConversationId, conversations, activeProjectId, activeProjectChatId, projects]);

  // useEffect for syncing messages
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

  const updateMessagesInState = (updatedMessages) => {
    setMessages(updatedMessages);
    if (activeConversationId) {
      setConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversationId
            ? { ...conv, messages: updatedMessages, timestamp: new Date() }
            : conv
        )
      );
    } else if (activeProjectId && activeProjectChatId) {
      setProjects(prev =>
        prev.map(proj =>
          proj.id === activeProjectId
            ? {
                ...proj,
                children: proj.children.map(chat =>
                  chat.id === activeProjectChatId
                    ? { ...chat, messages: updatedMessages, timestamp: new Date() }
                    : chat
                )
              }
            : proj
        )
      );
    }
  };

  const handleSendMessage = (text, file) => {
    // Calculate input tokens and cost
    const tokenCount = estimateTokenCount(text);
    const tokenCost = tokenCount * 0.0001;
    
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: text,
      file: file,
      replyTo: replyTo,
      meta: { 
        tokens: tokenCount, 
        cost: `$${tokenCost.toFixed(4)}`,
        inputCost: `$${tokenCost.toFixed(4)}` // Specifically track input cost
      },
      name: 'User',
      animate: true
    };

    const updatedMessages = [...messages, userMessage];
    updateMessagesInState(updatedMessages);
    setReplyTo(null); // Clear reply state after sending

    setTimeout(() => {
      // Generate a response that mentions the model being used
      const responseText = `You said: "${text}". I am responding as ${currentModel.name} from ${currentModel.provider}.`;
      const botTokenCount = estimateTokenCount(responseText);
      const botTokenCost = botTokenCount * 0.0001;
      
      const botResponse = {
        id: Date.now() + 1,
        sender: 'bot',
        text: responseText,
        meta: { 
          tokens: botTokenCount, 
          cost: `$${botTokenCost.toFixed(4)}`,
          outputCost: `$${botTokenCost.toFixed(4)}`, // Specifically track output cost
          model: currentModel.name
        },
        animate: true
      };
      const updatedMessagesWithResponse = [...updatedMessages, botResponse];
      updateMessagesInState(updatedMessagesWithResponse);
    }, 500);
  };

  const handleEditMessage = (messageId, newText) => {
    const tokenCount = estimateTokenCount(newText);
    const updatedMessages = messages.map(msg => 
      msg.id === messageId ? { 
        ...msg, 
        text: newText, 
        animate: false,
        meta: { 
          ...msg.meta, 
          tokens: tokenCount,
          cost: `$${(tokenCount * 0.0001).toFixed(4)}`
        }
      } : msg
    );
    
    // Find the edited message index and remove any bot responses that followed it
    const editedMessageIndex = updatedMessages.findIndex(msg => msg.id === messageId);
    const messagesBeforeResponse = updatedMessages.slice(0, editedMessageIndex + 1);
    
    updateMessagesInState(messagesBeforeResponse);
    
    // Generate new bot response based on the edited message
    setTimeout(() => {
      const responseText = `You edited your message to: "${newText}". This is a regenerated response from ${currentModel.name}.`;
      const botTokenCount = estimateTokenCount(responseText);
      const botResponse = {
        id: Date.now(),
        sender: 'bot',
        text: responseText,
        meta: { 
          tokens: botTokenCount, 
          cost: `$${(botTokenCount * 0.0001).toFixed(4)}`,
          model: currentModel.name
        },
        animate: true
      };
      const messagesWithNewResponse = [...messagesBeforeResponse, botResponse];
      updateMessagesInState(messagesWithNewResponse);
    }, 500);
  };

  const handleRegenerateResponse = (messageId) => {
    const userMessageIndex = messages.findIndex(msg => msg.id === messageId) - 1;
    if (userMessageIndex < 0) return;

    const userMessage = messages[userMessageIndex];
    const messagesWithoutOldResponse = messages.slice(0, userMessageIndex + 1);
    updateMessagesInState(messagesWithoutOldResponse);

    setTimeout(() => {
      const botResponse = {
        id: Date.now(),
        sender: 'bot',
        text: `This is a regenerated response from ${currentModel.name} to: "${userMessage.text}".`,
        meta: { 
          tokens: 25, 
          cost: '$0.0003',
          model: currentModel.name
        },
        animate: true
      };
      const updatedMessagesWithResponse = [...messagesWithoutOldResponse, botResponse];
      updateMessagesInState(updatedMessagesWithResponse);
    }, 500);
  };

  const handleFeedback = (messageId, feedback) => {
    const updatedMessages = messages.map(msg =>
      msg.id === messageId ? { ...msg, feedback: feedback } : msg
    );
    updateMessagesInState(updatedMessages);
  };

  const handleReply = (message) => {
    // Toggle reply - if already replying to this message, cancel the reply
    if (replyTo && replyTo.id === message.id) {
      setReplyTo(null);
    } else {
      setReplyTo(message);
    }
  };

  const cancelReply = () => {
    setReplyTo(null);
  };

  // Handle model switching
  const handleModelChange = (model) => {
    // Only proceed if the model is actually changing
    if (currentModel && currentModel.id === model.id) return;
    
    // Save the current model
    setCurrentModel(model);
    
    // Create a new conversation with the selected model
    const newConversationId = `conv-${Date.now()}`;
    const newConversation = {
      id: newConversationId,
      title: `New Chat with ${model.name}`,
      timestamp: new Date(),
      model: model,
      messages: []
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversationId);
    setActiveProjectId(null);
    setActiveProjectChatId(null);
    setMessages([]);
    
    // Reset the message count in sessionStorage to ensure proper animation tracking
    sessionStorage.setItem('lastMessageCount', '0');
  };

  // (Keep other handlers like handleNewConversation, handleSwitchConversation, etc. as they are)
  const handleNewConversation = () => {
    const newConversationId = `conv-${Date.now()}`;
    const newConversation = {
      id: newConversationId,
      title: `New Chat ${conversations.length + 1}`,
      timestamp: new Date(),
      model: currentModel, // Use the current model
      messages: []
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversationId);
    setActiveProjectId(null);
    setActiveProjectChatId(null);
    setMessages([]);
    
    // Reset the message count in sessionStorage to ensure proper animation tracking
    sessionStorage.setItem('lastMessageCount', '0');
  };

  const handleSwitchConversation = (conversationId) => {
    setActiveConversationId(conversationId);
    setActiveProjectId(null);
    setActiveProjectChatId(null);
    
    // When switching to an existing conversation, make sure no messages are animated
    const activeConversation = conversations.find(c => c.id === conversationId);
    if (activeConversation && activeConversation.messages) {
      // Update the current model
      setCurrentModel(activeConversation.model || defaultModel);
      
      // When viewing history, we want to show the completed state without animation
      const messagesWithoutAnimation = activeConversation.messages.map(message => ({
        ...message,
        animate: false // explicitly disable animations for history
      }));
      
      // Update lastMessageCount so we know these aren't new messages
      sessionStorage.setItem('lastMessageCount', activeConversation.messages.length.toString());
      setMessages(messagesWithoutAnimation);
    }
  };

  const handleRenameConversation = (conversationId, newTitle) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, title: newTitle }
          : conv
      )
    );
  };

  const handleDeleteConversation = (conversationId) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    if (activeConversationId === conversationId) {
      setActiveConversationId(conversations[0]?.id || null);
    }
  };

  const handleAddToProject = (conversationId, projectId) => {
    // Find the conversation
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;
    
    // Create a new chat from the conversation
    const newChat = {
      id: `chat-${Date.now()}`,
      name: conversation.title,
      type: 'chat',
      model: conversation.model || defaultModel,
      messages: conversation.messages,
      timestamp: new Date(),
      updatedAt: new Date(),
      createdAt: new Date()
    };
    
    // Add the chat to the project at the top
    setProjects(prev => 
      prev.map(proj => {
        if (proj.id === projectId) {
          return {
            ...proj,
            children: [newChat, ...proj.children].sort((a, b) => {
              const dateA = new Date(a.updatedAt || a.timestamp || a.createdAt || 0);
              const dateB = new Date(b.updatedAt || b.timestamp || b.createdAt || 0);
              return dateB - dateA; // Sort newest first
            })
          };
        }
        return proj;
      })
    );
    
    // Switch to the newly created project chat
    handleSwitchToProjectChat(projectId, newChat.id);
  };

  const handleSwitchToProjectChat = (projectId, chatId) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const chat = project.children.find(c => c.id === chatId);
    if (!chat) return;
    
    setActiveProjectId(projectId);
    setActiveProjectChatId(chatId);
    setActiveConversationId(null);
    
    // Update the current model
    setCurrentModel(chat.model || defaultModel);
    
    // When viewing existing chat history, disable animations
    if (chat.messages && chat.messages.length > 0) {
      const messagesWithoutAnimation = chat.messages.map(message => ({
        ...message,
        animate: false // no animations when viewing history
      }));
      
      // Update lastMessageCount so we know these aren't new messages
      sessionStorage.setItem('lastMessageCount', chat.messages.length.toString());
      setMessages(messagesWithoutAnimation);
    } else {
      sessionStorage.setItem('lastMessageCount', '0');
      setMessages(chat.messages || []);
    }
  };

  const handleProjectAction = {
    addProject: () => {
      const newProject = {
        id: `proj-${Date.now()}`,
        name: `New Project`,
        children: []
      };
      setProjects(prev => [newProject, ...prev]);
    },
    
    renameProject: (projectId, newName) => {
      setProjects(prev => 
        prev.map(proj => 
          proj.id === projectId
            ? { ...proj, name: newName }
            : proj
        )
      );
    },

    deleteProject: (projectId) => {
      setProjects(prev => prev.filter(proj => proj.id !== projectId));
      if (activeProjectId === projectId) {
        setActiveProjectId(null);
        setActiveProjectChatId(null);
        setActiveConversationId(conversations[0]?.id || null);
      }
    },
    
    addChat: (projectId) => {
      const newChat = {
        id: `chat-${Date.now()}`,
        name: `New Chat`,
        type: 'chat',
        model: currentModel, // Use the current model
        messages: [],
        timestamp: new Date()
      };
      
      setProjects(prev => 
        prev.map(proj => 
          proj.id === projectId
            ? { 
                ...proj, 
                children: [
                  newChat, 
                  ...proj.children
                ].sort((a, b) => (b.timestamp || new Date()) - (a.timestamp || new Date()))
              }
            : proj
        )
      );
      
      handleSwitchToProjectChat(projectId, newChat.id);
    },
    
    renameChat: (chatId, newName) => {
      setProjects(prev =>
        prev.map(proj => ({
          ...proj,
          children: proj.children.map(chat =>
            chat.id === chatId
              ? { ...chat, name: newName }
              : chat
          )
        }))
      );
    },

    deleteChat: (chatId) => {
      setProjects(prev =>
        prev.map(proj => ({
          ...proj,
          children: proj.children.filter(chat => chat.id !== chatId)
        }))
      );
      if (activeProjectChatId === chatId) {
        setActiveProjectChatId(null);
        setActiveProjectId(null);
        setActiveConversationId(conversations[0]?.id || null);
      }
    }
  };

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
  
  // Get the active model for displaying in UI
  const getActiveModel = () => {
    return currentModel || defaultModel;
  };

  // Estimator for live token counting during message editing
  const getLiveTokenCount = (text) => {
    const tokenCount = estimateTokenCount(text);
    return {
      tokens: tokenCount,
      cost: `$${(tokenCount * 0.0001).toFixed(4)}`
    };
  };

  // Search across all conversations and project chats
  const searchAllMessages = (query) => {
    if (!query || query.trim().length === 0) return [];
    
    const results = [];
    
    // Search in regular conversations
    conversations.forEach(conv => {
      // Search in conversation title
      if (conv.title.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          id: conv.id,
          type: 'conversation',
          title: conv.title,
          snippet: conv.title,
          projectId: null,
          projectName: null
        });
      }
      
      // Search in messages
      const matchingMessages = conv.messages.filter(msg => 
        msg.text.toLowerCase().includes(query.toLowerCase())
      );
      
      matchingMessages.forEach(msg => {
        results.push({
          id: conv.id,
          type: 'conversation',
          title: conv.title,
          messageId: msg.id,
          snippet: createSnippet(msg.text, query),
          projectId: null,
          projectName: null
        });
      });
    });
    
    // Search in project conversations
    projects.forEach(project => {
      project.children.forEach(chat => {
        // Search in chat title
        if (chat.name.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            id: chat.id,
            type: 'project-chat',
            title: chat.name,
            snippet: chat.name,
            projectId: project.id,
            projectName: project.name
          });
        }
        
        // Search in messages
        if (chat.messages && chat.messages.length > 0) {
          const matchingMessages = chat.messages.filter(msg => 
            msg.text.toLowerCase().includes(query.toLowerCase())
          );
          
          matchingMessages.forEach(msg => {
            results.push({
              id: chat.id,
              type: 'project-chat',
              title: chat.name,
              messageId: msg.id,
              snippet: createSnippet(msg.text, query),
              projectId: project.id,
              projectName: project.name
            });
          });
        }
      });
    });
    
    return results;
  };
  
  // Helper function to create a snippet around the search query
  const createSnippet = (text, query) => {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text.substring(0, 100) + '...';
    
    const start = Math.max(0, index - 40);
    const end = Math.min(text.length, index + query.length + 40);
    const prefix = start > 0 ? '...' : '';
    const suffix = end < text.length ? '...' : '';
    
    return prefix + text.substring(start, end) + suffix;
  };

  const handleNavigateToSearchResult = (result) => {
    if (result.type === 'conversation') {
      handleSwitchConversation(result.id);
      // Could implement scrolling to the specific message in future
    } else if (result.type === 'project-chat') {
      handleSwitchToProjectChat(result.projectId, result.id);
      // Could implement scrolling to the specific message in future
    }
  };

  return {
    conversations,
    activeConversationId,
    projects,
    activeProjectId,
    activeProjectChatId,
    messages,
    replyTo,
    currentModel,
    handleSendMessage,
    handleEditMessage,
    handleRegenerateResponse,
    handleFeedback,
    handleReply,
    cancelReply,
    handleNewConversation,
    handleSwitchConversation,
    handleRenameConversation,
    handleDeleteConversation,
    handleAddToProject,
    handleSwitchToProjectChat,
    handleProjectAction,
    getActiveChatTitle,
    getActiveModel,
    getLiveTokenCount,
    searchAllMessages,
    handleNavigateToSearchResult,
    handleModelChange
  };
};

