import React, { useState, useEffect, useMemo } from 'react';
import { X, Search, Filter, ChevronsLeft, XCircle } from 'react-feather';
import FilterSidebar from './FilterSidebar';
import ModelList from './ModelList';

const MarketplacePanel = ({ onClose, selectedModels: initialSelectedModels = [], onApplyModels, providers, categories, mockModels }) => {
  const [selectedModelIds, setSelectedModelIds] = useState(initialSelectedModels);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const initialFilters = {
    modalities: [],
    contextLength: 0,
    maxPrice: 0,
    categories: [],
    providers: [],
  };
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    const checkScreenSize = () => setIsSidebarOpen(window.innerWidth >= 1024);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    setSelectedModelIds(initialSelectedModels);
  }, [initialSelectedModels]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const filteredModels = useMemo(() => {
    // Trim and lowercase the search term once for better performance
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    
    const filtered = mockModels.filter(model => {
      // Skip search filtering if search term is empty
      if (normalizedSearchTerm === '') return true;
      
      // Check for model properties - handle potential undefined values
      const nameMatch = model.name?.toLowerCase().includes(normalizedSearchTerm) || false;
      const descMatch = model.description?.toLowerCase().includes(normalizedSearchTerm) || false;
      const providerMatch = model.provider?.name?.toLowerCase().includes(normalizedSearchTerm) || false;
      
      // Check categories with null/undefined safety
      const categoryMatch = Array.isArray(model.categories) && 
        model.categories.some(c => c?.toLowerCase().includes(normalizedSearchTerm));
      
      // ID match - useful for power users
      const idMatch = model.id?.toLowerCase().includes(normalizedSearchTerm) || false;

      // Search match combines all potential matches
      const searchMatch = nameMatch || descMatch || providerMatch || categoryMatch || idMatch;

      return searchMatch;
    }).filter(model => {
      // Apply filters separately for better readability
      
      // Price filtering
      const priceMatch = filters.maxPrice === 0 ? true : 
        ((model.pricing?.prompt || 0) / 1000) <= filters.maxPrice;
      
      // Context length filtering
      const contextMatch = filters.contextLength === 0 ? true : 
        (model.context_length || 0) >= filters.contextLength;

      // Modality filtering
      const modalitiesMatch = !filters.modalities?.length ? true : 
        filters.modalities.every(m => (model.modalities || []).includes(m));
      
      // Provider filtering
      const providerMatch = !filters.providers?.length ? true : 
        filters.providers.includes(model.provider?.name || '');
      
      // Categories filtering
      const categoriesMatch = !filters.categories?.length ? true : 
        filters.categories.every(c => (model.categories || []).includes(c));

      // Combine all filters
      return priceMatch && contextMatch && modalitiesMatch && providerMatch && categoriesMatch;
    });

    // Sort with selected models at the top
    return filtered.sort((a, b) => {
      // First by selection status
      const aIsSelected = selectedModelIds.includes(a.id);
      const bIsSelected = selectedModelIds.includes(b.id);
      
      if (aIsSelected && !bIsSelected) return -1;
      if (!aIsSelected && bIsSelected) return 1;
      
      // Then by name if search is empty
      if (normalizedSearchTerm === '') {
        return (a.name || '').localeCompare(b.name || '');
      }
      
      // If searching, prioritize exact matches in name
      const aNameStartsWith = a.name?.toLowerCase().startsWith(normalizedSearchTerm) || false;
      const bNameStartsWith = b.name?.toLowerCase().startsWith(normalizedSearchTerm) || false;
      
      if (aNameStartsWith && !bNameStartsWith) return -1;
      if (!aNameStartsWith && bNameStartsWith) return 1;
      
      return (a.name || '').localeCompare(b.name || '');
    });
  }, [searchTerm, filters, mockModels, selectedModelIds]);

  const handleModelSelection = (modelId) => {
    setSelectedModelIds(prev => 
      prev.includes(modelId) ? prev.filter(id => id !== modelId) : [...prev, modelId]
    );
  };

  const handleApplySelection = () => {
    const selectedModelsDetails = mockModels.filter(model => selectedModelIds.includes(model.id));
    onApplyModels(selectedModelsDetails);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in bg-black/60 backdrop-blur-sm">
      <div className="relative bg-[var(--bg-primary)] rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col animate-scale-in overflow-hidden border border-[var(--border-primary)]">
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-primary)] flex-shrink-0">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">AI Models Marketplace</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors" title="Close marketplace">
            <X size={22} />
          </button>
        </div>
        <div className="flex flex-1 min-h-0">
          <div className={`bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] h-full transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-72' : 'w-0'} overflow-hidden`}>
            {isSidebarOpen && <FilterSidebar onFilterChange={handleFilterChange} onResetFilters={handleResetFilters} filters={filters} providers={providers} categories={categories} />}
          </div>
          <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg-primary)]">
            <div className="p-4 flex items-center justify-between border-b border-[var(--border-primary)] gap-4 flex-shrink-0">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors" title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}>
                {isSidebarOpen ? <ChevronsLeft size={20} /> : <Filter size={20} />}
              </button>
              <div className="relative flex-grow max-w-2xl">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={18} className="text-[var(--text-secondary)]" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-10 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-[var(--text-primary)] placeholder-[var(--text-secondary)] transition-colors"
                  placeholder="Search models, providers, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoComplete="off"
                  aria-label="Search models"
                  spellCheck="false"
                />
                {searchTerm && (
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <span className="text-xs text-[var(--text-secondary)] pr-2 border-r border-[var(--border-primary)] mr-2">
                      {filteredModels.length} found
                    </span>
                    <button 
                      onClick={() => setSearchTerm('')} 
                      className="flex items-center pr-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" 
                      title="Clear search"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                )}
              </div>
              <div className="hidden md:flex items-center gap-2 text-[var(--text-secondary)]">
                <span className="text-sm font-medium">{filteredModels.length} models found</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <ModelList models={filteredModels} selectedModelIds={selectedModelIds} onToggleSelect={handleModelSelection} />
            </div>
            <div className="p-4 border-t border-[var(--border-primary)] flex items-center justify-between flex-shrink-0 bg-[var(--bg-secondary)]">
              <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                <span className="text-sm font-medium">{selectedModelIds.length} selected</span>
                {selectedModelIds.length > 0 && <button onClick={() => setSelectedModelIds([])} className="text-sm text-primary-500 hover:underline">Clear selection</button>}
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={onClose} className="px-6 py-2 border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] font-medium transition-colors">
                  Cancel
                </button>
                <button onClick={handleApplySelection} className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed" disabled={selectedModelIds.length === 0}>
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
