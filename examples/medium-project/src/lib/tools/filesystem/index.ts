/**
 * Filesystem Tools Namespace
 */

export { readFileTool } from './read';
export { writeFileTool } from './write';
export { searchFilesTool } from './search';

export const filesystemTools = {
  'files:read': async () => (await import('./read')).readFileTool,
  'files:write': async () => (await import('./write')).writeFileTool,
  'files:search': async () => (await import('./search')).searchFilesTool,
} as const;

export type FilesystemToolName = keyof typeof filesystemTools;
