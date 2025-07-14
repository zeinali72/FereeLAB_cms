import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Settings, User, HelpCircle, Check, ChevronRight, ChevronDown } from 'react-feather';

// List of available themes
const themes = [
  { id: 'light', name: 'Light', icon: Sun },
  { id: 'dark', name: 'Dark', icon: Moon },
];

const UserMenuPanel = ({ isOpen, theme, setTheme, onClose }) => {
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const menuRef = useRef(null);
  const themeButtonRef = useRef(null);
  const themeTimeoutRef = useRef(null);
  const ActiveThemeIcon = themes.find(t => t.id === theme)?.icon || Sun;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !menuRef.current?.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Clean up timeout when component unmounts
  useEffect(() => {
    return () => {
      if (themeTimeoutRef.current) {
        clearTimeout(themeTimeoutRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <>
      <div
        ref={menuRef}
        className="absolute bottom-full right-0 mb-3 w-60 bg-surface-primary border border-border rounded-lg shadow-lg user-menu-panel animate-fade-in"
        style={{ marginBottom: '12px', zIndex: 1000 }}
      >
        <div className="p-2">
          {/* Theme Section */}
          <div 
            className="border-b border-border pb-1 mb-1 relative overflow-visible"
            onMouseEnter={() => {
              if (themeTimeoutRef.current) {
                clearTimeout(themeTimeoutRef.current);
              }
              setIsThemeOpen(true);
            }}
            onMouseLeave={() => {
              themeTimeoutRef.current = setTimeout(() => {
                setIsThemeOpen(false);
              }, 300); // 300ms delay before closing
            }}
          >
            <button
              ref={themeButtonRef}
              className="w-full flex items-center justify-between p-2 text-sm hover:bg-surface-secondary rounded-md"
            >
              <div className="flex items-center">
                <ActiveThemeIcon size={16} className="mr-3" />
                <span className="font-medium">Theme</span>
              </div>
              <ChevronRight size={16} className="text-gray-500" />
            </button>
            {isThemeOpen && (
              <div
                className="absolute w-auto bg-surface-primary border border-border rounded-lg shadow-lg theme-dropdown animate-fade-in z-[9999]"
                style={{
                  top: '0',
                  right: '-130px', /* Fixed position from right edge */
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
                onMouseEnter={() => {
                  if (themeTimeoutRef.current) {
                    clearTimeout(themeTimeoutRef.current);
                  }
                }}
                onMouseLeave={() => {
                  themeTimeoutRef.current = setTimeout(() => {
                    setIsThemeOpen(false);
                  }, 300);
                }}
              >
                <div className="p-2 flex flex-col">
                  {themes.map((themeOption) => (
                    <button
                      key={themeOption.id}
                      onClick={() => {
                        setTheme(themeOption.id);
                        // Clear any pending timeout
                        if (themeTimeoutRef.current) {
                          clearTimeout(themeTimeoutRef.current);
                        }
                        setIsThemeOpen(false);
                      }}
                      className={`flex items-center p-2 text-sm hover:bg-surface-secondary rounded-md ${
                        theme === themeOption.id ? 'bg-surface-secondary' : ''
                      }`}
                    >
                      <themeOption.icon size={16} className="mr-2" />
                      <span>{themeOption.name}</span>
                      {theme === themeOption.id && <Check size={14} className="ml-2 text-green-500" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Other Menu Items */}
          <ul>
            {[
              { icon: Settings, label: 'Settings' },
              { icon: User, label: 'Profile' },
              { icon: HelpCircle, label: 'Help' },
            ].map(item => (
              <li key={item.label}>
                <button className="w-full flex items-center p-2 text-sm hover:bg-surface-secondary rounded-md">
                  <item.icon size={16} className="mr-3" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Divider */}
          <div className="h-px bg-border my-1"></div>

          {/* Sign Out Option */}
          <button className="w-full flex items-center p-2 text-sm hover:bg-surface-secondary rounded-md">
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default UserMenuPanel;