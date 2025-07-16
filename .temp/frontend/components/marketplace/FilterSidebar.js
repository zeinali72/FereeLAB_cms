import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Type, Clock, DollarSign, Box, Server } from 'react-feather';

const FilterSection = ({ title, icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="py-3 border-b border-[var(--border-primary)] last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-left px-4 py-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors duration-200"
            >
                <div className="flex items-center space-x-3 text-[var(--text-secondary)]">
                    {icon}
                    <h3 className="font-medium text-sm text-[var(--text-primary)]">{title}</h3>
                </div>
                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {isOpen && <div className="mt-2 px-4 space-y-2 animate-fade-in">{children}</div>}
        </div>
    );
};

const RangeSlider = ({ min, max, step, value, onChange, displayFormat }) => {
    const progress = ((value - min) / (max - min)) * 100;

    return (
        <div className="py-2">
            <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-2">
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
                    className="absolute top-1/2 left-0 h-1 rounded-full bg-primary-500 -translate-y-1/2"
                    style={{ width: `${progress}%` }}
                ></div>
                 <div 
                    className="absolute top-1/2 h-1 rounded-full bg-[var(--bg-tertiary)] -translate-y-1/2"
                    style={{ left: `${progress}%`, right: 0 }}
                ></div>
            </div>
            <div className="text-center text-sm font-medium text-[var(--text-primary)] mt-2">{displayFormat(value)}</div>
        </div>
    );
};

const CheckboxGroup = ({ items, selected, onChange }) => (
    <div>
        {items.map(item => (
            <label key={item.id} className="flex items-center text-sm p-2 rounded-lg w-full cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors">
                <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-[var(--border-primary)] text-primary-500 focus:ring-primary-500"
                    checked={selected.includes(item.id)}
                    onChange={() => onChange(item.id)}
                />
                <span className="ml-2 text-[var(--text-primary)]">{item.name}</span>
            </label>
        ))}
    </div>
);

const FilterSidebar = ({ onFilterChange, onResetFilters, filters: activeFilters, providers, categories }) => {
    const [filters, setFilters] = useState(activeFilters);

    useEffect(() => {
        setFilters(activeFilters);
    }, [activeFilters]);

    const handleCheckboxChange = (group, id) => {
        const newGroup = filters[group].includes(id)
            ? filters[group].filter(item => item !== id)
            : [...filters[group], id];
        
        const updatedFilters = { ...filters, [group]: newGroup };
        onFilterChange(updatedFilters);
        setFilters(updatedFilters);
    };

    const handleValueChange = (name, value) => {
        const updatedFilters = { ...filters, [name]: value };
        onFilterChange(updatedFilters);
        setFilters(updatedFilters);
    };

    const isFilterActive = () => {
        return (
            activeFilters.modalities.length > 0 ||
            activeFilters.contextLength > 0 ||
            activeFilters.maxPrice > 0 ||
            activeFilters.categories.length > 0 ||
            activeFilters.providers.length > 0
        );
    };
    
    return (
        <div className="h-full flex flex-col">
            <div className="p-4 flex items-center justify-between border-b border-[var(--border-primary)]">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Filters</h2>
                {isFilterActive() && (
                    <button 
                        onClick={onResetFilters} 
                        className="text-sm text-primary-500 hover:underline"
                    >
                        Reset
                    </button>
                )}
            </div>
            <div className="overflow-y-auto flex-grow custom-scrollbar">
                <FilterSection title="Input Modalities" icon={<Type size={16} />} defaultOpen={true}>
                    <CheckboxGroup 
                        items={[{id: 'text', name: 'Text'}, {id: 'image', name: 'Image'}, {id: 'file', name: 'File'}]}
                        selected={filters.modalities}
                        onChange={(id) => handleCheckboxChange('modalities', id)}
                    />
                </FilterSection>

                <FilterSection title="Context Length" icon={<Clock size={16} />} defaultOpen={true}>
                    <RangeSlider 
                        min={0} 
                        max={128000} 
                        step={1000}
                        value={filters.contextLength} 
                        onChange={(e) => handleValueChange('contextLength', parseInt(e.target.value))} 
                        displayFormat={(val) => val === 0 ? 'Any' : `${(val / 1000)}K`}
                    />
                </FilterSection>

                <FilterSection title="Max Price (/1M tokens)" icon={<DollarSign size={16} />} defaultOpen={true}>
                    <RangeSlider 
                        min={0} 
                        max={5} 
                        step={0.01}
                        value={filters.maxPrice} 
                        onChange={(e) => handleValueChange('maxPrice', parseFloat(e.target.value))} 
                        displayFormat={(val) => val === 0 ? 'Any' : `$${val.toFixed(2)}`}
                    />
                </FilterSection>

                <FilterSection title="Categories" icon={<Box size={16} />}>
                    <CheckboxGroup 
                        items={categories}
                        selected={filters.categories}
                        onChange={(id) => handleCheckboxChange('categories', id)}
                    />
                </FilterSection>

                <FilterSection title="Providers" icon={<Server size={16} />}>
                     <CheckboxGroup 
                        items={providers}
                        selected={filters.providers}
                        onChange={(id) => handleCheckboxChange('providers', id)}
                    />
                </FilterSection>
            </div>
        </div>
    );
};

export default FilterSidebar;