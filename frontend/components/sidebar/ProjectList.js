// frontend/components/sidebar/ProjectList.js
import React, { useState } from 'react';
import { Folder, ChevronRight, ChevronDown, FileText } from 'react-feather';
import { FolderPlusIcon } from '@heroicons/react/24/outline';

// Initial projects data
const initialProjects = [
  { id: 'proj-1', name: 'Project A', children: [{ id: 'file-1', name: 'Initial brief.docx' }, { id: 'file-2', name: 'Design mockups' }] },
  { id: 'proj-2', name: 'Project B', children: [{ id: 'file-3', name: 'API documentation' }] },
];

const ProjectList = () => {
  const [isSectionOpen, setIsSectionOpen] = useState(true);
  const [openProjects, setOpenProjects] = useState({ 'proj-1': true });
  // Convert static projects to state variable
  const [projects, setProjects] = useState(initialProjects);

  const toggleProject = (projectId) => {
    setOpenProjects(prev => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  const handleAddProject = () => {
    // Create a new project with a unique ID
    const newProject = {
      id: `proj-${Date.now()}`,
      name: `New Project ${projects.length + 1}`,
      children: [] // Start with no files
    };
    
    // Add the new project at the beginning of the array
    setProjects([newProject, ...projects]);
    
    // Automatically expand the new project
    setOpenProjects(prev => ({ ...prev, [newProject.id]: true }));
    
    console.log("Added new project at the top:", newProject.name);
  };

  return (
    <div className="p-4 flex-shrink-0">
      <div className="flex items-center justify-between cursor-pointer">
        <div onClick={() => setIsSectionOpen(!isSectionOpen)} className="flex items-center flex-grow">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Project Folders
            </h2>
            {isSectionOpen ? <ChevronDown size={20} className="ml-2 text-gray-400" /> : <ChevronRight size={20} className="ml-2 text-gray-400" />}
        </div>
        <button onClick={handleAddProject} className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200" aria-label="Add new folder">
            <FolderPlusIcon className="h-6 w-6" />
        </button>
      </div>
      {isSectionOpen && (
        <div className="mt-2 space-y-1 overflow-y-auto max-h-48">
          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                <div
                  onClick={() => toggleProject(project.id)}
                  className="flex items-center p-2 text-base font-normal text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  {openProjects[project.id] ? <ChevronDown size={16} className="mr-1" /> : <ChevronRight size={16} className="mr-1" />}
                  <Folder size={20} className="text-gray-500" />
                  <span className="ml-3 flex-1 whitespace-nowrap">{project.name}</span>
                </div>
                {openProjects[project.id] && (
                  <ul className="pl-8 mt-1 space-y-1">
                    {project.children.map(child => (
                      <li key={child.id}>
                        <a href="#" className="flex items-center p-2 text-sm font-normal text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                          <FileText size={16} className="text-gray-400" />
                          <span className="ml-3">{child.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProjectList;