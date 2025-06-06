import React, { useState } from 'react';
import { ChevronDown, Plus, Settings, FolderOpen } from 'lucide-react';
import { Project, User } from '../types';

interface ProjectSelectorProps {
  projects: Project[];
  currentProject: Project | undefined;
  currentUser: User;
  onProjectChange: (projectId: string) => void;
  onCreateProject: () => void;
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  projects,
  currentProject,
  currentUser,
  onProjectChange,
  onCreateProject,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <FolderOpen className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {currentProject?.name || 'Select Project'}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 py-1">
              Projects
            </div>
            {projects.map(project => (
              <button
                key={project.id}
                onClick={() => {
                  onProjectChange(project.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2 py-2 rounded-md text-sm transition-colors ${
                  currentProject?.id === project.id
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="font-medium">{project.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {project.description}
                </div>
              </button>
            ))}
            
            {currentUser.role === 'admin' && (
              <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                <button
                  onClick={() => {
                    onCreateProject();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-2 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Project</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};