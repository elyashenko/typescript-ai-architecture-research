# Рекомендации по размеру проекта

Практические рекомендации для организации AI tools/agents в зависимости от масштаба проекта.

## Классификация проектов

| Размер | Tools | Agents | Команда | Примеры |
|--------|-------|--------|---------|---------|
| **Small** | < 10 | 1-2 | Solo | Pet project, MVP, POC |
| **Medium** | 10-30 | 2-5 | 2-5 | Startup product, internal tool |
| **Large** | 30+ | 5+ | 5+ | Production SaaS, Platform |

---

## 1. Small Project (< 10 tools)

### Когда использовать

- Pet project или learning project
- MVP для валидации идеи
- Proof of concept
- Solo developer
- Один основной use case

### Рекомендуемая структура

```typescript
my-ai-app/
├── lib/
│   ├── agent.ts           // Один главный агент
│   └── tools/             // Все tools в одной папке
│       ├── github.ts      // 3-4 GitHub tools в одном файле
│       ├── files.ts       // 2-3 file tools
│       └── index.ts       // Экспорт всех tools
├── app/                   // Next.js app (если нужен UI)
│   └── api/
│       └── chat/
│           └── route.ts
├── package.json
└── tsconfig.json
```

### Пример: Simple Code Review Bot

```typescript
// lib/agent.ts
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import * as tools from './tools';

export async function reviewCode(prUrl: string) {
  const result = await generateText({
    model: openai('gpt-4'),
    prompt: `Review this pull request: ${prUrl}`,
    tools: {
      get_pr: tools.getPRTool,
      read_file: tools.readFileTool,
      create_comment: tools.createCommentTool,
    },
  });
  
  return result;
}

// lib/tools/github.ts
import { tool } from 'ai';
import { z } from 'zod';

export const getPRTool = tool({
  description: 'Get PR details',
  parameters: z.object({ prNumber: z.number() }),
  execute: async ({ prNumber }) => { /* ... */ },
});

export const createCommentTool = tool({
  description: 'Create PR comment',
  parameters: z.object({ prNumber: z.number(), body: z.string() }),
  execute: async ({ prNumber, body }) => { /* ... */ },
});

// lib/tools/files.ts
export const readFileTool = tool({
  description: 'Read file content',
  parameters: z.object({ path: z.string() }),
  execute: async ({ path }) => { /* ... */ },
});

// lib/tools/index.ts
export * from './github';
export * from './files';
```

### ✅ Преимущества

- Быстро начать разработку
- Просто ориентироваться
- Легко рефакторить
- Минимум boilerplate

### ⚠️ Ограничения

- Не масштабируется > 15 tools
- Сложно работать в команде
- Нет чёткого разделения ответственности

### 📦 Минимальные зависимости

```json
{
  "dependencies": {
    "ai": "^3.0.0",
    "@ai-sdk/openai": "^0.0.20",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.11.0"
  }
}
```

---

## 2. Medium Project (10-30 tools)

### Когда использовать

- Startup MVP в production
- Internal tool для компании
- Несколько use cases
- Команда 2-5 разработчиков
- Требуется поддержка

### Рекомендуемая структура

```typescript
my-ai-platform/
├── src/
│   ├── lib/
│   │   ├── agents/            // Несколько агентов
│   │   │   ├── code-review.ts
│   │   │   ├── test-runner.ts
│   │   │   └── index.ts
│   │   └── tools/             // Tools по доменам
│   │       ├── github/
│   │       │   ├── issues.ts
│   │       │   ├── prs.ts
│   │       │   ├── repos.ts
│   │       │   └── index.ts
│   │       ├── filesystem/
│   │       │   ├── read.ts
│   │       │   ├── write.ts
│   │       │   └── index.ts
│   │       └── database/
│   │           └── ...
│   ├── config/
│   │   └── env.ts
│   └── utils/
│       ├── logger.ts
│       └── errors.ts
├── app/                       // Next.js (если нужен UI)
├── tests/
│   ├── agents/
│   └── tools/
├── package.json
└── tsconfig.json
```

### Namespace Organization

```typescript
// src/lib/tools/github/index.ts
export const githubTools = {
  'github:create_issue': createIssueTool,
  'github:list_repos': listReposTool,
  'github:get_pr': getPRTool,
  'github:merge_pr': mergePRTool,
  'github:create_comment': createCommentTool,
} as const;

// src/lib/tools/filesystem/index.ts
export const filesystemTools = {
  'files:read': readFileTool,
  'files:write': writeFileTool,
  'files:search': searchFilesTool,
  'files:delete': deleteFileTool,
} as const;

// src/lib/agents/code-review.ts
import { githubTools } from '../tools/github';
import { filesystemTools } from '../tools/filesystem';

export const codeReviewAgent = createAgent({
  name: 'code-review',
  tools: { ...githubTools, ...filesystemTools },
});
```

### Path Aliases в tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/lib/*": ["src/lib/*"],
      "@/config/*": ["src/config/*"],
      "@/utils/*": ["src/utils/*"]
    }
  }
}
```

### ✅ Преимущества

- Domain-based организация
- Namespace для масштабирования
- Легко работать в команде
- Переиспользование tools

### ⚠️ Требования

- Нужна документация по структуре
- Code review процесс
- Testing strategy

### 📦 Зависимости

```json
{
  "dependencies": {
    "ai": "^3.0.0",
    "@ai-sdk/openai": "^0.0.20",
    "zod": "^3.22.4",
    "@langchain/core": "^0.1.0"
  },
  "devDependencies": {
    "vitest": "^1.2.0",
    "@types/node": "^20.11.0",
    "typescript": "^5.3.0",
    "eslint": "^8.56.0",
    "prettier": "^3.2.0"
  }
}
```

---

## 3. Large Project (30+ tools, Monorepo)

### Когда использовать

- Production SaaS платформа
- Multiple products/services
- Команда 5+ разработчиков
- Требуется строгая архитектура
- Важна поддерживаемость

### Рекомендуемая структура (FSD-inspired)

```typescript
my-ai-platform/
├── src/
│   ├── app/                   // 🔴 Layer 1: Orchestration
│   │   ├── orchestrator.ts
│   │   ├── router.ts
│   │   └── config.ts
│   │
│   ├── agents/                // 🟠 Layer 2: Agents
│   │   ├── code-review/
│   │   │   ├── index.ts
│   │   │   ├── config.ts
│   │   │   ├── prompts.ts
│   │   │   └── types.ts
│   │   ├── test-runner/
│   │   ├── deployment/
│   │   └── research/
│   │
│   ├── features/              // 🟡 Layer 3: Domain tools
│   │   ├── github/
│   │   │   ├── tools/
│   │   │   │   ├── issues.ts
│   │   │   │   ├── prs.ts
│   │   │   │   ├── repos.ts
│   │   │   │   └── index.ts
│   │   │   ├── types.ts
│   │   │   └── schemas.ts
│   │   ├── filesystem/
│   │   ├── database/
│   │   ├── slack/
│   │   └── email/
│   │
│   ├── entities/              // 🟢 Layer 4: Primitives
│   │   ├── http/
│   │   │   ├── fetch.ts
│   │   │   └── types.ts
│   │   ├── llm/
│   │   │   ├── interface.ts
│   │   │   ├── providers/
│   │   │   │   ├── openai.ts
│   │   │   │   ├── anthropic.ts
│   │   │   │   └── index.ts
│   │   │   └── factory.ts
│   │   ├── memory/
│   │   └── shell/
│   │
│   └── shared/                // 🔵 Layer 5: Utilities
│       ├── lib/
│       │   ├── validators.ts
│       │   ├── logger.ts
│       │   └── errors.ts
│       ├── types/
│       ├── config/
│       └── constants/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
│   ├── architecture.md
│   └── contributing.md
├── package.json
└── tsconfig.json
```

### Monorepo Structure (для нескольких сервисов)

```typescript
workspace/
├── apps/
│   ├── web/                   // Next.js app
│   ├── api/                   // API server
│   └── cli/                   // CLI tool
│
├── packages/
│   ├── agents/                // Shared agents
│   ├── tools/                 // Shared tools
│   ├── ui/                    // UI components
│   └── config/                // Shared config
│
├── libs/
│   └── shared/                // Shared utilities
│
├── turbo.json                 // Turborepo config
├── pnpm-workspace.yaml
└── package.json
```

### Import Rules Enforcement

```typescript
// .eslintrc.js
module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@/app/*'],
            message: 'Entities cannot import from app layer',
          },
          {
            group: ['@/agents/*'],
            message: 'Entities cannot import from agents layer',
          },
          {
            group: ['@/features/*'],
            message: 'Entities cannot import from features layer',
          },
        ],
      },
    ],
  },
};
```

### Testing Strategy

```typescript
// tests/integration/agents/code-review.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { codeReviewAgent } from '@/agents/code-review';
import { MockLLMProvider } from '@/tests/mocks/llm';

describe('Code Review Agent', () => {
  beforeEach(() => {
    // Setup mocks
  });
  
  it('should review PR and create comments', async () => {
    const result = await codeReviewAgent.execute({
      prUrl: 'https://github.com/owner/repo/pull/123',
    });
    
    expect(result.comments).toHaveLength(3);
    expect(result.status).toBe('completed');
  });
});
```

### ✅ Преимущества

- Строгая архитектура
- Масштабируемость
- Team collaboration
- Clear boundaries
- Production-ready

### ⚠️ Требования

- Архитектурная документация
- Code review процесс
- CI/CD pipeline
- Мониторинг и observability
- Testing coverage

### 📦 Зависимости

```json
{
  "dependencies": {
    "@mastra/core": "^1.0.0",
    "@ai-sdk/openai": "^0.0.20",
    "@langchain/langgraph": "^0.1.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "vitest": "^1.2.0",
    "typescript": "^5.3.0",
    "turbo": "^1.12.0",
    "eslint": "^8.56.0",
    "prettier": "^3.2.0",
    "@types/node": "^20.11.0"
  }
}
```

---

## Migration Path

### От Small к Medium

**Триггеры для миграции:**
- 10+ tools в одном файле
- Несколько разработчиков
- Нужна переиспользование tools

**Шаги:**
1. Создать папки по доменам: `tools/github/`, `tools/files/`
2. Разбить tools по файлам
3. Добавить namespace: `github:create_issue`
4. Создать `index.ts` с экспортами

### От Medium к Large

**Триггеры для миграции:**
- 30+ tools
- 5+ агентов
- Команда 5+ человек
- Production требования

**Шаги:**
1. Внедрить FSD layers: `app/`, `agents/`, `features/`, `entities/`, `shared/`
2. Настроить path aliases
3. Добавить import rules в ESLint
4. Написать архитектурную документацию
5. Настроить monorepo (если несколько сервисов)

---

## Decision Matrix

| Критерий | Small | Medium | Large |
|----------|-------|--------|-------|
| **Количество tools** | < 10 | 10-30 | 30+ |
| **Количество агентов** | 1-2 | 2-5 | 5+ |
| **Размер команды** | 1 | 2-5 | 5+ |
| **Структура** | Flat | Domain-based | FSD layers |
| **Namespace** | ❌ | ✅ | ✅ Required |
| **Import rules** | ❌ | Optional | ✅ Required |
| **Tests** | Optional | ✅ | ✅ Required |
| **Docs** | README | Docs folder | Architecture docs |
| **Monorepo** | ❌ | Optional | Consider |

---

## Практический чеклист

### Starting a New Project

**1. Определить размер:**
- [ ] Сколько планируется tools?
- [ ] Сколько агентов?
- [ ] Размер команды?

**2. Выбрать структуру:**
- [ ] Small: `lib/tools/*.ts`
- [ ] Medium: `lib/tools/{domain}/`
- [ ] Large: FSD layers

**3. Setup инфраструктуры:**
- [ ] TypeScript config с path aliases
- [ ] ESLint + Prettier
- [ ] Testing framework (Vitest)
- [ ] CI/CD (GitHub Actions)

**4. Документация:**
- [ ] README с архитектурой
- [ ] Contributing guide
- [ ] Tool documentation

---

## Заключение

**Ключевые выводы:**

1. **Начинайте просто** - не переусложняйте на старте
2. **Растите постепенно** - переходите к следующему уровню по триггерам
3. **Папка `tools/` обязательна** с 5+ tools
4. **Namespace** нужен с 20+ tools
5. **FSD** применяйте для 30+ tools и команды 5+ человек

**Next steps:**

- Изучите [примеры кода](../examples/) для вашего размера проекта
- Посмотрите [диаграммы](../diagrams/) для визуализации
- Прочитайте [best practices](./04-best-practices.md) для деталей
