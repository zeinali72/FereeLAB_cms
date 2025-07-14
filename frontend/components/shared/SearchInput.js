// components/shared/SearchInput.js
import React from 'react';
import { Search } from 'react-feather';

const SearchInput = () => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-tertiary" />
      </div>
      <input
        type="text"
        name="search"
        id="search"
        className="block w-full pl-10 pr-3 py-2 border rounded-md leading-5 bg-surface-primary text-primary placeholder-tertiary focus:outline-none focus:placeholder-tertiary focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
        placeholder="Search..."
      />
    </div>
  );
};

export default SearchInput;
