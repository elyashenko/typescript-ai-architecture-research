/**
 * App Layer: Orchestration
 * 
 * Main orchestrator that routes tasks to appropriate agents.
 * This is the entry point of the application.
 */

import { codeReviewAgent } from '@/agents/code-review';
import { deploymentAgent } from '@/agents/deployment';
import { logger } from '@/shared/lib/logger';
import { AppError } from '@/shared/lib/errors';

export type TaskType = 'code-review' | 'deployment' | 'testing';

export interface Task {
  type: TaskType;
  data: Record<string, unknown>;
  userId?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface TaskResult {
  success: boolean;
  data?: unknown;
  error?: string;
  duration: number;
}

/**
 * Main orchestrator
 * Routes tasks to appropriate agents
 */
export async function orchestrateTask(task: Task): Promise<TaskResult> {
  const startTime = Date.now();
  
  logger.info('Orchestrating task', { type: task.type, userId: task.userId });
  
  try {
    let result: unknown;
    
    switch (task.type) {
      case 'code-review':
        result = await codeReviewAgent.execute(task.data);
        break;
        
      case 'deployment':
        result = await deploymentAgent.execute(task.data);
        break;
        
      default:
        throw new AppError(
          `Unknown task type: ${task.type}`,
          'UNKNOWN_TASK_TYPE',
          400
        );
    }
    
    const duration = Date.now() - startTime;
    
    logger.info('Task completed successfully', {
      type: task.type,
      duration,
    });
    
    return {
      success: true,
      data: result,
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    
    logger.error('Task failed', error as Error, {
      type: task.type,
      duration,
    });
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration,
    };
  }
}
