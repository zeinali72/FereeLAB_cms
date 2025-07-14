// frontend/components/modals/ModelPanel.js
import React, { useState, useEffect } from 'react';
import { Briefcase, Zap, Settings, ChevronDown, ChevronRight, X } from 'react-feather';

// Mock data for models, now including default maxTokens and token prices
const models = [
  { id: 'gemini-flash', name: 'Gemini Flash', provider: 'Google', icon: '⚡️', maxTokens: 8192, inputPrice: 0.00025, outputPrice: 0.0005 },
  { id: 'claude-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', icon: '🍀', maxTokens: 4096, inputPrice: 0.000125, outputPrice: 0.000125 },
  { id: 'llama3-8b', name: 'Llama 3 8B', provider: 'Meta', icon: '🦙', maxTokens: 8192, inputPrice: 0.0001, outputPrice: 0.0001 },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', icon: '✨', maxTokens: 4096, inputPrice: 0.0005, outputPrice: 0.0015 },
];

const ModelPanel = ({ isOpen, onClose, onOpenMarketplace, selectedModels = [] }) => {
  const [selectedModelId, setSelectedModelId] = useState('gemini-flash');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Use only models from the marketplace if any are selected, otherwise use default models
  const allModels = React.useMemo(() => {
    if (selectedModels.length > 0) {
      // Use marketplace models
      const marketplaceModels = selectedModels.map(modelId => {
        const modelNameParts = modelId.split('/');
        const providerName = modelNameParts[0] || 'Unknown';
        const modelName = modelNameParts.length > 1 
          ? modelNameParts[1].replace(/-/g, ' ') 
          : modelId.replace(/-/g, ' ');
        
        return {
          id: modelId,
          name: modelName,
          provider: providerName,
          icon: '✨',
          maxTokens: 8192,
          inputPrice: 0.0001,
          outputPrice: 0.0001
        };
      });
      return marketplaceModels;
    } else {
      // Use default models if no marketplace models are selected
      return models;
    }
  }, [selectedModels]);
  
  // State for advanced settings
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(models.find(m => m.id === 'gemini-flash')?.maxTokens || 8192);

  // Effect to update max tokens when the model changes
  useEffect(() => {
    const model = allModels.find(m => m.id === selectedModelId);
    if (model) {
      setMaxTokens(model.maxTokens);
    }
  }, [selectedModelId, allModels]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-modal animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 modal-backdrop" 
        onClick={onClose}
      ></div>
      
      {/* Panel */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
        <div className="panel-translucent panel-layout-default animate-slide-in-right">
          {/* Header */}
          <div className="panel-header">
            <h2 className="text-xl font-semibold">Models</h2>
            <button
              onClick={onClose}
              className="btn btn-icon btn-ghost"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Content */}
          <div className="panel-content">
            {/* Model Selection */}
            <div className="space-y-3">
              <h3 className="font-medium">Select Model</h3>
              <div className="grid gap-2">
                {allModels.map(model => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModelId(model.id)}
                    className={`p-3 rounded-lg flex items-center justify-between transition-colors ${
                      selectedModelId === model.id 
                        ? 'bg-primary-50 dark:bg-primary-900 ring-1 ring-primary-500' 
                        : 'hover:bg-surface-secondary'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{model.icon}</span>
                      <div className="text-left">
                        <div className="font-medium">{model.name}</div>
                        <div className="text-xs text-tertiary">{model.provider}</div>
                      </div>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className="font-mono text-tertiary">
                        ${model.outputPrice.toFixed(5)}/1K
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Browse More Models Button */}
              <button
                onClick={onOpenMarketplace}
                className="btn btn-outline w-full p-3 border-dashed"
              >
                <Briefcase size={16} className="mr-2 text-tertiary" />
                <span className="text-sm font-medium">Browse AI Models</span>
              </button>
            </div>
            
            {/* Advanced Settings Toggle */}
            <div className="mt-6">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center w-full p-2 text-sm font-medium hover:bg-surface-secondary rounded-md transition-colors"
              >
                <Settings size={16} className="mr-2" />
                <span>Advanced Settings</span>
                {showAdvanced ? <ChevronDown size={16} className="ml-auto" /> : <ChevronRight size={16} className="ml-auto" />}
              </button>
            </div>
            
            {/* Advanced Settings Panel */}
            {showAdvanced && (
              <div className="mt-3 p-4 bg-surface-secondary rounded-lg space-y-4">
                {/* Temperature Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="temperature" className="text-sm font-medium">Temperature</label>
                    <span className="text-sm font-mono">{temperature.toFixed(1)}</span>
                  </div>
                  <input
                    id="temperature"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full appearance-none bg-surface-tertiary rounded-full h-2 focus:outline-none cursor-pointer"
                    style={{
                      appearance: 'none',
                      background: `linear-gradient(to right, var(--color-primary-500) 0%, var(--color-primary-500) ${temperature * 100}%, var(--color-surface-tertiary) ${temperature * 100}%, var(--color-surface-tertiary) 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-tertiary mt-1">
                    <span>More focused</span>
                    <span>More creative</span>
                  </div>
                </div>
                
                {/* Max Tokens Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="maxTokens" className="text-sm font-medium">Max Tokens</label>
                    <span className="text-sm font-mono">{maxTokens}</span>
                  </div>
                  <input
                    id="maxTokens"
                    type="range"
                    min="1000"
                    max="32000"
                    step="1000"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    className="w-full appearance-none bg-surface-tertiary rounded-full h-2 focus:outline-none cursor-pointer"
                    style={{
                      appearance: 'none',
                      background: `linear-gradient(to right, var(--color-primary-500) 0%, var(--color-primary-500) ${(maxTokens / 32000) * 100}%, var(--color-surface-tertiary) ${(maxTokens / 32000) * 100}%, var(--color-surface-tertiary) 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-tertiary mt-1">
                    <span>Shorter responses</span>
                    <span>Longer responses</span>
                  </div>
                </div>
                
                {/* Token usage info */}
                <div className="text-xs text-tertiary">
                  <div className="flex items-center mb-1">
                    <Zap size={12} className="mr-1" />
                    <span>Input: ${allModels.find(m => m.id === selectedModelId)?.inputPrice.toFixed(5)}/1K tokens</span>
                  </div>
                  <div className="flex items-center">
                    <Zap size={12} className="mr-1" />
                    <span>Output: ${allModels.find(m => m.id === selectedModelId)?.outputPrice.toFixed(5)}/1K tokens</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="panel-footer">
            <button
              onClick={onClose}
              className="btn btn-md btn-primary"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelPanel;