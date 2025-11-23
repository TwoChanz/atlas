# CLAUDE.md — Atlas Project Guide for AI Assistants

**Last Updated:** 2025-11-23
**Project Stage:** Early Stage - Documentation & Planning Phase
**Repository:** Atlas - Personal Tool Intelligence System

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Current State](#current-state)
3. [Architecture & Structure](#architecture--structure)
4. [Tech Stack](#tech-stack)
5. [Data Models & Core Concepts](#data-models--core-concepts)
6. [Development Workflows](#development-workflows)
7. [Code Conventions](#code-conventions)
8. [File Organization](#file-organization)
9. [Testing Strategy](#testing-strategy)
10. [Git Workflow](#git-workflow)
11. [AI Assistant Guidelines](#ai-assistant-guidelines)
12. [Common Tasks & Patterns](#common-tasks--patterns)

---

## Project Overview

**Atlas** is a personal knowledge engine for organizing **tools**, **websites**, **workflows**, and **goals**, powered by an **AI-driven mindmap** with dynamic clustering.

### Purpose

- Single source of truth for tools & workflows
- Dynamic, intelligent mindmap that reorganizes based on activity, filters, and insights
- Track real usage to surface high-leverage tools
- Enable rapid tool capture from browser
- Suggest monetizable workflows and identify redundancies

### Key Components

1. **Web App** - Main React application with mindmap visualization
2. **Chrome Extension** - MV3 side panel for instant tool capture
3. **AI Insight Engine** - Generates recommendations, detects overlaps, identifies patterns
4. **Local-First Storage** - IndexedDB + Chrome Storage Sync
5. **Graph Visualization** - Cytoscape.js-based dynamic mindmap

---

## Current State

**IMPORTANT:** This project is in the **early documentation phase**. As of now, only the following files exist:

- `README.md` - Project overview, setup instructions, planned structure
- `PRD.md` - Detailed Product Requirements Document (v1.2)
- `LICENSE` - MIT License
- `.git/` - Git repository

**No code has been implemented yet.** All implementation details in this document are based on the planned architecture.

### What Needs to Be Built

- [ ] Monorepo structure (`apps/` and `packages/`)
- [ ] Web application (`apps/web`)
- [ ] Chrome extension (`apps/extension`)
- [ ] Shared packages (`packages/core`, `packages/insights`, `packages/storage`)
- [ ] Build tooling and configuration
- [ ] Testing infrastructure
- [ ] CI/CD pipeline

---

## Architecture & Structure

The project follows a **monorepo** pattern with clearly separated concerns.

### Planned Directory Structure

```
atlas/
│
├── apps/
│   ├── web/                          # Main React web app
│   │   ├── src/
│   │   │   ├── components/           # Reusable UI components
│   │   │   │   ├── common/           # Buttons, inputs, etc.
│   │   │   │   ├── layout/           # Layout components
│   │   │   │   └── domain/           # Feature-specific components
│   │   │   ├── pages/                # Page components
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── ToolDetail.tsx
│   │   │   │   └── WorkflowBuilder.tsx
│   │   │   ├── mindmap/              # Cytoscape.js integration
│   │   │   │   ├── MindmapView.tsx
│   │   │   │   ├── clustering/       # Clustering algorithms
│   │   │   │   ├── layout/           # Graph layout logic
│   │   │   │   └── styles/           # Node/edge styles
│   │   │   ├── storage/              # Storage adapters
│   │   │   │   ├── indexeddb.ts
│   │   │   │   └── sync.ts
│   │   │   ├── insights/             # AI insight generation
│   │   │   │   ├── clustering.ts
│   │   │   │   ├── redundancy.ts
│   │   │   │   └── recommendations.ts
│   │   │   ├── workflows/            # Workflow management
│   │   │   │   ├── WorkflowEditor.tsx
│   │   │   │   └── WorkflowSuggestions.tsx
│   │   │   ├── goals/                # Goal management
│   │   │   │   ├── GoalEditor.tsx
│   │   │   │   └── GoalAlignment.tsx
│   │   │   ├── store/                # State management (Zustand/Recoil)
│   │   │   │   ├── toolsStore.ts
│   │   │   │   ├── workflowsStore.ts
│   │   │   │   ├── goalsStore.ts
│   │   │   │   └── mindmapStore.ts
│   │   │   ├── hooks/                # Custom React hooks
│   │   │   ├── utils/                # Utility functions
│   │   │   └── types/                # TypeScript types
│   │   ├── public/
│   │   │   └── index.html
│   │   ├── vite.config.ts            # Vite configuration
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── extension/                    # Chrome MV3 extension
│       ├── src/
│       │   ├── sidepanel/            # Side panel UI
│       │   │   ├── SidePanel.tsx
│       │   │   └── styles/
│       │   ├── background/           # Service worker
│       │   │   └── background.ts
│       │   ├── content/              # Content scripts
│       │   │   └── content.ts
│       │   ├── capture/              # Tool capture logic
│       │   │   ├── metadata.ts       # Extract page metadata
│       │   │   └── tagging.ts        # AI tag suggestions
│       │   └── shared/               # Shared utilities
│       ├── public/
│       │   ├── manifest.json         # MV3 manifest
│       │   └── icons/
│       ├── vite.config.ts
│       └── package.json
│
├── packages/
│   ├── core/                         # Shared types + data models
│   │   ├── src/
│   │   │   ├── models/
│   │   │   │   ├── Tool.ts
│   │   │   │   ├── Workflow.ts
│   │   │   │   ├── Goal.ts
│   │   │   │   └── InsightEdge.ts
│   │   │   ├── types/
│   │   │   │   ├── index.ts
│   │   │   │   └── clustering.ts
│   │   │   └── constants/
│   │   │       └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── insights/                     # AI Insight Engine
│   │   ├── src/
│   │   │   ├── clustering/
│   │   │   │   ├── tagClustering.ts
│   │   │   │   ├── workflowClustering.ts
│   │   │   │   ├── usageClustering.ts
│   │   │   │   ├── redundancyClustering.ts
│   │   │   │   ├── goalClustering.ts
│   │   │   │   ├── monetizationClustering.ts
│   │   │   │   └── filterDrivenClustering.ts
│   │   │   ├── analysis/
│   │   │   │   ├── similarityAnalysis.ts
│   │   │   │   ├── redundancyDetection.ts
│   │   │   │   └── leverageAnalysis.ts
│   │   │   ├── recommendations/
│   │   │   │   ├── workflowSuggestions.ts
│   │   │   │   ├── toolSuggestions.ts
│   │   │   │   └── monetizationSuggestions.ts
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── storage/                      # IndexedDB and sync logic
│       ├── src/
│       │   ├── indexeddb/
│       │   │   ├── schema.ts
│       │   │   ├── operations.ts
│       │   │   └── migrations.ts
│       │   ├── sync/
│       │   │   ├── chromeSyncAdapter.ts
│       │   │   └── conflictResolution.ts
│       │   ├── cache/
│       │   │   └── cacheStrategy.ts
│       │   └── index.ts
│       ├── tsconfig.json
│       └── package.json
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── docs/                             # Additional documentation
│   ├── architecture.md
│   ├── api.md
│   └── deployment.md
│
├── scripts/                          # Build and utility scripts
│   ├── build.sh
│   └── setup.sh
│
├── README.md
├── PRD.md
├── CLAUDE.md                         # This file
├── LICENSE
├── .gitignore
├── package.json                      # Root package.json for monorepo
├── pnpm-workspace.yaml              # pnpm workspace configuration
└── tsconfig.base.json               # Base TypeScript config
```

---

## Tech Stack

### Frontend

- **Framework:** React 18+
- **Language:** TypeScript 5+
- **Build Tool:** Vite (preferred) or Next.js
- **State Management:** Zustand (recommended) or Recoil
- **Styling:** Tailwind CSS (preferred) or standard CSS modules
- **UI Components:** Build custom or use Radix UI/shadcn for accessibility

### Graph Visualization

- **Library:** Cytoscape.js
- **Layout Algorithms:**
  - Force-directed (CoSE)
  - Hierarchical (Dagre)
  - Custom clustering layouts

### Storage

- **Local Database:** IndexedDB (using idb wrapper)
- **Browser Sync:** Chrome Storage Sync API
- **Caching:** Service Worker cache for offline support

### Browser Extension

- **Manifest:** Chrome Manifest V3
- **Side Panel API:** Chrome Side Panel API
- **Content Scripts:** For metadata extraction
- **Background:** Service Worker

### Development Tools

- **Package Manager:** pnpm (recommended) or npm/yarn
- **Linting:** ESLint with TypeScript support
- **Formatting:** Prettier
- **Testing:** Vitest (unit), Playwright (e2e)
- **Type Checking:** TypeScript strict mode

### Optional AI

- **Local LLM:** Ollama, LM Studio, or similar
- **Remote API:** OpenAI, Anthropic Claude, or custom endpoints
- **Embeddings:** For similarity analysis

---

## Data Models & Core Concepts

### Tool

The fundamental unit representing any tool, website, app, or resource.

```typescript
interface Tool {
  id: string;
  name: string;
  url?: string;
  type?: ToolType; // 'App' | 'Site' | 'Blog' | 'API' | 'Marketplace' | 'Service'
  tags: string[];
  notes?: string;
  createdAt: number;
  updatedAt: number;
  usage?: UsageData;
  aiAttributes?: AIAttributes;
  metadata?: ToolMetadata;
}

interface UsageData {
  visitCount: number;
  lastVisited: number;
  firstVisited: number;
  averageSessionTime?: number;
}

interface AIAttributes {
  workflows: number; // Count of workflows using this tool
  similarityScore?: number;
  categoryDensity?: number;
  monetizationPotential?: number; // 0-1 score
  leverageScore?: number; // High-leverage tools appear across many contexts
}

interface ToolMetadata {
  favicon?: string;
  description?: string;
  screenshot?: string;
  ogImage?: string;
}
```

### Workflow

A sequence of tools used together to accomplish a goal.

```typescript
interface Workflow {
  id: string;
  name: string;
  description?: string;
  steps: string[]; // Array of tool IDs in sequence
  tags: string[];
  notes?: string;
  createdAt: number;
  updatedAt: number;
  category?: string;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'occasional';
}
```

### Goal

High-level objectives that tools and workflows support.

```typescript
interface Goal {
  id: string;
  name: string;
  description: string;
  relatedTools: string[]; // Tool IDs
  relatedWorkflows: string[]; // Workflow IDs
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'completed' | 'archived';
  targetDate?: number;
  createdAt: number;
  updatedAt: number;
  tags?: string[];
}
```

### InsightEdge

AI-generated relationships between tools for graph visualization.

```typescript
interface InsightEdge {
  id: string;
  source: string; // Tool ID
  target: string; // Tool ID
  weight: number; // 0-1, affects visual thickness and clustering
  type: EdgeType;
  metadata?: EdgeMetadata;
}

type EdgeType =
  | 'similarity'    // Tools are similar (AI-detected)
  | 'usage'         // Often used together
  | 'workflow'      // Part of same workflow
  | 'goal'          // Support same goal
  | 'redundancy'    // Overlapping functionality
  | 'filter'        // Relationship based on filter context
  | 'tag';          // Share tags

interface EdgeMetadata {
  strength?: number;
  reason?: string;
  lastUpdated?: number;
}
```

### Cluster

Groups of related tools in the mindmap.

```typescript
interface Cluster {
  id: string;
  name: string;
  type: ClusterType;
  toolIds: string[];
  centroid?: { x: number; y: number };
  color?: string;
  size?: number;
}

type ClusterType =
  | 'tag'           // Grouped by shared tags
  | 'workflow'      // Tools in same workflows
  | 'usage'         // Frequently used together
  | 'redundancy'    // Overlapping tools
  | 'goal'          // Support same goal
  | 'monetization'  // Revenue-generating tools
  | 'leverage'      // High-leverage/keystone tools
  | 'filter';       // Filter-driven dynamic cluster
```

### Filter State

Current active filters affecting the mindmap view.

```typescript
interface FilterState {
  tags?: string[];
  types?: ToolType[];
  goals?: string[];
  workflows?: string[];
  usageRecency?: 'week' | 'month' | 'quarter'; // 7/30/90 days
  monetizationOnly?: boolean;
  searchQuery?: string;
}
```

### Cluster Mode

How the mindmap should organize tools.

```typescript
type ClusterMode =
  | 'auto'          // AI decides based on all factors
  | 'filter-driven' // Organize based on active filters
  | 'tag-only'      // Simple tag-based clustering
  | 'goal-focused'; // Organize around goals
```

---

## Development Workflows

### Initial Setup (When Starting Development)

1. **Set up monorepo structure**
   ```bash
   mkdir -p apps/web apps/extension packages/core packages/insights packages/storage
   ```

2. **Initialize package.json files**
   - Root: Workspace configuration
   - Each app/package: Specific dependencies

3. **Configure pnpm workspace**
   ```yaml
   # pnpm-workspace.yaml
   packages:
     - 'apps/*'
     - 'packages/*'
   ```

4. **Set up TypeScript**
   - Base config at root
   - Extended configs in each package

5. **Configure build tools**
   - Vite for web app
   - Vite for extension
   - tsc for packages

### Development Mode

```bash
# Install all dependencies
pnpm install

# Run web app in dev mode
pnpm --filter web dev

# Run extension in watch mode
pnpm --filter extension dev

# Run all packages in watch mode
pnpm --filter @atlas/core dev
pnpm --filter @atlas/insights dev
pnpm --filter @atlas/storage dev
```

### Building

```bash
# Build everything
pnpm build

# Build specific package
pnpm --filter web build
pnpm --filter extension build

# Build in production mode
NODE_ENV=production pnpm build
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests for specific package
pnpm --filter web test

# Run e2e tests
pnpm test:e2e

# Generate coverage
pnpm test:coverage
```

### Linting & Formatting

```bash
# Lint all code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Type check
pnpm typecheck
```

---

## Code Conventions

### TypeScript

- **Strict mode enabled** - Use `strict: true` in tsconfig
- **Explicit types** - Prefer explicit return types for functions
- **No any** - Avoid `any`, use `unknown` if needed
- **Interface over Type** - Use `interface` for object shapes, `type` for unions/intersections
- **Const assertions** - Use `as const` for literal types

```typescript
// Good
interface ToolProps {
  tool: Tool;
  onUpdate: (tool: Tool) => void;
}

function formatToolName(tool: Tool): string {
  return tool.name.trim();
}

const CLUSTER_COLORS = {
  tag: '#3B82F6',
  workflow: '#10B981',
  goal: '#8B5CF6',
} as const;

// Avoid
function formatToolName(tool) { // Missing types
  return tool.name.trim();
}

const data: any = getTool(); // Avoid any
```

### Naming Conventions

- **Files:** PascalCase for components (`ToolCard.tsx`), camelCase for utilities (`formatDate.ts`)
- **Components:** PascalCase (`ToolDetail`, `MindmapView`)
- **Functions:** camelCase (`calculateSimilarity`, `fetchTools`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_NODES`, `DEFAULT_CLUSTER_MODE`)
- **Interfaces/Types:** PascalCase (`Tool`, `InsightEdge`)
- **Enums:** PascalCase for enum, UPPER_SNAKE_CASE for values

```typescript
// Component files
ToolCard.tsx
MindmapView.tsx

// Utility files
clustering.ts
formatters.ts

// Constants
export const MAX_VISIBLE_NODES = 1000;
export const DEFAULT_EDGE_WEIGHT = 0.5;

// Enums
enum ClusterType {
  TAG = 'tag',
  WORKFLOW = 'workflow',
  GOAL = 'goal',
}
```

### Component Structure

```typescript
// imports at top
import { useState, useEffect } from 'react';
import { Tool } from '@atlas/core';
import { formatDate } from '../utils/formatters';

// types/interfaces
interface ToolCardProps {
  tool: Tool;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

// component
export function ToolCard({ tool, onEdit, onDelete }: ToolCardProps) {
  // hooks
  const [isExpanded, setIsExpanded] = useState(false);

  // effects
  useEffect(() => {
    // ...
  }, [tool.id]);

  // handlers
  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  // render
  return (
    <div onClick={handleClick}>
      {/* ... */}
    </div>
  );
}
```

### State Management

Use Zustand stores with TypeScript:

```typescript
// store/toolsStore.ts
import { create } from 'zustand';
import { Tool } from '@atlas/core';

interface ToolsState {
  tools: Tool[];
  selectedToolId: string | null;

  // Actions
  addTool: (tool: Tool) => void;
  updateTool: (id: string, updates: Partial<Tool>) => void;
  deleteTool: (id: string) => void;
  selectTool: (id: string | null) => void;
}

export const useToolsStore = create<ToolsState>((set) => ({
  tools: [],
  selectedToolId: null,

  addTool: (tool) => set((state) => ({
    tools: [...state.tools, tool],
  })),

  updateTool: (id, updates) => set((state) => ({
    tools: state.tools.map(t => t.id === id ? { ...t, ...updates } : t),
  })),

  deleteTool: (id) => set((state) => ({
    tools: state.tools.filter(t => t.id !== id),
    selectedToolId: state.selectedToolId === id ? null : state.selectedToolId,
  })),

  selectTool: (id) => set({ selectedToolId: id }),
}));
```

### Error Handling

```typescript
// Explicit error types
class StorageError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'StorageError';
  }
}

// Try-catch with proper error handling
async function saveTool(tool: Tool): Promise<void> {
  try {
    await db.tools.put(tool);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      throw new StorageError('Storage quota exceeded', error);
    }
    throw new StorageError('Failed to save tool', error as Error);
  }
}

// Use in components
try {
  await saveTool(newTool);
} catch (error) {
  if (error instanceof StorageError) {
    showNotification('error', error.message);
  } else {
    showNotification('error', 'An unexpected error occurred');
    console.error(error);
  }
}
```

### Async Operations

```typescript
// Use async/await over promises
// Good
async function loadTools(): Promise<Tool[]> {
  const tools = await db.tools.toArray();
  return tools;
}

// Avoid
function loadTools(): Promise<Tool[]> {
  return db.tools.toArray().then(tools => tools);
}

// Handle loading states in components
function ToolList() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadTools()
      .then(setTools)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  return <div>{/* render tools */}</div>;
}
```

---

## File Organization

### Imports Order

1. External dependencies (React, third-party libs)
2. Internal packages (@atlas/*)
3. Relative imports (components, utils)
4. Types
5. Styles/assets

```typescript
// 1. External
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

// 2. Internal packages
import { Tool, Workflow } from '@atlas/core';
import { calculateSimilarity } from '@atlas/insights';

// 3. Relative imports
import { ToolCard } from '../components/ToolCard';
import { formatToolName } from '../utils/formatters';

// 4. Types
import type { ToolCardProps } from '../types';

// 5. Styles
import './ToolList.css';
```

### Component Co-location

Keep related files together:

```
components/
  ToolCard/
    ToolCard.tsx
    ToolCard.test.tsx
    ToolCard.module.css
    ToolCardSkeleton.tsx
    index.ts  # Re-export
```

### Barrel Exports

Use index.ts for clean imports:

```typescript
// components/index.ts
export { ToolCard } from './ToolCard/ToolCard';
export { ToolList } from './ToolList/ToolList';
export { ToolDetail } from './ToolDetail/ToolDetail';

// Usage
import { ToolCard, ToolList } from '../components';
```

---

## Testing Strategy

### Unit Tests

- Test utilities and pure functions
- Test store actions and state updates
- Test hooks logic

```typescript
// utils/formatters.test.ts
import { describe, it, expect } from 'vitest';
import { formatToolName, truncateText } from './formatters';

describe('formatters', () => {
  describe('formatToolName', () => {
    it('should trim whitespace', () => {
      expect(formatToolName('  Figma  ')).toBe('Figma');
    });

    it('should handle empty strings', () => {
      expect(formatToolName('')).toBe('');
    });
  });
});
```

### Component Tests

- Test rendering
- Test user interactions
- Test props variations

```typescript
// components/ToolCard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToolCard } from './ToolCard';

describe('ToolCard', () => {
  const mockTool = {
    id: '1',
    name: 'Figma',
    url: 'https://figma.com',
    tags: ['design'],
  };

  it('should render tool name', () => {
    render(<ToolCard tool={mockTool} />);
    expect(screen.getByText('Figma')).toBeInTheDocument();
  });

  it('should call onEdit when edit button clicked', () => {
    const onEdit = vi.fn();
    render(<ToolCard tool={mockTool} onEdit={onEdit} />);

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith('1');
  });
});
```

### Integration Tests

- Test feature workflows
- Test data flow between components
- Test storage operations

### E2E Tests

- Test critical user journeys
- Test Chrome extension functionality
- Test mindmap interactions

```typescript
// e2e/tool-management.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Tool Management', () => {
  test('should create a new tool', async ({ page }) => {
    await page.goto('http://localhost:5173');

    await page.click('button:has-text("Add Tool")');
    await page.fill('input[name="name"]', 'Notion');
    await page.fill('input[name="url"]', 'https://notion.so');
    await page.click('button:has-text("Save")');

    await expect(page.locator('text=Notion')).toBeVisible();
  });
});
```

---

## Git Workflow

### Branch Naming

- **Feature:** `feature/tool-capture-ui`
- **Bug fix:** `fix/mindmap-clustering-bug`
- **Refactor:** `refactor/storage-layer`
- **Docs:** `docs/update-readme`
- **Claude branches:** `claude/claude-md-*` (auto-generated)

### Commit Messages

Follow Conventional Commits:

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code change without feature/fix
- `docs`: Documentation only
- `style`: Formatting, missing semi-colons, etc.
- `test`: Adding tests
- `chore`: Build process, dependencies

Examples:
```
feat(mindmap): add filter-driven clustering mode
fix(storage): resolve IndexedDB quota exceeded error
refactor(insights): improve similarity calculation performance
docs(readme): update setup instructions
```

### PR Guidelines

1. **Title:** Clear, descriptive summary
2. **Description:**
   - What changed
   - Why it changed
   - How to test
   - Screenshots (if UI change)
3. **Size:** Keep PRs focused and reviewable
4. **Tests:** Include tests for new features
5. **Documentation:** Update docs if needed

---

## AI Assistant Guidelines

### Understanding Project Context

When working on this project, remember:

1. **Early Stage:** Most code doesn't exist yet. Reference the planned architecture.
2. **Documentation First:** README.md and PRD.md are the source of truth.
3. **Monorepo Structure:** Understand the separation of apps and packages.
4. **Local-First:** All features should work offline with local storage.
5. **Performance:** Mindmap must handle 1000+ nodes smoothly.

### Approach to Tasks

#### When Implementing New Features

1. **Read the PRD** - Understand requirements in PRD.md
2. **Check Architecture** - Reference planned structure in this file
3. **Create Types First** - Define data models in `@atlas/core`
4. **Build Storage** - Implement persistence in `@atlas/storage`
5. **Add Business Logic** - Algorithms go in `@atlas/insights`
6. **Build UI** - Components in `apps/web`
7. **Add Tests** - Unit and integration tests
8. **Update Docs** - Keep README and this file current

#### When Fixing Bugs

1. **Reproduce** - Understand the issue
2. **Add Test** - Write failing test first (TDD)
3. **Fix** - Minimal change to fix the issue
4. **Verify** - Test passes, no regressions
5. **Document** - Update comments/docs if needed

#### When Refactoring

1. **Ensure Tests** - Good test coverage before refactoring
2. **Small Changes** - Incremental, focused refactors
3. **Keep Tests Green** - Tests pass at each step
4. **Update Types** - Keep TypeScript types accurate

### Common Pitfalls to Avoid

1. **Don't mix concerns** - Keep packages separate (core, insights, storage)
2. **Don't skip types** - Always define proper TypeScript types
3. **Don't ignore performance** - Graph with 1000+ nodes must be fast
4. **Don't break offline** - Local-first means offline-capable
5. **Don't ignore the PRD** - Features should match requirements
6. **Don't over-engineer** - Start simple, iterate based on needs
7. **Don't couple to specific AI** - Keep AI integration pluggable

### Key Decision Points

When making architectural decisions, prioritize:

1. **Local-First:** Can it work without a backend?
2. **Performance:** Will it scale to 1000+ tools?
3. **User Experience:** Is it intuitive and fast?
4. **Maintainability:** Is the code clear and testable?
5. **Extensibility:** Can new features be added easily?

### Questions to Ask

Before implementing features, consider:

- Does this align with the PRD?
- Which package should this code live in?
- What TypeScript types are needed?
- How will this be tested?
- How does this affect performance?
- Does this work offline?
- How does this integrate with the mindmap?
- What edge cases exist?

---

## Common Tasks & Patterns

### Adding a New Tool

```typescript
// 1. Import from store
import { useToolsStore } from '../store/toolsStore';

// 2. Get action
const addTool = useToolsStore(state => state.addTool);

// 3. Create tool object
const newTool: Tool = {
  id: crypto.randomUUID(),
  name: 'Notion',
  url: 'https://notion.so',
  tags: ['productivity', 'notes'],
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

// 4. Add to store
addTool(newTool);

// 5. Persist to storage
await db.tools.put(newTool);
```

### Implementing a Clustering Algorithm

```typescript
// packages/insights/src/clustering/tagClustering.ts

import type { Tool, InsightEdge } from '@atlas/core';

export function generateTagClusters(
  tools: Tool[],
  options?: ClusterOptions
): InsightEdge[] {
  const edges: InsightEdge[] = [];

  // Build tag index
  const tagIndex = new Map<string, Set<string>>();
  for (const tool of tools) {
    for (const tag of tool.tags) {
      if (!tagIndex.has(tag)) {
        tagIndex.set(tag, new Set());
      }
      tagIndex.get(tag)!.add(tool.id);
    }
  }

  // Generate edges between tools sharing tags
  for (const toolIds of tagIndex.values()) {
    const ids = Array.from(toolIds);
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        edges.push({
          id: `${ids[i]}-${ids[j]}`,
          source: ids[i],
          target: ids[j],
          weight: calculateTagWeight(tools, ids[i], ids[j]),
          type: 'tag',
        });
      }
    }
  }

  return edges;
}

function calculateTagWeight(
  tools: Tool[],
  id1: string,
  id2: string
): number {
  const tool1 = tools.find(t => t.id === id1);
  const tool2 = tools.find(t => t.id === id2);

  if (!tool1 || !tool2) return 0;

  const sharedTags = tool1.tags.filter(t => tool2.tags.includes(t));
  const totalTags = new Set([...tool1.tags, ...tool2.tags]).size;

  return sharedTags.length / totalTags; // Jaccard similarity
}
```

### Working with IndexedDB

```typescript
// packages/storage/src/indexeddb/schema.ts
import { openDB, DBSchema } from 'idb';

interface AtlasDB extends DBSchema {
  tools: {
    key: string;
    value: Tool;
    indexes: { 'by-tag': string; 'by-type': string };
  };
  workflows: {
    key: string;
    value: Workflow;
  };
  goals: {
    key: string;
    value: Goal;
  };
  edges: {
    key: string;
    value: InsightEdge;
    indexes: { 'by-source': string; 'by-target': string };
  };
}

export async function openAtlasDB() {
  return openDB<AtlasDB>('atlas-db', 1, {
    upgrade(db) {
      // Tools store
      const toolStore = db.createObjectStore('tools', { keyPath: 'id' });
      toolStore.createIndex('by-tag', 'tags', { multiEntry: true });
      toolStore.createIndex('by-type', 'type');

      // Workflows store
      db.createObjectStore('workflows', { keyPath: 'id' });

      // Goals store
      db.createObjectStore('goals', { keyPath: 'id' });

      // Edges store
      const edgeStore = db.createObjectStore('edges', { keyPath: 'id' });
      edgeStore.createIndex('by-source', 'source');
      edgeStore.createIndex('by-target', 'target');
    },
  });
}

// packages/storage/src/indexeddb/operations.ts
export async function getAllTools(): Promise<Tool[]> {
  const db = await openAtlasDB();
  return db.getAll('tools');
}

export async function getToolsByTag(tag: string): Promise<Tool[]> {
  const db = await openAtlasDB();
  return db.getAllFromIndex('tools', 'by-tag', tag);
}

export async function saveTool(tool: Tool): Promise<void> {
  const db = await openAtlasDB();
  await db.put('tools', tool);
}
```

### Chrome Extension Message Passing

```typescript
// apps/extension/src/background/background.ts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CAPTURE_TOOL') {
    captureCurrentTab()
      .then(tool => {
        sendResponse({ success: true, tool });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep channel open for async response
  }
});

// apps/extension/src/content/content.ts
function extractMetadata(): ToolMetadata {
  return {
    favicon: document.querySelector<HTMLLinkElement>('link[rel="icon"]')?.href,
    description: document.querySelector<HTMLMetaElement>('meta[name="description"]')?.content,
    ogImage: document.querySelector<HTMLMetaElement>('meta[property="og:image"]')?.content,
  };
}

// apps/extension/src/sidepanel/SidePanel.tsx
function captureTool() {
  chrome.runtime.sendMessage(
    { type: 'CAPTURE_TOOL' },
    (response) => {
      if (response.success) {
        addTool(response.tool);
      }
    }
  );
}
```

### Cytoscape.js Integration

```typescript
// apps/web/src/mindmap/MindmapView.tsx
import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';

cytoscape.use(coseBilkent);

export function MindmapView({ tools, edges, clusterMode }: MindmapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      elements: [
        ...tools.map(tool => ({
          data: { id: tool.id, label: tool.name, ...tool },
        })),
        ...edges.map(edge => ({
          data: {
            id: edge.id,
            source: edge.source,
            target: edge.target,
            weight: edge.weight,
          },
        })),
      ],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#3B82F6',
            'label': 'data(label)',
            'width': 60,
            'height': 60,
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 'data(weight)',
            'line-color': '#94A3B8',
            'curve-style': 'bezier',
          },
        },
      ],
      layout: {
        name: 'cose-bilkent',
        animate: true,
        nodeRepulsion: 4500,
        idealEdgeLength: 100,
      },
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, [tools, edges]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
```

---

## Additional Resources

### External Documentation

- [Cytoscape.js Docs](https://js.cytoscape.org/)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Chrome Extension MV3](https://developer.chrome.com/docs/extensions/mv3/)
- [Chrome Side Panel API](https://developer.chrome.com/docs/extensions/reference/sidePanel/)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Vite Docs](https://vitejs.dev/)

### Internal Documentation

- `README.md` - Project overview and setup
- `PRD.md` - Detailed product requirements
- `docs/architecture.md` - (To be created) Detailed architecture
- `docs/api.md` - (To be created) API reference
- `docs/deployment.md` - (To be created) Deployment guide

---

## Changelog

### 2025-11-23 - Initial Creation

- Created comprehensive CLAUDE.md file
- Documented planned architecture and structure
- Defined data models and core concepts
- Established development workflows and conventions
- Added guidelines for AI assistants
- Included common patterns and examples

---

## Notes for Future Updates

This file should be updated when:

- Major architectural decisions are made
- New features are planned or implemented
- Development workflows change
- New conventions are established
- Breaking changes occur
- Project structure evolves

Keep this document in sync with:
- README.md
- PRD.md
- Actual codebase structure
- Team decisions and learnings

---

**End of CLAUDE.md**
