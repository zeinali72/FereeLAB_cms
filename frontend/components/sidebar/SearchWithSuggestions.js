// frontend/components/sidebar/SearchWithSuggestions.js
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Folder } from 'react-feather';

const defaultSuggestions = [
  'How to use React hooks?',
  'What is Tailwind CSS?',
  'Getting started with Next.js',
  'How to implement dark mode?',
  'What are the best practices for API design?',
];

const SearchWithSuggestions = ({ conversations = [], projects = [], onSearchResults }) => {
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
      if (query.trim()) {
        const results = [];
        
        // Search in regular conversations
        conversations.forEach(conv => {
          // Search in conversation title
          if (conv.title.toLowerCase().includes(query.toLowerCase())) {
            results.push({
              id: conv.id,
              type: 'conversation',
              title: conv.title,
              snippet: highlightText(conv.title, query),
              projectId: null,
              projectName: null
            });
          }
          
          // Search in messages
          const matchingMessages = conv.messages.filter(msg => 
            msg.text.toLowerCase().includes(query.toLowerCase())
          );
          
          matchingMessages.forEach(msg => {
            results.push({
              id: conv.id,
              type: 'conversation',
              title: conv.title,
              messageId: msg.id,
              snippet: createSnippet(msg.text, query),
              projectId: null,
              projectName: null
            });
          });
        });
        
        // Search in project conversations
        projects.forEach(project => {
          project.children.forEach(chat => {
            // Search in chat title
            if (chat.name.toLowerCase().includes(query.toLowerCase())) {
              results.push({
                id: chat.id,
                type: 'project-chat',
                title: chat.name,
                snippet: highlightText(chat.name, query),
                projectId: project.id,
                projectName: project.name
              });
            }
            
            // Search in messages
            if (chat.messages && chat.messages.length > 0) {
              const matchingMessages = chat.messages.filter(msg => 
                msg.text.toLowerCase().includes(query.toLowerCase())
              );
              
              matchingMessages.forEach(msg => {
                results.push({
                  id: chat.id,
                  type: 'project-chat',
                  title: chat.name,
                  messageId: msg.id,
                  snippet: createSnippet(msg.text, query),
                  projectId: project.id,
                  projectName: project.name
                });
              });
            }
          });
        });
        
        setSearchResults(results);
        onSearchResults && onSearchResults(results);
      } else {
        setSearchResults([]);
        onSearchResults && onSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, conversations, projects, onSearchResults]);

  useEffect(() => {
    if (query && query.length >= 1) {
      const filtered = dynamicSuggestions
        .filter(suggestion => 
          suggestion.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5);
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  }, [query, dynamicSuggestions]);

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

  const handleClearSearch = () => {
    setQuery('');
    setFilteredSuggestions([]);
    setSearchResults([]);
    if (onSearchResults) {
      onSearchResults([], '');
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
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result) => {
    // This should navigate to the conversation and highlight the message
    console.log('Navigate to result:', result);
    // The parent component should handle the navigation
    if (result.type === 'conversation') {
      onSearchResults && onSearchResults(result, 'navigate');
    } else if (result.type === 'project-chat') {
      onSearchResults && onSearchResults(result, 'navigate');
    }
    setIsFocused(false);
  };

  // Helper function to create a snippet around the search query
  const createSnippet = (text, query) => {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text.substring(0, 100) + '...';
    
    const start = Math.max(0, index - 40);
    const end = Math.min(text.length, index + query.length + 40);
    const prefix = start > 0 ? '...' : '';
    const suffix = end < text.length ? '...' : '';
    
    const snippet = prefix + text.substring(start, end) + suffix;
    return highlightText(snippet, query);
  };
  
  // Helper function to highlight the search query in text
  const highlightText = (text, query) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <span key={i} className="bg-yellow-200 dark:bg-yellow-800 text-black dark:text-white">{part}</span> 
        : part
    );
  };

  return (
    <div className="relative w-full" ref={searchContainerRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search conversations..."
          className="w-full px-4 py-2 pr-10 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary-500)] text-[var(--text-primary)]"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {query ? (
            <X
              size={16}
              className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] cursor-pointer"
              onClick={handleClearSearch}
            />
          ) : (
            <Search size={16} className="text-[var(--text-tertiary)]" />
          )}
        </div>
      </div>

      {isFocused && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-md shadow-lg">
          <ul className="py-1">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 cursor-pointer hover:bg-[var(--bg-secondary)]"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-md shadow-lg max-h-80 overflow-y-auto">
          <ul className="py-1">
            {searchResults.map((result, index) => (
              <li
                key={index}
                className="px-4 py-3 cursor-pointer hover:bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] last:border-b-0"
                onClick={() => handleResultClick(result)}
              >
                <div className="flex flex-col">
                  <div className="flex items-center mb-1">
                    {result.projectName && (
                      <div className="flex items-center bg-[var(--primary-500)] text-white text-xs px-2 py-1 rounded mr-2">
                        <Folder size={12} className="mr-1" />
                        <span>{result.projectName}</span>
                      </div>
                    )}
                    <span className="font-medium">{result.title}</span>
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">
                    {result.snippet}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchWithSuggestions;