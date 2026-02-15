# Feature-Sliced Design для AI проектов

Адаптация методологии FSD (Feature-Sliced Design) для организации AI tools, agents и workflows в TypeScript.

## Что такое FSD

**Feature-Sliced Design** — методология архитектуры frontend-приложений, основанная на разделении кода по **слоям** и **срезам** (slices).

### Классический FSD (для веб-приложений)

```typescript
src/
├── app/           // 🔴 Инициализация приложения
├── pages/         // 🟠 Страницы приложения
├── widgets/       // 🟡 Составные блоки
├── features/      // 🟢 Бизнес-логика
├── entities/      // 🔵 Бизнес-сущности
└── shared/        // ⚪ Переиспользуемая инфраструктура
```

### Правила FSD

1. **Слои изолированы** — каждый слой может импортировать только из нижележащих
2. **Срезы внутри слоя** — группировка по feature/domain
3. **Public API** — каждый модуль экспортирует через `index.ts`

---

## FSD-подобная архитектура для AI

Адаптируем концепцию слоев для AI-проектов:

```typescript
src/
├── app/              // 🔴 Layer 1: Application orchestration
├── agents/           // 🟠 Layer 2: High-level agents
├── features/         // 🟡 Layer 3: Domain tools (business logic)
├── entities/         // 🟢 Layer 4: Low-level primitives
└── shared/           // 🔵 Layer 5: Utilities & types
```

### Layer 1: App (Orchestration)

**Назначение:** Точка входа, роутинг задач, главный оркестратор

```typescript
// app/orchestrator.ts
import { codeReviewAgent } from '@/agents/code-review';
import { testRunnerAgent } from '@/agents/test-runner';

export async function routeTask(task: Task) {
  switch (task.type) {
    case 'code-review':
      return codeReviewAgent.execute(task);
    case 'test':
      return testRunnerAgent.execute(task);
    default:
      throw new Error('Unknown task type');
  }
}
```

```typescript
// app/config.ts
export const appConfig = {
  llmProvider: 'openai',
  modelName: 'gpt-4o',
  maxTokens: 4000,
  temperature: 0.7,
};
```

**Содержимое:**
- Orchestration logic
- Роутинг между агентами
- Глобальная конфигурация
- Application entry point

---

### Layer 2: Agents (High-level orchestrators)

**Назначение:** Агенты используют tools из features для решения задач

```typescript
// agents/code-review/index.ts
import { createAgent } from '@/entities/agent';
import { githubTools } from '@/features/github/tools';
import { filesystemTools } from '@/features/filesystem/tools';

export const codeReviewAgent = createAgent({
  name: 'code-review',
  instructions: `You review pull requests...`,
  tools: {
    ...githubTools,
    ...filesystemTools,
  },
});
```

```typescript
// agents/code-review/config.ts
export const codeReviewConfig = {
  autoApprove: false,
  requireTests: true,
  maxFilesPerReview: 20,
};
```

**Структура:**
```typescript
agents/
├── code-review/
│   ├── index.ts       // agent definition
│   ├── config.ts      // agent-specific config
│   ├── prompts.ts     // prompt templates
│   └── types.ts       // agent types
├── test-runner/
└── deployment/
```

**Может импортировать:**
- ✅ features (tools)
- ✅ entities (primitives)
- ✅ shared (utils)
- ❌ app (нельзя)
- ❌ other agents (нельзя)

---

### Layer 3: Features (Domain tools)

**Назначение:** Tools, сгруппированные по доменам

```typescript
// features/github/tools/create-issue.ts
import { tool } from 'ai';
import { z } from 'zod';
import { httpFetch } from '@/entities/http';

export const createIssueTool = tool({
  description: 'Create a GitHub issue',
  
  parameters: z.object({
    repo: z.string().describe('owner/repo format'),
    title: z.string(),
    body: z.string().optional(),
  }),
  
  execute: async ({ repo, title, body }) => {
    const response = await httpFetch({
      url: `https://api.github.com/repos/${repo}/issues`,
      method: 'POST',
      body: { title, body },
    });
    
    return response.data;
  },
});
```

```typescript
// features/github/tools/index.ts
export { createIssueTool } from './create-issue';
export { listReposTool } from './list-repos';
export { getPRTool } from './get-pr';

// Экспорт как namespace
export const githubTools = {
  'github:create_issue': createIssueTool,
  'github:list_repos': listReposTool,
  'github:get_pr': getPRTool,
} as const;
```

**Структура:**
```typescript
features/
├── github/
│   ├── tools/
│   │   ├── create-issue.ts
│   │   ├── list-repos.ts
│   │   ├── get-pr.ts
│   │   └── index.ts       // public API
│   ├── types.ts
│   └── schemas.ts         // Zod schemas
├── filesystem/
│   ├── tools/
│   │   ├── read-file.ts
│   │   ├── write-file.ts
│   │   ├── search.ts
│   │   └── index.ts
│   └── types.ts
└── database/
    └── ...
```

**Может импортировать:**
- ✅ entities (primitives)
- ✅ shared (utils)
- ❌ app, agents, other features (нельзя)

---

### Layer 4: Entities (Low-level primitives)

**Назначение:** Низкоуровневые операции и провайдеры

```typescript
// entities/http/fetch.ts
export async function httpFetch<T>({
  url,
  method = 'GET',
  headers = {},
  body,
}: HttpFetchOptions): Promise<HttpResponse<T>> {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  
  if (!response.ok) {
    throw new HttpError(response.status, await response.text());
  }
  
  return {
    data: await response.json(),
    status: response.status,
  };
}
```

```typescript
// entities/llm/providers/openai.ts
import { LanguageModel } from '../interface';
import { OpenAI } from 'openai';

