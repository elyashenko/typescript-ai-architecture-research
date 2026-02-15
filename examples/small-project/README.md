# Small Project Example

Simple AI assistant with < 10 tools for a pet project or MVP.

## Structure

```
small-project/
├── lib/
│   ├── agent.ts           # Main agent
│   └── tools/             # All tools in one place
│       ├── github.ts      # GitHub tools (3-4 tools)
│       ├── files.ts       # File operations (2-3 tools)
│       └── index.ts       # Export all tools
├── app/                   # Optional UI
├── package.json
└── tsconfig.json
```

## Use Case

Code review bot that:
1. Fetches PR details
2. Reads changed files
3. Creates review comments

## Installation

```bash
cd examples/small-project
npm install
```

## Usage

```bash
npm run dev
```

## Key Features

- ✅ Simple flat structure
- ✅ Fast to start
- ✅ Easy to understand
- ✅ Minimal boilerplate

## When to Use

- Pet projects
- Learning projects
- MVPs
- Solo developer
- < 10 tools
