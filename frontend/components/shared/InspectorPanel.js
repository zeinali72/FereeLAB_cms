// components/shared/InspectorPanel.js
import React from 'react';
import { X, Copy } from 'react-feather';

const InspectorPanel = () => {
  return (
    <div className="w-80 lg:w-96 bg-white dark:bg-gray-800/50 border-l border-gray-200 dark:border-gray-700 flex-shrink-0 h-screen flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-gray-800 dark:text-gray-200">Canvas frame</h2>
        <button className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
          <X size={20} />
        </button>
      </div>
      <div className="p-6 text-sm text-gray-600 dark:text-gray-300 flex-grow overflow-y-auto">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Grvida eu feugiat quis. Purus nunc viverra in bibendum. Duis sit cursus pulvinar sit faucibus. Vitae vitae at tellus ultrices in. Commodo sed convallis in sit. Sed ut sed proin neque. Eget netus ipsum morbi condimentum quis amet sit. Varius et feugiat placerat in accumsan iaculis massa. Nibh neque feugiat faucibus interdum vitae varius in nibh. Non enim odio.
        </p>
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600">
          <Copy size={16} className="mr-2" />
          <span>Copy</span>
        </button>
      </div>
    </div>
  );
};

export default InspectorPanel;
