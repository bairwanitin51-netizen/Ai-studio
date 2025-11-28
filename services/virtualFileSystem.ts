
import { VirtualFile, FileType } from '../types';

export const createFile = (files: VirtualFile[], parentId: string, name: string, content: string = ''): VirtualFile[] => {
  const newFile: VirtualFile = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    type: 'file',
    parentId,
    content,
    language: getLanguageFromExt(name)
  };
  return [...files, newFile];
};

export const createFolder = (files: VirtualFile[], parentId: string, name: string): VirtualFile[] => {
  const newFolder: VirtualFile = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    type: 'folder',
    parentId
  };
  return [...files, newFolder];
};

export const getLanguageFromExt = (filename: string): string => {
  if (filename.endsWith('.kt')) return 'kotlin';
  if (filename.endsWith('.tsx') || filename.endsWith('.ts')) return 'typescript';
  if (filename.endsWith('.js')) return 'javascript';
  if (filename.endsWith('.json')) return 'json';
  if (filename.endsWith('.md')) return 'markdown';
  if (filename.endsWith('.html')) return 'html';
  if (filename.endsWith('.css')) return 'css';
  return 'plaintext';
};

export const updateFileContent = (files: VirtualFile[], fileId: string, content: string): VirtualFile[] => {
  return files.map(f => f.id === fileId ? { ...f, content } : f);
};
