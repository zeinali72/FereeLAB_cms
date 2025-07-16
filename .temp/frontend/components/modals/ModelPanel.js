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
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
      
      {/* Modal Panel */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Models</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {/* Model Selection */}
          <div className="space-y-3">
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Select Model</h3>
            <div className="grid gap-2">
              {allModels.map(model => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModelId(model.id)}
                  className={`p-3 rounded-lg flex items-center justify-between transition-colors border ${
                    selectedModelId === model.id 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-3">{model.icon}</span>
                    <div className="text-left">
                      <div className="font-medium text-gray-800 dark:text-gray-200">{model.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{model.provider}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                    <div className="font-mono">${model.outputPrice.toFixed(5)}/1K</div>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Browse More Models Button */}
            <button
              onClick={onOpenMarketplace}
              className="w-full flex items-center justify-center px-4 py-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mt-4"
            >
              <Briefcase size={16} className="mr-2" />
              <span className="text-sm font-medium">Browse AI Models</span>
            </button>
          </div>
          
          {/* Advanced Settings Toggle */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center w-full p-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Settings size={16} className="mr-2" />
              <span>Advanced Settings</span>
              {showAdvanced ? <ChevronDown size={16} className="ml-auto" /> : <ChevronRight size={16} className="ml-auto" />}
            </button>
          </div>
          
          {/* Advanced Settings Panel */}
          {showAdvanced && (
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 space-y-4 animate-fade-in">
              {/* Temperature Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="temperature" className="text-sm font-medium text-gray-700 dark:text-gray-300">Temperature</label>
                  <span className="text-sm font-mono text-gray-600 dark:text-gray-400">{temperature.toFixed(1)}</span>
                </div>
                <input
                  id="temperature"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--brand-primary-500) 0%, var(--brand-primary-500) ${temperature * 100}%, var(--gray-300) ${temperature * 100}%, var(--gray-300) 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>More focused</span>
                  <span>More creative</span>
                </div>
              </div>
              
              {/* Max Tokens Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="maxTokens" className="text-sm font-medium text-gray-700 dark:text-gray-300">Max Tokens</label>
                  <span className="text-sm font-mono text-gray-600 dark:text-gray-400">{maxTokens}</span>
                </div>
                <input
                  id="maxTokens"
                  type="range"
                  min="1000"
                  max="32000"
                  step="1000"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--brand-primary-500) 0%, var(--brand-primary-500) ${(maxTokens / 32000) * 100}%, var(--gray-300) ${(maxTokens / 32000) * 100}%, var(--gray-300) 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Shorter responses</span>
                  <span>Longer responses</span>
                </div>
              </div>
              
              {/* Token usage info */}
              <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center mb-1">
                  <Zap size={12} className="mr-1 text-blue-400" />
                  <span>Input: ${allModels.find(m => m.id === selectedModelId)?.inputPrice.toFixed(5)}/1K tokens</span>
                </div>
                <div className="flex items-center">
                  <Zap size={12} className="mr-1 text-blue-400" />
                  <span>Output: ${allModels.find(m => m.id === selectedModelId)?.outputPrice.toFixed(5)}/1K tokens</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelPanel;
