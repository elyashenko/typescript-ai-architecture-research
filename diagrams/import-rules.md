# Import Rules

## Allowed Imports (✅)

```mermaid
graph TD
    subgraph "✅ Correct Import Patterns"
        A[app/orchestrator.ts] -->|import| B[agents/code-review]
        B -->|import| C[features/github/tools]
        C -->|import| D[entities/http]
        D -->|import| E[shared/logger]
        
        A2[app] -->|import| E2[shared]
        B2[agents] -->|import| E3[shared]
    end
    
    style A fill:#51cf66
    style B fill:#51cf66
    style C fill:#51cf66
    style D fill:#51cf66
    style E fill:#51cf66
    style A2 fill:#51cf66
    style B2 fill:#51cf66
    style E2 fill:#51cf66
    style E3 fill:#51cf66
```

### Examples of Correct Imports

```typescript
// ✅ app can import agents
// app/orchestrator.ts
import { codeReviewAgent } from '@/agents/code-review';

// ✅ agents can import features
// agents/code-review/index.ts
import { githubTools } from '@/features/github/tools';

// ✅ features can import entities
// features/github/tools/create-issue.ts
import { httpFetch } from '@/entities/http';

// ✅ entities can import shared
// entities/http/index.ts
import { logger } from '@/shared/lib/logger';

// ✅ Any layer can import shared
// app/orchestrator.ts
import { AppError } from '@/shared/lib/errors';
```

## Forbidden Imports (❌)

```mermaid
graph TD
    subgraph "❌ Incorrect Import Patterns"
        E1[entities/http] -.->|❌ Cannot import| C1[features/github]
        C2[features/github] -.->|❌ Cannot import| B1[agents/code-review]
        B2[agents/code-review] -.->|❌ Cannot import| A1[app/orchestrator]
        S1[shared/logger] -.->|❌ Cannot import| A2[app]
        S2[shared/logger] -.->|❌ Cannot import| E2[entities]
    end
    
    style E1 fill:#ff6b6b
    style C1 fill:#ff6b6b
    style C2 fill:#ff6b6b
    style B1 fill:#ff6b6b
    style B2 fill:#ff6b6b
    style A1 fill:#ff6b6b
    style S1 fill:#ff6b6b
    style A2 fill:#ff6b6b
    style S2 fill:#ff6b6b
    style E2 fill:#ff6b6b
```

### Examples of Incorrect Imports

```typescript
// ❌ entities cannot import features
// entities/http/index.ts
import { createIssueTool } from '@/features/github/tools'; // WRONG!

// ❌ features cannot import agents
// features/github/tools/create-issue.ts
import { codeReviewAgent } from '@/agents/code-review'; // WRONG!

// ❌ agents cannot import app
// agents/code-review/index.ts
import { orchestrateTask } from '@/app/orchestrator'; // WRONG!

// ❌ shared cannot import anything
// shared/lib/logger.ts
import { httpFetch } from '@/entities/http'; // WRONG!

// ❌ Cross-agent imports are forbidden
// agents/code-review/index.ts
import { deploymentAgent } from '@/agents/deployment'; // WRONG!
```

## Enforcing Rules with ESLint

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          // Entities cannot import features, agents, app
          {
            group: ['@/features/*', '@/agents/*', '@/app/*'],
            message: 'Entities can only import from entities and shared',
          },
          // Features cannot import agents, app
          {
            group: ['@/agents/*', '@/app/*'],
            message: 'Features can only import from features, entities, and shared',
          },
          // Agents cannot import app or other agents
          {
            group: ['@/app/*', '@/agents/*'],
            message: 'Agents can only import from features, entities, and shared',
          },
          // Shared cannot import anything
          {
            group: ['@/app/*', '@/agents/*', '@/features/*', '@/entities/*'],
            message: 'Shared layer cannot import from other layers',
          },
        ],
      },
    ],
  },
};
```

## Import Rule Matrix

| From ↓ / To → | app | agents | features | entities | shared |
|---------------|-----|--------|----------|----------|--------|
| **app** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **agents** | ❌ | ❌ | ✅ | ✅ | ✅ |
| **features** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **entities** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **shared** | ❌ | ❌ | ❌ | ❌ | ❌ |

**Legend:**
- ✅ = Can import
- ❌ = Cannot import

## Why These Rules?

### 1. **Prevent Circular Dependencies**

```
❌ BAD: Circular dependency
features/github → entities/http → features/github
```

### 2. **Maintain Clear Hierarchy**

```
✅ GOOD: Clear top-down flow
app → agents → features → entities → shared
```

### 3. **Enable Independent Testing**

```typescript
// Can test entities/http without mocking features
describe('httpFetch', () => {
  // No dependencies on higher layers
});
```

### 4. **Improve Reusability**

```typescript
// shared/logger can be used anywhere without circular deps
import { logger } from '@/shared/lib/logger';
```

### 5. **Simplify Refactoring**

```
Changing entities/http only affects:
- features (that use it)
- agents (indirectly)
- app (indirectly)

Does NOT affect:
- shared (no dependencies on entities)
```
