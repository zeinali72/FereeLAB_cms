"use client";

import { Copy, ThumbsDown, ThumbsUp, MoreVertical, User, Edit2, RefreshCw, MessageSquare, Zap } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { estimateTokenCount } from "@/utils/token-calculator";

export type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  tokens?: number;
  inputCost?: number;
  outputCost?: number;
};

interface ChatMessageProps {
  message: Message;
  isLast?: boolean;
  onEdit?: (messageId: string, newContent: string) => void;
  onRegenerate?: (messageId: string) => void;
  onReply?: (message: Message) => void;
}

export function ChatMessage({ message, isLast, onEdit, onRegenerate, onReply }: ChatMessageProps) {
  const [showControls, setShowControls] = useState(false);
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [isCopied, setIsCopied] = useState(false);
  
  const isUser = message.role === "user";
  const tokenCount = message.tokens || estimateTokenCount(message.content);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleEdit = () => {
    if (isEditing && onEdit) {
      onEdit(message.id, editContent);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(message.content);
  };

  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate(message.id);
    }
  };

  const handleReply = () => {
    if (onReply) {
      onReply(message);
    }
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
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-3 border border-input rounded-lg bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                rows={4}
                autoFocus
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEdit}
                  className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/90 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 bg-muted text-muted-foreground rounded text-xs hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            message.content
          )}
        </div>
        
        {/* Token and Cost Information */}
        {(tokenCount > 0 || message.inputCost || message.outputCost) && (
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            {tokenCount > 0 && (
              <span className="flex items-center">
                <Zap className="h-3 w-3 mr-1" />
                {tokenCount.toLocaleString()} tokens
              </span>
            )}
            {message.inputCost && (
              <span>Input: ${message.inputCost.toFixed(4)}</span>
            )}
            {message.outputCost && (
              <span>Output: ${message.outputCost.toFixed(4)}</span>
            )}
          </div>
        )}
        
        {!isEditing && (
          <div className={cn(
            "flex items-center mt-3 gap-2",
            showControls || feedback ? "opacity-100" : "opacity-0"
          )}>
            {!isUser && (
              <>
                <button 
                  className={cn(
                    "p-1 rounded hover:bg-muted transition-colors",
                    feedback === "like" && "bg-muted text-primary"
                  )}
                  onClick={() => setFeedback("like")}
                  title="Good response"
                >
                  <ThumbsUp className="h-4 w-4" />
                </button>
                <button 
                  className={cn(
                    "p-1 rounded hover:bg-muted transition-colors",
                    feedback === "dislike" && "bg-muted text-primary"
                  )}
                  onClick={() => setFeedback("dislike")}
                  title="Bad response"
                >
                  <ThumbsDown className="h-4 w-4" />
                </button>
                <button 
                  className="p-1 rounded hover:bg-muted transition-colors"
                  onClick={handleRegenerate}
                  title="Regenerate response"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </>
            )}
            
            <button 
              className={cn(
                "p-1 rounded hover:bg-muted transition-colors",
                isCopied && "text-green-500"
              )}
              onClick={handleCopyToClipboard}
              title={isCopied ? "Copied!" : "Copy message"}
            >
              <Copy className="h-4 w-4" />
            </button>
            
            {isUser && onEdit && (
              <button 
                className="p-1 rounded hover:bg-muted transition-colors"
                onClick={handleEdit}
                title="Edit message"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            )}
            
            {onReply && (
              <button 
                className="p-1 rounded hover:bg-muted transition-colors"
                onClick={handleReply}
                title="Reply to message"
              >
                <MessageSquare className="h-4 w-4" />
              </button>
            )}
            
            <button className="p-1 rounded hover:bg-muted transition-colors">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
