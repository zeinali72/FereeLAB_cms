import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'react-feather';
import UserMenuPanel from '../modals/UserMenuPanel';

const UserProfile = ({ theme, setTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  return (
    // Add `relative` to make this the positioning context for the menu
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 relative" ref={menuRef}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            U
          </div>
          <span className="ml-3 font-semibold">User</span>
        </div>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <MoreVertical size={20} />
        </button>
      </div>

      <UserMenuPanel 
        isOpen={isMenuOpen} 
        theme={theme}
        setTheme={setTheme}
      />
    </div>
  );
};

export default UserProfile;