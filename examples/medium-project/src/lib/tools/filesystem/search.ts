import { tool } from 'ai';
import { z } from 'zod';

/**
 * Search Files
 */
export const searchFilesTool = tool({
  description: 'Search for files matching a pattern',
  
  parameters: z.object({
    pattern: z.string().describe('Search pattern or regex'),
    directory: z.string().optional().describe('Directory to search in'),
    fileType: z.string().optional().describe('File extension filter, e.g., "ts"'),
  }),
  
  execute: async ({ pattern, directory = '.', fileType }) => {
    // Mock implementation
    return {
      results: [
        { path: 'src/index.ts', matches: 2, lines: [10, 25] },
        { path: 'src/utils.ts', matches: 1, lines: [5] },
      ],
      totalMatches: 3,
      totalFiles: 2,
    };
  },
});
