# Best Practices

Практические рекомендации по организации AI tools, agents и MCP серверов в TypeScript проектах.

## 1. Именование и Namespace

### Tool Naming

**✅ Хорошо: глагол + объект**

```typescript
// Ясно, что делает tool
createGithubIssue
listRepositories
readFile
writeFile
searchCode
sendEmail
```

**❌ Плохо: неясные имена**

```typescript
githubIssue      // что делать? создать? получить?
repos            // список? поиск? создание?
file             // read? write? delete?
email            // отправка? получение?
```

### Namespace Organization

Для проектов с 20+ tools используйте namespace:

```typescript
// features/github/tools/index.ts
export const githubTools = {
  'github:create_issue': createIssueTool,
  'github:list_repos': listReposTool,
  'github:get_pr': getPullRequestTool,
  'github:merge_pr': mergePullRequestTool,
} as const;

// features/filesystem/tools/index.ts
export const filesystemTools = {
  'files:read': readFileTool,
  'files:write': writeFileTool,
  'files:search': searchFilesTool,
  'files:delete': deleteFileTool,
} as const;
```

**Преимущества:**
- LLM лучше понимает группировку
- Легче найти нужный tool
- Избегаются конфликты имен

### Description Writing

**✅ Хорошо: конкретное описание с примером**

```typescript
export const createIssueTool = tool({
  description: `Create a new GitHub issue in a repository.
  
  Use this when the user wants to:
  - Report a bug
  - Request a new feature
  - Track a task
  
  Example: "Create an issue in myorg/myrepo about fixing the login bug"`,
  
  parameters: z.object({
    repo: z.string().describe('Repository in "owner/repo" format, e.g., "facebook/react"'),
    title: z.string().describe('Clear, concise issue title'),
    body: z.string().optional().describe('Detailed description with steps, context, etc.'),
  }),
  
  execute: async ({ repo, title, body }) => {
    // ...
  },
});
```

**❌ Плохо: слишком короткое**

```typescript
description: 'Creates issue'  // Где? Как? Когда использовать?
```

---

## 2. Модульность и Композиция

### One Tool = One Responsibility

**✅ Хорошо: атомарные tools**

```typescript
// Отдельные, переиспользуемые tools
const readFileTool = tool({ /* read file */ });
const writeFileTool = tool({ /* write file */ });
const searchFilesTool = tool({ /* search files */ });

// Агент комбинирует их
const agent = createAgent({
  tools: [readFileTool, writeFileTool, searchFilesTool],
});
```

**❌ Плохо: один tool делает все**

```typescript
const fileManagerTool = tool({
  description: 'Manage files: read, write, delete, search',
  parameters: z.object({
    action: z.enum(['read', 'write', 'delete', 'search']),
    // ...
  }),
  // Сложная логика внутри одного tool
});
```

### Reusable Tools Across Agents

```typescript
// features/github/tools/index.ts
export const githubTools = {
  'github:create_issue': createIssueTool,
  'github:list_repos': listReposTool,
};

// agents/code-review/index.ts
import { githubTools } from '@/features/github/tools';
import { filesystemTools } from '@/features/filesystem/tools';

export const codeReviewAgent = createAgent({
  tools: { ...githubTools, ...filesystemTools },
});

// agents/deployment/index.ts
import { githubTools } from '@/features/github/tools';
import { databaseTools } from '@/features/database/tools';

export const deploymentAgent = createAgent({
  tools: { ...githubTools, ...databaseTools },  // переиспользуем githubTools
});
```

### Composition Over Inheritance

**✅ Хорошо: composition**

```typescript
// entities/llm/factory.ts
export function createLLMProvider(config: LLMConfig) {
  switch (config.provider) {
    case 'openai':
      return new OpenAIProvider(config);
    case 'anthropic':
      return new AnthropicProvider(config);
    default:
      throw new Error(`Unknown provider: ${config.provider}`);
  }
}

// Используем композицию
const llm = createLLMProvider({ provider: 'openai', apiKey: '...' });
```

**❌ Плохо: глубокая иерархия классов**

```typescript
class BaseLLM {}
class ChatLLM extends BaseLLM {}
class OpenAIChatLLM extends ChatLLM {}
class GPT4LLM extends OpenAIChatLLM {}  // слишком глубоко
```

---

## 3. Безопасность

### Input Validation

**Всегда используйте Zod для валидации:**

