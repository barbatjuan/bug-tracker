import { useState, useEffect } from 'react';
import { Project } from '../types';
import { getProjects, saveProjects, generateId, getCurrentProject, setCurrentProject } from '../utils/storage';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string>('');

  useEffect(() => {
    const loadedProjects = getProjects();
    const currentId = getCurrentProject();
    setProjects(loadedProjects);
    setCurrentProjectId(currentId);
  }, []);

  const addProject = (project: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...project,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const updatedProjects = projects.map(project =>
      project.id === id ? { ...project, ...updates } : project
    );
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
  };

  const deleteProject = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    
    if (currentProjectId === id && updatedProjects.length > 0) {
      switchProject(updatedProjects[0].id);
    }
  };

  const switchProject = (projectId: string) => {
    setCurrentProjectId(projectId);
    setCurrentProject(projectId);
  };

  const updateProjectModules = (projectId: string, newModules: string[]) => {
    const updatedProjects = projects.map(p => 
      p.id === projectId ? { ...p, modules: newModules } : p
    );
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    // currentProject will update automatically as it's derived from projects state
  };

  const getCurrentProjectData = () => {
    return projects.find(p => p.id === currentProjectId) || projects[0];
  };

  return {
    projects,
    currentProjectId,
    currentProject: getCurrentProjectData(),
    addProject,
    updateProject,
    deleteProject,
    switchProject,
    updateProjectModules,
  };
};