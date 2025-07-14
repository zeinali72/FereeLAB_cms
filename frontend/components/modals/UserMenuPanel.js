import React from 'react';
import { Sun, Moon, Settings, User, HelpCircle, Check } from 'react-feather';

// List of available themes
const themes = [
  { id: 'light', name: 'Light', icon: Sun },
  { id: 'dark', name: 'Dark', icon: Moon },
];

const UserMenuPanel = ({ isOpen, theme, setTheme }) => {
  if (!isOpen) return null;

  return (
    // Position the panel absolutely, relative to the UserProfile component
    <div
      className="absolute bottom-full right-4 mb-2 w-60 panel-solid panel-layout-default z-dropdown animate-fade-in"
    >
      <div className="p-2">
        {/* Theme Section */}
        <div className="p-2">
          <p className="text-xs font-semibold text-tertiary mb-1">THEME</p>
          <ul>
            {themes.map((themeOption) => (
              <li key={themeOption.id}>
                <button
                  onClick={() => setTheme(themeOption.id)}
                  className="btn btn-ghost w-full flex items-center justify-between p-2 text-sm"
                >
                  <div className="flex items-center">
                    <themeOption.icon size={16} className="mr-3" />
                    <span>{themeOption.name}</span>
                  </div>
                  {theme === themeOption.id && <Check size={16} className="text-primary-500" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Divider */}
        <div className="h-px bg-border my-1"></div>

        {/* Other Menu Items */}
        <ul>
          {[
            { icon: Settings, label: 'Settings' },
            { icon: User, label: 'Profile' },
            { icon: HelpCircle, label: 'Help' },
          ].map(item => (
            <li key={item.label}>
              <button className="btn btn-ghost w-full flex items-center p-2 text-sm">
                <item.icon size={16} className="mr-3" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
        
        {/* Divider */}
        <div className="h-px bg-border my-1"></div>
        
        {/* Sign Out Option */}
        <button className="btn btn-ghost w-full flex items-center p-2 text-sm">
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default UserMenuPanel;