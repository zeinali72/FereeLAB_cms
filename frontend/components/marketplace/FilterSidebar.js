// frontend/components/marketplace/FilterSidebar.js
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Type, Image, File, Clock, DollarSign, Star, Box, Sliders, Server, ChevronsLeft } from 'react-feather';

// Reusable accordion component for filter sections
const FilterSection = ({ title, icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                    {icon}
                    <h3 className="font-medium text-sm">{title}</h3>
                </div>
                {isOpen ? <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" /> : <ChevronRight size={16} className="text-gray-500 dark:text-gray-400" />}
            </button>
            {isOpen && <div className="mt-2 px-4 space-y-2 animate-fade-in">{children}</div>}
        </div>
    );
};

// Range slider component
const RangeSlider = ({ min, max, value, onChange, displayUnit = '' }) => {
    const progress = ((value - min) / (max - min)) * 100;

    return (
        <div className="py-2">
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={onChange}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                    background: `linear-gradient(to right, var(--brand-primary-500) 0%, var(--brand-primary-500) ${progress}%, var(--gray-300) ${progress}%, var(--gray-300) 100%)`,
                }}
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>{min}{displayUnit}</span>
                <span>{max}{displayUnit}</span>
            </div>
        </div>
    );
};

const FilterSidebar = () => {
    const [contextLength, setContextLength] = useState(4000);
    const [price, setPrice] = useState(0.005);

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-800">
            {/* Header is now handled by MarketplacePanel */}
            
            <div className="overflow-y-auto flex-grow custom-scrollbar">
                <FilterSection 
                    title="Input Modalities" 
                    icon={<Type size={16} className="text-gray-500 dark:text-gray-400" />} 
                    defaultOpen={true}
                >
                    <label className="flex items-center text-sm p-2 rounded-lg w-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700" defaultChecked />
                        <span className="ml-2 text-gray-800 dark:text-gray-200">Text</span>
                    </label>
                    <label className="flex items-center text-sm p-2 rounded-lg w-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700" />
                        <span className="ml-2 text-gray-800 dark:text-gray-200">Image</span>
                    </label>
                    <label className="flex items-center text-sm p-2 rounded-lg w-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700" />
                        <span className="ml-2 text-gray-800 dark:text-gray-200">File</span>
                    </label>
                </FilterSection>

                <FilterSection 
                    title="Context length" 
                    icon={<Clock size={16} className="text-gray-500 dark:text-gray-400" />} 
                    defaultOpen={true}
                >
                    <RangeSlider 
                        min={4000} 
                        max={128000} 
                        value={contextLength} 
                        onChange={(e) => setContextLength(parseInt(e.target.value))} 
                        displayUnit="K"
                    />
                </FilterSection>

                <FilterSection 
                    title="Prompt pricing" 
                    icon={<DollarSign size={16} className="text-gray-500 dark:text-gray-400" />} 
                    defaultOpen={true}
                >
                    <RangeSlider 
                        min={0} 
                        max={0.01} 
                        value={price} 
                        onChange={(e) => setPrice(parseFloat(e.target.value))} 
                        displayUnit="$/1K"
                    />
                </FilterSection>

                <FilterSection 
                    title="Series" 
                    icon={<Star size={16} className="text-gray-500 dark:text-gray-400" />}
                >
                    <label className="flex items-center text-sm p-2 rounded-lg w-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700" />
                        <span className="ml-2 text-gray-800 dark:text-gray-200">GPT</span>
                    </label>
                    <label className="flex items-center text-sm p-2 rounded-lg w-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700" />
                        <span className="ml-2 text-gray-800 dark:text-gray-200">Claude</span>
                    </label>
                    <label className="flex items-center text-sm p-2 rounded-lg w-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700" />
                        <span className="ml-2 text-gray-800 dark:text-gray-200">Gemini</span>
                    </label>
                    <div className="text-gray-600 dark:text-gray-400 text-sm mt-2 cursor-pointer hover:underline">More...</div>
                </FilterSection>

                <FilterSection 
                    title="Categories" 
                    icon={<Box size={16} className="text-gray-500 dark:text-gray-400" />}
                >
                    <label className="flex items-center text-sm p-2 rounded-lg w-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700" />
                        <span className="ml-2 text-gray-800 dark:text-gray-200">Programming</span>
                    </label>
                    <label className="flex items-center text-sm p-2 rounded-lg w-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700" />
                        <span className="ml-2 text-gray-800 dark:text-gray-200">Research</span>
                    </label>
                    <label className="flex items-center text-sm p-2 rounded-lg w-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700" />
                        <span className="ml-2 text-gray-800 dark:text-gray-200">Marketing</span>
                    </label>
                    <div className="text-gray-600 dark:text-gray-400 text-sm mt-2 cursor-pointer hover:underline">More...</div>
                </FilterSection>

                <FilterSection 
                    title="Supported Parameters" 
                    icon={<Sliders size={16} className="text-gray-500 dark:text-gray-400" />}
                >
                    <label className="flex items-center text-sm p-2 rounded-lg w-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700" />
                        <span className="ml-2 text-gray-800 dark:text-gray-200">temperature</span>
                    </label>
                    <label className="flex items-center text-sm p-2 rounded-lg w-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700" />
                        <span className="ml-2 text-gray-800 dark:text-gray-200">top_p</span>
                    </label>
                    <div className="text-gray-600 dark:text-gray-400 text-sm mt-2 cursor-pointer hover:underline">More...</div>
                </FilterSection>

                <FilterSection 
                    title="Providers" 
                    icon={<Server size={16} className="text-gray-500 dark:text-gray-400" />}
                >
                    <label className="flex items-center text-sm p-2 rounded-lg w-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700" />
                        <span className="ml-2 text-gray-800 dark:text-gray-200">Anthropic</span>
                    </label>
                    <label className="flex items-center text-sm p-2 rounded-lg w-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700" />
                        <span className="ml-2 text-gray-800 dark:text-gray-200">OpenAI</span>
                    </label>
                    <label className="flex items-center text-sm p-2 rounded-lg w-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700" />
                        <span className="ml-2 text-gray-800 dark:text-gray-200">Google</span>
                    </label>
                    <div className="text-gray-600 dark:text-gray-400 text-sm mt-2 cursor-pointer hover:underline">More...</div>
                </FilterSection>
            </div>
        </div>
    );
};

export default FilterSidebar;
