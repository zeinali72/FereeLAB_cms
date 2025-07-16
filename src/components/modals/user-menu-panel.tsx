"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sun, Moon, Settings, User, HelpCircle, Check, ChevronRight, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const themes = [
  { id: 'light', name: 'Light', icon: Sun },
  { id: 'dark', name: 'Dark', icon: Moon },
] as const;

type Theme = 'light' | 'dark';

interface UserMenuPanelProps {
  isOpen: boolean;
  position: { top: number; right: number };
  theme: Theme;
  setTheme: (theme: Theme) => void;
  onClose: () => void;
  onOpenSettings?: () => void;
}

export function UserMenuPanel({ isOpen, position, theme, setTheme, onClose, onOpenSettings }: UserMenuPanelProps) {
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const themeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const ActiveThemeIcon = themes.find(t => t.id === theme)?.icon || Sun;

  const handleAction = (action: string) => {
    switch (action) {
      case 'settings':
        if (onOpenSettings) {
          onOpenSettings();
        }
        onClose();
        break;
      case 'logout':
        console.log('Logging out...');
        onClose();
        break;
      default:
        console.log(`${action} clicked`);
        onClose();
        break;
    }
  };
  
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setIsThemeOpen(false);
    onClose(); // Close the menu after changing theme
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    return () => {
      if (themeTimeoutRef.current) clearTimeout(themeTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const menuHeight = menuRef.current.offsetHeight;
      menuRef.current.style.top = `${position.top - menuHeight - 8}px`;
      menuRef.current.style.right = `${position.right}px`;
    }
  }, [isOpen, position]);

  if (!isOpen) return null;

  const menuContent = (
    <div
      ref={menuRef}
      className="fixed w-60 glass-panel-modal border-border/30 border shadow-2xl z-50 animate-fade-in p-1.5"
      onMouseLeave={() => {
        if (themeTimeoutRef.current) clearTimeout(themeTimeoutRef.current);
        themeTimeoutRef.current = setTimeout(() => {
          setIsThemeOpen(false);
        }, 300);
      }}
    >
      {/* User info */}
      <div className="p-4 mb-1 border-b border-border/20 glass-overlay-light rounded-t-xl">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold mr-3 glass-border-gradient">
            U
          </div>
          <div>
            <p className="font-medium text-foreground glass-text-medium">User</p>
            <p className="text-xs text-muted-foreground glass-text-light">user@example.com</p>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="py-1">
        {/* Theme selector */}
        <div 
          className="relative px-4 py-2 flex items-center justify-between hover:bg-accent/30 rounded cursor-pointer transition-all duration-200"
          onMouseEnter={() => {
            if (themeTimeoutRef.current) clearTimeout(themeTimeoutRef.current);
            setIsThemeOpen(true);
          }}
        >
          <div className="flex items-center">
            <ActiveThemeIcon size={16} className="mr-3 text-muted-foreground" />
            <span className="text-foreground glass-text-light">{theme === 'light' ? 'Light' : 'Dark'} Theme</span>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
          
          {/* Theme submenu */}
          {isThemeOpen && (
            <div 
              className="absolute left-full top-0 w-48 glass-overlay-strong border-border/30 border rounded-lg shadow-2xl ml-2 overflow-hidden animate-fade-in"
              onMouseEnter={() => {
                if (themeTimeoutRef.current) clearTimeout(themeTimeoutRef.current);
              }}
            >
              {themes.map((themeOption) => (
                <div
                  key={themeOption.id}
                  className="px-4 py-2 flex items-center justify-between hover:bg-accent/30 cursor-pointer transition-all duration-200"
                  onClick={() => handleThemeChange(themeOption.id)}
                >
                  <div className="flex items-center">
                    <themeOption.icon size={16} className="mr-3 text-muted-foreground" />
                    <span className="text-foreground glass-text-light">{themeOption.name}</span>
                  </div>
                  {theme === themeOption.id && (
                    <Check size={16} className="text-primary" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div 
          className="px-4 py-2 flex items-center hover:bg-accent/30 rounded cursor-pointer transition-all duration-200" 
          onClick={() => handleAction('settings')}
        >
          <Settings size={16} className="mr-3 text-muted-foreground" />
          <span className="text-foreground glass-text-light">Settings</span>
        </div>
        
        <div 
          className="px-4 py-2 flex items-center hover:bg-accent/30 rounded cursor-pointer transition-all duration-200" 
          onClick={() => handleAction('account')}
        >
          <User size={16} className="mr-3 text-muted-foreground" />
          <span className="text-foreground glass-text-light">Account</span>
        </div>
        
        <div 
          className="px-4 py-2 flex items-center hover:bg-accent/30 rounded cursor-pointer transition-all duration-200" 
          onClick={() => handleAction('help')}
        >
          <HelpCircle size={16} className="mr-3 text-muted-foreground" />
          <span className="text-foreground glass-text-light">Help</span>
        </div>
        
        <div className="mt-1 pt-1 border-t border-border/20 glass-overlay-light">
          <div 
            className="px-4 py-2 flex items-center hover:bg-accent/30 rounded cursor-pointer transition-all duration-200 text-red-500" 
            onClick={() => handleAction('logout')}
          >
            <LogOut size={16} className="mr-3" />
            <span>Log out</span>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(menuContent, document.body);
}