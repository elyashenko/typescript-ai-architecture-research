# Medium Project Example

AI platform with 10-30 tools organized by domains with namespace.

## Structure

```
medium-project/
├── src/
│   ├── lib/
│   │   ├── agents/            # Multiple agents
│   │   │   ├── code-review.ts
│   │   │   ├── test-runner.ts
│   │   │   └── index.ts
│   │   └── tools/             # Tools by domain
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
├── tests/
├── package.json
└── tsconfig.json
```

## Features

- ✅ Domain-based organization
- ✅ Namespace (`github:create_issue`)
- ✅ Multiple agents
- ✅ Reusable tools
- ✅ Path aliases (`@/lib/*`)

## Installation

```bash
cd examples/medium-project
npm install
```

## Usage

```bash
# Run code review agent
npm run agent:code-review

# Run test runner agent
npm run agent:test-runner
```

## When to Use

- Startup MVP in production
- Internal tools for company
- Team of 2-5 developers
- 10-30 tools
- Multiple use cases
