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

  if (!isOpen) return null;

  return (
    <>
      <div
        ref={menuRef}
        className="absolute bottom-full right-0 mb-3 w-60 bg-surface-primary border border-border rounded-lg shadow-lg user-menu-panel animate-fade-in z-dropdown"
        style={{ marginBottom: '12px' }}
      >
        <div className="p-2">
          {/* Theme Section */}
          <div 
            className="border-b border-border pb-1 mb-1 relative"
            onMouseEnter={() => setIsThemeOpen(true)}
            onMouseLeave={() => setIsThemeOpen(false)}
          >
            <button
              ref={themeButtonRef}
              className="w-full flex items-center justify-between p-2 text-sm hover:bg-surface-secondary rounded-md"
            >
              <div className="flex items-center">
                <Settings size={16} className="mr-3" />
                <span className="font-medium">Theme</span>
              </div>
              <ChevronRight size={16} />
            </button>
            {isThemeOpen && (
              <div
                className="absolute w-auto bg-surface-primary border border-border rounded-lg shadow-lg theme-dropdown animate-fade-in z-dropdown"
                style={{
                  top: '0',
                  right: '100%',
                  marginRight: '0.5rem',
                }}
              >
                <div className="p-2 flex space-x-2">
                  {themes.map((themeOption) => (
                    <button
                      key={themeOption.id}
                      onClick={() => {
                        setTheme(themeOption.id);
                        setIsThemeOpen(false);
                      }}
                      className={`flex items-center justify-center p-2 text-sm hover:bg-surface-secondary rounded-md ${
                        theme === themeOption.id ? 'bg-surface-secondary' : ''
                      }`}
                    >
                      <span>{themeOption.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Other Menu Items */}
          <ul>
            {[
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