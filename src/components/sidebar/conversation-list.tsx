"use client";

import { MessageSquare, MoreVertical, Trash } from "lucide-react";
import { useState } from "react";

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
  };

  return (
    <div className="py-2">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className={`flex items-start justify-between px-3 py-2 cursor-pointer hover:bg-accent/10 ${
            conversation.isActive ? "bg-accent/10" : ""
          }`}
        >
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <div className="flex-shrink-0 pt-1">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{conversation.title}</p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{conversation.lastMessage}</p>
            </div>
            <div className="flex-shrink-0 flex flex-col items-end">
              <p className="text-xs text-muted-foreground">{conversation.date}</p>
              <div className="flex mt-1">
                <button 
                  className="p-1 hover:bg-muted rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(conversation.id);
                  }}
                >
                  <Trash className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                </button>
                <button className="p-1 hover:bg-muted rounded-full">
                  <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
