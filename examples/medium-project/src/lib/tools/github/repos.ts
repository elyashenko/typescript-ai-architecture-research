import { tool } from 'ai';
import { z } from 'zod';

/**
 * List Repositories
 */
export const listReposTool = tool({
  description: 'List repositories for an organization or user',
  
  parameters: z.object({
    owner: z.string().describe('Organization or user name'),
    type: z.enum(['all', 'public', 'private']).default('all'),
    sort: z.enum(['created', 'updated', 'pushed', 'full_name']).default('updated'),
  }),
  
  execute: async ({ owner, type, sort }) => {
    return {
      repositories: [
        {
          name: 'repo1',
          fullName: `${owner}/repo1`,
          private: false,
          stars: 1234,
          language: 'TypeScript',
        },
        {
          name: 'repo2',
          fullName: `${owner}/repo2`,
          private: false,
          stars: 567,
          language: 'JavaScript',
        },
      ],
      total: 2,
    };
  },
});

/**
 * Get Repository
 */
export const getRepoTool = tool({
  description: 'Get detailed information about a repository',
  
  parameters: z.object({
    repo: z.string().describe('Repository in "owner/repo" format'),
  }),
  
  execute: async ({ repo }) => {
    return {
      name: repo.split('/')[1],
      fullName: repo,
      description: 'Example repository',
      private: false,
      stars: 1234,
      forks: 567,
      language: 'TypeScript',
      topics: ['typescript', 'ai', 'agents'],
      url: `https://github.com/${repo}`,
    };
  },
});
