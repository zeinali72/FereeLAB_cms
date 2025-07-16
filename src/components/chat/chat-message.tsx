"use client";

import { Copy, ThumbsDown, ThumbsUp, MoreVertical, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

interface ChatMessageProps {
  message: Message;
  isLast?: boolean;
}

export function ChatMessage({ message, isLast }: ChatMessageProps) {
  const [showControls, setShowControls] = useState(false);
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);
  
  const isUser = message.role === "user";

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
  };

  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(message.timestamp);

  return (
    <div
      className={cn(
        "py-6 px-4 flex group",
        isUser ? "" : "bg-muted/30"
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="flex-shrink-0 mr-4">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
            U
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-1 max-w-3xl">
        <div className="flex items-center mb-1">
          <span className="font-medium text-sm">
            {isUser ? "You" : "Sider Fusion"}
          </span>
          <span className="text-xs text-muted-foreground ml-2">
            {formattedTime}
          </span>
        </div>
        
        <div className="prose dark:prose-invert prose-sm max-w-none">
          {message.content}
        </div>
        
        {!isUser && (
          <div className={cn(
            "flex items-center mt-3 gap-2",
            showControls || feedback ? "opacity-100" : "opacity-0"
          )}>
            <button 
              className={cn(
                "p-1 rounded hover:bg-muted transition-colors",
                feedback === "like" && "bg-muted text-primary"
              )}
              onClick={() => setFeedback("like")}
            >
              <ThumbsUp className="h-4 w-4" />
            </button>
            <button 
              className={cn(
                "p-1 rounded hover:bg-muted transition-colors",
                feedback === "dislike" && "bg-muted text-primary"
              )}
              onClick={() => setFeedback("dislike")}
            >
              <ThumbsDown className="h-4 w-4" />
            </button>
            <button 
              className="p-1 rounded hover:bg-muted transition-colors"
              onClick={handleCopyToClipboard}
            >
              <Copy className="h-4 w-4" />
            </button>
            <button className="p-1 rounded hover:bg-muted transition-colors">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
