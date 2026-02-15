# Architecture Comparison

## Project Size Evolution

```mermaid
graph LR
    A[Small<br/>< 10 tools] --> B[Medium<br/>10-30 tools]
    B --> C[Large<br/>30+ tools]
    
    A --> |Triggers<br/>• 10+ tools<br/>• Team grows<br/>• Reuse needed| B
    B --> |Triggers<br/>• 30+ tools<br/>• 5+ developers<br/>• Production| C
    
    style A fill:#51cf66
    style B fill:#ffd43b
    style C fill:#ff922b
```

## Structure Comparison

```mermaid
graph TD
    subgraph "Small Project"
        S1[lib/agent.ts]
        S2[lib/tools/github.ts]
        S3[lib/tools/files.ts]
    end
    
    subgraph "Medium Project"
        M1[lib/agents/code-review.ts]
        M2[lib/tools/github/issues.ts]
        M3[lib/tools/github/prs.ts]
        M4[lib/tools/filesystem/read.ts]
    end
    
    subgraph "Large Project FSD"
        L1[app/orchestrator.ts]
        L2[agents/code-review/]
        L3[features/github/tools/]
        L4[entities/http/]
        L5[shared/lib/]
    end
    
    style S1 fill:#51cf66
    style S2 fill:#51cf66
    style S3 fill:#51cf66
    style M1 fill:#ffd43b
    style M2 fill:#ffd43b
    style M3 fill:#ffd43b
    style M4 fill:#ffd43b
    style L1 fill:#ff922b
    style L2 fill:#ff922b
    style L3 fill:#ff922b
    style L4 fill:#ff922b
    style L5 fill:#ff922b
```

## Feature Matrix

| Feature | Small | Medium | Large |
|---------|-------|--------|-------|
| **Tools** | < 10 | 10-30 | 30+ |
| **Agents** | 1-2 | 2-5 | 5+ |
| **Team Size** | 1 | 2-5 | 5+ |
| **Folder Structure** | Flat | Domain-based | FSD layers |
| **Namespace** | ❌ | ✅ | ✅ Required |
| **Import Rules** | ❌ | Optional | ✅ Enforced |
| **Path Aliases** | ❌ | ✅ | ✅ Required |
| **Testing** | Optional | ✅ | ✅ Required |
| **Documentation** | README | Docs folder | Architecture docs |
| **Monorepo** | ❌ | Optional | Consider |
| **Observability** | Console logs | Logger | Tracing + Metrics |
| **Error Handling** | Basic try-catch | Structured errors | Error hierarchy |

## Complexity vs Scalability

```mermaid
quadrantChart
    title Complexity vs Scalability
    x-axis Low Complexity --> High Complexity
    y-axis Low Scalability --> High Scalability
    quadrant-1 Over-engineered
    quadrant-2 Sweet Spot
    quadrant-3 Under-engineered
    quadrant-4 Technical Debt
    
    Small Project: [0.2, 0.3]
    Medium Project: [0.5, 0.6]
    Large FSD: [0.8, 0.9]
    Small with FSD: [0.7, 0.3]
    Large without FSD: [0.4, 0.5]
```

## Decision Tree

```mermaid
graph TD
    Start[Start New Project] --> Q1{< 10 tools?}
    Q1 -->|Yes| Small[Use Small Structure]
    Q1 -->|No| Q2{< 30 tools?}
    
    Q2 -->|Yes| Medium[Use Medium Structure]
    Q2 -->|No| Large[Use Large FSD Structure]
    
    Small --> Review1{Growing?}
    Review1 -->|Yes, 10+ tools| Migrate1[Migrate to Medium]
    Review1 -->|No| Stay1[Stay Small]
    
    Medium --> Review2{Growing?}
    Review2 -->|Yes, 30+ tools| Migrate2[Migrate to Large]
    Review2 -->|No| Stay2[Stay Medium]
    
    Large --> Review3{Still appropriate?}
    Review3 -->|Yes| Stay3[Maintain FSD]
    Review3 -->|Shrinking| Consider[Consider simplifying]
    
    style Small fill:#51cf66
    style Medium fill:#ffd43b
    style Large fill:#ff922b
    style Migrate1 fill:#339af0
    style Migrate2 fill:#339af0
```

## Organization Patterns

### Small Project Pattern

```typescript
lib/
├── agent.ts              // Single agent
└── tools/
    ├── github.ts         // All GitHub tools (3-4)
    ├── files.ts          // All file tools (2-3)
    └── index.ts          // Export all
```

### Medium Project Pattern

```typescript
lib/
├── agents/
│   ├── code-review.ts    // Specific agents
│   └── test-runner.ts
└── tools/
    ├── github/           // Domain folders
    │   ├── issues.ts     // Grouped by function
    │   ├── prs.ts
    │   └── index.ts      // Namespace export
    └── filesystem/
```

### Large Project Pattern (FSD)

```typescript
src/
├── app/                  // 🔴 Orchestration
├── agents/               // 🟠 High-level
├── features/             // 🟡 Domain tools
├── entities/             // 🟢 Primitives
└── shared/               // 🔵 Utilities
```

## Migration Path

```mermaid
graph LR
    A[Small<br/>Flat Structure] -->|Step 1<br/>Create domains| B[Medium<br/>Domain Folders]
    B -->|Step 2<br/>Add namespace| C[Medium+<br/>With Namespace]
    C -->|Step 3<br/>Split layers| D[Large<br/>FSD Layers]
    
    A -.->|Don't skip<br/>these steps| D
    
    style A fill:#51cf66
    style B fill:#ffd43b
    style C fill:#ffd43b
    style D fill:#ff922b
```

## When to Choose Each

### Choose Small When:
- ✅ Pet project / Learning
- ✅ MVP / POC
- ✅ Solo developer
- ✅ < 10 tools
- ✅ Single use case

### Choose Medium When:
- ✅ Startup product
- ✅ Internal tool
- ✅ Team 2-5 developers
- ✅ 10-30 tools
- ✅ Multiple use cases

### Choose Large (FSD) When:
- ✅ Production SaaS
- ✅ Enterprise application
- ✅ Team 5+ developers
- ✅ 30+ tools
- ✅ High maintainability needs
- ✅ Multiple products/services
