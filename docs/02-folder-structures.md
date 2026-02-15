# Структуры папок в TypeScript AI проектах

Разбираем реальные подходы к организации кода в популярных фреймворках и проектах.

## 1. MCP сервер (Model Context Protocol)

### Официальная структура

```typescript
my-mcp-server/
├── src/
│   ├── index.ts           // main server entry, MCP setup
│   ├── config.ts          // capabilities: tools, resources, prompts
│   └── tools/             // ⭐ папка для tools
│       ├── github.ts      // grouped by domain
│       ├── filesystem.ts
│       └── database.ts
├── dist/                  // compiled output
├── tsconfig.json
├── package.json
└── README.md
```

### Tool Definition Pattern

```typescript
// src/tools/github.ts
import { tool } from '@modelcontextprotocol/sdk';
import { z } from 'zod';

export const createIssueTool = tool({
  name: 'github_create_issue',
  description: 'Create a new GitHub issue',
  
  inputSchema: z.object({
    repo: z.string().describe('Repository name (owner/repo)'),
    title: z.string(),
    body: z.string().optional(),
  }),
  
  async execute({ repo, title, body }) {
    // implementation
    return { issueNumber: 123, url: '...' };
  },
});
```

### Регистрация tools

```typescript
// src/index.ts
import { MCPServer } from '@modelcontextprotocol/sdk';
import { createIssueTool } from './tools/github';
import { readFileTool, writeFileTool } from './tools/filesystem';

const server = new MCPServer({
  name: 'my-server',
  version: '1.0.0',
});

// Явно добавляем tools
server.addTool(createIssueTool);
server.addTool(readFileTool);
server.addTool(writeFileTool);
```

### Когда использовать

- ✅ Создаете MCP сервер для Claude, Cursor, Windsurf
- ✅ Экспортируете tools для других агентов
- ✅ 5-20 tools в одном домене

