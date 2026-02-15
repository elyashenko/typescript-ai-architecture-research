# Реальные примеры проектов

Разбор архитектуры production-ready TypeScript AI проектов из open-source.

## 1. Mastra Framework ⭐ 21k+

**Репозиторий:** https://github.com/mastra-ai/mastra

### Обзор

Полноценный TypeScript framework для AI-приложений от команды Gatsby. Production-ready с observability, eval и deployment.

### Архитектура монорепо

```typescript
mastra/
├── packages/              // ⭐ Core packages
│   ├── core/             // @mastra/core
│   ├── agents/           // Agent engine
│   ├── workflows/        // Workflow orchestration
│   ├── rag/              // RAG implementation
│   ├── mcp/              // MCP protocol
│   └── memory/           // Memory systems
├── integrations/          // ⭐ MCP integrations
│   └── opencode/
├── examples/              // Example projects
│   ├── personal-assistant/
│   └── ...
├── templates/             // Starter templates
├── stores/                // Storage implementations
│   ├── postgres/
│   └── redis/
├── observability/         // Tracing & monitoring
├── deployers/             // Deployment adapters
│   ├── vercel/
│   └── aws/
└── workflows/             // Workflow engine internals
```

### Пользовательский проект на Mastra

```typescript
my-mastra-app/
├── src/
│   └── mastra/
│       ├── agents/        // Agent definitions
│       │   └── index.ts
│       ├── tools/         // Custom tools
│       │   └── index.ts
│       ├── workflows/     // Multi-step workflows
│       │   └── index.ts
│       ├── mcp/           // MCP servers (optional)
│       ├── scorers/       // Evaluation
│       └── index.ts       // Mastra instance
├── app/                   // Next.js app (optional)
└── .env.development
```

### Ключевые решения

**1. Monorepo с Turborepo + pnpm**
- Все пакеты в одном репо
- Shared dependencies
- Fast builds с кэшированием

**2. Слои архитектуры**
```
app (user code)
    ↓
packages (core framework)
    ↓
integrations (external services)
    ↓
stores/deployers (infrastructure)
```

**3. Observability встроен**
- Tracing из коробки
- Scorers для evaluation
- Мониторинг агентов

**4. Deployment adapters**
- Vercel, AWS, GCP
- One-command deploy

### Что взять для своего проекта

✅ Структуру `src/mastra/{agents,tools,workflows}`  
✅ Observability patterns  
✅ Monorepo для нескольких проектов  
✅ MCP integration patterns

**Документация:** https://mastra.ai/docs

---

## 2. Personal Assistant Example (Mastra)

**Репозиторий:** https://github.com/mastra-ai/personal-assistant-example

### Обзор

Реальный пример personal assistant с MCP серверами, Telegram bot и workflows.

### Структура

```typescript
personal-assistant/
├── src/
│   └── mastra/
│       ├── agents/
│       │   └── index.ts              // personalAssistantAgent
│       ├── tools/
│       │   └── index.ts              // weatherTool, dailyWorkflowTool
│       ├── workflows/
│       │   └── index.ts              // daily briefing workflow
│       ├── integrations/
│       │   └── telegram.ts           // Telegram bot
│       └── index.ts                  // Mastra config
├── notes/                            // Persistent storage
└── package.json
```

### Agent Definition

```typescript
// src/mastra/agents/index.ts
import { Agent } from '@mastra/core';
import { openai } from '@ai-sdk/openai';
import { weatherTool } from '../tools';

export const personalAssistantAgent = new Agent({
  name: 'personal-assistant',
  instructions: `You are a helpful personal assistant...`,
  model: openai('gpt-4o'),
  tools: [weatherTool],
});
```

### MCP Servers Integration

```typescript
// src/mastra/index.ts
import { Mastra } from '@mastra/core';
import { MCPClient } from '@mastra/mcp';

export const mastra = new Mastra({
  agents: { personalAssistant: personalAssistantAgent },
  mcpServers: {
    zapier: new MCPClient({ url: process.env.ZAPIER_MCP_URL }),
    github: new MCPClient({ url: process.env.GITHUB_MCP_URL }),
  },
});
```

### Workflow Example

