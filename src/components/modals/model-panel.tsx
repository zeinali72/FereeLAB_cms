"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Settings, ChevronDown, ChevronRight, Zap, Search } from "lucide-react";
import { availableModels, AIModel } from "@/data/models";

interface ModelPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: AIModel | null;
  onModelSelect: (model: AIModel) => void;
  onOpenMarketplace?: () => void;
  selectedMarketplaceModels?: AIModel[];
}

export function ModelPanel({ 
  isOpen, 
  onClose, 
  selectedModel, 
  onModelSelect,
  onOpenMarketplace,
  selectedMarketplaceModels = []
}: ModelPanelProps) {
  // Provide fallback to first available model if selectedModel is null
  const currentModel = selectedModel || availableModels[0];
  
  const [selectedModelId, setSelectedModelId] = useState(currentModel?.id || availableModels[0]?.id);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(currentModel?.maxTokens || 8192);
  const [searchQuery, setSearchQuery] = useState("");

  // Combine default models with marketplace models
  const allModels = useMemo(() => {
    const defaultModels = availableModels;
    const marketplaceModels = selectedMarketplaceModels.filter(
      m => !defaultModels.find(dm => dm.id === m.id)
    );
    return [...defaultModels, ...marketplaceModels];
  }, [selectedMarketplaceModels]);

  // Filter models based on search query
  const filteredModels = allModels.filter(model => 
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update max tokens when model changes
  useEffect(() => {
    const model = allModels.find(m => m.id === selectedModelId);
    if (model) {
      setMaxTokens(model.maxTokens || 8192);
    }
  }, [selectedModelId, allModels]);

  // Update selectedModelId when selectedModel prop changes
  useEffect(() => {
    if (selectedModel?.id) {
      setSelectedModelId(selectedModel.id);
    }
  }, [selectedModel]);

  const handleApply = () => {
    const model = allModels.find(m => m.id === selectedModelId);
    if (model) {
      onModelSelect(model);
    }
    onClose();
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
      <div className="panel-modal w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/20 bg-muted/30 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-semibold text-heading">Select AI Model</h2>
            <p className="text-sm text-muted-foreground mt-1">Choose the best model for your task</p>
          </div>
          <button
            onClick={onClose}
            className="btn-minimal hover-lift-gentle focus-ring-enhanced"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-lg scrollbar-modern">
          {/* Search */}
          <div className="relative input-raised p-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-transparent border-none focus:outline-none"
            />
          </div>

          {/* Model Selection */}
          <div className="space-lg">
            <h3 className="text-sm font-medium text-muted-foreground">Available Models</h3>
            <div className="grid gap-3 max-h-96 overflow-y-auto scrollbar-modern">
              {filteredModels.map(model => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModelId(model.id)}
                  className={`card-interactive text-left transition-all duration-200 ${
                    selectedModelId === model.id 
                      ? 'border-primary bg-primary/5 shadow-md' 
                      : 'hover-lift-gentle'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <span className="text-xl mt-0.5">{model.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground text-heading">{model.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{model.provider.name}</div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2 text-body">
                          {model.description}
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>Context: {model.context_length.toLocaleString()}</span>
                          <span>•</span>
                          <span>${model.inputPrice?.toFixed(4)}/1K tokens</span>
                        </div>
                      </div>
                    </div>
                    {selectedModelId === model.id && (
                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center ml-2 mt-1 shadow-md">
                        <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            {/* Browse More Models Button */}
            {onOpenMarketplace && (
              <button
                onClick={onOpenMarketplace}
                className="w-full card-flat border-dashed hover-lift-gentle flex items-center justify-center px-4 py-3"
              >
                <Search className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Browse More Models</span>
              </button>
            )}
          </div>
          
          {/* Advanced Settings Toggle */}
          <div className="border-t border-border pt-6">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center w-full p-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <Settings className="h-4 w-4 mr-2" />
              <span>Advanced Settings</span>
              {showAdvanced ? 
                <ChevronDown className="h-4 w-4 ml-auto" /> : 
                <ChevronRight className="h-4 w-4 ml-auto" />
              }
            </button>
          </div>
          
          {/* Advanced Settings Panel */}
          {showAdvanced && (
            <div className="bg-muted/30 rounded-lg p-4 space-y-4">
              {/* Temperature Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Temperature</label>
                  <span className="text-sm font-mono text-muted-foreground">{temperature.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer bg-secondary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>More focused</span>
                  <span>More creative</span>
                </div>
              </div>
              
              {/* Max Tokens Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Max Tokens</label>
                  <span className="text-sm font-mono text-muted-foreground">{maxTokens.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="1000"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer bg-secondary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Shorter responses</span>
                  <span>Longer responses</span>
                </div>
              </div>
              
              {/* Token usage info */}
              <div className="text-xs text-muted-foreground pt-2 border-t border-border space-y-1">
                {(() => {
                  const currentModel = allModels.find(m => m.id === selectedModelId);
                  return (
                    <>
                      <div className="flex items-center">
                        <Zap className="h-3 w-3 mr-1" />
                        <span>Input: ${currentModel?.inputPrice?.toFixed(5)}/1K tokens</span>
                      </div>
                      <div className="flex items-center">
                        <Zap className="h-3 w-3 mr-1" />
                        <span>Output: ${currentModel?.outputPrice?.toFixed(5)}/1K tokens</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-border/20 flex justify-end gap-3 bg-muted/30 rounded-b-2xl">
          <button
            onClick={onClose}
            className="btn-ghost"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="btn-raised btn-ripple hover-lift-gentle"
          >
            Apply Model
          </button>
        </div>
      </div>
    </div>
  );
}
