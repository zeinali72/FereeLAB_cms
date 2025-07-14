// frontend/components/marketplace/FilterSidebar.js
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'react-feather';

// Reusable accordion component for filter sections
const FilterSection = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="py-3 border-b border-gray-200 dark:border-gray-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-left"
            >
                <h3 className="font-semibold text-sm uppercase tracking-wider">{title}</h3>
                {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
            {isOpen && <div className="mt-4 space-y-2">{children}</div>}
        </div>
    );
};

const FilterSidebar = () => {
    return (
        <aside className="w-72 h-full p-4 border-r border-gray-200 dark:border-gray-700 overflow-y-auto flex-shrink-0">
            <FilterSection title="Categories" defaultOpen={true}>
                <label className="flex items-center text-sm">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2">Programming</span>
                </label>
                <label className="flex items-center text-sm">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2">Marketing</span>
                </label>
                 <label className="flex items-center text-sm">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2">Writing</span>
                </label>
            </FilterSection>

            <FilterSection title="Providers" defaultOpen={true}>
                 <label className="flex items-center text-sm">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2">OpenAI</span>
                </label>
                <label className="flex items-center text-sm">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2">Google</span>
                </label>
                <label className="flex items-center text-sm">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2">Anthropic</span>
                </label>
                 <label className="flex items-center text-sm">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2">Mistral</span>
                </label>
            </FilterSection>

            <FilterSection title="Context Length">
                {/* Context length filters can be added here */}
                <p className="text-sm text-gray-500">Range slider or options go here.</p>
            </FilterSection>

             <FilterSection title="Supported Parameters">
                {/* Parameters filters can be added here */}
                 <p className="text-sm text-gray-500">Tool use, JSON mode, etc.</p>
            </FilterSection>
        </aside>
    );
};

export default FilterSidebar;