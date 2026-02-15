# Open-Source Giants Comparison

## Project Overview

```mermaid
graph TD
    subgraph "126k+ ⭐ LangChain"
        LC1[tools/]
        LC2[file_management/]
        LC3[search/]
        LC4[partners/]
        LC5[community/]
    end
    
    subgraph "27k+ ⭐ Semantic Kernel"
        SK1[dotnet/plugins/]
        SK2[python/functions/]
        SK3[java/plugins/]
        SK4[connectors/]
    end
    
    subgraph "38k+ ⭐ LlamaIndex"
        LI1[integrations/tools/]
        LI2[tools-google/]
        LI3[tools-azure/]
        LI4[tools-slack/]
    end
    
    style LC1 fill:#ffd43b
    style SK1 fill:#51cf66
    style LI1 fill:#339af0
```

## Organization Patterns

```mermaid
mindmap
  root((Organization))
    Category-Based
      LangChain
        file_management/
        search/
        retriever/
      CrewAI
        file_management/
        web_scraping/
        database/
    Provider-Based
      LlamaIndex
        tools-google/
        tools-azure/
        tools-slack/
    Function-Based
      Haystack
        generators/
        retrievers/
        converters/
    Language-Based
      Semantic Kernel
        dotnet/
        python/
        java/
```

## Terminology Comparison

```mermaid
graph LR
    A[LangChain] --> T1[tools]
    B[Semantic Kernel] --> T2[plugins]
    C[LlamaIndex] --> T3[tools]
    D[CrewAI] --> T4[tools]
    E[Haystack] --> T5[components]
    
    T1 --> Purpose1[LLM function calling]
    T2 --> Purpose2[Grouped functions]
    T3 --> Purpose3[Provider integrations]
    T4 --> Purpose4[Task execution]
    T5 --> Purpose5[Pipeline building]
    
    style T1 fill:#ffd43b
    style T2 fill:#51cf66
    style T3 fill:#339af0
    style T4 fill:#ff922b
    style T5 fill:#ff6b6b
```

## Monorepo Patterns

```mermaid
graph TD
    A[Root Repository] --> B[libs/]
    A --> C[packages/]
    A --> D[integrations/]
    
    B --> B1[core/]
    B --> B2[langchain/]
    B --> B3[partners/]
    
    C --> C1[tools-provider-1/]
    C --> C2[tools-provider-2/]
    
    D --> D1[external-1/]
    D --> D2[external-2/]
    
    style A fill:#ff6b6b
    style B fill:#ffd43b
    style C fill:#51cf66
    style D fill:#339af0
```

## Scalability Path

```mermaid
graph LR
    S1[Small<br/>Flat Structure] --> S2[Medium<br/>Categories]
    S2 --> S3[Large<br/>Packages]
    S3 --> S4[Enterprise<br/>Monorepo]
    
    S1 -.->|10 tools| S2
    S2 -.->|30 tools| S3
    S3 -.->|50+ tools| S4
    
    style S1 fill:#51cf66
    style S2 fill:#ffd43b
    style S3 fill:#ff922b
    style S4 fill:#ff6b6b
```

## Integration Strategies

```mermaid
quadrantChart
    title Integration Organization
    x-axis Tight Coupling --> Loose Coupling
    y-axis Low Maintenance --> High Maintenance
    quadrant-1 Over-isolated
    quadrant-2 Well-balanced
    quadrant-3 Monolithic
    quadrant-4 Fragmented
    
    LangChain Partners: [0.7, 0.3]
    Semantic Kernel Connectors: [0.5, 0.5]
    LlamaIndex Packages: [0.8, 0.4]
    Haystack Integrations: [0.6, 0.3]
    CrewAI Community: [0.4, 0.6]
```

## Naming Conventions

```mermaid
graph TD
    A[Naming Pattern] --> B[Provider-based]
    A --> C[Category-based]
    A --> D[Namespace]
    
    B --> B1["project-tools-provider<br/>llama-index-tools-google"]
    C --> C1["category/tool<br/>file_management/read"]
    D --> D1["domain:action<br/>github:create_issue"]
    
    style A fill:#ff6b6b
    style B fill:#ffd43b
    style C fill:#51cf66
    style D fill:#339af0
```

## Common Features Matrix

| Feature | LangChain | Semantic Kernel | LlamaIndex | CrewAI | Haystack |
|---------|-----------|-----------------|------------|--------|----------|
| **Monorepo** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Categories** | ✅ | ❌ | ❌ | ✅ | ✅ |
| **Providers** | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Separate Integrations** | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Multi-language** | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Deprecation Strategy** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Examples Included** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **BaseTool Pattern** | ✅ | ✅ | ✅ | ✅ | ✅ |

## Evolution Timeline

```mermaid
timeline
    title Tool Organization Evolution
    2023 Early : Flat structure
           : All tools in one folder
    2023 Mid : Category folders
           : Group by function
    2023 Late : Separate packages
           : Provider-based separation
    2024 Early : Monorepo
           : Unified management
    2024 Mid : Multi-language
           : Cross-platform support
    2024 Late : MCP Integration
           : Standard protocol
    2025 : Enterprise patterns
         : Production-ready
```

## Decision Tree

```mermaid
graph TD
    Start[Choose Organization] --> Q1{Multi-language?}
    Q1 -->|Yes| SK[Semantic Kernel Style<br/>Language folders]
    Q1 -->|No| Q2{Many providers?}
    
    Q2 -->|Yes| LI[LlamaIndex Style<br/>Provider packages]
    Q2 -->|No| Q3{Pipeline focused?}
    
    Q3 -->|Yes| HS[Haystack Style<br/>Function components]
    Q3 -->|No| Q4{Task-oriented?}
    
    Q4 -->|Yes| CA[CrewAI Style<br/>Task categories]
    Q4 -->|No| LC[LangChain Style<br/>Category folders]
    
    style SK fill:#51cf66
    style LI fill:#339af0
    style HS fill:#ff6b6b
    style CA fill:#ff922b
    style LC fill:#ffd43b
```

## Migration Paths

```mermaid
sankey-beta

LangChain Flat, Categories, 100
Categories, Packages, 80
Packages, Monorepo, 60

LlamaIndex Flat, Integrations, 90
Integrations, Packages, 85

Semantic Kernel Plugins, Multi-lang, 70
Multi-lang, Enterprise, 65

CrewAI Flat, Tasks, 75
Tasks, Separate Package, 70

Haystack Components, Functions, 80
Functions, Integrations Repo, 75
```

## Key Takeaways

### Pattern Distribution

```mermaid
pie title Organization Patterns Used
    "Category-based" : 40
    "Provider-based" : 25
    "Function-based" : 20
    "Language-based" : 10
    "Mixed" : 5
```

### Terminology Usage

```mermaid
pie title Tool Terminology
    "tools" : 60
    "plugins" : 20
    "components" : 15
    "functions" : 5
```

### Integration Approach

```mermaid
pie title Integration Strategy
    "Monorepo" : 50
    "Separate Packages" : 30
    "Hybrid" : 20
```
