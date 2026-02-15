# Open-Source Giants: Анализ структуры tools

Анализ организации tools в крупнейших open-source AI проектах (126k+ stars).

## Обзор проектов

| Проект | Звезды | Термин | Организация | Репозиторий |
|--------|--------|--------|-------------|-------------|
| **LangChain** | 126k+ | tools | Category-based | [github.com/langchain-ai/langchain](https://github.com/langchain-ai/langchain) |
| **LlamaIndex** | 38k+ | tools | Provider-based | [github.com/run-llama/llama_index](https://github.com/run-llama/llama_index) |
| **Semantic Kernel** | 27k+ | plugins | Multi-language | [github.com/microsoft/semantic-kernel](https://github.com/microsoft/semantic-kernel) |
| **CrewAI** | 25k+ | tools | Task-based | [github.com/crewAIInc/crewAI](https://github.com/crewAIInc/crewAI) |
| **Haystack** | 18k+ | components | Function-based | [github.com/deepset-ai/haystack](https://github.com/deepset-ai/haystack) |

---

## 1. LangChain ⭐ 126,679 stars

**Репозиторий:** https://github.com/langchain-ai/langchain

### Структура

```
langchain/
├── libs/
│   ├── core/                    # Core abstractions
│   │   ├── langchain_core/
│   │   └── tools/
│   │
│   ├── langchain/               # Main package
│   │   └── tools/               # ⭐ ОСНОВНЫЕ TOOLS
│   │       ├── file_management/ # Category: file operations
│   │       │   ├── copy.py
│   │       │   ├── delete.py
│   │       │   ├── file_search.py
│   │       │   ├── list_dir.py
│   │       │   ├── move.py
│   │       │   ├── read.py
│   │       │   ├── write.py
│   │       │   └── __init__.py
│   │       ├── search/          # Search tools
│   │       ├── retriever/       # Retriever tools
│   │       └── __init__.py
│   │
│   ├── partners/                # Partner integrations
│   │   ├── openai/
│   │   ├── anthropic/
│   │   ├── google/
│   │   └── ...
│   │
│   └── langchain_community/     # Community contributions
│       └── tools/               # Deprecated tools moved here
│
└── README.md
```

### Ключевые решения

**1. Category-based organization**
```python
# tools/file_management/__init__.py
from langchain.tools.file_management.copy import CopyFileTool
from langchain.tools.file_management.delete import DeleteFileTool
from langchain.tools.file_management.file_search import FileSearchTool
from langchain.tools.file_management.list_dir import ListDirectoryTool
from langchain.tools.file_management.move import MoveFileTool
from langchain.tools.file_management.read import ReadFileTool
from langchain.tools.file_management.write import WriteFileTool

__all__ = [
    "CopyFileTool",
    "DeleteFileTool",
    "FileSearchTool",
    "ListDirectoryTool",
    "MoveFileTool",
    "ReadFileTool",
    "WriteFileTool",
]
```

**2. Deprecation strategy**
- Старые tools перемещаются в `langchain_community.tools`
- Backward compatibility с warnings
- Migration guides в документации

**3. Partner packages**
- Отдельные пакеты для интеграций (`langchain-openai`, `langchain-anthropic`)
- Независимое версионирование
- Чистое разделение ответственности

**4. Monorepo с pnpm/poetry**
- Единый репозиторий для всех пакетов
- Shared dependencies
- Unified CI/CD

### Что взять для своего проекта

✅ **Category-based folders** - группировка по типу задачи  
✅ **Deprecation path** - плавный переход при рефакторинге  
✅ **Monorepo structure** - для нескольких связанных пакетов  
✅ **Partner separation** - внешние интеграции отдельно

---

## 2. Semantic Kernel (Microsoft) ⭐ 27,220 stars

**Репозиторий:** https://github.com/microsoft/semantic-kernel

### Структура

```
semantic-kernel/
├── dotnet/                      # .NET implementation
│   └── src/
│       ├── Agents/
│       │   ├── Core/
│       │   └── Extensions/
│       ├── Connectors/          # LLM providers
│       │   ├── Connectors.OpenAI/
│       │   ├── Connectors.Anthropic/
│       │   └── ...
│       └── Plugins/             # ⭐ PLUGINS вместо TOOLS
│           ├── Core/
│           ├── MCP/
│           └── OpenApi/
│
├── python/                      # Python implementation
│   └── semantic_kernel/
│       ├── agents/
│       ├── connectors/
│       │   ├── ai/
│       │   │   ├── open_ai/
│       │   │   └── anthropic/
│       │   └── memory/
│       └── functions/           # ⭐ Functions = tools
│           ├── kernel_function.py
│           └── kernel_plugin.py
│
└── java/                        # Java implementation
    └── semantickernel-api/
```

### Ключевые решения

**1. Terminology: Plugins**

Вместо "tools" используют "plugins" - группировка связанных функций:

```python
# Python example
from semantic_kernel.functions import kernel_function

class MenuPlugin:
    @kernel_function(description="Provides a list of specials from the menu.")
    def get_specials(self) -> str:
        return """
        Special Soup: Clam Chowder
        Special Salad: Cobb Salad
        """
    
    @kernel_function(description="Provides the price of the requested menu item.")
    def get_item_price(self, menu_item: str) -> str:
        return "$9.99"
```

```csharp
// C# example
public class MenuPlugin
{
    [KernelFunction, Description("Provides a list of specials from the menu.")]
    public string GetSpecials() => 
        """
        Special Soup: Clam Chowder
        Special Salad: Cobb Salad
        """;
    
    [KernelFunction, Description("Provides the price of the requested menu item.")]
    public string GetItemPrice(
        [Description("The name of the menu item.")] string menuItem) => 
        "$9.99";
}
```

**2. Multi-language consistency**

Одинаковая структура для .NET, Python, Java:
- `Agents/` - agent framework
- `Connectors/` - LLM integrations
- `Functions/Plugins/` - tools

**3. Plugin sources**

Три способа создания plugins:
- **Native functions** - код на Python/.NET/Java
- **OpenAPI specifications** - из OpenAPI спеков
- **MCP (Model Context Protocol)** - из MCP серверов

**4. Enterprise patterns**

- Dependency injection support
- Structured logging
- Observability из коробки
- Production-ready patterns

### Что взять для своего проекта

✅ **Plugin terminology** - группировка функций по смыслу  
✅ **Multi-language** - если планируете несколько языков  
✅ **Connectors separation** - LLM интеграции отдельно  
✅ **MCP support** - стандартный протокол для tools

---

## 3. LlamaIndex ⭐ 38,000+ stars

**Репозиторий:** https://github.com/run-llama/llama_index

### Структура

```
llama_index/
├── llama-index-core/            # Core library
│   └── llama_index/
│       ├── core/
│       ├── agent/
│       └── tools/
│
├── llama-index-integrations/    # ⭐ ВСЕ ИНТЕГРАЦИИ
│   ├── tools/                   # Tools by provider
│   │   ├── llama-index-tools-google/
│   │   │   ├── examples/
│   │   │   │   └── advanced_tools_usage.ipynb
│   │   │   └── llama_index/
│   │   │       └── tools/
│   │   │           └── google/
│   │   │               ├── __init__.py
│   │   │               └── base.py
│   │   ├── llama-index-tools-azure/
│   │   ├── llama-index-tools-slack/
│   │   ├── llama-index-tools-wikipedia/
│   │   └── llama-index-tools-{provider}/
│   ├── llms/                    # LLM integrations
│   │   ├── llama-index-llms-openai/
│   │   └── llama-index-llms-anthropic/
│   └── readers/                 # Data readers
│
└── llama-datasets/              # Datasets
```

### Ключевые решения

**1. Provider-based naming**

Каждый tool = отдельный package с префиксом:
- `llama-index-tools-google`
- `llama-index-tools-azure`
- `llama-index-tools-slack`

**2. Отдельные пакеты**

Каждая интеграция - независимый npm/pip package:

```bash
# Install specific tool
pip install llama-index-tools-google
pip install llama-index-tools-slack
```

**3. Examples внутри**

Каждый tool package содержит:
- `examples/` - Jupyter notebooks с примерами
- `llama_index/tools/{provider}/` - реализация
- `README.md` - документация
- `pyproject.toml` - зависимости

**4. Integrations folder**

Всё, что интегрируется с внешним миром:
- `tools/` - инструменты
- `llms/` - языковые модели
- `readers/` - читалки данных
- `vector_stores/` - векторные БД

### Что взять для своего проекта

✅ **Provider-based naming** - `{project}-tools-{provider}`  
✅ **Separate packages** - каждый tool = пакет  
✅ **Examples included** - документация через примеры  
✅ **Integrations folder** - чистое разделение

---

## 4. CrewAI ⭐ 25,000+ stars

**Репозиторий:** https://github.com/crewAIInc/crewAI

### Структура

```
crewAI/
├── src/
│   └── crewai/
│       ├── agents/
│       ├── crews/
│       └── tools/
│           └── base_tool.py     # BaseTool abstract class
│
└── lib/
    └── crewai-tools/            # ⭐ ОТДЕЛЬНЫЙ ПАКЕТ ДЛЯ TOOLS
        ├── file_management/     # Category: file operations
        │   ├── file_read_tool.py
        │   ├── file_write_tool.py
        │   └── directory_read_tool.py
        │
        ├── web_scraping/        # Category: web
        │   ├── scrape_website_tool.py
        │   └── selenium_scraping_tool.py
        │
        ├── database/            # Category: databases
        │   ├── pg_search_tool.py
        │   └── mysql_search_tool.py
        │
        ├── vector_db/           # Category: vector databases
        │   ├── mongodb_vector_search_tool.py
        │   ├── qdrant_vector_search_tool.py
        │   └── weaviate_vector_search_tool.py
        │
        └── ai_tools/            # Category: AI-powered
            ├── dalle_tool.py
            ├── vision_tool.py
            └── stagehand_tool.py
```

### Ключевые решения

**1. Task-based categories**

Tools организованы по типу задачи:
- **File Management** - работа с файлами
- **Web Scraping** - парсинг веба
- **Database** - работа с БД
- **Vector DB** - векторные базы
- **AI Tools** - AI-powered инструменты

**2. BaseTool pattern**

```python
from crewai.tools import BaseTool

class MyCustomTool(BaseTool):
    name: str = "My Custom Tool"
    description: str = "Description of what this tool does"
    
    def _run(self, argument: str) -> str:
        # Implementation
        return "result"
```

**3. Decorator support**

```python
from crewai.tools import tool

@tool("Weather Tool")
def get_weather(city: str) -> str:
    """Get weather for a city."""
    return f"Weather in {city}: Sunny"
```

**4. Separate package**

`crewai-tools` - отдельный pip package:
```bash
pip install crewai-tools
```

### Что взять для своего проекта

✅ **Task categories** - группировка по типу задачи  
✅ **BaseTool pattern** - базовый класс для наследования  
✅ **Decorator option** - простой синтаксис для легких tools  
✅ **Separate tools package** - изоляция от core

---

## 5. Haystack (deepset) ⭐ 18,000+ stars

**Репозиторий:** https://github.com/deepset-ai/haystack

### Структура

```
haystack/
├── haystack/
│   ├── components/              # ⭐ "COMPONENTS" вместо "TOOLS"
│   │   ├── generators/          # Function: text generation
│   │   │   ├── hugging_face_local.py
│   │   │   ├── openai.py
│   │   │   └── chat/
│   │   ├── retrievers/          # Function: document retrieval
│   │   │   ├── in_memory/
│   │   │   └── sentence_window.py
│   │   ├── converters/          # Function: format conversion
│   │   │   ├── txt.py
│   │   │   └── pdf.py
│   │   ├── builders/            # Function: building structures
│   │   └── embedders/           # Function: embedding
│   │
│   └── dataclasses/
│
└── test/
```

**Отдельный репозиторий для интеграций:**

```
haystack-integrations/
└── integrations/
    ├── amazon_bedrock/
    ├── anthropic/
    ├── chroma/
    ├── elasticsearch/
    └── {provider}/
```

### Ключевые решения

**1. Components terminology**

Используют термин "components" для элементов pipeline:
- **Generators** - генерация текста
- **Retrievers** - поиск документов
- **Converters** - конвертация форматов
- **Embedders** - создание embeddings

**2. Function-based organization**

Группировка по функциональному назначению, а не по провайдеру:

```python
# generators/ содержит генераторы от разных провайдеров
from haystack.components.generators import OpenAIGenerator
from haystack.components.generators import HuggingFaceLocalGenerator

# retrievers/ содержит retrievers разных типов
from haystack.components.retrievers import InMemoryRetriever
from haystack.components.retrievers import SentenceWindowRetriever
```

**3. Pipeline-oriented**

Components созданы для построения pipelines:

```python
from haystack import Pipeline
from haystack.components.generators import OpenAIGenerator
from haystack.components.retrievers import InMemoryRetriever

pipeline = Pipeline()
pipeline.add_component("retriever", InMemoryRetriever())
pipeline.add_component("generator", OpenAIGenerator())
pipeline.connect("retriever", "generator")
```

**4. Separate integrations repository**

Внешние интеграции в отдельном repo:
- Community-maintained
- Independent versioning
- Easier contribution

### Что взять для своего проекта

✅ **Components terminology** - если строите pipelines  
✅ **Function-based** - группировка по назначению  
✅ **Separate integrations** - изоляция внешних зависимостей  
✅ **Pipeline architecture** - composable components

---

## Сравнительная матрица

### По терминологии

| Проект | Термин | Почему такой выбор |
|--------|--------|-------------------|
| LangChain | **tools** | Стандартный термин для LLM function calling |
| Semantic Kernel | **plugins** | Группировка связанных функций, enterprise focus |
| LlamaIndex | **tools** | Следует индустриальному стандарту |
| CrewAI | **tools** | Простота и понятность |
| Haystack | **components** | Pipeline-oriented architecture |

### По организации

| Проект | Принцип организации | Пример |
|--------|---------------------|--------|
| LangChain | **Category-based** | `tools/file_management/`, `tools/search/` |
| Semantic Kernel | **Language-based** | `dotnet/`, `python/`, `java/` |
| LlamaIndex | **Provider-based** | `tools-google/`, `tools-azure/` |
| CrewAI | **Task-based** | `file_management/`, `web_scraping/` |
| Haystack | **Function-based** | `generators/`, `retrievers/` |

### По масштабируемости

| Проект | Паттерн | Масштаб |
|--------|---------|---------|
| LangChain | Monorepo + community | 100+ tools |
| Semantic Kernel | Multi-language monorepo | 50+ plugins |
| LlamaIndex | Separate packages | 30+ integrations |
| CrewAI | Separate tools package | 20+ tools |
| Haystack | Core + integrations repo | 40+ components |

---

## Общие паттерны

### 1. Монорепо доминирует ✅

**Все крупные проекты используют монорепо:**

- ✅ Easier dependency management
- ✅ Shared CI/CD
- ✅ Atomic commits across packages
- ✅ Unified versioning strategy

### 2. Категоризация обязательна ✅

**Три основных подхода:**

**A. По типу данных** (CrewAI, LangChain)
```
tools/
├── file_management/
├── web_scraping/
└── database/
```

**B. По функции** (Haystack)
```
components/
├── generators/
├── retrievers/
└── converters/
```

**C. По провайдеру** (LlamaIndex)
```
integrations/tools/
├── tools-google/
├── tools-azure/
└── tools-slack/
```

### 3. Integrations отдельно ✅

**Внешние интеграции изолируются:**

- `partners/` - LangChain
- `integrations/` - LlamaIndex, Haystack
- `connectors/` - Semantic Kernel

**Преимущества:**
- Independent versioning
- Optional dependencies
- Easier contributions
- Clear boundaries

### 4. Naming conventions ✅

**Устоявшиеся паттерны:**

```typescript
// Provider-based (LlamaIndex)
{project}-tools-{provider}
llama-index-tools-google
llama-index-tools-azure

// Category-based (LangChain)
{category}/{tool_name}
file_management/read_file
search/tavily_search

// Namespace (рекомендуется для 20+)
{domain}:{action}
github:create_issue
files:read
```

### 5. Deprecation strategy ✅

**Плавный переход при рефакторинге:**

```python
# LangChain example
from langchain.tools.file_management import ReadFileTool  # deprecated

# New way
from langchain_community.tools.file_management import ReadFileTool

# With deprecation warning
import warnings
warnings.warn(
    "Importing from langchain.tools is deprecated. "
    "Use langchain_community.tools instead.",
    DeprecationWarning
)
```

### 6. BaseTool pattern ✅

**Все используют базовый класс:**

```typescript
// CrewAI-style
abstract class BaseTool {
  abstract name: string;
  abstract description: string;
  abstract execute(args: unknown): Promise<unknown>;
}

// Your tool
class GitHubTool extends BaseTool {
  name = 'github_create_issue';
  description = 'Create GitHub issue';
  
  async execute({ repo, title }: Args) {
    // implementation
  }
}
```

---

## Lessons Learned

### Для маленьких проектов (< 10 tools)

```typescript
lib/tools/
├── github.ts      // All GitHub tools
├── files.ts       // All file tools
└── index.ts
```

**Вдохновение:** Early LangChain, CrewAI декораторы

### Для средних проектов (10-30 tools)

```typescript
lib/tools/
├── github/        // Category folder (LangChain style)
│   ├── issues.ts
│   ├── prs.ts
│   └── index.ts
├── filesystem/    // CrewAI task-based
└── database/
```

**Вдохновение:** LangChain categories, CrewAI tasks

### Для крупных проектов (30+ tools)

```typescript
packages/          // LlamaIndex integrations style
├── core/
├── tools-github/  // Separate package
│   ├── src/
│   ├── examples/
│   └── package.json
├── tools-slack/
└── community/     // LangChain community style
```

**Вдохновение:** LlamaIndex packages, LangChain monorepo

### Enterprise проекты

```typescript
src/
├── dotnet/        // Semantic Kernel multi-language
├── python/
├── typescript/
└── shared/
    ├── connectors/    // SK connectors
    ├── plugins/       // SK plugins
    └── agents/
```

**Вдохновение:** Semantic Kernel enterprise patterns

---

## Best Practices от гигантов

### 1. Start Simple, Scale Gradually

**LangChain path:**
```
v0.1: Flat tools/ folder
  ↓
v0.2: Category folders (file_management/, search/)
  ↓
v1.0: Community package + partners
  ↓
v2.0: Full monorepo with integrations
```

### 2. Naming Consistency

**Все придерживаются правил:**
- ✅ `snake_case` для файлов (Python)
- ✅ `PascalCase` для классов
- ✅ Descriptive names (`ReadFileTool`, не `RFT`)
- ✅ Namespace prefixes (`github:`, `files:`)

### 3. Documentation in Code

**Semantic Kernel pattern:**
```python
@kernel_function(
    description="Get weather for a city",  # For LLM
    name="get_weather"                      # Function name
)
def get_weather(
    city: Annotated[str, "City name"]      # Parameter description
) -> Annotated[str, "Weather data"]:       # Return description
    """Get current weather."""              # Python docstring
    pass
```

### 4. Examples are Essential

**LlamaIndex pattern:**
```
llama-index-tools-google/
├── examples/
│   ├── basic_usage.ipynb
│   ├── advanced_usage.ipynb
│   └── README.md
└── llama_index/
```

### 5. Independent Versioning

**Separate packages = independent versions:**
```json
{
  "dependencies": {
    "@langchain/core": "^0.3.0",
    "@langchain/openai": "^0.2.0",      // different version
    "@langchain/anthropic": "^0.1.0"    // different version
  }
}
```

---

## Рекомендации

### Выбор терминологии

- **tools** - если следуете LLM function calling стандартам
- **plugins** - если группируете связанные функции (enterprise)
- **components** - если строите pipelines

### Выбор организации

**< 10 tools:** Flat или category folders  
**10-30 tools:** Category-based (LangChain style)  
**30+ tools:** Provider-based packages (LlamaIndex style)  
**Enterprise:** Multi-language monorepo (Semantic Kernel style)

### Migration Path

```mermaid
graph LR
    A[Flat Structure] --> B[Categories]
    B --> C[Namespaces]
    C --> D[Packages]
    D --> E[Monorepo]
```

---

## Заключение

**Главные выводы:**

1. ✅ **Нет единого стандарта** - выбирайте под свои нужды
2. ✅ **Категоризация критична** - по функции, типу или провайдеру
3. ✅ **Монорепо для масштаба** - все гиганты используют
4. ✅ **Integrations изолированы** - чистое разделение
5. ✅ **Примеры обязательны** - документация через код

**Начинайте с простого** (category folders), растите постепенно (packages, monorepo) по мере необходимости!

## Дополнительные ресурсы

- [LangChain Repository](https://github.com/langchain-ai/langchain)
- [Semantic Kernel](https://github.com/microsoft/semantic-kernel)
- [LlamaIndex](https://github.com/run-llama/llama_index)
- [CrewAI](https://github.com/crewAIInc/crewAI)
- [Haystack](https://github.com/deepset-ai/haystack)
