# TypeScript AI Tools & Agents Architecture Research

> Исследование лучших практик организации tools и agents в TypeScript проектах для AI/LLM приложений

## 📋 О проекте

Это комплексное исследование архитектурных подходов к организации AI tools, agents и MCP серверов в TypeScript проектах. Включает анализ реальных open-source проектов, адаптацию Feature-Sliced Design (FSD) для AI, и практические рекомендации для проектов разного масштаба.

## 🎯 Для кого

- Frontend/Fullstack разработчики, работающие с AI
- Архитекторы AI-приложений на TypeScript
- Команды, создающие production-ready AI агентов
- Разработчики MCP серверов

## 📚 Содержание

### Основная документация

1. **[Введение](./docs/01-introduction.md)**
   - Проблематика организации AI tools
   - Чем AI проекты отличаются от обычных веб-приложений
   - Зачем нужна архитектура

2. **[Структуры папок](./docs/02-folder-structures.md)**
   - MCP серверы на TypeScript
   - Vercel AI SDK подход
   - LangChain/LangGraph организация
   - Mastra Framework структура

3. **[FSD для AI](./docs/03-fsd-adaptation.md)**
   - Адаптация Feature-Sliced Design
   - Слои: app → agents → features → entities → shared
   - Правила импортов
   - Когда использовать

4. **[Best Practices](./docs/04-best-practices.md)**
   - Именование и namespace
   - Модульность и композиция
   - Безопасность и error handling
   - Тестирование

5. **[Реальные примеры](./docs/05-real-examples.md)**
   - Анализ Mastra (21k+ stars)
   - OpenAI Agents SDK
   - LangChain.js monorepo
   - Personal Assistant Example

6. **[Рекомендации](./docs/06-recommendations.md)**
   - Для маленьких проектов (< 10 tools)
   - Для средних проектов (10-30 tools)
   - Для крупных проектов (30+ tools, monorepo)

7. **[Open-Source Giants](./docs/07-opensource-giants.md)**
   - Анализ LangChain (126k+ stars)
   - Semantic Kernel от Microsoft
   - LlamaIndex, CrewAI, Haystack
   - Общие паттерны и best practices

### Примеры кода

- **[Small Project](./examples/small-project/)** - Simple structure for pet projects
- **[Medium Project](./examples/medium-project/)** - Domain-based organization
- **[Large Project](./examples/large-project/)** - FSD-inspired architecture

### Диаграммы

- **[FSD Layers](./diagrams/fsd-layers.md)** - Визуализация слоев
- **[Import Rules](./diagrams/import-rules.md)** - Правила зависимостей
- **[Comparison](./diagrams/comparison.md)** - Сравнение подходов

## 🚀 Быстрый старт

### Установка зависимостей

```bash
npm install
# или
pnpm install
```

### Просмотр примеров

```bash
# Перейти в пример среднего проекта
cd examples/medium-project

# Установить зависимости
npm install

# Посмотреть структуру
tree -L 3
```

## 📊 Ключевые выводы

### ✅ Папка `tools/` обязательна

Начиная с 5+ инструментов, выносите их в отдельную папку для:
- Разделения ответственности
- Переиспользования
- Удобства тестирования

### 🎨 FSD-подобная архитектура для крупных проектов

```typescript
src/
├── app/          // 🔴 Orchestration
├── agents/       // 🟠 High-level agents
├── features/     // 🟡 Domain tools
├── entities/     // 🟢 Primitives
└── shared/       // 🔵 Utilities
```

### 📏 По размеру проекта

| Проект | Структура | Организация tools |
|--------|-----------|-------------------|
| < 10 tools | Flat `lib/tools/*.ts` | Файлы по доменам |
| 10-30 tools | `lib/tools/{domain}/` | Папки + namespace |
| 30+ tools | FSD layers | Слои + strict imports |
| Monorepo | Workspaces + shared | `libs/shared/tools/` |

### 🔗 Namespace для масштабирования

```typescript
const tools = {
  'github:create_issue': createIssueTool,
  'github:list_repos': listReposTool,
  'files:read': readFileTool,
  'files:write': writeFileTool,
};
```

## 🌟 Реальные проекты для изучения

### Production Frameworks

- **[Mastra](https://github.com/mastra-ai/mastra)** ⭐ 21k+ - TypeScript AI framework, monorepo
- **[OpenAI Agents SDK](https://github.com/openai/openai-agents-js)** - Multi-agent orchestration
- **[Vercel AI SDK](https://github.com/vercel/ai)** - Feature-based structure
- **[LangChain.js](https://github.com/langchain-ai/langchainjs)** - LLM application framework

### Examples

- **[Personal Assistant](https://github.com/mastra-ai/personal-assistant-example)** - Mastra + MCP
- **[Email Assistant](https://github.com/langchain-ai/agents-from-scratch-ts)** - HITL + Memory
- **[MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)** - Official MCP

## 🛠 Стек технологий

- TypeScript
- Node.js
- AI SDKs: Vercel AI SDK, LangChain, Mastra, OpenAI
- MCP (Model Context Protocol)
- Zod (validation)
- Monorepo: Turborepo, pnpm workspaces

## 📖 Дополнительные ресурсы

### Статьи

- [Architecting AI Agents with TypeScript](https://apeatling.com/articles/architecting-ai-agents-with-typescript/)
- [Building Effective Agents (Anthropic)](https://www.anthropic.com/research/building-effective-agents)
- [A Practical Guide to Building AI Agents (OpenAI)](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/)

### Документация

- [Mastra Docs](https://mastra.ai/docs)
- [Vercel AI SDK](https://ai-sdk.dev/docs)
- [LangGraph Structure](https://docs.langchain.com/oss/javascript/langgraph/application-structure)
- [Model Context Protocol](https://modelcontextprotocol.io/)

### Паттерны

- [Agent Design Pattern Catalogue](https://arxiv.org/abs/2405.10467)
- [AgentFSD](https://agentfsd.com/)
- [Feature-Sliced Design](https://feature-sliced.design/)

## 🤝 Contributing

Этот проект создан как исследовательский материал. Если у вас есть:
- Примеры других архитектурных подходов
- Ссылки на интересные проекты
- Улучшения для существующих примеров

Открывайте issues или pull requests!

## 📝 License

MIT

## 👤 Author

Research compiled from open-source projects and community best practices (February 2026)

---

**⭐ Если материал был полезен, поставьте звезду!**