```typescript
// src/mastra/workflows/index.ts
import { Workflow } from '@mastra/workflows';

export const dailyBriefingWorkflow = new Workflow({
  name: 'daily-briefing',
  
  steps: [
    {
      id: 'fetch-news',
      execute: async () => {
        return await fetchHackerNews();
      },
    },
    {
      id: 'fetch-github',
      execute: async () => {
        return await fetchGithubActivity();
      },
    },
    {
      id: 'summarize',
      execute: async ({ fetchNews, fetchGithub }) => {
        return await summarizeData([fetchNews, fetchGithub]);
      },
    },
  ],
});
```

### Что взять для своего проекта

✅ MCP clients usage  
✅ Telegram bot integration  
✅ Workflow patterns  
✅ Notes/storage organization

---

## 3. Email Assistant with HITL (LangChain)

**Репозиторий:** https://github.com/langchain-ai/agents-from-scratch-ts

### Обзор

Email assistant с Human-in-the-Loop и Memory. Прогрессивная архитектура: basic → HITL → memory.

### Структура

```typescript
agents-from-scratch-ts/
├── src/
│   ├── email_assistant.ts              // Basic version
│   ├── email_assistant_hitl.ts         // + Human-in-the-Loop
│   ├── email_assistant_hitl_memory.ts  // + Persistent memory
│   ├── tools/
│   │   └── base.ts                     // Tool definitions
│   ├── prompts.ts                      // Prompt templates
│   ├── schemas.ts                      // Zod schemas for state
│   └── utils.ts                        // Email parsing, formatting
├── notebooks/                          // Jupyter notebooks
│   ├── langgraph_101.ipynb
│   ├── agent.ipynb
│   ├── hitl.ipynb
│   └── memory.ipynb
├── tests/
└── langgraph.json                      // LangGraph config
```

### State Management

```typescript
// src/schemas.ts
import { z } from 'zod';
import type { BaseMessage } from '@langchain/core/messages';

export const BaseEmailAgentState = z.object({
  messages: z.array(z.custom<BaseMessage>()),
  emailInput: z.object({
    id: z.string(),
    from_email: z.string(),
    to_email: z.string(),
    subject: z.string(),
    page_content: z.string(),
    send_time: z.string(),
  }),
  classificationDecision: z.enum(['respond', 'notify', 'ignore']).optional(),
});

export type EmailAgentState = z.infer<typeof BaseEmailAgentState>;
```

### Graph Construction

```typescript
// src/email_assistant.ts
import { StateGraph, START, END } from '@langchain/langgraph';
import { EmailAgentState } from './schemas';

const graph = new StateGraph(EmailAgentState)
  .addNode('triage_router', triageRouterNode)
  .addNode('response_agent', responseAgentSubgraph)
  .addEdge(START, 'triage_router')
  .addConditionalEdges('triage_router', routeBasedOnClassification)
  .addEdge('response_agent', END);

export const emailAssistant = graph.compile();
```

### HITL Pattern

```typescript
// src/email_assistant_hitl.ts
import { interrupt } from '@langchain/langgraph';

function interruptHandlerNode(state: EmailAgentHITLState) {
  // Останавливаем выполнение для человеческого review
  const userResponse = interrupt({
    toolCall: state.lastToolCall,
    message: 'Review this action before execution',
  });
  
  // Обрабатываем ответ пользователя
  if (userResponse.type === 'accept') {
    return executeTool(state.lastToolCall);
  } else if (userResponse.type === 'edit') {
    return executeTool({ ...state.lastToolCall, args: userResponse.args });
  } else {
    return { skipped: true };
  }
}
```

### Memory Pattern

```typescript
// src/email_assistant_hitl_memory.ts
import { InMemoryStore } from '@langchain/langgraph';

const store = new InMemoryStore();

async function getMemory(namespace: string[]) {
  const memories = await store.get(namespace);
  return memories || getDefaultPreferences(namespace);
}

async function updateMemory(namespace: string[], feedback: string) {
  const current = await getMemory(namespace);
  const updated = await llm.call([
    { role: 'system', content: 'Update preferences based on feedback...' },
    { role: 'user', content: feedback },
    { role: 'assistant', content: JSON.stringify(current) },
  ]);
  
  await store.put(namespace, JSON.parse(updated));
}
```

### Что взять для своего проекта

✅ HITL patterns с `interrupt()`  
✅ Memory с namespace organization  
✅ Прогрессивная архитектура (basic → advanced)  
✅ Zod schemas для state management

---

## 4. OpenAI Agents SDK

**Репозиторий:** https://github.com/openai/openai-agents-js

### Обзор

Official SDK от OpenAI для multi-agent orchestration с handoffs и guardrails.

### Ключевые паттерны

**1. Agent Handoffs**

