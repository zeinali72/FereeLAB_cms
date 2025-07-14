// frontend/components/marketplace/ModelList.js
import React from 'react';
import ModelCard from './ModelCard';
import { Briefcase } from 'react-feather';

const ModelList = ({ models, selectedModelIds = [], onToggleSelect }) => {
  return (
    <main className="flex-grow p-4 md:p-6 overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {models.map(model => (
          <ModelCard 
            key={model.id} 
            model={model} 
            isSelected={selectedModelIds.includes(model.id)}
            onToggleSelect={() => onToggleSelect(model.id)}
          />
        ))}
      </div>
      {models.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No models found</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Try adjusting your filters</p>
        </div>
      )}
    </main>
  );
};

export default ModelList;