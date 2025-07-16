"use client";

import React, { useState, useMemo } from 'react';
import { X, Copy, Check, Download, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface MarkdownCanvasProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  width?: number;
}

export function MarkdownCanvas({ isOpen, onClose, messages, width }: MarkdownCanvasProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Extract and format content from messages
  const formattedContent = useMemo(() => {
    const assistantMessages = messages.filter(msg => msg.role === 'assistant');
    
    if (assistantMessages.length === 0) {
      return `# Welcome to FereeLAB Canvas

This panel displays formatted content from your conversations. As you chat with the AI, any markdown-formatted responses will appear here in a beautiful, readable format.

## Features

- **Live Updates**: Content updates as you receive new messages
- **Markdown Rendering**: Full support for markdown formatting
- **Copy to Clipboard**: Easily copy formatted content
- **Export Options**: Download content as markdown files
- **Responsive Design**: Adapts to different screen sizes

Start a conversation to see your content appear here!`;
    }

    return assistantMessages.map((msg, index) => {
      const timestamp = msg.timestamp.toLocaleString();
      return `## Response ${index + 1}
*Generated at ${timestamp}*

${msg.content}

---
`;
    }).join('\n');
  }, [messages]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedContent);
      setIsCopied(true);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([formattedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fereelab-conversation-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={cn(
      "h-full flex flex-col bg-background shadow-lg transition-all duration-300",
      isFullscreen && "fixed inset-0 z-50"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0 bg-muted/30">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">Markdown Canvas</h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {messages.filter(m => m.role === 'assistant').length} responses
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={handleCopy} 
            className={cn(
              "p-2 rounded-md hover:bg-muted transition-colors",
              isCopied ? 'text-green-500' : 'text-muted-foreground'
            )}
            title="Copy all content"
          >
            {isCopied ? <Check size={18} /> : <Copy size={18} />}
          </button>
          
          <button
            onClick={handleDownload}
            className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground"
            title="Download as markdown"
          >
            <Download size={18} />
          </button>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground"
            title="Close canvas"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-none">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-normal bg-background p-0 border-0">
              {formattedContent}
            </pre>
          </div>
        </div>
      </div>
      
      {/* Footer with stats */}
      <div className="border-t border-border p-3 bg-muted/20">
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>
            {formattedContent.split('\n').length} lines • {formattedContent.length} characters
          </span>
          <span>
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
}
