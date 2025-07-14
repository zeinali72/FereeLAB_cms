// frontend/components/marketplace/MarketplacePanel.js
import React, { useState, useEffect } from 'react';
import { X, Search, ChevronDown, Check, Menu, Filter, XCircle, ChevronsRight, ChevronLeft, ChevronsLeft } from 'react-feather';
import FilterSidebar from './FilterSidebar';
import ModelList from './ModelList';
import { mockModels } from '../../data/mockModels';

const MarketplacePanel = ({ onClose, selectedModels = [], onApplyModels }) => {
  const [selectedModelIds, setSelectedModelIds] = useState(selectedModels);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Check screen size on initial load
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    // Check on initial load
    checkScreenSize();
    
    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
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
    // Pass selected models back to parent component and close
    const selectedModelsDetails = mockModels.filter(model => selectedModelIds.includes(model.id));
    onApplyModels(selectedModelsDetails);
    onClose();
  };
  
  const filteredModels = mockModels.filter(model => 
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-modal animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 modal-backdrop" 
        onClick={onClose}
      ></div>
      
      {/* Modal Panel */}
      <div className="absolute inset-0 flex">
        <div className="animate-slide-in-right w-full max-w-7xl mx-auto flex flex-col market-panel shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">AI Models Marketplace</h2>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-surface-secondary transition-colors"
                title="Close marketplace"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex flex-1 min-h-0">
            {/* Filter Sidebar */}
            <div 
              className={`filter-sidebar h-full transition-all duration-300 ease-in-out ${
                isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
              }`}
            >
              {isSidebarOpen && <FilterSidebar />}
            </div>
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Top Bar */}
              <div className="p-4 flex items-center justify-between border-b gap-4">
                {/* Sidebar Toggle */}
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 rounded-md hover:bg-surface-secondary flex-shrink-0"
                >
                  {isSidebarOpen ? <ChevronsLeft size={20} /> : <Filter size={20} />}
                </button>
                
                {/* Search */}
                <div className="relative flex-grow max-w-2xl">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-tertiary" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 bg-surface-secondary border border-transparent rounded-md focus:outline-none focus:border-primary-400"
                    placeholder="Search models..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <XCircle size={16} className="text-tertiary hover:text-primary-500" />
                    </button>
                  )}
                </div>
                
                {/* Selected Count */}
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-sm">
                    {selectedModelIds.length} {selectedModelIds.length === 1 ? 'model' : 'models'} selected
                  </span>
                  {selectedModelIds.length > 0 && (
                    <button
                      onClick={handleDeselectAll}
                      className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
              
              {/* Models List */}
              <div className="flex-1 overflow-y-auto p-4">
                <ModelList 
                  models={filteredModels}
                  selectedModelIds={selectedModelIds}
                  onToggleSelect={handleModelSelection}
                />
              </div>
              
              {/* Bottom Action Bar */}
              <div className="p-4 border-t flex items-center justify-between">
                <div className="md:hidden flex items-center gap-2">
                  <span className="text-sm">
                    {selectedModelIds.length} {selectedModelIds.length === 1 ? 'model' : 'models'} selected
                  </span>
                  {selectedModelIds.length > 0 && (
                    <button
                      onClick={handleDeselectAll}
                      className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
                
                <div className="flex items-center space-x-3 ml-auto">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border rounded-md hover:bg-surface-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApplySelection}
                    className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                  >
                    Apply Selection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePanel;