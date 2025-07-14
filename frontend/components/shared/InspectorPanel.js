// frontend/components/shared/InspectorPanel.js
import React from 'react';
import { X } from 'react-feather';

const InspectorPanel = ({ isOpen, onClose, width }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Canvas Frame</h2>
        <button
          onClick={onClose}
          className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full"
        >
          <X size={24} />
        </button>
      </div>
      <div className="flex-grow bg-gray-100 dark:bg-gray-700 m-6 rounded-lg p-4 overflow-auto">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Gravida eu feugiat quis. Purus nunc viverra in bibendum. Duis sit cursus pulvinar sit faucibus. Vitae vitae at tellus ultrices in. Commodo sed convallis in sit. Sed ut sed proin neque. Eget netus ipsum morbi condimentum quis amet sit. Varius id feugiat placerat in accumsan iaculis massa. Nibh neque feugiat faucibus interdum vitae varius in nibh. Non enim nobis.
        </p>
        {/* Added more content to test scrolling */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
          Additional content to demonstrate scrolling. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
          Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh.
        </p>
      </div>
      <div className="p-6 pt-0 flex justify-end flex-shrink-0">
        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">
          Copy
        </button>
      </div>
    </div>
  );
};

export default InspectorPanel;