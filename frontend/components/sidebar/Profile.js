// components/sidebar/Profile.js
import React from 'react';
import { MoreHorizontal } from 'react-feather';

const Profile = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold">
          P
        </div>
        <div className="ml-3">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Profile</p>
        </div>
      </div>
      <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
        <MoreHorizontal size={20} />
      </button>
    </div>
  );
};

export default Profile;
