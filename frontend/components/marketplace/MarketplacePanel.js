// frontend/components/marketplace/MarketplacePanel.js
import React from 'react';
import { X, Search, ChevronDown } from 'react-feather';
import FilterSidebar from './FilterSidebar';
import ModelList from './ModelList';
import { mockModels } from '../../data/mockModels';

const MarketplacePanel = ({ onClose }) => {
  return (
    <div className="w-full h-screen flex flex-col bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h1 className="text-xl font-semibold">Models</h1>
        <div className="flex items-center gap-4">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Filter models"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm">
            Sort
            <ChevronDown size={16} />
          </button>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Close Marketplace"
          >
            <X size={24} />
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-grow flex overflow-hidden">
        <FilterSidebar />
        <ModelList models={mockModels} />
      </div>
    </div>
  );
};

export default MarketplacePanel;