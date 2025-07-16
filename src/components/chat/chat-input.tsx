"use client";

import { useState, useRef, useEffect } from "react";
import { Paperclip, Sparkles, Send } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div className="border-t border-border p-4">
      <div className="flex flex-col space-y-3 max-w-3xl mx-auto">
        {/* Prompt Suggestions */}
        <div className="flex gap-2 flex-wrap">
          <button className="bg-muted px-3 py-1 rounded-full text-xs hover:bg-muted/80 transition-colors">
            Explain quantum computing
          </button>
          <button className="bg-muted px-3 py-1 rounded-full text-xs hover:bg-muted/80 transition-colors">
            Draft an email
          </button>
          <button className="bg-muted px-3 py-1 rounded-full text-xs hover:bg-muted/80 transition-colors">
            Create a marketing plan
          </button>
        </div>

        {/* Input Area */}
        <div className="flex items-end rounded-lg border border-input bg-background p-2 shadow-sm focus-within:ring-1 focus-within:ring-ring">
          <div className="flex-1">
            <TextareaAutosize
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className="min-h-10 w-full resize-none bg-transparent px-2 py-1.5 text-sm focus:outline-none"
              maxRows={10}
            />
          </div>
          
          <div className="flex items-center gap-1 px-1">
            <button className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <Paperclip className="h-5 w-5" />
            </button>
            <button className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <Sparkles className="h-5 w-5" />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="p-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="text-xs text-center text-muted-foreground">
          <span className="inline-flex items-center">
            <Sparkles className="h-3 w-3 mr-1" />
            Compare with GPT-4.1
          </span>
        </div>
      </div>
    </div>
  );
}
