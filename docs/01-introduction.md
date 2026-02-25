# Введение

## Проблематика организации AI tools

При разработке AI-приложений на TypeScript возникают специфические архитектурные вопросы, которых нет в традиционных веб-приложениях:

### 🤔 Типичные вопросы

- **Где хранить tools?** В одной папке или разбивать по доменам?
- **Как организовать агентов?** Плоская структура или иерархия?
- **Когда использовать namespace?** `github:create_issue` vs `createGithubIssueTool`?
- **Нужна ли отдельная папка для tools?** Или можно держать все в одном файле?
- **Как масштабировать?** От 5 tools до 50+ tools?

### ⚠️ Проблемы при отсутствии архитектуры

```typescript
// ❌ Все в одном файле - плохо для 20+ tools
src/
├── index.ts  // 2000+ строк кода с agents и tools
└── utils.ts
```

**Последствия:**
- Невозможно найти нужный tool
- Сложно тестировать
- Конфликты при работе в команде
- Дублирование кода
- Непонятно, какой tool за что отвечает

## Чем AI проекты отличаются от веб-приложений

### Традиционное веб-приложение

```typescript
// Классическая структура Next.js
app/
├── (auth)/
├── (dashboard)/
├── api/
└── components/
```

**Принципы организации:**
- По страницам (routes)
- По UI компонентам
- По features для пользователя

### AI-приложение с агентами

```typescript
// AI-приложение требует другого подхода
src/
├── agents/       // Агенты-оркестраторы
├── tools/        // Функции для LLM
├── workflows/    // Multi-step процессы
├── memory/       // Контекст и история
└── app/          // UI (если есть)
```

**Специфика:**
- Tools вызываются LLM динамически
- Агенты принимают решения в runtime
- Важна композиция и переиспользование
- Контекст и память между вызовами
- Human-in-the-loop patterns

## Зачем нужна архитектура

### 1. **Maintainability** (Поддерживаемость)

```typescript
// ❌ Плохо: все в одном месте
const tools = {
  githubCreateIssue, githubListRepos, filesRead, filesWrite,
  dbQuery, dbMigrate, weatherGet, emailSend, slackPost
};

// ✅ Хорошо: организовано по доменам
import { githubTools } from './tools/github';
import { filesystemTools } from './tools/filesystem';
import { databaseTools } from './tools/database';
```

### 2. **Scalability** (Масштабируемость)

**5 tools** → плоская структура работает  
**15 tools** → нужны папки по доменам  
**30+ tools** → требуется многоуровневая архитектура

### 3. **Testability** (Тестируемость)

```typescript
// Изолированный tool легко тестировать
describe('github/create-issue', () => {
  it('should create issue with valid args', async () => {
    // ...
  });
});
```

### 4. **Team Collaboration** (Командная работа)

```
feature/github-tools    ← developer A
feature/slack-tools     ← developer B
feature/code-agent      ← developer C
```

Каждый работает в своей области без конфликтов.

### 5. **Reusability** (Переиспользование)

```typescript
// Tools можно использовать в разных агентах
const codeReviewAgent = createAgent({
  tools: [githubTools, filesystemTools],
});

const deploymentAgent = createAgent({
  tools: [githubTools, databaseTools],
});
```

## Почему не существует "единого стандарта"

В отличие от веб-разработки (где есть устоявшиеся паттерны MVC, MVVM, FSD), в AI-разработке:

### 🆕 Молодая область

- AI-агенты на TypeScript активно развиваются с 2023-2024
- Паттерны еще формируются
- Каждый фреймворк предлагает свой подход

### 🎯 Разные use cases

- **Chatbot** (простой) → плоская структура
- **Multi-agent system** (сложный) → иерархия агентов
- **MCP server** (специализированный) → organization by protocol

### 🔄 Быстрая эволюция

- Новые возможности LLM меняют архитектуру
- Tool calling, function schemas, structured outputs
- MCP protocol появился в конце 2024

## Что мы будем исследовать

### 📂 Структуры папок

Как организованы проекты в:
- MCP серверах
- Vercel AI SDK
- LangChain/LangGraph
- Mastra Framework
- OpenAI Agents SDK

### 🎨 Предлагаемая адаптация FSD

Мы предлагаем применить принципы Feature-Sliced Design к AI (это не устоявшаяся практика — Mastra, LangChain и др. используют свои структуры):
- Слои (app, agents, features, entities, shared)
- Правила импортов
- Boundaries между модулями

### 🏆 Best Practices

- Именование tools и namespace
- Модульность и композиция
- Error handling и безопасность
- Тестирование агентов

### 📊 Сравнение подходов

По размеру проекта:
- Small (< 10 tools)
- Medium (10-30 tools)
- Large (30+ tools, monorepo)

## Следующие шаги

Переходите к следующему разделу:  
→ **[Структуры папок](./02-folder-structures.md)**

Там мы детально разберем, как организованы реальные open-source проекты.
