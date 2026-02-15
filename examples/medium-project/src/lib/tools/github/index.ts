/**
 * GitHub Tools Namespace
 * 
 * All GitHub-related tools with namespace prefix
 */

export { createIssueTool } from './issues';
export { getPRTool, listPRsTool, mergePRTool } from './prs';
export { listReposTool, getRepoTool } from './repos';

// Export as namespace for better organization
export const githubTools = {
  'github:create_issue': async () => (await import('./issues')).createIssueTool,
  'github:get_pr': async () => (await import('./prs')).getPRTool,
  'github:list_prs': async () => (await import('./prs')).listPRsTool,
  'github:merge_pr': async () => (await import('./prs')).mergePRTool,
  'github:list_repos': async () => (await import('./repos')).listReposTool,
  'github:get_repo': async () => (await import('./repos')).getRepoTool,
} as const;

// Type helper
export type GitHubToolName = keyof typeof githubTools;
