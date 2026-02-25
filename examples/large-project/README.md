# Large Project Example

**Иллюстративный пример** AI-платформы с 30+ tools. Использует предлагаемую FSD-подобную архитектуру — не копия реального production-проекта; популярные фреймворки (Mastra, LangChain) используют иные структуры.

## Structure (FSD Layers)

```
large-project/
├── src/
│   ├── app/              # 🔴 Layer 1: Orchestration
│   ├── agents/           # 🟠 Layer 2: High-level agents
│   ├── features/         # 🟡 Layer 3: Domain tools
│   ├── entities/         # 🟢 Layer 4: Primitives
│   └── shared/           # 🔵 Layer 5: Utilities
├── tests/
├── docs/
└── package.json
```

## FSD Import Rules

```
app → agents → features → entities → shared
 ↓      ↓         ↓          ↓
Can import from layers below
Cannot import from layers above
```

## Features

- ✅ Предлагаемая FSD-подобная архитектура (см. disclaimer в docs/03-fsd-adaptation.md)
- ✅ Strict import rules
- ✅ 30+ tools organized by layers
- ✅ Multiple agents
- ✅ Production-ready patterns
- ✅ Comprehensive testing

## Installation

```bash
cd examples/large-project
npm install
```

## Usage

```bash
# Run specific agent
npm run agent:code-review
npm run agent:deployment

# Run all tests
npm test

# Type check
npm run type-check

# Lint
npm run lint
```

## When to Use

- Production SaaS platform
- Enterprise applications
- Team of 5+ developers
- 30+ tools
- Requires strict architecture
- High maintainability needs

## Key Decisions

1. **FSD-like Layers** - Clear separation of concerns (proposed approach, not industry standard)
2. **Import Rules** - Enforced via ESLint
3. **Testing Strategy** - Unit, integration, e2e
4. **Observability** - Built-in tracing and logging
5. **Error Handling** - Structured errors with retry logic
