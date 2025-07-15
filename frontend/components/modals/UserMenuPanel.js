import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Sun, Moon, Settings, User, HelpCircle, Check, ChevronRight, LogOut } from 'react-feather';

const themes = [
  { id: 'light', name: 'Light', icon: Sun },
  { id: 'dark', name: 'Dark', icon: Moon },
];

const UserMenuPanel = ({ isOpen, position, theme, setTheme, onClose }) => {
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const menuRef = useRef(null);
  const themeTimeoutRef = useRef(null);
  
  const ActiveThemeIcon = themes.find(t => t.id === theme)?.icon || Sun;

  const handleAction = (action) => {
    console.log(`${action} clicked`);
    onClose(); // Close menu after action
  };
  
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setIsThemeOpen(false);
    onClose(); // Close the menu after changing theme
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && menuRef.current && !menuRef.current.contains(event.target)) {
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
      className="fixed w-60 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg shadow-lg z-50 animate-fade-in p-1.5"
      onMouseLeave={() => {
        themeTimeoutRef.current = setTimeout(() => {
          setIsThemeOpen(false);
        }, 300);
      }}
    >
      {/* User info */}
      <div className="p-4 mb-1 border-b border-[var(--border-primary)]">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
            U
          </div>
          <div>
            <p className="font-medium text-[var(--text-primary)]">User</p>
            <p className="text-xs text-[var(--text-secondary)]">user@example.com</p>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="py-1">
        {/* Theme selector */}
        <div 
          className="relative px-4 py-2 flex items-center justify-between hover:bg-[var(--bg-secondary)] rounded cursor-pointer transition-colors"
          onMouseEnter={() => {
            if (themeTimeoutRef.current) clearTimeout(themeTimeoutRef.current);
            setIsThemeOpen(true);
          }}
        >
          <div className="flex items-center">
            <ActiveThemeIcon size={16} className="mr-3 text-[var(--text-tertiary)]" />
            <span className="text-[var(--text-primary)]">{theme === 'light' ? 'Light' : 'Dark'} Theme</span>
          </div>
          <ChevronRight size={16} className="text-[var(--text-tertiary)]" />
          
          {/* Theme submenu */}
          {isThemeOpen && (
            <div 
              className="absolute left-full top-0 w-48 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg shadow-lg ml-2 overflow-hidden animate-fade-in"
              onMouseEnter={() => {
                if (themeTimeoutRef.current) clearTimeout(themeTimeoutRef.current);
              }}
            >
              {themes.map((themeOption) => (
                <div
                  key={themeOption.id}
                  className="px-4 py-2 flex items-center justify-between hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors"
                  onClick={() => handleThemeChange(themeOption.id)}
                >
                  <div className="flex items-center">
                    <themeOption.icon size={16} className="mr-3 text-[var(--text-tertiary)]" />
                    <span className="text-[var(--text-primary)]">{themeOption.name}</span>
                  </div>
                  {theme === themeOption.id && (
                    <Check size={16} className="text-primary-500" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="px-4 py-2 flex items-center hover:bg-[var(--bg-secondary)] rounded cursor-pointer transition-colors" onClick={() => handleAction('settings')}>
          <Settings size={16} className="mr-3 text-[var(--text-tertiary)]" />
          <span className="text-[var(--text-primary)]">Settings</span>
        </div>
        
        <div className="px-4 py-2 flex items-center hover:bg-[var(--bg-secondary)] rounded cursor-pointer transition-colors" onClick={() => handleAction('account')}>
          <User size={16} className="mr-3 text-[var(--text-tertiary)]" />
          <span className="text-[var(--text-primary)]">Account</span>
        </div>
        
        <div className="px-4 py-2 flex items-center hover:bg-[var(--bg-secondary)] rounded cursor-pointer transition-colors" onClick={() => handleAction('help')}>
          <HelpCircle size={16} className="mr-3 text-[var(--text-tertiary)]" />
          <span className="text-[var(--text-primary)]">Help</span>
        </div>
        
        <div className="mt-1 pt-1 border-t border-[var(--border-primary)]">
          <div className="px-4 py-2 flex items-center hover:bg-[var(--bg-secondary)] rounded cursor-pointer transition-colors text-red-500" onClick={() => handleAction('logout')}>
            <LogOut size={16} className="mr-3" />
            <span>Log out</span>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(menuContent, document.body);
};

export default UserMenuPanel;
