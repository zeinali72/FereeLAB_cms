// frontend/components/marketplace/FilterSidebar.js
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Type, Image, File, Clock, DollarSign, Star, Box, Sliders, Server, ChevronLeft, ChevronsLeft } from 'react-feather';

// Reusable accordion component for filter sections
const FilterSection = ({ title, icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="py-3 border-b border-gray-200 dark:border-gray-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-left px-4 py-2 bg-surface-secondary rounded-md hover:bg-surface-tertiary transition-colors duration-200"
            >
                <div className="flex items-center space-x-3">
                    {icon}
                    <h3 className="font-medium text-sm">{title}</h3>
                </div>
                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {isOpen && <div className="mt-2 px-4 space-y-2">{children}</div>}
        </div>
    );
};

// Range slider component
const RangeSlider = ({ min, max, value, onChange }) => {
    return (
        <div className="py-2">
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={onChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    );
};

const FilterSidebar = ({ isOpen, onToggle }) => {
    const [contextLength, setContextLength] = useState(50);
    const [temperature, setTemperature] = useState(0.7);

    return (
        <>
            {/* Overlay for small screens */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" 
                    onClick={onToggle}
                ></div>
            )}
            
            <aside className={`
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
                fixed md:static inset-y-0 left-0 z-30 w-72 h-full 
                border-r border-gray-200 dark:border-gray-700 flex-shrink-0 flex flex-col
                bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out
                md:w-72 md:${isOpen ? 'block' : 'hidden'}
            `}>
                {/* Header with title and close button */}
                <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                    <h2 className="font-semibold text-lg">Filters</h2>
                    <button 
                        onClick={onToggle}
                        className="p-1 text-gray-500 rounded-md hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                        title="Close filters"
                    >
                        <ChevronsLeft size={20} />
                    </button>
                </div>
                
                <div className="overflow-y-auto flex-grow">
                    <FilterSection 
                        title="Input Modalities" 
                        icon={<Type size={16} className="text-gray-500 dark:text-gray-400" />} 
                        defaultOpen={true}
                    >
                        <label className="flex items-center text-sm p-2 bg-surface-secondary rounded-md w-full mb-2 hover:bg-surface-tertiary transition-colors duration-200">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500" defaultChecked />
                            <span className="ml-2">Text</span>
                        </label>
                        <label className="flex items-center text-sm p-2 bg-surface-secondary rounded-md w-full mb-2 hover:bg-surface-tertiary transition-colors duration-200">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                            <span className="ml-2">Image</span>
                        </label>
                        <label className="flex items-center text-sm p-2 bg-surface-secondary rounded-md w-full mb-2 hover:bg-surface-tertiary transition-colors duration-200">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                            <span className="ml-2">File</span>
                        </label>
                    </FilterSection>

                    <FilterSection 
                        title="Context length" 
                        icon={<Clock size={16} className="text-gray-500 dark:text-gray-400" />} 
                        defaultOpen={true}
                    >
                        <RangeSlider 
                            min="4K" 
                            max="128K" 
                            value={contextLength} 
                            onChange={(e) => setContextLength(e.target.value)} 
                        />
                    </FilterSection>

                    <FilterSection 
                        title="Prompt pricing" 
                        icon={<DollarSign size={16} className="text-gray-500 dark:text-gray-400" />} 
                        defaultOpen={true}
                    >
                        <RangeSlider 
                            min="$0" 
                            max="$0.01" 
                            value={temperature} 
                            onChange={(e) => setTemperature(e.target.value)} 
                        />
                    </FilterSection>

                    <FilterSection 
                        title="Series" 
                        icon={<Star size={16} className="text-gray-500 dark:text-gray-400" />}
                    >
                        <label className="flex items-center text-sm">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gray-600 dark:text-gray-400 focus:ring-gray-500" />
                            <span className="ml-2">GPT</span>
                        </label>
                        <label className="flex items-center text-sm">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gray-600 dark:text-gray-400 focus:ring-gray-500" />
                            <span className="ml-2">Claude</span>
                        </label>
                        <label className="flex items-center text-sm">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gray-600 dark:text-gray-400 focus:ring-gray-500" />
                            <span className="ml-2">Gemini</span>
                        </label>
                        <div className="text-gray-600 dark:text-gray-400 text-sm mt-1 cursor-pointer hover:underline">More...</div>
                    </FilterSection>

                    <FilterSection 
                        title="Categories" 
                        icon={<Box size={16} className="text-gray-500 dark:text-gray-400" />}
                    >
                        <label className="flex items-center text-sm">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gray-600 dark:text-gray-400 focus:ring-gray-500" />
                            <span className="ml-2">Programming</span>
                        </label>
                        <label className="flex items-center text-sm">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gray-600 dark:text-gray-400 focus:ring-gray-500" />
                            <span className="ml-2">Research</span>
                        </label>
                        <label className="flex items-center text-sm">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gray-600 dark:text-gray-400 focus:ring-gray-500" />
                            <span className="ml-2">Marketing</span>
                        </label>
                        <div className="text-gray-600 dark:text-gray-400 text-sm mt-1 cursor-pointer hover:underline">More...</div>
                    </FilterSection>

                    <FilterSection 
                        title="Supported Parameters" 
                        icon={<Sliders size={16} className="text-gray-500 dark:text-gray-400" />}
                    >
                        <label className="flex items-center text-sm">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gray-600 dark:text-gray-400 focus:ring-gray-500" />
                            <span className="ml-2">temperature</span>
                        </label>
                        <label className="flex items-center text-sm">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gray-600 dark:text-gray-400 focus:ring-gray-500" />
                            <span className="ml-2">top_p</span>
                        </label>
                        <div className="text-gray-600 dark:text-gray-400 text-sm mt-1 cursor-pointer hover:underline">More...</div>
                    </FilterSection>

                    <FilterSection 
                        title="Providers" 
                        icon={<Server size={16} className="text-gray-500 dark:text-gray-400" />}
                    >
                        <label className="flex items-center text-sm">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gray-600 dark:text-gray-400 focus:ring-gray-500" />
                            <span className="ml-2">Anthropic</span>
                        </label>
                        <label className="flex items-center text-sm">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gray-600 dark:text-gray-400 focus:ring-gray-500" />
                            <span className="ml-2">OpenAI</span>
                        </label>
                        <label className="flex items-center text-sm">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gray-600 dark:text-gray-400 focus:ring-gray-500" />
                            <span className="ml-2">Google</span>
                        </label>
                        <div className="text-gray-600 dark:text-gray-400 text-sm mt-1 cursor-pointer hover:underline">More...</div>
                    </FilterSection>
                </div>

                {/* User profile at the bottom */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    {/* User profile moved to chat input area */}
                </div>
            </aside>
        </>
    );
};

export default FilterSidebar;