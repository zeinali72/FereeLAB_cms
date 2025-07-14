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
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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