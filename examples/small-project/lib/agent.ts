import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import * as tools from './tools';

/**
 * Code Review Agent
 * 
 * Reviews pull requests and provides feedback
 */
export async function codeReviewAgent(prUrl: string) {
  const result = await generateText({
    model: openai('gpt-4'),
    prompt: `Review this pull request and provide constructive feedback: ${prUrl}`,
    tools: {
      get_pr: tools.getPRTool,
      read_file: tools.readFileTool,
      create_comment: tools.createCommentTool,
    },
    maxSteps: 5,
  });
  
  return {
    text: result.text,
    toolCalls: result.steps.flatMap(step => 
      step.toolCalls?.map(tc => tc.toolName) || []
    ),
  };
}

/**
 * Simple usage example
 */
export async function main() {
  const result = await codeReviewAgent('https://github.com/owner/repo/pull/123');
  console.log('Review completed:', result);
}
