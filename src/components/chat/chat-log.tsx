"use client";

import { useRef, useEffect } from "react";
import { ChatMessage, Message } from "./chat-message";

interface ChatLogProps {
  messages: Message[];
}

export function ChatLog({ messages }: ChatLogProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Welcome to Sider</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              Start a conversation by typing a message below. You can ask questions, 
              get creative content, or discuss any topic.
            </p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message, index) => (
            <ChatMessage 
              key={message.id} 
              message={message}
              isLast={index === messages.length - 1} 
            />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
