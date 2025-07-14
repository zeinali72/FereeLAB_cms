// frontend/components/marketplace/FilterSidebar.js
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Type, Image, File, Clock, DollarSign, Star, Box, Sliders, Server } from 'react-feather';
import UserProfile from '../sidebar/UserProfile';

// Reusable accordion component for filter sections
const FilterSection = ({ title, icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="py-3 border-b border-gray-200 dark:border-gray-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-left px-4 py-2"
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

const FilterSidebar = ({ theme, setTheme }) => {
    const [contextLength, setContextLength] = useState(50);
    const [temperature, setTemperature] = useState(0.7);

    return (
        <aside className="w-72 h-full border-r border-gray-200 dark:border-gray-700 flex-shrink-0 flex flex-col">
            <div className="overflow-y-auto flex-grow">
                <FilterSection 
                    title="Input Modalities" 
                    icon={<Type size={16} className="text-gray-500 dark:text-gray-400" />} 
                    defaultOpen={true}
                >
                    <label className="flex items-center text-sm">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gray-600 dark:text-gray-400 focus:ring-gray-500" defaultChecked />
                        <span className="ml-2">Text</span>
                    </label>
                    <label className="flex items-center text-sm">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gray-600 dark:text-gray-400 focus:ring-gray-500" />
                        <span className="ml-2">Image</span>
                    </label>
                    <label className="flex items-center text-sm">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gray-600 dark:text-gray-400 focus:ring-gray-500" />
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

            {/* User profile at the bottom of sidebar */}
            <UserProfile theme={theme} setTheme={setTheme} />
        </aside>
    );
};

export default FilterSidebar;