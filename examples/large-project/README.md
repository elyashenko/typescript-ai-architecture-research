# Large Project Example

Production-ready AI platform with 30+ tools using FSD-inspired architecture.

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

- ✅ FSD-inspired architecture
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

1. **FSD Layers** - Clear separation of concerns
2. **Import Rules** - Enforced via ESLint
3. **Testing Strategy** - Unit, integration, e2e
4. **Observability** - Built-in tracing and logging
5. **Error Handling** - Structured errors with retry logic
