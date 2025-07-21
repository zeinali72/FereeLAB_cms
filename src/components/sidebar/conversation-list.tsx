"use client";

import { MessageSquare, MoreVertical, Trash } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedIcon } from "../ui/animated-icon";
import { MinimalButton } from "../ui/animated-button";

type Conversation = {
  id: string;
  title: string;
  lastMessage: string;
  date: string;
  isActive?: boolean;
};

// Mock conversations data
const mockConversations: Conversation[] = [
  {
    id: "1",
    title: "Getting started with AI",
    lastMessage: "How can I use AI in my project?",
    date: "Today",
    isActive: true,
  },
  {
    id: "2",
    title: "Web development tips",
    lastMessage: "What are the best practices for React?",
    date: "Yesterday",
  },
  {
    id: "3",
    title: "Machine learning basics",
    lastMessage: "Can you explain how neural networks work?",
    date: "Jul 10",
  },
  {
    id: "4",
    title: "Design systems",
    lastMessage: "How do I create a consistent design system?",
    date: "Jul 8",
  },
];

export default function ConversationList() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  
  const handleDelete = (id: string) => {
    setConversations(conversations.filter((conv) => conv.id !== id));
    console.log('Deleted conversation:', id);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    // Update active state
    setConversations(conversations.map(conv => ({
      ...conv,
      isActive: conv.id === conversation.id
    })));
    console.log('Selected conversation:', conversation.title);
  };

  const handleMoreOptions = (conversation: Conversation) => {
    console.log('More options for:', conversation.title);
    // Could open a context menu or modal here
  };

  return (
    <div className="py-2">
      <AnimatePresence>
        {conversations.map((conversation, index) => (
          <motion.div
            key={conversation.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20, height: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.05,
              ease: "easeOut" 
            }}
            layout
            className={`flex items-start justify-between px-3 py-2 cursor-pointer hover:bg-accent/10 rounded-lg transition-colors group ${
              conversation.isActive ? "bg-accent/10" : ""
            }`}
            whileHover={{ scale: 1.01, x: 2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => handleSelectConversation(conversation)}
          >
            <div className="flex items-start space-x-3 flex-1 min-w-0">
              <div className="flex-shrink-0 pt-1">
                <AnimatedIcon
                  icon={MessageSquare}
                  size={20}
                  className="text-primary"
                  animate={conversation.isActive ? "pulse" : "none"}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{conversation.title}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{conversation.lastMessage}</p>
              </div>
              <div className="flex-shrink-0 flex flex-col items-end">
                <p className="text-xs text-muted-foreground">{conversation.date}</p>
                <div className="flex mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="p-1 hover:bg-muted rounded-full transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(conversation.id);
                    }}
                    title="Delete conversation"
                  >
                    <AnimatedIcon
                      icon={Trash}
                      size={14}
                      className="text-muted-foreground hover:text-destructive"
                      animate="shake"
                    />
                  </button>
                  <button 
                    className="p-1 hover:bg-muted rounded-full transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoreOptions(conversation);
                    }}
                    title="More options"
                  >
                    <AnimatedIcon
                      icon={MoreVertical}
                      size={14}
                      className="text-muted-foreground"
                      animate="bounce"
                    />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
