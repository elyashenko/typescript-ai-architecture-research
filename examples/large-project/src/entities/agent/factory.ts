/**
 * Entities Layer: Agent Factory
 * 
 * Creates agents with standard configuration
 */

export interface AgentConfig {
  name: string;
  description: string;
  instructions: string;
  tools: Record<string, unknown>;
  config?: Record<string, unknown>;
}

export interface Agent {
  name: string;
  description: string;
  execute: (data: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Create agent instance
 */
export function createAgent(config: AgentConfig): Agent {
  return {
    name: config.name,
    description: config.description,
    execute: async (data: Record<string, unknown>) => {
      // Default implementation
      return { status: 'success', data };
    },
  };
}
