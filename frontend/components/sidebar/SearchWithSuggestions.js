// frontend/components/sidebar/SearchWithSuggestions.js
import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'react-feather';

const suggestions = [
  'How to use React hooks?',
  'What is Tailwind CSS?',
  'Getting started with Next.js',
  'How to implement dark mode?',
  'What are the best practices for API design?',
];

const SearchWithSuggestions = () => {
  const [query, setQuery] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 1) {
      const filtered = suggestions.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setFilteredSuggestions([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsFocused(false);
        setFilteredSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="p-4 border-b border-outline-variant relative" ref={searchContainerRef}>
      <div className="relative">
        <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-on-surface-variant" size={20} />
        <input
          type="text"
          placeholder="Search conversations..."
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          className="w-full pl-10 pr-4 py-2 bg-surface-container-low rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
        />
      </div>
      {isFocused && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mx-4 mt-1 bg-surface-container-high border border-outline rounded-lg shadow-lg z-dropdown animate-fade-in">
          <ul>
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-3 hover:bg-surface-container-low cursor-pointer text-sm text-on-surface"
                onClick={() => handleSuggestionClick(suggestion)}
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