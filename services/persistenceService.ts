
import { ProjectState, ProjectMetadata, VirtualFile } from '../types';

const STORAGE_KEY = 'singularity_projects_v2';
const CURRENT_PROJECT_KEY = 'singularity_current_project';

export const saveProject = (project: ProjectState): void => {
  try {
    // 1. Save current active project state deeply
    const deepClone = JSON.stringify({
      ...project,
      lastModified: Date.now()
    });
    localStorage.setItem(CURRENT_PROJECT_KEY, deepClone);

    // 2. Update metadata list
    const metadata: ProjectMetadata = {
      id: project.id,
      name: project.name,
      type: project.type,
      lastModified: Date.now(),
      version: '1.1'
    };
    
    const existingListStr = localStorage.getItem(STORAGE_KEY);
    let list: ProjectMetadata[] = existingListStr ? JSON.parse(existingListStr) : [];
    
    // Remove old entry if exists and add new one to top
    list = list.filter(p => p.id !== project.id);
    list.unshift(metadata);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Auto-Save Failed (Quota Exceeded?)", e);
  }
};

export const loadRecentProjects = (): ProjectMetadata[] => {
  try {
    const str = localStorage.getItem(STORAGE_KEY);
    return str ? JSON.parse(str) : [];
  } catch (e) {
    return [];
  }
};

export const loadLastActiveProject = (): ProjectState | null => {
  try {
    const str = localStorage.getItem(CURRENT_PROJECT_KEY);
    return str ? JSON.parse(str) : null;
  } catch (e) {
    return null;
  }
};

export const clearAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CURRENT_PROJECT_KEY);
};
