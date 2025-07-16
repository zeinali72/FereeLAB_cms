"use client";

import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';

interface InspectorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  width?: number;
}

export function InspectorPanel({ isOpen, onClose, width }: InspectorPanelProps) {
  const [isCopied, setIsCopied] = useState(false);
  
  // Sample content that will be copied
  const canvasContent = `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Gravida eu feugiat quis. Purus nunc viverra in bibendum. Duis sit cursus pulvinar sit faucibus. Vitae vitae at tellus ultrices in. Commodo sed convallis in sit. Sed ut sed proin neque. Eget netus ipsum morbi condimentum quis amet sit. Varius id feugiat placerat in accumsan iaculis massa. Nibh neque feugiat faucibus interdum vitae varius in nibh. Non enim nobis.

Additional content to demonstrate scrolling. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.

Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh.`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(canvasContent);
      setIsCopied(true);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-background border-l border-border shadow-lg">
      <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
        <h2 className="text-lg font-semibold text-foreground">Canvas Frame</h2>
        <div className="flex items-center">
          <button 
            onClick={handleCopy} 
            className={`p-2 rounded-full hover:bg-muted transition-colors mr-2 ${
              isCopied ? 'text-green-500' : 'text-muted-foreground'
            }`}
            title="Copy content"
          >
            {isCopied ? 
              <Check size={20} /> : 
              <Copy size={20} />
            }
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
            title="Close panel"
          >
            <X size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-muted/50 custom-scrollbar">
        <pre className="whitespace-pre-wrap text-sm text-foreground">
          {canvasContent}
        </pre>
      </div>
    </div>
  );
}
