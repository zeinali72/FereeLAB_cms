"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Search, Filter, CheckCircle } from "lucide-react";
import { AIModel } from "@/data/models";
import { FilterSidebar } from "@/components/marketplace/filter-sidebar";
import { ModelList } from "@/components/marketplace/model-list";
import { modelsAPI } from "@/lib/api";

interface MarketplacePanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModels: string[];
  onApplyModels: (models: AIModel[]) => void;
}

interface FilterState {
  providers: string[];
  modalities: string[];
  contextLength: number;
  maxPrice: number;
  categories: string[];
}

export function MarketplacePanel({ isOpen, onClose, selectedModels, onApplyModels }: MarketplacePanelProps) {
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>(selectedModels);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    providers: [],
    modalities: [],
    contextLength: 0,
    maxPrice: 0,
    categories: [],
  });

  // Load models from OpenRouter on mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoading(true);
        const response = await modelsAPI.getModels();
        if (response.models) {
          setModels(response.models);
        }
      } catch (error) {
        console.error('Failed to load models:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadModels();
    }
  }, [isOpen]);

  // Get unique providers for filter
  const providers = useMemo(() => {
    return [...new Set(models.map((m: AIModel) => m.provider.name))].sort();
  }, [models]);

  // Filter models based on search and filters
  const filteredModels = useMemo(() => {
    return models.filter((model: AIModel) => {
      // Search filter
      const searchMatch = !searchTerm || 
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.provider.name.toLowerCase().includes(searchTerm.toLowerCase());

      // Provider filter
      const providerMatch = filters.providers.length === 0 || 
        filters.providers.includes(model.provider.name);

      // Price filter  
      const priceMatch = filters.maxPrice === 0 || 
        (model.inputPrice || 0) <= filters.maxPrice;

      // Context length filter
      const contextMatch = filters.contextLength === 0 || 
        model.context_length >= filters.contextLength;

      return searchMatch && providerMatch && priceMatch && contextMatch;
    });
  }, [searchTerm, filters, models]);

  const handleModelToggle = (modelId: string) => {
    setSelectedModelIds(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const handleApply = () => {
    const selectedModelsData = models.filter((m: AIModel) => selectedModelIds.includes(m.id));
    onApplyModels(selectedModelsData);
    onClose();
  };

  const handleProviderToggle = (provider: string) => {
    setFilters(prev => ({
      ...prev,
      providers: prev.providers.includes(provider)
        ? prev.providers.filter(p => p !== provider)
        : [...prev.providers, provider]
    }));
  };

  const resetFilters = () => {
    setFilters({
      providers: [],
      modalities: [],
      contextLength: 0,
      maxPrice: 0,
      categories: [],
    });
  };

  const formatContext = (tokens: number) => {
    if (tokens >= 1000000) {
      return `${(tokens / 1000000).toFixed(1)}M`;
    } else if (tokens >= 1000) {
      return `${(tokens / 1000).toFixed(0)}K`;
    }
    return tokens.toString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Model Marketplace</h2>
              <p className="text-sm text-muted-foreground">
                Browse and select AI models from OpenRouter
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Filter Sidebar */}
          {showFilters && (
            <div className="w-64 border-r border-border bg-muted/30 p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Filters</h3>
                <button
                  onClick={resetFilters}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Reset
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search models..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-input rounded-md bg-background text-sm"
                  />
                </div>
              </div>

              {/* Providers */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Providers</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {providers.map((provider: string) => (
                    <label key={provider} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.providers.includes(provider)}
                        onChange={() => handleProviderToggle(provider)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{provider}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Context Length */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Min Context Length: {formatContext(filters.contextLength)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="1000"
                  value={filters.contextLength}
                  onChange={(e) => setFilters(prev => ({ ...prev, contextLength: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>

              {/* Max Price */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Max Price: ${filters.maxPrice === 0 ? 'Any' : filters.maxPrice.toFixed(4)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.1"
                  step="0.001"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-input hover:bg-muted text-sm"
                >
                  <Filter className="h-4 w-4" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
                <span className="text-sm text-muted-foreground">
                  {filteredModels.length} models found
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedModelIds.length} selected
                </span>
                <button
                  onClick={handleApply}
                  disabled={selectedModelIds.length === 0}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Apply Selection
                </button>
              </div>
            </div>

            {/* Model List */}
            <ModelList
              models={filteredModels}
              selectedModelIds={selectedModelIds}
              onToggleSelect={handleModelToggle}
              loading={loading}
              emptyMessage="No models found matching your criteria"
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
