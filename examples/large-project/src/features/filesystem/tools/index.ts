/**
 * Features Layer: Filesystem Tools
 */

export const filesystemTools = {
  'files:read': () => import('./read').then(m => m.readFileTool),
  'files:write': () => import('./write').then(m => m.writeFileTool),
} as const;