export class OpenAIProvider implements LanguageModel {
  private client: OpenAI;
  
  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }
  
  async generateText(prompt: string, options?: GenerateOptions) {
    const response = await this.client.chat.completions.create({
      model: options?.model ?? 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: options?.temperature,
    });
    
    return response.choices[0].message.content;
  }
}
```

**Структура:**
```typescript
entities/
├── http/
│   ├── fetch.ts
│   ├── error.ts
│   └── types.ts
├── llm/
│   ├── interface.ts       // unified LLM interface
│   ├── providers/
│   │   ├── openai.ts
│   │   ├── anthropic.ts
│   │   └── index.ts
│   └── factory.ts         // provider factory
├── memory/
│   ├── in-memory.ts
│   └── persistent.ts
└── shell/
    ├── execute.ts
    └── types.ts
```

**Может импортировать:**
- ✅ shared (utils, types)
- ❌ app, agents, features (нельзя)

---

### Layer 5: Shared (Utilities)

**Назначение:** Общие утилиты, типы, хелперы

```typescript
// shared/lib/validators.ts
import { z } from 'zod';

export const emailSchema = z.string().email();

export const urlSchema = z.string().url();

export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}
```

```typescript
// shared/lib/error-handler.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }
  
  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR');
  }
  
  return new AppError('An unknown error occurred', 'UNKNOWN_ERROR');
}
```

**Структура:**
```typescript
shared/
├── lib/
│   ├── validators.ts
│   ├── error-handler.ts
│   ├── logger.ts
│   └── formatters.ts
├── types/
│   ├── common.ts
│   ├── api.ts
│   └── agent.ts
├── config/
│   └── env.ts
└── constants/
    └── index.ts
```

**Может импортировать:**
- ✅ Только другие модули внутри shared
- ❌ Никакие другие слои

---

## Правила импортов

### ✅ Разрешенные импорты (сверху вниз)

```typescript
// ✅ app → agents
import { codeReviewAgent } from '@/agents/code-review';

// ✅ agents → features
import { githubTools } from '@/features/github/tools';

// ✅ features → entities
import { httpFetch } from '@/entities/http';

// ✅ entities → shared
import { logger } from '@/shared/lib/logger';

// ✅ любой слой → shared
import { AppError } from '@/shared/lib/error-handler';
```

### ❌ Запрещенные импорты (снизу вверх или горизонтально)

```typescript
// ❌ entities → features
import { createIssueTool } from '@/features/github/tools';

// ❌ features → agents
import { codeReviewAgent } from '@/agents/code-review';

// ❌ shared → любой другой слой
import { githubTools } from '@/features/github';

// ❌ agents → agents (cross-agent imports)
import { testRunnerAgent } from '@/agents/test-runner';
```

### Диаграмма зависимостей

```
         app              🔴 может импортировать всех
          ↓
       agents             🟠 может: features, entities, shared
          ↓
      features            🟡 может: entities, shared
          ↓
      entities            🟢 может: shared
          ↓
       shared             🔵 не может импортировать никого
```

---

## Практический пример

### Задача: Code Review Agent

```typescript
// 🔴 app/orchestrator.ts
import { routeToAgent } from './router';

export async function handleRequest(request: Request) {
  const agent = routeToAgent(request.type);
  return agent.execute(request.data);
}

// 🟠 agents/code-review/index.ts
import { createAgent } from '@/entities/agent/factory';
import { githubTools } from '@/features/github/tools';
import { filesystemTools } from '@/features/filesystem/tools';
import { codeReviewPrompt } from './prompts';

export const codeReviewAgent = createAgent({
  name: 'code-review',
  instructions: codeReviewPrompt,
  tools: { ...githubTools, ...filesystemTools },
});

// 🟡 features/github/tools/create-issue.ts
import { tool } from 'ai';
import { httpFetch } from '@/entities/http';
import { logger } from '@/shared/lib/logger';

export const createIssueTool = tool({
  description: 'Create GitHub issue',
  parameters: z.object({ /* ... */ }),
  execute: async (args) => {
    logger.info('Creating issue', args);
    return httpFetch({ /* ... */ });
  },
});

// 🟢 entities/http/fetch.ts
import { AppError } from '@/shared/lib/error-handler';

export async function httpFetch(options: HttpOptions) {
  try {
    const response = await fetch(/* ... */);
    return response.json();
  } catch (error) {
    throw new AppError('HTTP request failed', 'HTTP_ERROR');
  }
}

// 🔵 shared/lib/error-handler.ts
export class AppError extends Error {
  // базовый класс ошибок
}
```

---

## Преимущества FSD для AI

### 1. **Чёткие границы**

Каждый слой знает, что он может/не может импортировать.

### 2. **Переиспользование**

Tools из `features/` можно использовать в разных агентах.

### 3. **Тестируемость**

Легко мокать зависимости, т.к. они идут из нижних слоев.

### 4. **Масштабируемость**

Добавление нового feature не влияет на остальные.

### 5. **Онбординг**

Новые разработчики быстро понимают структуру.

---

## Когда использовать FSD

### ✅ Используйте FSD когда:

- 30+ tools в проекте
- Несколько агентов
- Команда > 3 разработчиков
- Production-ready application
- Важна поддерживаемость

### ❌ Не используйте FSD когда:

- < 10 tools
- Pet project / MVP
- Solo developer
- Простые use cases

Для маленьких проектов достаточно:
```typescript
lib/
├── agents/
└── tools/
    ├── github.ts
    └── files.ts
```

---

## Следующий раздел

→ **[Best Practices](./04-best-practices.md)**

Детальные рекомендации по организации кода, именованию и безопасности.
