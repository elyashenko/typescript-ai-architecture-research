/**
 * Code Review Agent Types
 */

export interface CodeReviewConfig {
  maxSteps: number;
  temperature: number;
  autoApprove?: boolean;
  requireTests?: boolean;
  maxFilesPerReview?: number;
}

export interface CodeReviewResult {
  prUrl: string;
  status: 'completed' | 'failed' | 'pending';
  feedback: string;
  suggestions?: CodeSuggestion[];
  issues?: CodeIssue[];
}

export interface CodeSuggestion {
  file: string;
  line: number;
  suggestion: string;
  severity: 'info' | 'warning' | 'error';
}

export interface CodeIssue {
  file: string;
  line: number;
  issue: string;
  category: 'bug' | 'performance' | 'security' | 'style';
}
