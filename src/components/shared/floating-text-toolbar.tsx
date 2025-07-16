"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Plus,
  Minus,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TextFormatting {
  fontSize: number;
  fontFamily: string;
  alignment: 'left' | 'center' | 'right' | 'justify';
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

interface TextElement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  formatting: TextFormatting;
}

interface FloatingTextToolbarProps {
  selectedElement: TextElement | null;
  onFormatChange: (formatting: Partial<TextFormatting>) => void;
  containerRef?: React.RefObject<HTMLElement>;
}

const FONT_FAMILIES = [
  { name: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans' },
  { name: 'Inter', value: 'Inter' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Lato', value: 'Lato' },
  { name: 'Poppins', value: 'Poppins' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Source Sans Pro', value: 'Source Sans Pro' },
];

const FONT_SIZE_MIN = 8;
const FONT_SIZE_MAX = 72;

export function FloatingTextToolbar({ 
  selectedElement, 
  onFormatChange, 
  containerRef 
}: FloatingTextToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });

  // Calculate toolbar position relative to selected element
  useEffect(() => {
    if (!selectedElement || !toolbarRef.current) return;

    const toolbar = toolbarRef.current;
    const container = containerRef?.current || document.documentElement;
    const containerRect = container.getBoundingClientRect();
    
    // Position toolbar above the selected element
    let x = selectedElement.x + (selectedElement.width / 2) - (toolbar.offsetWidth / 2);
    let y = selectedElement.y - toolbar.offsetHeight - 12; // 12px gap

    // Ensure toolbar doesn't go off-screen horizontally
    const maxX = containerRect.width - toolbar.offsetWidth - 16;
    const minX = 16;
    x = Math.max(minX, Math.min(x, maxX));

    // If toolbar would be cut off at the top, position it below the element
    if (y < 16) {
      y = selectedElement.y + selectedElement.height + 12;
    }

    setToolbarPosition({ x, y });
  }, [selectedElement, containerRef]);

  if (!selectedElement) {
    return null;
  }

  const formatting = selectedElement.formatting;
  const selectedFont = FONT_FAMILIES.find(f => f.value === formatting.fontFamily) || FONT_FAMILIES[0];

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(FONT_SIZE_MIN, Math.min(FONT_SIZE_MAX, formatting.fontSize + delta));
    onFormatChange({ fontSize: newSize });
  };

  const handleAlignmentChange = (alignment: TextFormatting['alignment']) => {
    onFormatChange({ alignment });
  };

  const handleStyleToggle = (style: 'bold' | 'italic' | 'underline') => {
    onFormatChange({ [style]: !formatting[style] });
  };

  const handleFontFamilyChange = (fontFamily: string) => {
    onFormatChange({ fontFamily });
  };

  return (
    <div
      ref={toolbarRef}
      className="fixed z-50 bg-popover border border-border rounded-lg shadow-lg p-2 flex items-center gap-1 animate-in fade-in-0 zoom-in-95 duration-200"
      style={{
        left: `${toolbarPosition.x}px`,
        top: `${toolbarPosition.y}px`,
      }}
    >
      {/* Font Family Dropdown */}
      <div className="relative">
        <Listbox value={selectedFont} onChange={(font) => handleFontFamilyChange(font.value)}>
          <div className="relative">
            <Listbox.Button className="relative w-32 cursor-default rounded-md bg-background border border-border py-1.5 pl-3 pr-8 text-left text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              <span className="block truncate font-medium" style={{ fontFamily: selectedFont.value }}>
                {selectedFont.name}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover border border-border py-1 text-sm shadow-lg focus:outline-none">
                {FONT_FAMILIES.map((font) => (
                  <Listbox.Option
                    key={font.value}
                    className={({ active }) =>
                      cn(
                        'relative cursor-default select-none py-2 pl-3 pr-9',
                        active ? 'bg-muted text-foreground' : 'text-foreground'
                      )
                    }
                    value={font}
                  >
                    {({ selected }) => (
                      <span
                        className={cn(
                          'block truncate',
                          selected ? 'font-semibold' : 'font-normal'
                        )}
                        style={{ fontFamily: font.value }}
                      >
                        {font.name}
                      </span>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>

      {/* Separator */}
      <div className="w-px h-6 bg-border mx-1" />

      {/* Font Size Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => handleFontSizeChange(-2)}
          className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          title="Decrease font size"
        >
          <Minus size={14} />
        </button>
        <div className="px-2 py-1 text-sm font-medium min-w-[32px] text-center">
          {formatting.fontSize}px
        </div>
        <button
          onClick={() => handleFontSizeChange(2)}
          className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          title="Increase font size"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Separator */}
      <div className="w-px h-6 bg-border mx-1" />

      {/* Text Alignment */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => handleAlignmentChange('left')}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            formatting.alignment === 'left'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
          title="Align left"
        >
          <AlignLeft size={16} />
        </button>
        <button
          onClick={() => handleAlignmentChange('center')}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            formatting.alignment === 'center'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
          title="Align center"
        >
          <AlignCenter size={16} />
        </button>
        <button
          onClick={() => handleAlignmentChange('right')}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            formatting.alignment === 'right'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
          title="Align right"
        >
          <AlignRight size={16} />
        </button>
        <button
          onClick={() => handleAlignmentChange('justify')}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            formatting.alignment === 'justify'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
          title="Justify"
        >
          <AlignJustify size={16} />
        </button>
      </div>

      {/* Separator */}
      <div className="w-px h-6 bg-border mx-1" />

      {/* Text Styling */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => handleStyleToggle('bold')}
          className={cn(
            "p-1.5 rounded-md transition-colors font-bold",
            formatting.bold
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => handleStyleToggle('italic')}
          className={cn(
            "p-1.5 rounded-md transition-colors italic",
            formatting.italic
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => handleStyleToggle('underline')}
          className={cn(
            "p-1.5 rounded-md transition-colors underline",
            formatting.underline
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
          title="Underline"
        >
          <Underline size={16} />
        </button>
      </div>
    </div>
  );
}