// components/sidebar/ProjectList.js
import React from 'react';
import { Folder } from 'react-feather';

const projects = [
  { id: 1, name: 'Project A' },
  { id: 2, name: 'Project B' },
];

const ProjectList = () => {
  return (
    <nav className="space-y-1">
      {projects.map((project, index) => (
        <a
          key={project.id}
          href="#"
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
            index === 0
              ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Folder size={18} className="mr-3" />
          <span>{project.name}</span>
        </a>
      ))}
    </nav>
  );
};

export default ProjectList;
