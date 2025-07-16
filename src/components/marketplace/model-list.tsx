"use client";

import React from 'react';
import { Briefcase } from 'lucide-react';
import { ModelCard } from './model-card';
import { AIModel } from '@/data/models';

interface ModelListProps {
  models: AIModel[];
  selectedModelIds?: string[];
  onToggleSelect?: (modelId: string) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export const ModelList: React.FC<ModelListProps> = ({ 
  models, 
  selectedModelIds = [], 
  onToggleSelect,
  loading = false,
  emptyMessage = "No models found",
  className = ""
}) => {
  if (loading) {
    return (
      <main className={`flex-grow p-4 overflow-y-auto custom-scrollbar ${className}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="p-4 rounded-xl border border-border bg-card animate-pulse">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="h-5 bg-muted rounded w-32 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-20"></div>
                </div>
                <div className="h-6 bg-muted rounded w-16"></div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-4/5"></div>
                <div className="h-4 bg-muted rounded w-3/5"></div>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex gap-4">
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-4 bg-muted rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className={`flex-grow p-4 overflow-y-auto custom-scrollbar ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map(model => (
          <ModelCard 
            key={model.id} 
            model={model} 
            isSelected={selectedModelIds.includes(model.id)}
            onToggleSelect={() => onToggleSelect?.(model.id)}
          />
        ))}
      </div>
      
      {models.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground">
          <Briefcase size={48} className="mb-4" />
          <p className="text-lg font-medium">No models found</p>
          <p className="text-sm mt-2">{emptyMessage}</p>
          <p className="text-sm mt-1">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </main>
  );
};
