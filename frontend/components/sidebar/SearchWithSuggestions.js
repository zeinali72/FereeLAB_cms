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
    <div className="p-4 border-b relative">
      <div className="relative">
        <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-tertiary" size={20} />
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleChange}
          className="w-full pl-10 pr-4 py-2 bg-surface-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      {filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mx-4 mt-1 bg-surface-primary border rounded-lg shadow-lg z-dropdown">
          <ul>
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-3 hover:bg-surface-secondary cursor-pointer text-sm"
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