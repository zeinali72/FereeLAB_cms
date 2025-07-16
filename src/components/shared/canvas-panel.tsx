"use client";

import React, { useState, useRef, useCallback } from 'react';
import { X, Copy, Check, Type, Move } from 'lucide-react';
import { FloatingTextToolbar, TextFormatting } from './floating-text-toolbar';
import { cn } from '@/lib/utils';

interface TextElement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  formatting: TextFormatting;
}

interface CanvasPanelProps {
  isOpen: boolean;
  onClose: () => void;
  width?: number;
}

export function CanvasPanel({ isOpen, onClose, width }: CanvasPanelProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [textElements, setTextElements] = useState<TextElement[]>([
    {
      id: '1',
      x: 50,
      y: 100,
      width: 200,
      height: 40,
      content: 'Click to edit this text',
      formatting: {
        fontSize: 16,
        fontFamily: 'Plus Jakarta Sans',
        alignment: 'left',
        bold: false,
        italic: false,
        underline: false,
      },
    },
    {
      id: '2',
      x: 50,
      y: 200,
      width: 300,
      height: 60,
      content: 'Select text to see the formatting toolbar',
      formatting: {
        fontSize: 18,
        fontFamily: 'Plus Jakarta Sans',
        alignment: 'center',
        bold: true,
        italic: false,
        underline: false,
      },
    },
  ]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isEditingText, setIsEditingText] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const selectedTextElement = textElements.find(el => el.id === selectedElement);

  const handleElementClick = useCallback((elementId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedElement(elementId);
  }, []);

  const handleDoubleClick = useCallback((elementId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setIsEditingText(elementId);
    setSelectedElement(elementId);
  }, []);

  const handleCanvasClick = useCallback(() => {
    setSelectedElement(null);
    setIsEditingText(null);
  }, []);

  const handleFormatChange = useCallback((formatting: Partial<TextFormatting>) => {
    if (!selectedElement) return;

    setTextElements(prev => 
      prev.map(el => 
        el.id === selectedElement 
          ? { ...el, formatting: { ...el.formatting, ...formatting } }
          : el
      )
    );
  }, [selectedElement]);

  const handleTextContentChange = useCallback((elementId: string, newContent: string) => {
    setTextElements(prev =>
      prev.map(el =>
        el.id === elementId
          ? { ...el, content: newContent }
          : el
      )
    );
  }, []);

  const handleTextBlur = useCallback(() => {
    setIsEditingText(null);
  }, []);

  const handleAddTextElement = useCallback(() => {
    const newElement: TextElement = {
      id: Date.now().toString(),
      x: Math.random() * 200 + 50,
      y: Math.random() * 200 + 100,
      width: 200,
      height: 40,
      content: 'New text element',
      formatting: {
        fontSize: 16,
        fontFamily: 'Plus Jakarta Sans',
        alignment: 'left',
        bold: false,
        italic: false,
        underline: false,
      },
    };
    setTextElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);
  }, []);

  const handleCopyContent = async () => {
    const content = textElements.map(el => el.content).join('\n\n');
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getTextStyle = (element: TextElement) => {
    const { formatting } = element;
    return {
      fontSize: `${formatting.fontSize}px`,
      fontFamily: formatting.fontFamily,
      textAlign: formatting.alignment,
      fontWeight: formatting.bold ? 'bold' : 'normal',
      fontStyle: formatting.italic ? 'italic' : 'normal',
      textDecoration: formatting.underline ? 'underline' : 'none',
    } as React.CSSProperties;
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-background border-l border-border shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
        <h2 className="text-lg font-semibold text-foreground">Text Canvas</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddTextElement}
            className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Add text element"
          >
            <Type size={20} />
          </button>
          <button 
            onClick={handleCopyContent} 
            className={cn(
              "p-2 rounded-md hover:bg-muted transition-colors",
              isCopied ? 'text-green-500' : 'text-muted-foreground'
            )}
            title="Copy all text"
          >
            {isCopied ? <Check size={20} /> : <Copy size={20} />}
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground"
            title="Close panel"
          >
            <X size={20} />
          </button>
        </div>
      </div>
      
      {/* Canvas Area */}
      <div 
        ref={canvasRef}
        className="flex-1 relative bg-muted/20 overflow-hidden cursor-default"
        onClick={handleCanvasClick}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Text Elements */}
        {textElements.map((element) => (
          <div
            key={element.id}
            className={cn(
              "absolute border-2 border-transparent cursor-pointer group",
              selectedElement === element.id && "border-primary border-dashed",
              "hover:border-primary/50"
            )}
            style={{
              left: `${element.x}px`,
              top: `${element.y}px`,
              width: `${element.width}px`,
              minHeight: `${element.height}px`,
            }}
            onClick={(e) => handleElementClick(element.id, e)}
            onDoubleClick={(e) => handleDoubleClick(element.id, e)}
          >
            {/* Selection Indicator */}
            {selectedElement === element.id && (
              <div className="absolute -top-6 left-0 flex items-center gap-1">
                <div className="bg-primary text-primary-foreground px-2 py-1 text-xs rounded flex items-center gap-1">
                  <Move size={12} />
                  Text Element
                </div>
              </div>
            )}

            {/* Text Content */}
            {isEditingText === element.id ? (
              <textarea
                className="w-full h-full bg-transparent border-none outline-none resize-none p-2"
                style={getTextStyle(element)}
                value={element.content}
                onChange={(e) => handleTextContentChange(element.id, e.target.value)}
                onBlur={handleTextBlur}
                autoFocus
              />
            ) : (
              <div
                className="w-full h-full p-2 break-words"
                style={getTextStyle(element)}
              >
                {element.content}
              </div>
            )}
          </div>
        ))}

        {/* Floating Text Toolbar */}
        <FloatingTextToolbar
          selectedElement={selectedTextElement}
          onFormatChange={handleFormatChange}
          containerRef={canvasRef}
        />

        {/* Instructions */}
        {textElements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Type size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Canvas is empty</p>
              <p className="text-sm">Click the + button to add text elements</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border p-3 bg-muted/20">
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{textElements.length} text elements</span>
          <span>
            {selectedElement ? 'Element selected' : 'Click to select, double-click to edit'}
          </span>
        </div>
      </div>
    </div>
  );
}
