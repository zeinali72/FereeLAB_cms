// frontend/components/shared/InspectorPanel.js
import React from 'react';
import { X } from 'react-feather';

const InspectorPanel = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <aside className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6 flex flex-col shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Canvas Frame</h2>
        <button
          onClick={onClose}
          className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full"
        >
          <X size={24} />
        </button>
      </div>
      <div className="flex-grow bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Gravida eu feugiat quis. Purus nunc viverra in bibendum. Duis sit cursus pulvinar sit faucibus. Vitae vitae at tellus ultrices in. Commodo sed convallis in sit. Sed ut sed proin neque. Eget netus ipsum morbi condimentum quis amet sit. Varius id feugiat placerat in accumsan iaculis massa. Nibh neque feugiat faucibus interdum vitae varius in nibh. Non enim nobis.
        </p>
      </div>
      <div className="mt-4 flex justify-end">
        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">
          Copy
        </button>
      </div>
    </aside>
  );
};

export default InspectorPanel;