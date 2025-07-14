// frontend/components/marketplace/ModelList.js
import React from 'react';
import ModelCard from './ModelCard';
import { Briefcase } from 'react-feather';

const ModelList = ({ models, selectedModelIds = [], onToggleSelect }) => {
  return (
    <main className="flex-grow p-4 overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="flex flex-col items-center justify-center h-full py-12 text-gray-500 dark:text-gray-400">
          <Briefcase size={48} className="mb-4" />
          <p className="text-lg font-medium">No models found</p>
          <p className="text-sm mt-2">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </main>
  );
};

export default ModelList;
