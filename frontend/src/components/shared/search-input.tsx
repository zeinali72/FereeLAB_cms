"use client";

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ 
  onSearch, 
  placeholder = 'Search...', 
  className = '',
  value: controlledValue,
  onChange
}) => {
  const [internalQuery, setInternalQuery] = useState('');
  
  // Use controlled value if provided, otherwise use internal state
  const query = controlledValue !== undefined ? controlledValue : internalQuery;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    
    if (controlledValue !== undefined && onChange) {
      onChange(newQuery);
    } else {
      setInternalQuery(newQuery);
    }
    
    if (onSearch) {
      onSearch(newQuery);
    }
  };

  const handleClear = () => {
    const emptyQuery = '';
    
    if (controlledValue !== undefined && onChange) {
      onChange(emptyQuery);
    } else {
      setInternalQuery(emptyQuery);
    }
    
    if (onSearch) {
      onSearch(emptyQuery);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <input
        type="text"
        name="search"
        id="search"
        className={cn(
          "w-full pl-10 pr-10 py-2 text-sm",
          "border border-input rounded-md",
          "bg-background text-foreground",
          "placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring",
          "transition-colors"
        )}
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-foreground text-muted-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
