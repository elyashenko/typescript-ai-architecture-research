/**
 * Features Layer: GitHub Tools
 * 
 * Domain-specific tools for GitHub operations
 */

export const githubTools = {
  'github:create_issue': () => import('./create-issue').then(m => m.createIssueTool),
  'github:get_pr': () => import('./get-pr').then(m => m.getPRTool),
  'github:list_repos': () => import('./list-repos').then(m => m.listReposTool),
} as const;

export type GitHubToolName = keyof typeof githubTools;
