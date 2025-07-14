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
      className="absolute bottom-full right-4 mb-2 w-60 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50"
    >
      <div className="p-2">
        {/* Theme Section */}
        <div className="p-2">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1">THEME</p>
          <ul>
            {themes.map((themeOption) => (
              <li key={themeOption.id}>
                <button
                  onClick={() => setTheme(themeOption.id)}
                  className="w-full flex items-center justify-between p-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center">
                    <themeOption.icon size={16} className="mr-3" />
                    <span>{themeOption.name}</span>
                  </div>
                  {theme === themeOption.id && <Check size={16} className="text-blue-500" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Divider */}
        <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>

        {/* Other Menu Items */}
        <ul>
          {[
            { icon: Settings, label: 'Settings' },
            { icon: User, label: 'Profile' },
            { icon: HelpCircle, label: 'Help' },
          ].map(item => (
            <li key={item.label}>
              <a href="#" className="flex items-center p-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                <item.icon size={16} className="mr-3" />
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserMenuPanel;