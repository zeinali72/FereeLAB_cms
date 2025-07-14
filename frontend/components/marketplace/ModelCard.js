// frontend/components/marketplace/ModelCard.js
import React from 'react';

const ModelCard = ({ model }) => {
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
        <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-200">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{model.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">by {model.provider.name}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                    <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium">
                        {formatContext(model.context_length)}
                    </div>
                </div>
            </div>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                {model.description}
            </p>
            <div className="mt-4 flex items-center space-x-6 text-sm">
                 <div className="text-gray-500 dark:text-gray-400">
                    Input: <span className="font-mono text-gray-700 dark:text-gray-200">${model.pricing.prompt}/M</span>
                </div>
                 <div className="text-gray-500 dark:text-gray-400">
                    Output: <span className="font-mono text-gray-700 dark:text-gray-200">${model.pricing.completion}/M</span>
                </div>
            </div>
        </div>
    );
};

export default ModelCard;