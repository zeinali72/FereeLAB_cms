// frontend/components/chat/PromptSuggestions.js
import React from 'react';

// Sample data for demonstration
const suggestions = [
  'Explain quantum computing in simple terms',
  'What are the best practices for writing clean code?',
  'Generate a business plan for a new startup',
];

const PromptSuggestions = ({ onSuggestionClick }) => {
  return (
    <div className="px-4 md:px-6 lg:px-8 py-4">
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="suggestion-chip hover:bg-surface-tertiary transition-colors"
            onClick={() => onSuggestionClick(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PromptSuggestions;