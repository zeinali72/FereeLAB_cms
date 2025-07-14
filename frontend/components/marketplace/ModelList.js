// frontend/components/marketplace/ModelList.js
import React from 'react';
import ModelCard from './ModelCard';

const ModelList = ({ models, selectedModelIds = [], onToggleSelect }) => {
  return (
    <main className="flex-grow p-6 overflow-y-auto">
      <div className="space-y-4">
        {models.map(model => (
          <ModelCard 
            key={model.id} 
            model={model} 
            isSelected={selectedModelIds.includes(model.id)}
            onToggleSelect={() => onToggleSelect(model.id)}
          />
        ))}
      </div>
    </main>
  );
};

export default ModelList;