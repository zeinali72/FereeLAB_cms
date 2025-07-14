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
    >
      <div
        className="relative"
        onMouseEnter={() => { clearTimeout(themeTimeoutRef.current); setIsThemeOpen(true); }}
        onMouseLeave={() => { themeTimeoutRef.current = setTimeout(() => setIsThemeOpen(false), 300); }}
      >
        <button
          className="w-full flex items-center justify-between p-2 text-sm hover:bg-[var(--bg-secondary)] rounded-md text-[var(--text-primary)]"
        >
          <div className="flex items-center">
            <ActiveThemeIcon size={16} className="mr-3" />
            <span className="font-medium">Theme</span>
          </div>
          <ChevronRight size={16} className="text-[var(--text-secondary)]" />
        </button>
        {isThemeOpen && (
          <div
            className="absolute top-0 left-full ml-2 w-40 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg shadow-lg animate-fade-in p-1.5"
            onMouseEnter={() => clearTimeout(themeTimeoutRef.current)}
            onMouseLeave={() => { themeTimeoutRef.current = setTimeout(() => setIsThemeOpen(false), 300); }}
          >
            {themes.map((themeOption) => (
              <button
                key={themeOption.id}
                onClick={() => {
                  setTheme(themeOption.id);
                  setIsThemeOpen(false);
                }}
                className={`w-full flex items-center p-2 text-sm hover:bg-[var(--bg-secondary)] rounded-md text-[var(--text-primary)] ${
                  theme === themeOption.id ? 'bg-[var(--bg-secondary)]' : ''
                }`}
              >
                <themeOption.icon size={16} className="mr-2" />
                <span>{themeOption.name}</span>
                {theme === themeOption.id && <Check size={14} className="ml-auto text-primary-500" />}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-px bg-[var(--border-primary)] my-1"></div>

      <ul>
        {[
          { icon: Settings, label: 'Settings', action: () => handleAction('Settings') },
          { icon: User, label: 'Profile', action: () => handleAction('Profile') },
          { icon: HelpCircle, label: 'Help', action: () => handleAction('Help') },
        ].map(item => (
          <li key={item.label}>
            <button onClick={item.action} className="w-full flex items-center p-2 text-sm hover:bg-[var(--bg-secondary)] rounded-md text-[var(--text-primary)]">
              <item.icon size={16} className="mr-3 text-[var(--text-secondary)]" />
              <span className="font-medium">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="h-px bg-[var(--border-primary)] my-1"></div>

      <button onClick={() => handleAction('Sign Out')} className="w-full flex items-center p-2 text-sm hover:bg-[var(--bg-secondary)] rounded-md text-[var(--text-primary)]">
        <LogOut size={16} className="mr-3 text-[var(--text-secondary)]" />
        <span className="font-medium">Sign Out</span>
      </button>
    </div>
  );

  return ReactDOM.createPortal(menuContent, document.body);
};

export default UserMenuPanel;
