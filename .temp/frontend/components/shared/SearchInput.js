import React, { useState } from 'react';
import { Search, X } from 'react-feather';

const SearchInput = ({ onSearch, placeholder = 'Search...' }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (onSearch) {
      onSearch(newQuery);
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-on-surface-variant" />
      </div>
      <input
        type="text"
        name="search"
        id="search"
        className="block w-full pl-10 pr-10 py-2 border border-outline rounded-md leading-5 bg-surface-primary text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary-focus focus:border-primary-focus text-sm"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
      />
      {query && (
        <button 
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-on-surface"
          aria-label="Clear search"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