```typescript
import { Agent } from '@openai/agents';

const salesAgent = new Agent({
  name: 'sales',
  instructions: 'Handle sales inquiries...',
  tools: [pricingTool, quoteTool],
});

const supportAgent = new Agent({
  name: 'support',
  instructions: 'Handle support requests...',
  tools: [ticketTool, knowledgeBaseTool],
  handoffs: [salesAgent],  // ⭐ Can delegate to sales
});

const routerAgent = new Agent({
  name: 'router',
  instructions: 'Route user to appropriate agent...',
  handoffs: [salesAgent, supportAgent],  // ⭐ Delegates to specialists
});
```

**2. Guardrails**

```typescript
import { Guardrail } from '@openai/agents';

const inputGuardrail = new Guardrail({
  name: 'input-validation',
  check: async (input: string) => {
    // Проверка на PII, offensive content
    if (containsPII(input)) {
      return { allowed: false, reason: 'PII detected' };
    }
    return { allowed: true };
  },
});

const agent = new Agent({
  name: 'customer-service',
  guardrails: {
    input: [inputGuardrail],
    output: [outputGuardrail],
  },
});
```

**3. Streaming**

```typescript
const stream = await agent.run({
  messages: [{ role: 'user', content: 'Hello!' }],
  stream: true,
});

for await (const chunk of stream) {
  if (chunk.type === 'text') {
    process.stdout.write(chunk.content);
  } else if (chunk.type === 'tool_call') {
    console.log(`Calling tool: ${chunk.tool.name}`);
  }
}
```

### Что взять для своего проекта

✅ Multi-agent handoff patterns  
✅ Guardrails для безопасности  
✅ Streaming responses  
✅ Agent-to-agent delegation

**Документация:** https://openai.github.io/openai-agents-js/

---

## 5. MCP TypeScript SDK (Official)

**Репозиторий:** https://github.com/modelcontextprotocol/typescript-sdk

### Обзор

Official TypeScript SDK для Model Context Protocol.

### Структура

```typescript
typescript-sdk/
├── packages/
│   ├── server/            // MCP server SDK
│   │   ├── src/
│   │   │   ├── server/
│   │   │   ├── tools/
│   │   │   ├── resources/
│   │   │   └── prompts/
│   │   └── examples/
│   ├── client/            // MCP client SDK
│   └── middleware/        // Express, Hono adapters
└── examples/
    └── remote-server/     // Full feature demo
```

### Server Example

```typescript
import { MCPServer } from '@modelcontextprotocol/server';
import { z } from 'zod';

const server = new MCPServer({
  name: 'my-server',
  version: '1.0.0',
});

// Tool
server.addTool({
  name: 'calculate',
  description: 'Perform calculation',
  inputSchema: z.object({
    expression: z.string(),
  }),
  execute: async ({ expression }) => {
    return { result: eval(expression) };
  },
});

// Resource
server.addResource({
  uri: 'file:///data/users.json',
  name: 'Users Database',
  mimeType: 'application/json',
  read: async () => {
    return fs.readFileSync('/data/users.json', 'utf-8');
  },
});

// Start server
server.listen({ transport: 'stdio' });
```

### Client Example

```typescript
import { MCPClient } from '@modelcontextprotocol/client';

const client = new MCPClient({
  serverUrl: 'http://localhost:3000',
});

await client.connect();

// List tools
const tools = await client.listTools();

// Call tool
const result = await client.callTool('calculate', {
  expression: '2 + 2',
});

console.log(result);  // { result: 4 }
```

### Что взять для своего проекта

✅ MCP protocol implementation  
✅ Tools, Resources, Prompts patterns  
✅ Client-server architecture  
✅ Middleware для разных frameworks

**Документация:** https://modelcontextprotocol.io/

---

## Сравнительная таблица

| Проект | Размер | Архитектура | Ключевая фича |
|--------|--------|-------------|---------------|
| **Mastra** | Крупный | Monorepo + Layers | Observability, Production-ready |
| **Personal Assistant** | Средний | Mastra + MCP | Real-world example, Telegram |
| **Email Assistant** | Средний | LangGraph State Machine | HITL + Memory patterns |
| **OpenAI Agents SDK** | Крупный | Multi-agent | Handoffs, Guardrails |
| **MCP SDK** | Средний | Protocol-based | Official MCP standard |

---

## Следующий раздел

→ **[Рекомендации](./06-recommendations.md)**

Practical recommendations для проектов разного размера.
