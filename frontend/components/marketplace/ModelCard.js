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
                    ? 'border-primary-500 bg-primary-500/10 shadow-md' 
                    : 'border-[var(--border-primary)] bg-[var(--bg-tertiary)] hover:shadow-sm hover:border-[var(--border-secondary)]'
                }`}
            onClick={onToggleSelect}
        >
            {isSelected && (
                <div className="absolute bottom-3 right-3 text-primary-500 bg-[var(--bg-primary)] rounded-full">
                    <CheckCircle size={22} strokeWidth={1.5} />
                </div>
            )}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">{model.name}</h2>
                    <p className="text-sm text-[var(--text-secondary)]">by {model.provider.name}</p>
                </div>
                <div className="flex-shrink-0 ml-4 mt-1 px-3 py-1 bg-[var(--bg-secondary)] rounded-full text-xs font-medium text-[var(--text-secondary)]">
                    {formatContext(model.context_length)}
                </div>
            </div>
            <p className="mt-3 text-sm text-[var(--text-primary)] line-clamp-3">
                {model.description}
            </p>
            <div className="mt-4 pt-4 border-t border-[var(--border-primary)] flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <div className="text-[var(--text-secondary)]">
                    Input: <span className="font-mono text-[var(--text-primary)]">${model.pricing.prompt}/M</span>
                </div>
                <div className="text-[var(--text-secondary)]">
                    Output: <span className="font-mono text-[var(--text-primary)]">${model.pricing.completion}/M</span>
                </div>
                <div className="flex items-center text-[var(--text-secondary)]">
                    <span className="mr-2">Speed:</span>
                    <div className="h-2 w-16 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-primary-500 rounded-full" 
                            style={{ width: `${Math.min(100, (model.metrics?.speed || 3) * 20)}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModelCard;
