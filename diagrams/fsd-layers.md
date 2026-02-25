# FSD Layers Visualization

> Предлагаемая адаптация FSD для AI. Не используется в Mastra, LangChain и др. — см. [03-fsd-adaptation.md](../docs/03-fsd-adaptation.md).

## Layer Architecture

```mermaid
graph TD
    A[🔴 app<br/>Orchestration] --> B[🟠 agents<br/>High-level agents]
    B --> C[🟡 features<br/>Domain tools]
    C --> D[🟢 entities<br/>Primitives]
    D --> E[🔵 shared<br/>Utilities]
    
    style A fill:#ff6b6b
    style B fill:#ff922b
    style C fill:#ffd43b
    style D fill:#51cf66
    style E fill:#339af0
```

## Import Dependencies

```mermaid
graph LR
    app[app Layer] --> |can import| agents
    app --> |can import| features
    app --> |can import| entities
    app --> |can import| shared
    
    agents[agents Layer] --> |can import| features
    agents --> |can import| entities
    agents --> |can import| shared
    
    features[features Layer] --> |can import| entities
    features --> |can import| shared
    
    entities[entities Layer] --> |can import| shared
    
    shared[shared Layer] --> |cannot import| anyone
    
    style app fill:#ff6b6b
    style agents fill:#ff922b
    style features fill:#ffd43b
    style entities fill:#51cf66
    style shared fill:#339af0
```

## Detailed Structure

```mermaid
graph TD
    subgraph "🔴 app - Application Layer"
        A1[orchestrator.ts]
        A2[router.ts]
        A3[config.ts]
    end
    
    subgraph "🟠 agents - High-level Agents"
        B1[code-review/]
        B2[deployment/]
        B3[test-runner/]
    end
    
    subgraph "🟡 features - Domain Tools"
        C1[github/tools/]
        C2[filesystem/tools/]
        C3[database/tools/]
    end
    
    subgraph "🟢 entities - Primitives"
        D1[http/]
        D2[llm/providers/]
        D3[memory/]
    end
    
    subgraph "🔵 shared - Utilities"
        E1[lib/logger.ts]
        E2[lib/errors.ts]
        E3[types/]
    end
    
    A1 --> B1
    A1 --> B2
    B1 --> C1
    B1 --> C2
    B2 --> C3
    C1 --> D1
    C2 --> D1
    D1 --> E1
    D1 --> E2
    
    style A1 fill:#ff6b6b
    style A2 fill:#ff6b6b
    style A3 fill:#ff6b6b
    style B1 fill:#ff922b
    style B2 fill:#ff922b
    style B3 fill:#ff922b
    style C1 fill:#ffd43b
    style C2 fill:#ffd43b
    style C3 fill:#ffd43b
    style D1 fill:#51cf66
    style D2 fill:#51cf66
    style D3 fill:#51cf66
    style E1 fill:#339af0
    style E2 fill:#339af0
    style E3 fill:#339af0
```

## Data Flow Example

```mermaid
sequenceDiagram
    participant User
    participant App as 🔴 app/orchestrator
    participant Agent as 🟠 agents/code-review
    participant Tool as 🟡 features/github/tools
    participant HTTP as 🟢 entities/http
    participant Logger as 🔵 shared/logger
    
    User->>App: Request code review
    App->>Logger: Log task start
    App->>Agent: Execute review
    Agent->>Tool: github:get_pr
    Tool->>HTTP: Fetch PR data
    HTTP->>Logger: Log HTTP request
    HTTP-->>Tool: PR data
    Tool-->>Agent: Tool result
    Agent->>Tool: github:create_comment
    Tool->>HTTP: Post comment
    HTTP-->>Tool: Comment created
    Tool-->>Agent: Comment result
    Agent-->>App: Review completed
    App->>Logger: Log task complete
    App-->>User: Return result
```

## Layer Responsibilities

| Layer | Responsibility | Can Import | Examples |
|-------|---------------|-----------|----------|
| 🔴 **app** | Orchestration, routing | All layers | orchestrator, config |
| 🟠 **agents** | High-level task execution | features, entities, shared | code-review, deployment |
| 🟡 **features** | Domain-specific tools | entities, shared | github/tools, database/tools |
| 🟢 **entities** | Low-level primitives | shared | http, llm, memory |
| 🔵 **shared** | Utilities | None | logger, errors, types |
