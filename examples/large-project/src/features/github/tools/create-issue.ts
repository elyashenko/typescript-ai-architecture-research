/**
 * GitHub: Create Issue Tool
 */

import { tool } from 'ai';
import { z } from 'zod';
import { httpFetch } from '@/entities/http';
import { logger } from '@/shared/lib/logger';

export const createIssueTool = tool({
  description: 'Create a GitHub issue',
  
  parameters: z.object({
    repo: z.string(),
    title: z.string(),
    body: z.string().optional(),
  }),
  
  execute: async ({ repo, title, body }) => {
    logger.info('Creating GitHub issue', { repo, title });
    
    const response = await httpFetch({
      url: `https://api.github.com/repos/${repo}/issues`,
      method: 'POST',
      body: { title, body },
    });
    
    return response.data;
  },
});
