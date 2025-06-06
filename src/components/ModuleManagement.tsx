import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { PlusCircle, Trash2, X } from 'lucide-react';

interface ModuleManagementProps {
  project: Project;
  onUpdateModules: (projectId: string, updatedModules: string[]) => void;
  onClose: () => void; // Para cerrar la vista de gestión de módulos
}

export const ModuleManagement: React.FC<ModuleManagementProps> = ({ project, onUpdateModules, onClose }) => {
  const [modules, setModules] = useState<string[]>(project.modules || []);
  const [newModule, setNewModule] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setModules(project.modules || []);
  }, [project]);

  const handleAddModule = () => {
    if (!newModule.trim()) {
      setError('Module name cannot be empty.');
      return;
    }
    if (modules.includes(newModule.trim())) {
      setError('Module already exists.');
      return;
    }
    const updatedModules = [...modules, newModule.trim()];
    setModules(updatedModules);
    onUpdateModules(project.id, updatedModules);
    setNewModule('');
    setError('');
  };

  const handleDeleteModule = (moduleToDelete: string) => {
    const updatedModules = modules.filter(module => module !== moduleToDelete);
    setModules(updatedModules);
    onUpdateModules(project.id, updatedModules);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg mx-auto my-8 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Manage Modules for: <span className="text-blue-600 dark:text-blue-400">{project.name}</span>
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Close"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="mb-6">
        <label htmlFor="newModule" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          New Module Name
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            id="newModule"
            value={newModule}
            onChange={(e) => {
              setNewModule(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g., Frontend, API, Database"
            className="flex-grow mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-100"
          />
          <button
            onClick={handleAddModule}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out flex items-center"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add
          </button>
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Existing Modules:</h3>
        {modules.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No modules defined for this project yet.</p>
        ) : (
          <ul className="space-y-2">
            {modules.map((module, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md border border-gray-200 dark:border-gray-600"
              >
                <span className="text-sm text-gray-800 dark:text-gray-200">{module}</span>
                <button
                  onClick={() => handleDeleteModule(module)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  title="Delete module"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
