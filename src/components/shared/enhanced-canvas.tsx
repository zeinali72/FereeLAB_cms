"use client";

import React, { useState, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Underline, List, ListOrdered, Quote, Type, AlignLeft, AlignCenter, AlignRight, Copy, Check, Download, X, Maximize2, Minimize2, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface EnhancedCanvasProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  width?: number;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  icon: React.ReactNode;
  title: string;
  disabled?: boolean;
}

function ToolbarButton({ onClick, isActive, icon, title, disabled }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "p-2 rounded-md transition-all duration-200 hover:bg-accent/10",
        "focus:outline-none focus:ring-2 focus:ring-primary/20",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        isActive && "bg-accent/20 text-accent-foreground"
      )}
    >
      {icon}
    </button>
  );
}

export function EnhancedCanvas({ isOpen, onClose, messages, width }: EnhancedCanvasProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFont, setSelectedFont] = useState('Inter');
  const [fontSize, setFontSize] = useState(14);
  const [textAlign, setTextAlign] = useState('left');

  // Extract and format content from messages
  const initialContent = useMemo(() => {
    const assistantMessages = messages.filter(msg => msg.role === 'assistant');
    
    if (assistantMessages.length === 0) {
      return `<h1>Welcome to FereeLAB Canvas</h1>
      
<p>This panel displays formatted content from your conversations. As you chat with the AI, any markdown-formatted responses will appear here in a beautiful, readable format.</p>

<h2>Features</h2>

<ul>
  <li><strong>Live Updates</strong>: Content updates as you receive new messages</li>
  <li><strong>Rich Text Editing</strong>: Full WYSIWYG editor with formatting tools</li>
  <li><strong>Copy to Clipboard</strong>: Easily copy formatted content</li>
  <li><strong>Export Options</strong>: Download content as HTML or markdown files</li>
  <li><strong>Responsive Design</strong>: Adapts to different screen sizes</li>
</ul>

<p>Start a conversation to see your content appear here!</p>`;
    }

    return assistantMessages.map((msg, index) => {
      const timestamp = msg.timestamp.toLocaleString();
      return `<h2>Response ${index + 1}</h2>
<p><em>Generated at ${timestamp}</em></p>
<div>${msg.content.replace(/\n/g, '</p><p>')}</div>`;
    }).join('\n\n');
  }, [messages]);

  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: initialContent,
    editable: isEditing,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm max-w-none focus:outline-none',
          'prose-headings:text-foreground prose-p:text-foreground',
          'prose-strong:text-foreground prose-em:text-muted-foreground',
          'prose-code:text-foreground prose-code:bg-muted prose-code:rounded',
          'prose-pre:bg-muted prose-pre:text-foreground',
          'prose-blockquote:text-muted-foreground prose-blockquote:border-l-primary',
          'prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground',
          'min-h-[400px] p-4 leading-relaxed'
        ),
        style: `font-family: ${selectedFont}; font-size: ${fontSize}px; text-align: ${textAlign};`
      },
    },
  });

  const fonts = [
    'Inter', 'System UI', 'Roboto', 'Arial', 'Georgia', 'Times New Roman',
    'Courier New', 'Monaco', 'Menlo'
  ];

  const handleCopy = async () => {
    if (editor) {
      const html = editor.getHTML();
      try {
        await navigator.clipboard.writeText(html);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy content:', err);
      }
    }
  };

  const handleDownload = () => {
    if (editor) {
      const content = editor.getHTML();
      const blob = new Blob([content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fereelab-canvas-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const toggleFormat = (format: string) => {
    if (!editor) return;
    
    switch (format) {
      case 'bold':
        editor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        editor.chain().focus().toggleItalic().run();
        break;
      case 'bulletList':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'orderedList':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'blockquote':
        editor.chain().focus().toggleBlockquote().run();
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "h-full flex flex-col bg-background border-l border-border/50",
        isFullscreen && "fixed inset-0 z-50 border-0"
      )}
      style={{ width: isFullscreen ? '100%' : width }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card/50">
        <div className="flex items-center gap-2">
          <Edit3 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Canvas Editor</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={cn(
              "p-2 rounded-md transition-colors hover:bg-accent/10",
              isEditing && "bg-accent/20 text-accent-foreground"
            )}
            title={isEditing ? "View Mode" : "Edit Mode"}
          >
            <Edit3 className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleCopy}
            className="p-2 rounded-md transition-colors hover:bg-accent/10"
            title="Copy Content"
          >
            {isCopied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          
          <button
            onClick={handleDownload}
            className="p-2 rounded-md transition-colors hover:bg-accent/10"
            title="Download HTML"
          >
            <Download className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-md transition-colors hover:bg-accent/10"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
          
          <button
            onClick={onClose}
            className="p-2 rounded-md transition-colors hover:bg-accent/10 text-muted-foreground hover:text-foreground"
            title="Close Canvas"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <AnimatePresence>
        {isEditing && editor && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-border/50 bg-card/30 p-3"
          >
            <div className="flex items-center gap-6">
              {/* Font Controls */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value)}
                  className="text-sm border border-border rounded px-2 py-1 bg-background"
                >
                  {fonts.map(font => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
                
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-16"
                />
                <span className="text-xs text-muted-foreground min-w-[2rem]">{fontSize}px</span>
              </div>

              <div className="w-px h-6 bg-border/50" />

              {/* Format Controls */}
              <div className="flex items-center gap-1">
                <ToolbarButton
                  onClick={() => toggleFormat('bold')}
                  isActive={editor.isActive('bold')}
                  icon={<Bold className="w-4 h-4" />}
                  title="Bold"
                />
                
                <ToolbarButton
                  onClick={() => toggleFormat('italic')}
                  isActive={editor.isActive('italic')}
                  icon={<Italic className="w-4 h-4" />}
                  title="Italic"
                />
                
                <ToolbarButton
                  onClick={() => toggleFormat('bulletList')}
                  isActive={editor.isActive('bulletList')}
                  icon={<List className="w-4 h-4" />}
                  title="Bullet List"
                />
                
                <ToolbarButton
                  onClick={() => toggleFormat('orderedList')}
                  isActive={editor.isActive('orderedList')}
                  icon={<ListOrdered className="w-4 h-4" />}
                  title="Numbered List"
                />
                
                <ToolbarButton
                  onClick={() => toggleFormat('blockquote')}
                  isActive={editor.isActive('blockquote')}
                  icon={<Quote className="w-4 h-4" />}
                  title="Blockquote"
                />
              </div>

              <div className="w-px h-6 bg-border/50" />

              {/* Alignment Controls */}
              <div className="flex items-center gap-1">
                <ToolbarButton
                  onClick={() => setTextAlign('left')}
                  isActive={textAlign === 'left'}
                  icon={<AlignLeft className="w-4 h-4" />}
                  title="Align Left"
                />
                
                <ToolbarButton
                  onClick={() => setTextAlign('center')}
                  isActive={textAlign === 'center'}
                  icon={<AlignCenter className="w-4 h-4" />}
                  title="Align Center"
                />
                
                <ToolbarButton
                  onClick={() => setTextAlign('right')}
                  isActive={textAlign === 'right'}
                  icon={<AlignRight className="w-4 h-4" />}
                  title="Align Right"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <EditorContent
          editor={editor}
          className="h-full"
        />
      </div>

      {/* Status Bar */}
      <div className="p-2 border-t border-border/50 bg-card/30 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>
            {isEditing ? 'Editing Mode' : 'View Mode'} • {messages.filter(m => m.role === 'assistant').length} responses
          </span>
          <span>{selectedFont} • {fontSize}px</span>
        </div>
      </div>
    </motion.div>
  );
}