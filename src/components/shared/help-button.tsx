"use client";

import { useState } from "react";
import { HelpCircle, X, Send, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface HelpMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface HelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isDocked?: boolean;
  onToggleDock?: () => void;
}

const helpResponses: Record<string, string> = {
  "how to export": "You can export your chats by going to Settings > Export and selecting JSON or CSV format. You can also use the download button in the Canvas panel to export formatted content.",
  
  "how to use canvas": "The Canvas panel displays formatted versions of AI responses. Click the layers icon in the chat input to toggle it. When active, AI responses will appear in the Canvas with rich formatting.",
  
  "how to change model": "Click on the current model name in the header to open the model selector. You can choose from different AI models or visit the Marketplace to explore more options.",
  
  "keyboard shortcuts": "Useful shortcuts:\n• Enter: Send message\n• Shift+Enter: New line\n• Ctrl/Cmd+K: Focus search\n• Esc: Close panels",
  
  "how to reply": "Right-click on any message to see reply options, or click the reply button when hovering over a message. You can also select text and use the hover menu to reply to specific parts.",
  
  "project folders": "Organize your conversations using project folders in the sidebar. Drag and drop conversations to move them into projects, or use the 'Assign to Project' option in the context menu.",
  
  "text to speech": "AI responses include a speaker icon for text-to-speech. You can also right-click on any message and select 'Read Aloud' to hear the content.",
  
  "default": "Hi! I'm here to help you use FereeLAB Chat. Ask me about:\n\n• How to export chats\n• Using the Canvas panel\n• Changing AI models\n• Keyboard shortcuts\n• Reply and quote features\n• Project organization\n• Text-to-speech\n\nWhat would you like to know?"
};

function HelpPanel({ isOpen, onClose, isDocked = false, onToggleDock }: HelpPanelProps) {
  const [messages, setMessages] = useState<HelpMessage[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: HelpMessage = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    // Find matching response
    const query = input.toLowerCase();
    let response = helpResponses.default;
    
    for (const [key, value] of Object.entries(helpResponses)) {
      if (key !== "default" && query.includes(key)) {
        response = value;
        break;
      }
    }

    const assistantMessage: HelpMessage = {
      id: (Date.now() + 1).toString(),
      content: response,
      role: "assistant",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 100, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 100, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "fixed z-50 bg-background border border-border rounded-lg shadow-xl",
          "flex flex-col overflow-hidden",
          isDocked
            ? "right-4 top-1/2 -translate-y-1/2 w-80 h-96"
            : "right-4 bottom-20 w-96 h-[500px]"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card/50">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Help Assistant</h3>
          </div>
          
          <div className="flex items-center gap-1">
            {onToggleDock && (
              <button
                onClick={onToggleDock}
                className="p-1.5 rounded-md hover:bg-accent/10 transition-colors"
                title={isDocked ? "Undock" : "Dock to sidebar"}
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            )}
            
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-accent/10 transition-colors"
              title="Close help"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground">
              <HelpCircle className="w-12 h-12 mx-auto mb-3 text-primary/50" />
              <p className="text-sm">Ask me anything about using FereeLAB Chat!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-4 h-4 text-primary" />
                  </div>
                )}
                
                <div
                  className={cn(
                    "max-w-[280px] p-3 rounded-lg text-sm whitespace-pre-wrap",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  )}
                >
                  {message.content}
                </div>
                
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium">U</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-card/30">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about features..."
              className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function HelpButton() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isDocked, setIsDocked] = useState(false);

  return (
    <>
      {/* Help Button */}
      <motion.button
        onClick={() => setIsHelpOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Get help"
      >
        <HelpCircle className="w-6 h-6" />
      </motion.button>

      {/* Help Panel */}
      <HelpPanel
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        isDocked={isDocked}
        onToggleDock={() => setIsDocked(!isDocked)}
      />
    </>
  );
}