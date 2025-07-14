// frontend/components/sidebar/SearchWithSuggestions.js
import React, { useState } from 'react';
import { Search } from 'react-feather';

// Sample data for demonstration
const suggestions = [
  'Initial project setup',
  'Conversation about React hooks',
  'Ideas for a new feature',
];

const SearchWithSuggestions = () => {
  const [query, setQuery] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 0) {
      const filtered = suggestions.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  return (
    <div className="p-4 border-b border-outline-variant relative">
      <div className="relative">
        <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-on-surface-variant" size={20} />
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleChange}
          className="w-full pl-10 pr-4 py-2 bg-surface-container-low rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      {filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mx-4 mt-1 bg-surface-container-high border border-outline rounded-lg shadow-lg z-dropdown">
          <ul>
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-3 hover:bg-surface-container-low cursor-pointer text-sm text-on-surface"
                onClick={() => {
                  setQuery(suggestion);
                  setFilteredSuggestions([]);
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchWithSuggestions;