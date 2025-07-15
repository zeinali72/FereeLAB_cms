// frontend/components/sidebar/SearchWithSuggestions.js
import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'react-feather';

const defaultSuggestions = [
  'How to use React hooks?',
  'What is Tailwind CSS?',
  'Getting started with Next.js',
  'How to implement dark mode?',
  'What are the best practices for API design?',
];

const SearchWithSuggestions = ({ conversations = [], onSearchResults }) => {
  const [query, setQuery] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef(null);
  const [searchResults, setSearchResults] = useState([]);
  
  // Extract unique terms from conversations to use as dynamic suggestions
  const dynamicSuggestions = conversations.length > 0 
    ? [...new Set(conversations
        .map(conv => conv.title)
        .filter(title => title && title.trim().length > 0)
        .slice(0, 5))]
    : defaultSuggestions;
    
  // Use debounce for search to avoid excessive updates
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length > 1) {
        const results = conversations.filter(conv => 
          conv.title?.toLowerCase().includes(query.toLowerCase()) || 
          conv.summary?.toLowerCase().includes(query.toLowerCase()) ||
          conv.messages?.some(msg => 
            msg.text?.toLowerCase().includes(query.toLowerCase())
          )
        );
        
        setSearchResults(results);
        if (onSearchResults) {
          onSearchResults(results, query); // Pass query along with results
        }
      }
    }, 300); // 300ms debounce
    
    return () => clearTimeout(delayDebounce);
  }, [query, conversations, onSearchResults]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 1) {
      // Filter suggestions
      const filtered = dynamicSuggestions.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      
      // Search results will be handled by the debounced effect
    } else {
      setFilteredSuggestions([]);
      setSearchResults([]);
      if (onSearchResults) {
        onSearchResults([], '');
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setFilteredSuggestions([]);
    
    // Immediately perform search with the selected suggestion without waiting for debounce
    const results = conversations.filter(conv => 
      conv.title?.toLowerCase().includes(suggestion.toLowerCase()) || 
      conv.summary?.toLowerCase().includes(suggestion.toLowerCase()) ||
      conv.messages?.some(msg => 
        msg.text?.toLowerCase().includes(suggestion.toLowerCase())
      )
    );
    
    setSearchResults(results);
    if (onSearchResults) {
      onSearchResults(results, suggestion);
    }
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

  const handleClearSearch = () => {
    setQuery('');
    setFilteredSuggestions([]);
    setSearchResults([]);
    if (onSearchResults) {
      onSearchResults([], '');
    }
  };    return (
    <div className="p-4 border-b border-outline-variant relative" ref={searchContainerRef}>
      <div className="relative">
        <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-on-surface-variant" size={20} />
        <input
          type="text"
          placeholder="Search conversations..."
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          className={`w-full pl-10 pr-4 py-2 bg-surface-container-low rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-on-surface ${searchResults.length > 0 ? 'ring-1 ring-primary-500' : ''}`}
          aria-label="Search through conversations"
        />
        {query && (
          <button 
            onClick={handleClearSearch}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
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
      {query.length > 1 && searchResults.length > 0 && (
        <div className="mt-2 text-xs text-on-surface-variant">
          Found {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
        </div>
      )}
    </div>
  );
};

export default SearchWithSuggestions;