**Примеры:**
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Remote Server Example](https://github.com/modelcontextprotocol/example-remote-server)

---

## 2. Vercel AI SDK

### Feature-based структура

```typescript
nextjs-app/
├── app/
│   ├── (chat)/                    // feature: chat interface
│   │   └── page.tsx
│   ├── (extraction)/              // feature: data extraction
│   │   └── page.tsx
│   └── api/
│       └── chat/
│           └── route.ts           // API route with tools
├── components/
│   └── ui/                        // reusable UI components
└── lib/
    ├── agents/                    // ⭐ agent definitions
    │   ├── code-review.ts
    │   └── research.ts
    └── tools/                     // ⭐ tools organized by domain
        ├── github/
        │   ├── create-issue.ts
        │   ├── list-repos.ts
        │   └── index.ts
        ├── filesystem/
        │   ├── read.ts
        │   ├── write.ts
        │   └── index.ts
        └── web/
            ├── search.ts
            └── fetch.ts
```

### Tool Definition

```typescript
// lib/tools/github/create-issue.ts
import { tool } from 'ai';
import { z } from 'zod';

export const createIssueTool = tool({
  description: 'Create a GitHub issue',
  
  parameters: z.object({
    repo: z.string(),
    title: z.string(),
    body: z.string().optional(),
  }),
  
  execute: async ({ repo, title, body }) => {
    // API call to GitHub
    const response = await fetch(/* ... */);
    return response.json();
  },
});
```

### Usage in API Route

```typescript
// app/api/chat/route.ts
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createIssueTool } from '@/lib/tools/github/create-issue';
import { searchWebTool } from '@/lib/tools/web/search';

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const result = await generateText({
    model: openai('gpt-4'),
    messages,
    tools: {
      create_issue: createIssueTool,
      search_web: searchWebTool,
    },
  });
  
  return Response.json(result);
}
```

### Когда использовать

- ✅ Next.js приложение с AI features
- ✅ Feature-based организация (по фичам пользователя)
- ✅ Full-stack TypeScript (frontend + backend)

**Примеры:**
- [Vercel AI SDK Examples](https://github.com/vercel/ai/tree/main/examples)
- [AI SDK Fundamentals Starter](https://github.com/vercel/ai-sdk-fundamentals-starter)

---

## 3. LangChain/LangGraph

### Application Structure

```typescript
my-agent/
├── src/
│   ├── agent.ts           // ⭐ main graph construction
│   ├── utils/
│   │   ├── tools.ts       // ⭐ agent tools definitions
│   │   ├── nodes.ts       // graph node functions
│   │   └── state.ts       // state management (Zod schemas)
│   ├── prompts.ts         // prompt templates
│   ├── schemas.ts         // Zod validation schemas
│   └── config.ts          // configuration
├── tests/
├── notebooks/             // Jupyter notebooks for exploration
├── langgraph.json         // LangGraph config
├── package.json
└── tsconfig.json
```

### Tool Definition

```typescript
// src/utils/tools.ts
import { StructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

export class GitHubCreateIssueTool extends StructuredTool {
  name = 'github_create_issue';
  description = 'Create a new GitHub issue';
  
  schema = z.object({
    repo: z.string(),
    title: z.string(),
    body: z.string().optional(),
  });
  
  async _call({ repo, title, body }) {
    // implementation
    return { issueNumber: 123 };
  }
}
```

### Graph Construction

```typescript
// src/agent.ts
import { StateGraph } from '@langchain/langgraph';
import { GitHubCreateIssueTool } from './utils/tools';
import { AgentState } from './utils/state';

const tools = [new GitHubCreateIssueTool()];

const graph = new StateGraph(AgentState)
  .addNode('agent', agentNode)
  .addNode('tools', toolsNode)
  .addEdge('__start__', 'agent')
  .addConditionalEdges('agent', shouldContinue)
  .addEdge('tools', 'agent');

export const agent = graph.compile();
```

### Monorepo Structure (для крупных проектов)

```typescript
workspace/
├── libs/
│   └── shared/            // ⭐ shared code
│       ├── tools/         // reusable tools
│       ├── types/         // common types
│       └── utils/         // utilities
├── apps/
│   ├── code-agent/        // individual agent app
│   │   ├── src/
│   │   │   ├── agent.ts
│   │   │   └── utils/
│   │   ├── langgraph.json
│   │   └── package.json
│   └── test-agent/
│       └── ...
├── turbo.json             // Turborepo config
├── pnpm-workspace.yaml
└── tsconfig.json
```

### Когда использовать

- ✅ Stateful multi-step workflows
- ✅ Human-in-the-loop patterns
- ✅ Persistent memory required
- ✅ Monorepo для нескольких агентов

**Примеры:**
- [Email Assistant with HITL](https://github.com/langchain-ai/agents-from-scratch-ts)
- [LangGraph Monorepo Example](https://github.com/langchain-ai/js-langgraph-monorepo-example)

---

## 4. Mastra Framework

### Standard Project Structure

```typescript
src/
├── mastra/
│   ├── agents/            // ⭐ agent definitions
│   │   └── index.ts
│   ├── tools/             // ⭐ custom tools
│   │   └── index.ts
│   ├── workflows/         // ⭐ multi-step workflows
│   │   └── index.ts
│   ├── mcp/               // MCP server implementations
│   ├── scorers/           // evaluation/testing
│   └── index.ts           // Mastra instance config
├── app/                   // Next.js app (optional)
│   └── api/
└── .env.example
```

### Mastra Monorepo (production)

```typescript
mastra/                    // main repository
├── packages/              // ⭐ core packages
│   ├── core/
│   ├── agents/
│   ├── workflows/
│   ├── rag/
│   ├── mcp/
│   └── memory/
├── integrations/          // ⭐ MCP integrations
│   └── opencode/
├── examples/              // example projects
├── templates/             // starter templates
├── stores/                // storage implementations
├── observability/         // tracing & monitoring
└── deployers/             // deployment adapters
```

### Tool Definition

```typescript
// src/mastra/tools/index.ts
import { createTool } from '@mastra/core';
import { z } from 'zod';

export const weatherTool = createTool({
  id: 'weather_get_current',
  description: 'Get current weather for location',
  
  inputSchema: z.object({
    location: z.string(),
    unit: z.enum(['celsius', 'fahrenheit']).default('celsius'),
  }),
  
  async execute({ location, unit }) {
    // API call
    return { temperature: 22, condition: 'Sunny' };
  },
});
```

### Agent Definition

```typescript
// src/mastra/agents/index.ts
import { Agent } from '@mastra/core';
import { openai } from '@ai-sdk/openai';
import { weatherTool } from '../tools';

export const assistantAgent = new Agent({
  name: 'personal-assistant',
  instructions: 'You are a helpful assistant...',
  model: openai('gpt-4'),
  tools: [weatherTool],
});
```

### Когда использовать

- ✅ Production-ready AI applications
- ✅ Full-stack integration (React, Next.js)
- ✅ Observability and evaluation required
- ✅ Multiple agents + workflows

**Примеры:**
- [Mastra Main Repo](https://github.com/mastra-ai/mastra) (21k+ stars)
- [Personal Assistant Example](https://github.com/mastra-ai/personal-assistant-example)

---

## 5. OpenAI Agents SDK

### Project Structure

```typescript
openai-agents-project/
├── src/
│   ├── agents/            // ⭐ agent definitions
│   │   ├── primary.ts
│   │   └── specialist.ts
│   ├── tools/             // ⭐ tool implementations
│   │   ├── github/
│   │   ├── filesystem/
│   │   └── database/
│   ├── guardrails/        // input/output validation
│   ├── handoffs/          // agent-to-agent delegation
│   └── index.ts
├── package.json
└── tsconfig.json
```

### Tool Definition

```typescript
// src/tools/github/create-issue.ts
import { z } from 'zod';

export const createIssueTool = {
  name: 'github_create_issue',
  description: 'Create a GitHub issue',
  
  parameters: z.object({
    repo: z.string(),
    title: z.string(),
    body: z.string().optional(),
  }),
  
  execute: async (args: { repo: string; title: string; body?: string }) => {
    // implementation
    return { success: true, issueNumber: 123 };
  },
};
```

### Agent with Handoffs

```typescript
// src/agents/primary.ts
import { Agent } from '@openai/agents';
import { createIssueTool } from '../tools/github/create-issue';
import { specialistAgent } from './specialist';

export const primaryAgent = new Agent({
  name: 'primary',
  instructions: 'You coordinate tasks...',
  tools: [createIssueTool],
  handoffs: [specialistAgent], // delegate to specialist
});
```

### Когда использовать

- ✅ Multi-agent systems with delegation
- ✅ Guardrails and safety required
- ✅ Real-time voice agents
- ✅ Production tracing/debugging

**Примеры:**
- [OpenAI Agents SDK](https://github.com/openai/openai-agents-js)

---

## Сравнительная таблица

| Фреймворк | Структура tools | Ключевая особенность | Размер проекта |
|-----------|----------------|----------------------|----------------|
| **MCP Server** | `src/tools/{domain}.ts` | Protocol-based, export to other agents | Small-Medium |
| **Vercel AI SDK** | `lib/tools/{domain}/` | Feature-based, Next.js integration | Small-Medium |
| **LangChain** | `src/utils/tools.ts` | Graph-based, HITL patterns | Medium-Large |
| **Mastra** | `src/mastra/tools/` | Full-stack, production-ready | Medium-Large |
| **OpenAI Agents** | `src/tools/{domain}/` | Multi-agent, handoffs | Medium-Large |

## Общие паттерны

### ✅ Папка `tools/` — стандарт

Все фреймворки используют отдельную папку для tools.

### ✅ Domain-based группировка

```typescript
tools/
├── github/      // GitHub-related tools
├── filesystem/  // File operations
└── database/    // DB queries
```

### ✅ Zod для validation

Все используют Zod для схем входных параметров.

### ✅ Explicit registration

Tools регистрируются явно (не auto-discovery).

## Следующий раздел

→ **[FSD для AI](./03-fsd-adaptation.md)**

Адаптация Feature-Sliced Design для AI проектов.
