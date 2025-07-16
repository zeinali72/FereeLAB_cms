"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Type, Clock, DollarSign, Box, Server } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="py-3 border-b border-border/20 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left px-4 py-2 rounded-lg hover:bg-muted/30 transition-all duration-200"
      >
        <div className="flex items-center space-x-3 text-muted-foreground">
          {icon}
          <h3 className="font-medium text-sm text-foreground glass-text-light">{title}</h3>
        </div>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {isOpen && <div className="mt-2 px-4 space-y-2 animate-in slide-in-from-top-2">{children}</div>}
    </div>
  );
};

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  displayFormat: (value: number) => string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ min, max, step, value, onChange, displayFormat }) => {
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <div className="py-2">
      <div className="flex justify-between text-xs text-muted-foreground mb-2">
        <span>{displayFormat(min)}</span>
        <span>{displayFormat(max)}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step || 1}
          value={value}
          onChange={onChange}
          className="w-full h-2 bg-transparent appearance-none cursor-pointer range-slider"
        />
        <div 
          className="absolute top-1/2 left-0 h-1 rounded-full bg-primary -translate-y-1/2"
          style={{ width: `${progress}%` }}
        />
        <div 
          className="absolute top-1/2 h-1 rounded-full bg-muted -translate-y-1/2"
          style={{ left: `${progress}%`, right: 0 }}
        />
      </div>
      <div className="text-center text-xs text-muted-foreground mt-1">
        {displayFormat(value)}
      </div>
    </div>
  );
};

interface CheckboxGroupProps {
  items: { id: string; name: string }[];
  selected: string[];
  onChange: (id: string) => void;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ items, selected, onChange }) => (
  <div>
    {items.map(item => (
      <label key={item.id} className="flex items-center text-sm p-2 rounded-lg w-full cursor-pointer hover:bg-muted transition-colors">
        <input 
          type="checkbox" 
          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          checked={selected.includes(item.id)}
          onChange={() => onChange(item.id)}
        />
        <span className="ml-2 text-foreground">{item.name}</span>
      </label>
    ))}
  </div>
);

interface FilterSidebarProps {
  filters: {
    providers: string[];
    modalities: string[];
    contextLength: number;
    maxPrice: number;
    categories: string[];
  };
  onFilterChange: (filters: { minPrice: number; maxPrice: number; categories: string[]; }) => void;
  onResetFilters: () => void;
  providers?: { id: string; name: string }[];
  categories?: { id: string; name: string }[];
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  providers = [],
  categories = []
}) => {
  const modalities = [
    { id: 'text', name: 'Text' },
    { id: 'image', name: 'Image' },
    { id: 'audio', name: 'Audio' },
    { id: 'video', name: 'Video' },
    { id: 'code', name: 'Code' }
  ];

  const handleProviderChange = (providerId: string) => {
    const newProviders = filters.providers.includes(providerId)
      ? filters.providers.filter(p => p !== providerId)
      : [...filters.providers, providerId];
    
    onFilterChange({ ...filters, providers: newProviders });
  };

  const handleModalityChange = (modalityId: string) => {
    const newModalities = filters.modalities.includes(modalityId)
      ? filters.modalities.filter(m => m !== modalityId)
      : [...filters.modalities, modalityId];
    
    onFilterChange({ ...filters, modalities: newModalities });
  };

  const handleCategoryChange = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(c => c !== categoryId)
      : [...filters.categories, categoryId];
    
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleContextLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, contextLength: parseInt(e.target.value) });
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, maxPrice: parseFloat(e.target.value) });
  };

  const formatTokens = (tokens: number) => {
    if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`;
    if (tokens >= 1000) return `${Math.round(tokens / 1000)}K`;
    return tokens.toString();
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(4)}`;
  };

  return (
    <div className="w-72 bg-background border-r border-border overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button
            onClick={onResetFilters}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Reset All
          </button>
        </div>

        <div className="space-y-1">
          {/* Providers Filter */}
          {providers.length > 0 && (
            <FilterSection title="Providers" icon={<Server size={16} />} defaultOpen>
              <CheckboxGroup
                items={providers}
                selected={filters.providers}
                onChange={handleProviderChange}
              />
            </FilterSection>
          )}

          {/* Modalities Filter */}
          <FilterSection title="Modalities" icon={<Type size={16} />}>
            <CheckboxGroup
              items={modalities}
              selected={filters.modalities}
              onChange={handleModalityChange}
            />
          </FilterSection>

          {/* Context Length Filter */}
          <FilterSection title="Context Length" icon={<Box size={16} />}>
            <RangeSlider
              min={0}
              max={1000000}
              step={1000}
              value={filters.contextLength}
              onChange={handleContextLengthChange}
              displayFormat={formatTokens}
            />
          </FilterSection>

          {/* Price Filter */}
          <FilterSection title="Max Price" icon={<DollarSign size={16} />}>
            <RangeSlider
              min={0}
              max={0.1}
              step={0.001}
              value={filters.maxPrice}
              onChange={handleMaxPriceChange}
              displayFormat={formatPrice}
            />
          </FilterSection>

          {/* Categories Filter */}
          {categories.length > 0 && (
            <FilterSection title="Categories" icon={<Clock size={16} />}>
              <CheckboxGroup
                items={categories}
                selected={filters.categories}
                onChange={handleCategoryChange}
              />
            </FilterSection>
          )}
        </div>
      </div>
    </div>
  );
};
