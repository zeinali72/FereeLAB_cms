// frontend/components/marketplace/MarketplacePanel.js
import React, { useState, useEffect } from 'react';
import { X, Search, Filter, ChevronsLeft, ChevronsRight, XCircle, Check } from 'react-feather';
import FilterSidebar from './FilterSidebar';
import ModelList from './ModelList';
import { mockModels } from '../../data/mockModels';

const MarketplacePanel = ({ onClose, selectedModels = [], onApplyModels }) => {
  const [selectedModelIds, setSelectedModelIds] = useState(selectedModels);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  useEffect(() => {
    setSelectedModelIds(selectedModels);
  }, [selectedModels]);
  
  const handleModelSelection = (modelId) => {
    setSelectedModelIds(prev => {
      if (prev.includes(modelId)) {
        return prev.filter(id => id !== modelId);
      } else {
        return [...prev, modelId];
      }
    });
  };
  
  const handleDeselectAll = () => {
    setSelectedModelIds([]);
  };
  
  const handleApplySelection = () => {
    const selectedModelsDetails = mockModels.filter(model => selectedModelIds.includes(model.id));
    onApplyModels(selectedModelsDetails);
    onClose();
  };
  
  const filteredModels = mockModels.filter(model => 
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
      
      {/* Modal Panel */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">AI Models Marketplace</h2>
          
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
            title="Close marketplace"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex flex-1 min-h-0">
          {/* Filter Sidebar */}
          <div 
            className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}
          >
            {isSidebarOpen && <FilterSidebar />}
          </div>
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Top Bar */}
            <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 gap-4 flex-shrink-0">
              {/* Sidebar Toggle */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 flex-shrink-0"
                title={isSidebarOpen ? "Collapse filter sidebar" : "Expand filter sidebar"}
              >
                {isSidebarOpen ? <ChevronsLeft size={20} /> : <Filter size={20} />}
              </button>
              
              {/* Search */}
              <div className="relative flex-grow max-w-2xl">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:outline-none focus:border-blue-500 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Search models..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    title="Clear search"
                  >
                    <XCircle size={16} />
                  </button>
                )}
              </div>
              
              {/* Selected Count */}
              <div className="hidden md:flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <span className="text-sm">
                  {selectedModelIds.length} {selectedModelIds.length === 1 ? 'model' : 'models'} selected
                </span>
                {selectedModelIds.length > 0 && (
                  <button
                    onClick={handleDeselectAll}
                    className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            
            {/* Models List */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <ModelList 
                models={filteredModels}
                selectedModelIds={selectedModelIds}
                onToggleSelect={handleModelSelection}
              />
            </div>
            
            {/* Bottom Action Bar */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
              <div className="md:hidden flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <span className="text-sm">
                  {selectedModelIds.length} {selectedModelIds.length === 1 ? 'model' : 'models'} selected
                </span>
                {selectedModelIds.length > 0 && (
                  <button
                    onClick={handleDeselectAll}
                    className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              <div className="flex items-center space-x-3 ml-auto">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplySelection}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Apply Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePanel;
