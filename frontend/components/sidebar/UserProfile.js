// frontend/components/sidebar/UserProfile.js
import React from 'react';
import { MoreHorizontal } from 'react-feather';

const UserProfile = () => {
  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <img
          className="w-10 h-10 rounded-full"
          src="https://via.placeholder.com/40" // Placeholder image
          alt="User Avatar"
        />
        <div className="ml-3 flex-grow">
          <p className="font-semibold text-sm text-gray-800 dark:text-white">Profile</p>
        </div>
        <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
          <MoreHorizontal size={20} />
        </button>
      </div>
    </div>
  );
};

export default UserProfile;