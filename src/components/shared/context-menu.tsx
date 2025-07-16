"use client";

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

export interface ContextMenuItem {
  label?: string;
  icon?: React.ReactNode;
  action?: () => void;
  disabled?: boolean;
  separator?: boolean;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  position: { x: number; y: number } | null;
  onClose: () => void;
}

export function ContextMenu({ items, position, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (position) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, position]);

  // Auto-adjust position to stay within viewport
  useEffect(() => {
    if (menuRef.current && position) {
      const menu = menuRef.current;
      const rect = menu.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      let { x, y } = position;

      // Adjust horizontal position
      if (x + rect.width > viewport.width) {
        x = viewport.width - rect.width - 10;
      }

      // Adjust vertical position
      if (y + rect.height > viewport.height) {
        y = viewport.height - rect.height - 10;
      }

      menu.style.left = `${Math.max(10, x)}px`;
      menu.style.top = `${Math.max(10, y)}px`;
    }
  }, [position]);

  if (!position) return null;

  const menuContent = (
    <div
      ref={menuRef}
      className={cn(
        "fixed z-50 w-56 bg-popover border border rounded-lg shadow-lg p-2",
        "animate-fade-in"
      )}
      style={{ 
        left: position.x, 
        top: position.y,
        maxHeight: 'calc(100vh - 40px)',
        overflowY: 'auto'
      }}
      role="menu"
      aria-orientation="vertical"
    >
      {items.map((item, index) => (
        item.separator ? (
          <div key={`separator-${index}`} className="h-px bg-border mx-1 my-1" />
        ) : (
          <button
            key={item.label}
            onClick={() => {
              if (!item.disabled && item.action) {
                item.action();
                onClose();
              }
            }}
            className={cn(
              "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              "focus:bg-accent focus:text-accent-foreground focus:outline-none",
              item.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent"
            )}
            role="menuitem"
            disabled={item.disabled}
          >
            {item.icon && (
              <span className="mr-3 text-muted-foreground">
                {item.icon}
              </span>
            )}
            <span>{item.label}</span>
          </button>
        )
      ))}
    </div>
  );

  return createPortal(menuContent, document.body);
}