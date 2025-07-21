"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Search, Filter, CheckCircle, Loader2 } from "lucide-react";
import { AIModel } from "@/hooks/use-panels-with-api";
import { api } from "@/lib/api";
import { FilterSidebar } from "@/components/marketplace/filter-sidebar";
import { ModelList } from "@/components/marketplace/model-list";

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
  const [filters, setFilters] = useState<FilterState>({
    providers: [],
    modalities: [],
    contextLength: 0,
    maxPrice: 0,
    categories: [],
  });
  
  const [availableModels, setAvailableModels] = useState<AIModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load models from API when panel opens
  useEffect(() => {
    if (isOpen && availableModels.length === 0) {
      loadModels();
    }
  }, [isOpen]);

  const loadModels = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiModels = await api.getModels();
      const convertedModels: AIModel[] = apiModels.map(model => ({
        id: model.model_id,
        name: model.display_name,
        description: model.description,
        context_length: model.context_length,
        pricing: {
          prompt: model.prompt_cost.toString(),
          completion: model.completion_cost.toString(),
        },
        provider: {
          id: model.provider.name,
          name: model.provider.display_name,
        },
        icon: getModelIcon(model.provider.name),
        maxTokens: model.context_length,
        inputPrice: model.prompt_cost,
        outputPrice: model.completion_cost,
        model_id: model.model_id,
        quality_score: model.quality_score,
        speed_score: model.speed_score,
        popularity_score: model.popularity_score,
        supports_functions: model.supports_functions,
        supports_vision: model.supports_vision,
        is_featured: model.is_featured,
      }));
      setAvailableModels(convertedModels);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load models');
      console.error('Failed to load models:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get icon for model provider
  function getModelIcon(providerName: string): string {
    const icons: Record<string, string> = {
      'switchpoint': '🔄',
      'openai': '🤖',
      'anthropic': '🎭',
      'google': '✨',
      'mistralai': '🌊',
      'moonshot': '🌙',
    };
    return icons[providerName] || '🔮';
  }

  // Get unique providers for filter
  const providers = useMemo(() => {
    return [...new Set(availableModels.map(m => m.provider.name))].sort();
  }, [availableModels]);

  // Filter models based on search and filters
  const filteredModels = useMemo(() => {
    return availableModels.filter(model => {
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
  }, [searchTerm, filters]);

  const handleModelToggle = (modelId: string) => {
    setSelectedModelIds(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const handleApply = () => {
    const models = availableModels.filter(m => selectedModelIds.includes(m.id));
    onApplyModels(models);
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
    }
    if (tokens >= 1000) {
      return `${Math.round(tokens / 1000)}K`;
    }
    return `${tokens}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Panel */}
      <div className="relative panel-modal w-full max-w-7xl h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/20 bg-muted/30 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-semibold text-heading">AI Models Marketplace</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Browse and select AI models for your conversations
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex flex-1 min-h-0">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-72 border-r border-border/20 p-6 overflow-y-auto bg-muted/20 scrollbar-modern">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-heading">Filters</h3>
                <button
                  onClick={resetFilters}
                  className="text-xs text-muted-foreground hover:text-foreground transition-all duration-200"
                >
                  Reset
                </button>
              </div>

              {/* Providers Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3">Providers</h4>
                <div className="space-y-2">
                  {providers.map(provider => (
                    <label key={provider} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.providers.includes(provider)}
                        onChange={() => handleProviderToggle(provider)}
                        className="rounded border-border"
                      />
                      <span className="text-sm">{provider}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Max Price Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3">Max Price (per 1K tokens)</h4>
                <input
                  type="range"
                  min="0"
                  max="0.1"
                  step="0.001"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseFloat(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Free</span>
                  <span>${filters.maxPrice.toFixed(3)}</span>
                </div>
              </div>

              {/* Context Length Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3">Min Context Length</h4>
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="10000"
                  value={filters.contextLength}
                  onChange={(e) => setFilters(prev => ({ ...prev, contextLength: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Any</span>
                  <span>{formatContext(filters.contextLength)} tokens</span>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Search and Controls */}
            <div className="p-6 border-b border-border/20 bg-muted/20">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 rounded-lg hover:bg-muted/30 transition-all duration-200"
                  title={showFilters ? "Hide filters" : "Show filters"}
                >
                  <Filter className="h-4 w-4" />
                </button>
                
                <div className="flex-1 relative input-raised p-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <input
                    type="text"
                    placeholder="Search models, providers, or descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-transparent border-none focus:outline-none"
                  />
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {filteredModels.length} models found
                </div>
              </div>
            </div>

            {/* Models Grid */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-modern">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading AI models...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                      onClick={loadModels}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : filteredModels.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <p className="text-muted-foreground">No models found matching your criteria</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredModels.map(model => {
                    const isSelected = selectedModelIds.includes(model.id);
                    return (
                      <div
                        key={model.id}
                        className={`relative p-4 rounded-lg border cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-primary bg-primary/5 shadow-md' 
                            : 'border hover:border-primary/50 hover:shadow-sm'
                        }`}
                        onClick={() => handleModelToggle(model.id)}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3 text-primary">
                            <CheckCircle className="h-5 w-5" />
                          </div>
                        )}
                        
                        <div className="mb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">{model.icon}</span>
                                <h3 className="font-semibold text-sm">{model.name}</h3>
                              </div>
                              <p className="text-xs text-muted-foreground">{model.provider.name}</p>
                              {/* Show feature badges */}
                              <div className="flex gap-1 mt-1">
                                {model.supports_functions && (
                                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">Functions</span>
                                )}
                                {model.supports_vision && (
                                  <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs">Vision</span>
                                )}
                                {model.is_featured && (
                                  <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">Featured</span>
                                )}
                              </div>
                            </div>
                            <div className="flex-shrink-0 ml-2">
                              <span className="px-2 py-1 bg-muted rounded-full text-xs">
                                {formatContext(model.context_length)} tokens
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {model.description}
                        </p>
                        
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Input:</span>
                            <span className="font-mono">${model.pricing.prompt}/1M tokens</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Output:</span>
                            <span className="font-mono">${model.pricing.completion}/1M tokens</span>
                          </div>
                          {/* Show performance scores */}
                          {(model.quality_score || model.speed_score) && (
                            <div className="flex items-center justify-between pt-1 border-t border-border/10">
                              {model.quality_score && (
                                <span className="text-muted-foreground">Quality: {model.quality_score}/10</span>
                              )}
                              {model.speed_score && (
                                <span className="text-muted-foreground">Speed: {model.speed_score}/10</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border/20 flex items-center justify-between bg-muted/30 rounded-b-2xl">
              <div className="text-sm text-muted-foreground">
                {selectedModelIds.length} model(s) selected
                {selectedModelIds.length > 0 && (
                  <button
                    onClick={() => setSelectedModelIds([])}
                    className="ml-2 text-primary hover:underline transition-all duration-200"
                  >
                    Clear selection
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-input/50 rounded-lg hover:bg-muted/30 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  disabled={selectedModelIds.length === 0}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
}
