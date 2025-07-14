// frontend/components/marketplace/ModelCard.js
import React from 'react';

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
            className={`p-4 md:p-5 rounded-lg transition-colors duration-200 cursor-pointer relative model-card
                ${isSelected ? 'model-card-selected' : ''}`}
            onClick={onToggleSelect}
        >
            {isSelected && (
                <div className="absolute bottom-4 right-4">
                    <div className="w-5 h-5 border border-primary-600 rounded flex items-center justify-center">
                        <div className="w-3 h-3 bg-primary-600 rounded-sm"></div>
                    </div>
                </div>
            )}
            <div className="flex flex-col md:flex-row justify-between md:items-start">
                <div>
                    <h2 className="text-lg font-semibold">{model.name}</h2>
                    <p className="text-sm text-tertiary">by {model.provider.name}</p>
                </div>
                <div className="text-left md:text-right flex-shrink-0 mt-2 md:mt-0 md:ml-4">
                    <div className="inline-block px-3 py-1 bg-surface-secondary rounded-full text-sm font-medium">
                        {formatContext(model.context_length)}
                    </div>
                </div>
            </div>
            <p className="mt-3 text-sm text-secondary line-clamp-3">
                {model.description}
            </p>
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm">
                <div className="text-tertiary">
                    Input: <span className="font-mono text-secondary">${model.pricing.prompt}/M</span>
                </div>
                <div className="text-tertiary">
                    Output: <span className="font-mono text-secondary">${model.pricing.completion}/M</span>
                </div>
                <div className="flex items-center text-tertiary">
                    <span className="mr-1">Speed:</span>
                    <div className="h-2 w-16 bg-surface-secondary rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-primary-500 rounded-full" 
                            style={{ width: `${Math.min(100, model.metrics.speed * 20)}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModelCard;