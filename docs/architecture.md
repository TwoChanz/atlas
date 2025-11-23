# Atlas Architecture Documentation

**Last Updated:** 2025-11-23
**Version:** 1.0
**Project:** Atlas - Personal Tool Intelligence System

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Principles](#architecture-principles)
3. [Monorepo Structure](#monorepo-structure)
4. [Package Architecture](#package-architecture)
5. [Data Flow](#data-flow)
6. [Storage Architecture](#storage-architecture)
7. [AI Insights Engine](#ai-insights-engine)
8. [Graph Visualization](#graph-visualization)
9. [Chrome Extension Architecture](#chrome-extension-architecture)
10. [State Management](#state-management)
11. [Testing Strategy](#testing-strategy)
12. [Performance Considerations](#performance-considerations)
13. [Security Considerations](#security-considerations)

---

## System Overview

Atlas is a local-first, AI-powered personal knowledge management system designed to organize tools, workflows, and goals through an intelligent, dynamic mindmap interface.

### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                        User Layer                            │
├────────────────┬────────────────────────┬───────────────────┤
│   Web App      │  Chrome Extension      │   Future Clients  │
│   (React)      │  (Side Panel MV3)      │                   │
└────────┬───────┴───────────┬────────────┴──────────┬────────┘
         │                   │                       │
         └───────────────────┴───────────────────────┘
                              │
         ┌────────────────────┴────────────────────┐
         │         Shared Packages Layer           │
         ├─────────────┬──────────────┬────────────┤
         │  @atlas/core│@atlas/insights│@atlas/storage│
         └─────────────┴──────────────┴────────────┘
                              │
         ┌────────────────────┴────────────────────┐
         │          Storage Layer                  │
         ├─────────────────────────────────────────┤
         │  IndexedDB (Local) + Chrome Storage Sync│
         └─────────────────────────────────────────┘
```

### Key Features

- **Local-First**: All data stored in IndexedDB, no backend required
- **AI-Driven**: Intelligent clustering and recommendations
- **Real-Time Sync**: Chrome Storage API for cross-device sync
- **Offline-Capable**: Full functionality without internet
- **Extensible**: Plugin-based clustering algorithms

---

## Architecture Principles

### 1. Local-First

- All data stored locally in IndexedDB
- No required backend or API calls
- Optional sync via Chrome Storage API
- Full offline functionality

### 2. Separation of Concerns

```
Presentation Layer  → UI Components (React)
Business Logic      → Insights Engine, Clustering
Data Layer          → Storage Operations, IndexedDB
```

### 3. Dependency Injection

```typescript
// Packages depend on abstractions, not implementations
@atlas/insights  depends on  @atlas/core (types)
@atlas/storage   depends on  @atlas/core (models)
apps/*           depend on   packages/*
```

### 4. Type Safety

- TypeScript strict mode everywhere
- Shared types in `@atlas/core`
- No `any` types in production code

---

## Monorepo Structure

### Workspace Configuration

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'        # Applications (web, extension)
  - 'packages/*'    # Shared packages
```

### Package Graph

```
apps/web ────────────┐
                     ├──→ @atlas/core
apps/extension ──────┤    @atlas/storage ─→ @atlas/core
                     └──→ @atlas/insights ─→ @atlas/core
```

**No circular dependencies.** Apps depend on packages, packages depend on `@atlas/core`.

---

## Package Architecture

### @atlas/core

**Purpose:** Shared data models, types, and constants

**Exports:**
```typescript
// Models with factory functions
export { Tool, createTool } from './models/Tool';
export { Workflow, createWorkflow } from './models/Workflow';
export { Goal, createGoal } from './models/Goal';
export { InsightEdge, createInsightEdge } from './models/InsightEdge';

// Type definitions
export type { ClusterMode, FilterState, ToolType };

// Constants
export { CLUSTER_COLORS, EDGE_TYPES, DEFAULT_SETTINGS };
```

**No dependencies** - this is the foundational package.

### @atlas/storage

**Purpose:** Data persistence and synchronization

**Architecture:**

```
┌──────────────────────────────────────────┐
│           Storage API                    │
├──────────────────────────────────────────┤
│  getAllTools(), saveTool(), etc.         │
└──────┬───────────────┬───────────────────┘
       │               │
┌──────▼──────┐  ┌────▼────────────────┐
│  IndexedDB  │  │  Chrome Storage Sync│
│  (Primary)  │  │  (Backup/Sync)      │
└─────────────┘  └─────────────────────┘
```

**Key Features:**
- Async/await API for all operations
- Automatic timestamp management (`createdAt`, `updatedAt`)
- Index-based queries (`by-tag`, `by-type`)
- Conflict resolution for sync
- Memory cache for frequently accessed data

**Example:**
```typescript
// Create and save a tool
const tool = createTool({ name: 'Figma', tags: ['design'] });
await saveTool(tool);

// Query by index
const designTools = await getToolsByTag('design');

// Update with automatic timestamp
await updateTool(tool.id, { name: 'Figma Updated' });
```

### @atlas/insights

**Purpose:** AI-driven analysis and clustering

**Architecture:**

```
┌────────────────────────────────────────────┐
│         Insights API                       │
├────────────────┬───────────────────────────┤
│  Clustering    │  Analysis                 │
├────────────────┼───────────────────────────┤
│ • Tag          │ • Similarity              │
│ • Workflow     │ • Redundancy              │
│ • Usage        │ • Leverage                │
│ • Goal         │                           │
│ • Filter-Driven│ • Recommendations         │
└────────────────┴───────────────────────────┘
```

**Clustering Algorithms:**

1. **Tag Clustering** - Jaccard similarity between tool tags
2. **Workflow Clustering** - Tools appearing in same workflows
3. **Usage Clustering** - Frequently used together
4. **Goal Clustering** - Tools supporting same goals
5. **Filter-Driven** - Dynamic clustering based on active filters

**Example:**
```typescript
// Generate tag-based clusters
const edges = generateTagClusters(tools);

// Detect redundant tools
const redundantClusters = groupRedundantTools(tools, 0.7);

// Get workflow suggestions
const suggestions = suggestWorkflows(tools, workflows);
```

---

## Data Flow

### Tool Creation Flow

```
User Input (UI)
     │
     ▼
Form Validation
     │
     ▼
createTool() Factory  ←── Generates UUID, timestamps
     │
     ▼
Zustand Store (addTool)
     │
     ├──→ Update UI State
     │
     └──→ saveTool() → IndexedDB
              │
              └──→ Chrome Storage Sync (background)
```

### Mindmap Update Flow

```
Tool/Workflow/Goal Changes
          │
          ▼
    Zustand Stores
          │
          ├──→ Tools Store
          ├──→ Workflows Store
          └──→ Goals Store
          │
          ▼
    useMemo() Hook  ←── React optimization
          │
          ▼
    Clustering Algorithms
          │
          ├──→ generateTagClusters()
          ├──→ generateWorkflowClusters()
          └──→ generateGoalClusters()
          │
          ▼
    InsightEdge[] Array
          │
          ▼
    Cytoscape.js Layout
          │
          ▼
    Rendered Graph
```

---

## Storage Architecture

### IndexedDB Schema

```typescript
interface AtlasDB extends DBSchema {
  tools: {
    key: string;                    // Primary key: tool.id
    value: Tool;
    indexes: {
      'by-tag': string;             // Multi-entry index
      'by-type': string;            // Single-entry index
    };
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
    indexes: {
      'by-source': string;
      'by-target': string;
    };
  };
}
```

### Storage Patterns

**1. Write-Through Cache**
```typescript
// Memory cache
const cache = new Map<string, Tool>();

async function saveTool(tool: Tool): Promise<void> {
  // Write to IndexedDB
  await db.put('tools', tool);

  // Update cache
  cache.set(tool.id, tool);

  // Background sync to Chrome Storage
  syncToChrome(tool);
}
```

**2. Index-Based Queries**
```typescript
// Fast tag lookup using index
const designTools = await db.getAllFromIndex('tools', 'by-tag', 'design');
```

**3. Batch Operations**
```typescript
// Efficient bulk inserts
const tx = db.transaction('tools', 'readwrite');
await Promise.all([
  tx.store.put(tool1),
  tx.store.put(tool2),
  tx.store.put(tool3),
]);
await tx.done;
```

---

## AI Insights Engine

### Similarity Calculation

**Jaccard Similarity:**
```typescript
function calculateSimilarity(tool1: Tool, tool2: Tool): number {
  const set1 = new Set(tool1.tags);
  const set2 = new Set(tool2.tags);

  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
}
```

### Redundancy Detection

```typescript
// Detect tools with >70% similarity
const redundantTools = detectRedundantTools(tools, 0.7);

// Group into clusters
const clusters = groupRedundantTools(tools, 0.7);
// Returns: [{ tools: Tool[], averageSimilarity: number }]
```

### Workflow Suggestions

```typescript
// Find tools that share tags but aren't in workflows
const suggestions = suggestWorkflows(tools, existingWorkflows);

// Suggests workflow like:
// { name: "Design workflow", steps: [figma.id, sketch.id] }
```

---

## Graph Visualization

### Cytoscape.js Integration

**Architecture:**

```
React Component (MindmapView)
        │
        ▼
Cytoscape Instance
        │
        ├──→ Nodes (Tools)
        ├──→ Edges (Relationships)
        └──→ Layout Algorithm (CoSE Bilkent)
```

**Node Sizing:**
```typescript
// Dynamic sizing based on usage
const nodeSize = tool.usage?.visitCount
  ? 40 + Math.log(tool.usage.visitCount) * 10
  : 40;
```

**Edge Styling:**
```typescript
const edgeStyles = {
  'tag': { color: '#3B82F6', width: 2 },
  'workflow': { color: '#10B981', width: 3 },
  'redundancy': { color: '#EF4444', width: 2, style: 'dashed' },
};
```

**Layout Configuration:**
```typescript
{
  name: 'cose-bilkent',
  animate: true,
  nodeRepulsion: 4500,       // Push nodes apart
  idealEdgeLength: 100,      // Target edge length
  edgeElasticity: 0.45,      // Edge flexibility
  gravity: 0.25,             // Pull towards center
}
```

### Performance Optimization

**1. Incremental Updates**
```typescript
// Only update changed nodes
cy.batch(() => {
  changedNodes.forEach(node => {
    cy.$(`#${node.id}`).data(node.data);
  });
});
```

**2. Layout Throttling**
```typescript
// Debounce layout recalculation
const debouncedLayout = debounce(() => {
  cy.layout({ name: 'cose-bilkent' }).run();
}, 300);
```

**3. Viewport Culling**
```typescript
// Only render visible nodes
cy.on('render', () => {
  const extent = cy.extent();
  cy.nodes().forEach(node => {
    const pos = node.position();
    node.style('display', isInViewport(pos, extent) ? 'element' : 'none');
  });
});
```

---

## Chrome Extension Architecture

### Manifest V3 Structure

```
┌────────────────────────────────────────────────┐
│             Chrome Extension                   │
├───────────────┬────────────────┬───────────────┤
│ Side Panel    │ Background     │ Content Script│
│ (React UI)    │ (Service Worker)│ (Metadata)   │
└───────┬───────┴────────┬───────┴──────┬────────┘
        │                │              │
        │                │              │
        ▼                ▼              ▼
   Tool Capture    Message Router   Page Scraper
```

### Component Responsibilities

**Side Panel:**
- React UI for tool capture
- Recent tools display
- Quick actions

**Background Service Worker:**
```typescript
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CAPTURE_TOOL') {
    captureCurrentTab()
      .then(tool => sendResponse({ success: true, tool }))
      .catch(error => sendResponse({ success: false, error }));
    return true; // Keep channel open
  }
});
```

**Content Script:**
```typescript
// Extract metadata from page
function extractMetadata(): ToolMetadata {
  return {
    favicon: document.querySelector('link[rel="icon"]')?.href,
    description: document.querySelector('meta[name="description"]')?.content,
    ogImage: document.querySelector('meta[property="og:image"]')?.content,
  };
}
```

### Message Passing

```typescript
// Side Panel → Background
chrome.runtime.sendMessage(
  { type: 'CAPTURE_TOOL' },
  (response) => {
    if (response.success) addTool(response.tool);
  }
);

// Background → Content Script
chrome.tabs.sendMessage(
  tabId,
  { type: 'GET_METADATA' },
  (metadata) => processMetadata(metadata)
);
```

---

## State Management

### Zustand Architecture

**Four Independent Stores:**

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Tools Store │  │Workflows St.│  │ Goals Store │  │ Mindmap St. │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
      │                │                │                │
      └────────────────┴────────────────┴────────────────┘
                            │
                            ▼
                    Component Access
```

**Example Store:**
```typescript
interface ToolsState {
  tools: Tool[];
  selectedToolId: string | null;

  addTool: (tool: Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTool: (id: string, updates: Partial<Tool>) => Promise<void>;
  deleteTool: (id: string) => Promise<void>;
  selectTool: (id: string | null) => void;
  loadTools: () => Promise<void>;
}
```

**Usage in Components:**
```typescript
// Subscribe to specific state
const tools = useToolsStore(state => state.tools);
const addTool = useToolsStore(state => state.addTool);

// Component only re-renders when tools array changes
```

### Store-Storage Sync

```typescript
const addTool = async (toolData) => {
  // 1. Create tool with factory
  const tool = createTool(toolData);

  // 2. Update local state
  set(state => ({ tools: [...state.tools, tool] }));

  // 3. Persist to IndexedDB
  await saveTool(tool);

  // 4. Background sync (fire-and-forget)
  syncToChrome(tool).catch(console.error);
};
```

---

## Testing Strategy

### Test Pyramid

```
        ┌──────────────┐
        │  E2E Tests   │  ← Playwright (full user journeys)
        ├──────────────┤
        │Integration T.│  ← Vitest (component + storage)
        ├──────────────┤
        │  Unit Tests  │  ← Vitest (pure functions)
        └──────────────┘
```

### Unit Tests

**Target:** Pure functions, clustering algorithms

```typescript
// Tag clustering test
it('should calculate Jaccard similarity correctly', () => {
  const tool1 = createTool({ tags: ['a', 'b', 'c'] });
  const tool2 = createTool({ tags: ['b', 'c', 'd'] });

  const similarity = calculateSimilarity(tool1, tool2);

  // 2 shared / 4 total = 0.5
  expect(similarity).toBeCloseTo(0.5);
});
```

### Integration Tests

**Target:** Storage operations, IndexedDB

```typescript
it('should save and retrieve tools from IndexedDB', async () => {
  const tool = createTool({ name: 'Figma' });
  await saveTool(tool);

  const retrieved = await getToolById(tool.id);
  expect(retrieved).toEqual(tool);
});
```

### E2E Tests

**Target:** Full user workflows

```typescript
test('should create and edit a tool', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /add tool/i }).click();
  await page.getByLabel(/name/i).fill('Figma');
  await page.getByRole('button', { name: /save/i }).click();

  await expect(page.getByText('Figma')).toBeVisible();
});
```

---

## Performance Considerations

### 1. Graph Performance (1000+ Nodes)

**Strategies:**
- Use CoSE Bilkent layout (optimized for large graphs)
- Incremental layout updates
- Viewport culling for off-screen nodes
- Debounced layout recalculation

**Benchmark:**
- 100 nodes: < 100ms layout time
- 500 nodes: < 500ms layout time
- 1000 nodes: < 2s layout time

### 2. Storage Performance

**IndexedDB Optimization:**
- Use indexes for frequent queries
- Batch operations with transactions
- Memory cache for hot data
- Lazy loading for large datasets

### 3. React Performance

**Optimization Techniques:**
```typescript
// 1. Memoization
const edges = useMemo(() =>
  generateTagClusters(tools),
  [tools]
);

// 2. Selector optimization
const tools = useToolsStore(state => state.tools);  // Only re-render on tools change

// 3. Code splitting
const WorkflowBuilder = lazy(() => import('./WorkflowBuilder'));
```

---

## Security Considerations

### Data Privacy

- **No external requests** - All data stays local
- **No analytics** - No tracking or telemetry
- **No auth** - No passwords or credentials stored

### Chrome Extension Security

- **Content Security Policy:**
  ```json
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
  ```

- **Permissions (Minimal):**
  - `sidePanel` - For side panel UI
  - `tabs` - For current tab info
  - `storage` - For Chrome Storage API

### Input Validation

```typescript
// Sanitize user input
function sanitizeToolName(name: string): string {
  return name
    .trim()
    .replace(/<script>/gi, '')  // Remove script tags
    .substring(0, 100);          // Max length
}
```

---

## Conclusion

Atlas is built on a foundation of:

1. **Local-first architecture** for privacy and performance
2. **Type-safe TypeScript** for reliability
3. **Modular monorepo** for maintainability
4. **AI-driven insights** for intelligence
5. **Comprehensive testing** for quality

The architecture is designed to scale to thousands of tools while maintaining sub-second response times and providing intelligent, actionable insights to users.

---

**Maintained by:** Six1Five Studio
**License:** MIT
**Version:** 1.0
