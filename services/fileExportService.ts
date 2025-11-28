
import { ProjectState } from '../types';

export const downloadProjectAsJSON = (project: ProjectState) => {
  // Since we can't easily create a real binary ZIP without heavy libs, 
  // we export a full JSON representation that acts as a "singularity package".
  const data = JSON.stringify(project, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.name.replace(/\s+/g, '_')}_Source.omega`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const downloadSimulatedAPK = (projectName: string) => {
  // Create a dummy binary blob to simulate an APK file
  const mockContent = `PK\x03\x04\x14\x00\x08\x00\x08\x00${new Date().toISOString()}_SINGULARITY_SIGNED_APK_DATA_MOCK`;
  const blob = new Blob([mockContent], { type: 'application/vnd.android.package-archive' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${projectName.replace(/\s+/g, '_')}-release-unsigned.apk`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
