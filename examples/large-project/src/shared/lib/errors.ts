/**
 * Shared: Error Classes
 * 
 * Structured error handling
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ToolError extends AppError {
  constructor(
    message: string,
    public toolName: string,
    retryable: boolean = false
  ) {
    super(message, 'TOOL_ERROR', 500, retryable);
    this.name = 'ToolError';
  }
}

export class RateLimitError extends AppError {
  constructor(
    public toolName: string,
    public retryAfterMs: number
  ) {
    super(
      `Rate limit exceeded for ${toolName}. Retry after ${retryAfterMs}ms`,
      'RATE_LIMIT',
      429,
      true
    );
    this.name = 'RateLimitError';
  }
}
