import React from 'react';
import Profile from './Profile';
import SearchInput from '../shared/SearchInput';
import { Home, FileText, Settings } from 'react-feather';

const NavItem = ({ icon, children }) => (
  <a href="#" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
    {icon}
    <span className="ml-3">{children}</span>
  </a>
);

const Sidebar = () => {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Profile />
      </div>
      <div className="p-4">
        <SearchInput />
      </div>
      <nav className="flex-grow px-4 space-y-2">
        <NavItem icon={<Home size={20} />}>Dashboard</NavItem>
        <NavItem icon={<FileText size={20} />}>Pages</NavItem>
        <NavItem icon={<Settings size={20} />}>Settings</NavItem>
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {/* Footer can go here */}
      </div>
    </div>
  );
};

export default Sidebar;