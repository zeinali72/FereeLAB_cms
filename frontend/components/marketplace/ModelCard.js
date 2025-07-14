// frontend/components/marketplace/ModelCard.js
import React from 'react';
import { CheckCircle } from 'react-feather';

const ModelCard = ({ model, isSelected = false, onToggleSelect }) => {
    // Format context length for better readability
    const formatContext = (tokens) => {
        if (tokens >= 1000000) {
            return `${(tokens / 1000000).toFixed(1)}M tokens`;
        }
        if (tokens >= 1000) {
            return `${Math.round(tokens / 1000)}K tokens`;
        }
        return `${tokens} tokens`;
    };

    return (
        <div 
            className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 
                ${isSelected 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md' 
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-sm hover:border-gray-300 dark:hover:border-gray-600'
                }`}
            onClick={onToggleSelect}
        >
            {isSelected && (
                <div className="absolute top-3 right-3 text-blue-600 dark:text-blue-400">
                    <CheckCircle size={20} fill="currentColor" />
                </div>
            )}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{model.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">by {model.provider.name}</p>
                </div>
                <div className="flex-shrink-0 ml-4 mt-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                    {formatContext(model.context_length)}
                </div>
            </div>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                {model.description}
            </p>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm">
                <div className="text-gray-600 dark:text-gray-400">
                    Input: <span className="font-mono text-gray-800 dark:text-gray-200">${model.pricing.prompt}/M</span>
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                    Output: <span className="font-mono text-gray-800 dark:text-gray-200">${model.pricing.completion}/M</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <span className="mr-1">Speed:</span>
                    <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${Math.min(100, (model.metrics?.speed || 3) * 20)}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModelCard;