```typescript
export const createIssueTool = tool({
  parameters: z.object({
    repo: z.string()
      .regex(/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/)
      .describe('Repository in owner/repo format'),
    title: z.string()
      .min(1)
      .max(200)
      .describe('Issue title'),
    body: z.string()
      .max(10000)
      .optional(),
  }),
  
  execute: async (args) => {
    // args уже провалидированы
  },
});
```

### Rate Limiting

```typescript
// shared/lib/rate-limiter.ts
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  async checkLimit(key: string, maxRequests: number, windowMs: number): Promise<boolean> {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Убираем старые запросы
    const recentRequests = requests.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      return false;
    }
    
    recentRequests.push(now);
    this.requests.set(key, recentRequests);
    return true;
  }
}

// features/github/tools/create-issue.ts
const rateLimiter = new RateLimiter();

export const createIssueTool = tool({
  // ...
  execute: async ({ repo, title, body }) => {
    const allowed = await rateLimiter.checkLimit('github:create_issue', 10, 60000);
    
    if (!allowed) {
      throw new Error('Rate limit exceeded. Try again later.');
    }
    
    // создаем issue
  },
});
```

### Секреты и API Keys

**✅ Хорошо: через environment variables**

```typescript
// shared/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  GITHUB_TOKEN: z.string().min(1),
  DATABASE_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

```typescript
// entities/llm/providers/openai.ts
import { env } from '@/shared/config/env';

export class OpenAIProvider {
  private client: OpenAI;
  
  constructor() {
    this.client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }
}
```

**❌ Плохо: хардкод в коде**

```typescript
const apiKey = 'sk-abc123...';  // НИКОГДА так не делайте!
```

### Sandbox для выполнения кода

```typescript
// entities/shell/execute.ts
export async function executeCommand(
  command: string,
  options: ExecuteOptions = {}
): Promise<ExecuteResult> {
  // Blacklist опасных команд
  const dangerousCommands = ['rm -rf', 'dd', 'mkfs', ':(){ :|:& };:'];
  
  if (dangerousCommands.some(cmd => command.includes(cmd))) {
    throw new Error('Dangerous command detected');
  }
  
  // Timeout для защиты от зависания
  const timeout = options.timeout || 30000;
  
  // Выполнение с ограничениями
  const result = await executeWithTimeout(command, timeout);
  
  return result;
}
```

---

## 4. Error Handling

### Structured Errors

```typescript
// shared/lib/error-handler.ts
export class ToolError extends Error {
  constructor(
    message: string,
    public toolName: string,
    public code: string,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'ToolError';
  }
}

export class RateLimitError extends ToolError {
  constructor(toolName: string, retryAfterMs: number) {
    super(
      `Rate limit exceeded for ${toolName}. Retry after ${retryAfterMs}ms`,
      toolName,
      'RATE_LIMIT',
      true
    );
  }
}
```

### Graceful Degradation

```typescript
export const searchWebTool = tool({
  description: 'Search the web',
  parameters: z.object({ query: z.string() }),
  
  execute: async ({ query }) => {
    try {
      // Основной поиск
      return await primarySearchAPI(query);
    } catch (error) {
      // Fallback на альтернативный сервис
      try {
        return await fallbackSearchAPI(query);
      } catch (fallbackError) {
        // Возвращаем частичный результат или ошибку
        return {
          success: false,
          message: 'Search temporarily unavailable',
          suggestions: ['Try again later', 'Use alternative search methods'],
        };
      }
    }
  },
});
```

### Error Logging

```typescript
// shared/lib/logger.ts
export const logger = {
  info: (message: string, meta?: Record<string, any>) => {
    console.log(JSON.stringify({ level: 'info', message, ...meta, timestamp: new Date() }));
  },
  
  error: (message: string, error: Error, meta?: Record<string, any>) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      ...meta,
      timestamp: new Date(),
    }));
  },
};

// features/github/tools/create-issue.ts
export const createIssueTool = tool({
  execute: async (args) => {
    try {
      const result = await createIssue(args);
      logger.info('Issue created successfully', { issueNumber: result.number });
      return result;
    } catch (error) {
      logger.error('Failed to create issue', error as Error, { args });
      throw new ToolError('Failed to create GitHub issue', 'github:create_issue', 'API_ERROR');
    }
  },
});
```

---

## 5. Тестирование

### Unit Tests для Tools

```typescript
// features/github/tools/__tests__/create-issue.test.ts
import { describe, it, expect, vi } from 'vitest';
import { createIssueTool } from '../create-issue';

