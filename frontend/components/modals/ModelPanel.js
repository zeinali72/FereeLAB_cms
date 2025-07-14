import React, { useState, useEffect } from 'react';
import { Briefcase, Zap, Settings, ChevronDown, ChevronRight, X } from 'react-feather';

// Mock data for models, now including default maxTokens and token prices
const models = [
  { id: 'gemini-flash', name: 'Gemini Flash', provider: 'Google', icon: '⚡️', maxTokens: 8192, inputPrice: 0.00025, outputPrice: 0.0005 },
  { id: 'claude-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', icon: '🍀', maxTokens: 4096, inputPrice: 0.000125, outputPrice: 0.000125 },
  { id: 'llama3-8b', name: 'Llama 3 8B', provider: 'Meta', icon: '🦙', maxTokens: 8192, inputPrice: 0.0001, outputPrice: 0.0001 },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', icon: '✨', maxTokens: 4096, inputPrice: 0.0005, outputPrice: 0.0015 },
];

const ModelPanel = ({ isOpen, onClose }) => {
  const [selectedModelId, setSelectedModelId] = useState('gemini-flash');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // State for advanced settings
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(models.find(m => m.id === 'gemini-flash').maxTokens);

  // Effect to update max tokens when the model changes
  useEffect(() => {
    const newModel = models.find(m => m.id === selectedModelId);
    if (newModel) {
      setMaxTokens(newModel.maxTokens);
    }
  }, [selectedModelId]);

  if (!isOpen) return null;

return (
    // Backdrop
    <div className="fixed inset-0 z-40" onClick={onClose}>
        {/* Panel */}
        <div
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            className="absolute top-16 left-1/2 md:left-auto md:right-1/2 transform -translate-x-1/2 md:translate-x-0 w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50"
        >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Select a Model</h2>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <X size={20} />
                </button>
            </div>

            {/* Model Selection Grid */}
            <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                    {models.map((model) => (
                        <button
                            key={model.id}
                            onClick={() => setSelectedModelId(model.id)}
                            className={`p-3 border rounded-lg text-left hover:border-blue-500 dark:hover:border-blue-500 ${
                                selectedModelId === model.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50' : 'border-gray-200 dark:border-gray-600'
                            }`}
                        >
                            <div className="text-2xl mb-2">{model.icon}</div>
                            <div className="font-semibold">{model.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{model.provider}</div>
                            {/* Token price info */}
                            <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                              <span>
                                Input: <span className="font-mono">${model.inputPrice.toFixed(5)}</span>
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">
                              <span>
                                Output: <span className="font-mono">${model.outputPrice.toFixed(5)}</span>
                              </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Marketplace Section */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Briefcase size={18} className="mr-3 text-gray-500" />
                        <div>
                            <h3 className="font-semibold">Marketplace</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Discover more models from the community.</p>
                        </div>
                    </div>
                    <button className="px-3 py-1 text-sm font-medium border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                        Explore
                    </button>
                </div>
            </div>

            {/* Advanced Settings */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center justify-between cursor-pointer"
                >
                    <div className="flex items-center">
                        <Settings size={18} className="mr-3 text-gray-500" />
                        <h3 className="font-semibold">Advanced Settings</h3>
                    </div>
                    {showAdvanced ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
                {showAdvanced && (
                    <div className="mt-4 space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="temp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Temperature</label>
                                {/* Display the temperature value */}
                                <span className="text-sm font-mono text-gray-600 dark:text-gray-400">{temperature.toFixed(2)}</span>
                            </div>
                            {/* Show the value above the bar */}
                            <div className="flex justify-end mb-1">
                                <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{temperature.toFixed(2)}</span>
                            </div>
                            <input 
                                type="range" 
                                id="temp" 
                                min="0" 
                                max="2" 
                                step="0.01" 
                                value={temperature}
                                onChange={(e) => setTemperature(parseFloat(parseFloat(e.target.value).toFixed(2)))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600" 
                            />
                        </div>
                        <div>
                            <label htmlFor="max-tokens" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Tokens</label>
                            <input 
                                type="number" 
                                id="max-tokens" 
                                value={maxTokens}
                                onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
                                className="w-full mt-1 p-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md" 
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
);
};

export default ModelPanel;