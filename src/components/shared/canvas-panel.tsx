"use client";

import { useState } from "react";
import { X, Copy, Check, FileText, Layers } from "lucide-react";

interface CanvasPanelProps {
  isOpen: boolean;
  onClose: () => void;
  width?: number;
}

export function CanvasPanel({ isOpen, onClose, width = 400 }: CanvasPanelProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "context" | "history">("content");

  // Sample canvas content
  const canvasContent = `# Project Analysis

## Key Insights
- Market opportunity in AI-powered productivity tools
- Growing demand for conversational interfaces
- Competition from established players

## Technical Requirements
- React/Next.js frontend
- Node.js backend with TypeScript
- OpenAI API integration
- Real-time capabilities

## Implementation Strategy
1. MVP with core chat functionality
2. Enhanced model selection
3. Advanced features (file upload, etc.)
4. Enterprise features

## Resource Requirements
- 2-3 developers
- 3-month timeline
- $50K budget estimate

## Next Steps
- [ ] Finalize technical architecture
- [ ] Set up development environment
- [ ] Begin frontend implementation
- [ ] Design API endpoints`;

  const handleCopy = () => {
    navigator.clipboard.writeText(canvasContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const contextInfo = [
    {
      title: "Current Model",
      value: "GPT-4 Turbo",
      description: "High performance model for complex tasks"
    },
    {
      title: "Token Usage",
      value: "1,247 / 8,192",
      description: "15% of context window used"
    },
    {
      title: "Conversation Length",
      value: "12 messages",
      description: "Started 23 minutes ago"
    },
    {
      title: "Estimated Cost",
      value: "$0.023",
      description: "For current conversation"
    }
  ];

  if (!isOpen) return null;

  return (
    <div 
      className="h-full flex flex-col bg-background border-l border-border"
      style={{ width: `${width}px` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4" />
          <h2 className="font-semibold">Canvas</h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className={`p-2 rounded-full hover:bg-muted transition-colors ${
              isCopied ? 'text-green-500' : 'text-muted-foreground hover:text-foreground'
            }`}
            title={isCopied ? "Copied!" : "Copy content"}
          >
            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Close canvas"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("content")}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "content"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Content
        </button>
        <button
          onClick={() => setActiveTab("context")}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "context"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Context
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "history"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          History
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "content" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <FileText className="h-4 w-4" />
              <span>Project Analysis Document</span>
            </div>
            <pre className="text-sm whitespace-pre-wrap font-mono bg-muted p-4 rounded-lg overflow-x-auto">
              {canvasContent}
            </pre>
          </div>
        )}

        {activeTab === "context" && (
          <div className="space-y-4">
            <h3 className="font-medium text-sm mb-3">Conversation Context</h3>
            <div className="grid gap-3">
              {contextInfo.map((item, index) => (
                <div key={index} className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{item.title}</span>
                    <span className="text-sm font-mono">{item.value}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            <h3 className="font-medium text-sm mb-3">Recent Activity</h3>
            <div className="space-y-2">
              {[
                { time: "2 min ago", action: "Generated project analysis", type: "assistant" },
                { time: "5 min ago", action: "Asked about market research", type: "user" },
                { time: "8 min ago", action: "Discussed technical requirements", type: "assistant" },
                { time: "12 min ago", action: "Started new conversation", type: "system" },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    item.type === "user" ? "bg-blue-500" :
                    item.type === "assistant" ? "bg-green-500" : "bg-gray-500"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          Canvas helps you organize and track your conversation context
        </div>
      </div>
    </div>
  );
}
