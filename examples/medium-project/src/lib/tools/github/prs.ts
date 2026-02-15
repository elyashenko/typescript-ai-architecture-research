import { tool } from 'ai';
import { z } from 'zod';

/**
 * Get Pull Request
 */
export const getPRTool = tool({
  description: 'Fetch detailed information about a pull request',
  
  parameters: z.object({
    repo: z.string().describe('Repository in "owner/repo" format'),
    prNumber: z.number().describe('Pull request number'),
  }),
  
  execute: async ({ repo, prNumber }) => {
    return {
      number: prNumber,
      title: 'Example PR',
      author: 'developer',
      state: 'open',
      changedFiles: ['src/index.ts', 'src/utils.ts'],
      additions: 45,
      deletions: 12,
      url: `https://github.com/${repo}/pull/${prNumber}`,
    };
  },
});

/**
 * List Pull Requests
 */
export const listPRsTool = tool({
  description: 'List pull requests in a repository',
  
  parameters: z.object({
    repo: z.string(),
    state: z.enum(['open', 'closed', 'all']).default('open'),
    limit: z.number().min(1).max(100).default(30),
  }),
  
  execute: async ({ repo, state, limit }) => {
    return {
      pullRequests: [
        { number: 123, title: 'Add new feature', state: 'open' },
        { number: 122, title: 'Fix bug', state: 'open' },
      ],
      total: 2,
    };
  },
});

/**
 * Merge Pull Request
 */
export const mergePRTool = tool({
  description: 'Merge a pull request',
  
  parameters: z.object({
    repo: z.string(),
    prNumber: z.number(),
    mergeMethod: z.enum(['merge', 'squash', 'rebase']).default('merge'),
  }),
  
  execute: async ({ repo, prNumber, mergeMethod }) => {
    return {
      merged: true,
      sha: 'abc123',
      message: `Merged PR #${prNumber} using ${mergeMethod}`,
    };
  },
});
