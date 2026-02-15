import { tool } from 'ai';
import { z } from 'zod';

/**
 * Create GitHub Issue
 * 
 * Creates a new issue in the specified repository.
 * 
 * Use this when:
 * - User wants to report a bug
 * - User wants to request a feature
 * - User wants to track a task
 * 
 * @example
 * ```ts
 * await createIssueTool.execute({
 *   repo: 'facebook/react',
 *   title: 'Bug: useState not updating',
 *   body: 'Detailed description...',
 *   labels: ['bug', 'needs-triage'],
 * });
 * ```
 */
export const createIssueTool = tool({
  description: `Create a new GitHub issue in a repository.
  
  Use this to report bugs, request features, or track tasks.
  
  Example: "Create an issue in facebook/react about useState bug"`,
  
  parameters: z.object({
    repo: z.string().describe('Repository in "owner/repo" format, e.g., "facebook/react"'),
    title: z.string().min(1).max(200).describe('Clear, concise issue title'),
    body: z.string().optional().describe('Detailed description with context, steps, etc.'),
    labels: z.array(z.string()).optional().describe('Labels like ["bug", "enhancement"]'),
    assignees: z.array(z.string()).optional().describe('GitHub usernames to assign'),
  }),
  
  execute: async ({ repo, title, body, labels, assignees }) => {
    // Mock implementation - replace with actual GitHub API call
    console.log(`Creating issue in ${repo}: ${title}`);
    
    return {
      issueNumber: 12345,
      url: `https://github.com/${repo}/issues/12345`,
      title,
      state: 'open',
      createdAt: new Date().toISOString(),
    };
  },
});
