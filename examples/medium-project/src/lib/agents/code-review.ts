import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { githubTools } from '../tools/github';
import { filesystemTools } from '../tools/filesystem';

/**
 * Code Review Agent
 * 
 * Reviews pull requests and provides constructive feedback.
 * Can read files, analyze code, and create review comments.
 */
export async function codeReviewAgent(prUrl: string) {
  // Extract repo and PR number from URL
  const match = prUrl.match(/github\.com\/([^/]+\/[^/]+)\/pull\/(\d+)/);
  if (!match) {
    throw new Error('Invalid PR URL format');
  }
  
  const [, repo, prNumberStr] = match;
  const prNumber = parseInt(prNumberStr, 10);
  
  const result = await generateText({
    model: openai('gpt-4'),
    prompt: `Review pull request #${prNumber} in ${repo}. Provide constructive feedback on code quality, best practices, and potential improvements.`,
    
    tools: {
      // Lazy load tools
      'github:get_pr': (await githubTools['github:get_pr']()),
      'github:create_issue': (await import('../tools/github/issues')).createIssueTool,
      'files:read': (await filesystemTools['files:read']()),
      'files:search': (await filesystemTools['files:search']()),
    },
    
    maxSteps: 10,
    temperature: 0.7,
  });
  
  return {
    repo,
    prNumber,
    review: result.text,
    toolCalls: result.steps.flatMap(step => 
      step.toolCalls?.map(tc => tc.toolName) || []
    ),
    stepsCount: result.steps.length,
  };
}

/**
 * Agent Configuration
 */
export const codeReviewAgentConfig = {
  name: 'code-review',
  description: 'Reviews pull requests and provides feedback',
  maxSteps: 10,
  temperature: 0.7,
  requiredTools: [
    'github:get_pr',
    'files:read',
    'files:search',
  ],
};
