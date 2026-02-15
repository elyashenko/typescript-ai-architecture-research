/**
 * Agents Layer: Deployment Agent
 * 
 * Handles deployment tasks
 */

import { createAgent } from '@/entities/agent/factory';
import { githubTools } from '@/features/github/tools';
import { databaseTools } from '@/features/database/tools';

export const deploymentAgent = createAgent({
  name: 'deployment',
  description: 'Handles deployment and infrastructure tasks',
  instructions: 'You are a deployment specialist...',
  tools: {
    ...githubTools,
    ...databaseTools,
  },
});

deploymentAgent.execute = async (data: Record<string, unknown>) => {
  return {
    status: 'deployed',
    environment: data.environment || 'production',
  };
};
