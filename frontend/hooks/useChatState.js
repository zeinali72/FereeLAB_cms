// frontend/hooks/useChatState.js
import { useState, useEffect } from 'react';

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

export const useChatState = () => {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState(initialConversations[0].id);
  const [projects, setProjects] = useState(initialProjects);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [activeProjectChatId, setActiveProjectChatId] = useState(null);
  const [messages, setMessages] = useState(initialConversations[0].messages);

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

  const handleSendMessage = (text) => {
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: text,
      meta: { tokens: text.split(' ').length, cost: '$0.0001' },
      name: 'User'
    };

    const updatedMessages = [...messages, userMessage];
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
                    ? { ...chat, messages: updatedMessages }
                    : chat
                )
              }
            : proj
        )
      );
    }

    const hasAnimated = sessionStorage.getItem('hasAnimatedInSession');

    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        sender: 'bot',
        text: `You said: "${text}". I am a simple bot and this is a canned response.`,
        meta: { tokens: 20, cost: '$0.0002' },
        animate: !hasAnimated
      };
      
      if (!hasAnimated) {
        sessionStorage.setItem('hasAnimatedInSession', 'true');
      }

      const updatedMessagesWithResponse = [...updatedMessages, botResponse];
      setMessages(updatedMessagesWithResponse);
      
      if (activeConversationId) {
        setConversations(prev => 
          prev.map(conv => 
            conv.id === activeConversationId 
              ? { ...conv, messages: updatedMessagesWithResponse }
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

  const handleNewConversation = () => {
    const newConversationId = `conv-${Date.now()}`;
    const newConversation = {
      id: newConversationId,
      title: `New Chat ${conversations.length + 1}`,
      timestamp: new Date(),
      messages: []
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversationId);
    setActiveProjectId(null);
    setActiveProjectChatId(null);
    setMessages([]);
  };

  const handleSwitchConversation = (conversationId) => {
    setActiveConversationId(conversationId);
    setActiveProjectId(null);
    setActiveProjectChatId(null);
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

  const handleSwitchToProjectChat = (projectId, chatId) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const chat = project.children.find(c => c.id === chatId);
    if (!chat) return;
    
    setActiveProjectId(projectId);
    setActiveProjectChatId(chatId);
    setActiveConversationId(null);
    setMessages(chat.messages || []);
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
    
    addChat: (projectId) => {
      const newChat = {
        id: `chat-${Date.now()}`,
        name: `New Chat`,
        type: 'chat',
        messages: []
      };
      
      setProjects(prev => 
        prev.map(proj => 
          proj.id === projectId
            ? { ...proj, children: [...proj.children, newChat] }
            : proj
        )
      );
      
      handleSwitchToProjectChat(projectId, newChat.id);
    },
    
    renameChat: (projectId, chatId, newName) => {
      setProjects(prev => 
        prev.map(proj => 
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

  return {
    conversations,
    activeConversationId,
    projects,
    activeProjectId,
    activeProjectChatId,
    messages,
    handleSendMessage,
    handleNewConversation,
    handleSwitchConversation,
    handleRenameConversation,
    handleSwitchToProjectChat,
    handleProjectAction,
    getActiveChatTitle,
  };
};