describe('github:create_issue', () => {
  it('should create issue with valid parameters', async () => {
    // Мокируем HTTP запрос
    vi.mock('@/entities/http', () => ({
      httpFetch: vi.fn().mockResolvedValue({
        data: { number: 123, url: 'https://github.com/...' },
      }),
    }));
    
    const result = await createIssueTool.execute({
      repo: 'owner/repo',
      title: 'Bug report',
      body: 'Description',
    });
    
    expect(result.number).toBe(123);
  });
  
  it('should throw error for invalid repo format', async () => {
    await expect(
      createIssueTool.execute({
        repo: 'invalid-format',  // должно быть owner/repo
        title: 'Test',
      })
    ).rejects.toThrow();
  });
});
```

### Integration Tests для Agents

```typescript
// agents/__tests__/code-review.test.ts
import { describe, it, expect } from 'vitest';
import { codeReviewAgent } from '../code-review';

describe('Code Review Agent', () => {
  it('should review pull request and create feedback', async () => {
    const result = await codeReviewAgent.execute({
      task: 'Review PR #123 in owner/repo',
    });
    
    expect(result.toolCalls).toContain('github:get_pr');
    expect(result.toolCalls).toContain('files:read');
    expect(result.feedback).toBeDefined();
  });
});
```

### Mock LLM для тестов

```typescript
// entities/llm/__tests__/mock-provider.ts
export class MockLLMProvider implements LanguageModel {
  private responses: string[];
  private currentIndex = 0;
  
  constructor(responses: string[]) {
    this.responses = responses;
  }
  
  async generateText(prompt: string): Promise<string> {
    const response = this.responses[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.responses.length;
    return response;
  }
}

// Использование в тестах
const mockLLM = new MockLLMProvider([
  'I will use github:create_issue tool',
  'Issue created successfully',
]);
```

---

## 6. Performance

### Кэширование результатов

```typescript
// shared/lib/cache.ts
export class SimpleCache<T> {
  private cache = new Map<string, { value: T; expiresAt: number }>();
  
  get(key: string): T | undefined {
    const item = this.cache.get(key);
    if (!item) return undefined;
    
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }
    
    return item.value;
  }
  
  set(key: string, value: T, ttlMs: number = 60000): void {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }
}

// features/github/tools/list-repos.ts
const cache = new SimpleCache<Repository[]>();

export const listReposTool = tool({
  execute: async ({ org }) => {
    const cacheKey = `repos:${org}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    const repos = await fetchRepositories(org);
    cache.set(cacheKey, repos, 300000);  // 5 minutes
    
    return repos;
  },
});
```

### Параллельное выполнение

```typescript
// agents/deployment/index.ts
export async function deployApplication() {
  // Параллельно выполняем независимые задачи
  const [buildResult, testsResult, lintResult] = await Promise.all([
    buildTool.execute({ project: 'main' }),
    runTestsTool.execute({ suite: 'e2e' }),
    lintTool.execute({ path: 'src/' }),
  ]);
  
  if (!testsResult.success) {
    throw new Error('Tests failed');
  }
  
  // Последовательно выполняем зависимые задачи
  await deployTool.execute({ artifact: buildResult.path });
}
```

---

## 7. Observability

### Tracing

```typescript
// shared/lib/tracer.ts
export class Tracer {
  startSpan(name: string, attributes?: Record<string, any>) {
    const spanId = crypto.randomUUID();
    console.log(JSON.stringify({
      type: 'span_start',
      spanId,
      name,
      attributes,
      timestamp: new Date(),
    }));
    
    return {
      end: () => {
        console.log(JSON.stringify({
          type: 'span_end',
          spanId,
          timestamp: new Date(),
        }));
      },
    };
  }
}

// features/github/tools/create-issue.ts
const tracer = new Tracer();

export const createIssueTool = tool({
  execute: async (args) => {
    const span = tracer.startSpan('github:create_issue', { repo: args.repo });
    
    try {
      const result = await createIssue(args);
      return result;
    } finally {
      span.end();
    }
  },
});
```

---

## Следующий раздел

→ **[Реальные примеры](./05-real-examples.md)**

Анализ архитектуры production-ready проектов.
