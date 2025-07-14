// frontend/components/sidebar/ProjectList.js
import React, { useState } from 'react';
import { Folder, ChevronRight, ChevronDown } from 'react-feather';

// Sample data for demonstration
const projects = [
  { id: 'proj-1', name: 'Project A' },
  { id: 'proj-2', name: 'Project B' },
];

const ProjectList = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="p-4">
      <h2
        className="flex items-center justify-between text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Project Folders</span>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </h2>
      {isOpen && (
        <ul className="mt-2 space-y-1">
          {projects.map((project) => (
            <li key={project.id}>
              <a
                href="#"
                className="flex items-center p-2 text-base font-normal text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Folder size={20} className="text-gray-500" />
                <span className="ml-3">{project.name}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectList;