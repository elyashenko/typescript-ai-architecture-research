/**
 * Agents Layer: Code Review Agent
 * 
 * High-level agent that orchestrates code review tasks.
 * Uses tools from features layer.
 */

import { createAgent } from '@/entities/agent/factory';
import { githubTools } from '@/features/github/tools';
import { filesystemTools } from '@/features/filesystem/tools';
import { logger } from '@/shared/lib/logger';
import { codeReviewPrompt } from './prompts';
import type { CodeReviewConfig } from './types';

/**
 * Code Review Agent
 * 
 * Reviews pull requests and provides constructive feedback
 */
export const codeReviewAgent = createAgent({
  name: 'code-review',
  description: 'Reviews pull requests and provides feedback',
  instructions: codeReviewPrompt,
  tools: {
    ...githubTools,
    ...filesystemTools,
  },
  config: {
    maxSteps: 15,
    temperature: 0.7,
  } as CodeReviewConfig,
});

/**
 * Execute code review
 */
codeReviewAgent.execute = async (data: Record<string, unknown>) => {
  const { prUrl } = data;
  
  if (!prUrl || typeof prUrl !== 'string') {
    throw new Error('prUrl is required and must be a string');
  }
  
  logger.info('Starting code review', { prUrl });
  
  // Implementation will use tools to:
  // 1. Get PR details
  // 2. Read changed files
  // 3. Analyze code
  // 4. Create review comments
  
  return {
    prUrl,
    status: 'completed',
    feedback: 'Code review completed successfully',
  };
};
