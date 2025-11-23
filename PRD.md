
# 🚀 **PRODUCT REQUIREMENTS DOCUMENT (PRD)**

## **Atlas — Personal Tool Intelligence System**

**Owner:** Six1Five Studio
**Platforms:** Web App + Chrome Side Panel Extension
**Tech Stack:** React, TypeScript, Node.js, Chrome MV3, Cytoscape.js, IndexedDB/Chrome Storage Sync
**Version:** **1.2** (Updated With Filter-Driven Clustering)

---

# 1. PRODUCT OVERVIEW

Atlas is a personal knowledge engine for organizing tools, websites, workflows, and goals.
It functions as:

* A **Smart Tool Directory**
* A **Mindmap / Knowledge Graph**
* A **Workflow Builder**
* A **Goal Alignment Engine**
* A **Usage Tracking System**
* A **Chrome Extension for instant capture**
* A **Recommendation & Insight Generator**

The mindmap is powered by **AI-driven clustering**, dynamically reorganizing based on:

* Tags
* Workflows
* Usage patterns
* Goals
* Redundancies
* Monetization potential
* **Filter-driven subsets** (NEW)

---

# 2. CORE USER PROBLEMS

1. Tools spread across many domains with no central system.
2. Hard to visualize relationships and redundancies.
3. No way to see workflow patterns or which tools matter.
4. No fast capture workflow while browsing.
5. Hard to identify tools tied to actual goals (e.g., monetizing Reality Capture).
6. Hard to know which tools create ROI.
7. No intelligent clustering that reacts to what the user is currently filtering.

---

# 3. PRODUCT GOALS

* Become the user's **single source of truth** for tools & workflows.
* Provide a **dynamic, intelligent mindmap** that reorganizes based on activity, filters, and insights.
* Help users understand **workflow patterns**, overlaps, and opportunities.
* Track real usage to surface **high leverage tools**.
* Enable rapid tool capture from browser.
* Suggest **monetizable workflows** for AEC, Reality Capture, Dev, ML.

---

# 4. USER PERSONAS

### **1. Builder / Developer**

Uses Atlas as a daily tool navigator and knowledge hub.

### **2. AEC + Reality Capture Specialist (Six1Five Studio)**

Needs tool clarity for deliverables, documentation, and monetizable workflows.

### **3. Researcher / Power Browser**

Wants fast capture, organization, and relationship mapping.

---

# 5. SYSTEM REQUIREMENTS

---

# 5.1 Data Models

### **Tool**

```ts
id: string
name: string
url?: string
type?: string       // App, Site, Blog, API, Marketplace
tags: string[]
notes?: string
usage?: {
  visitCount: number
  lastVisited: timestamp
}
aiAttributes?: {
  workflows: number
  similarityScore?: number
  categoryDensity?: number
  monetizationPotential?: number
}
```

### **Workflow**

```ts
id: string
name: string
steps: string[]      // tool IDs
tags: string[]
notes?: string
```

### **Goal**

```ts
id: string
name: string
description: string
relatedTools: string[]
relatedWorkflows: string[]
priority: "high" | "medium" | "low"
```

### **InsightEdge (AI Relationships)**

```ts
interface InsightEdge {
  source: string
  target: string
  weight: number
  type: "similarity" | "usage" | "workflow" | "goal" | "redundancy" | "filter"
}
```

---

# 5.2 FEATURES

---

# **FEATURE 1: Smart Tool Directory**

* Add/edit/delete tools
* AI auto-tag suggestions
* Related tools based on similarity
* Notes & metadata
* Tag filtering

**Success:** Find or add any tool in under 3 seconds.

---

# **FEATURE 2: AI Mindmap with Dynamic Clustering**

The mindmap (Cytoscape.js) organizes tools in real time using **weighted clusters**.

### **Cluster Types**

#### **1. Tag Cluster**

Groups tools with shared tags (baseline).

#### **2. Workflow Cluster**

Tools appearing together in workflows cluster tightly.

#### **3. Usage Cluster**

Frequently used tools appear in a central cluster.

#### **4. Redundancy Cluster**

AI groups overlapping tools (e.g., Obsidian vs Notion).

#### **5. Goal Cluster**

Clusters tools that support specific user goals.

#### **6. Monetization Cluster**

Tools with income potential get grouped.

#### **7. High-Leverage Tools Cluster**

Tools appearing across many contexts become central hubs.

### **NEW: 8. Filter-Driven Clusters**

When filters are active, Atlas rebuilds the graph **only using the filtered subset**.

* Shows only matching nodes
* Recalculates cluster gravity
* Boosts edge weights that match filters
* Reveals focused insights (“your active Reality Capture stack”, “your last 30 days toolset”, etc.)

Supported filters:

* Tags
* Types
* Goals
* Workflows
* Usage recency (7/30/90 days)
* Monetization potential

---

## **Cluster Behavior**

* Filtering → **Switches clustering mode to Filter-Driven**
* Clearing filters → returns to AI Auto Mode
* Users can manually toggle:

**Modes:**

* Auto (AI Default)
* Filter-Driven
* Tag-Only
* Goal-Focused

---

# **FEATURE 3: Workflow Builder**

* Drag tools into a workflow
* Generate AI “Suggested Workflows”
* Export workflows to Markdown
* Workflow relationships influence clustering

---

# **FEATURE 4: Goal Alignment Engine**

* Create goals
* Assign tools + workflows
* Mindmap visualizes goal-driven relationships
* AI suggests missing tools
* Goal clusters reorganize based on priority

---

# **FEATURE 5: Usage Tracking & Heatmaps**

Via Chrome extension:

Tracks:

* visitCount
* lastVisited
* tool browsing patterns
* usage clusters

Heatmap overlay:

* High usage = bold
* Low usage = faded

---

# **FEATURE 6: Chrome Extension (Side Panel)**

### Capture Button

* One-click add tool
* Auto-grabs title, URL, favicon
* AI tag suggestion
* Quick add to workflow or goal

### Side Panel Mode

* Full web app accessible
* Mindmap visible
* Note-taking available

---

# **FEATURE 7: Content Scraping**

* Metadata extraction (title, description, OG tags)
* Optional screenshot capture

---

# **FEATURE 8: Export & Sync**

* Export JSON
* Export Markdown
* Obsidian-compatible vault export
* Notion CSV import
* Chrome storage sync

---

# **FEATURE 9: AI Insight Engine**

AI generates:

* Tool overlaps
* Redundancy clusters
* Workflow suggestions
* Goal acceleration suggestions
* Monetization recommendations
* High-leverage tool discovery
* Underused tools
* Category density
* Filter-driven insights (“within RC tag, here are cluster patterns…”)

---

# 6. NON-FUNCTIONAL REQUIREMENTS

* Mindmap reclusters under 200ms
* Smooth rendering for 1,000+ nodes
* Async AI calculations
* Local-first storage
* Offline-friendly
* Zero backend required for MVP

---

# 7. UI REQUIREMENTS

### 1. Three-Column Layout

* Left: Filters + tag panel
* Center: Tool/Workflow/Goal detail
* Right: Mindmap

### 2. Mindmap Panel Controls (Updated)

* Cluster Mode selector (`Auto`, `Filter-Driven`, `Tag`, `Goal`)
* Gravity slider
* Show/hide cluster types
* Highlight redundancies
* Center on filter
* Ghost hidden nodes

### 3. Node Styles

* Tool = Blue
* Tag = Gray
* Workflow = Green
* Goal = Purple
* Redundancy = Orange
* Monetization = Gold
* Keystone tools = Deep Blue

### 4. Tool Page

* Usage history
* Related tools
* AI insights

---

# 8. MILESTONES

### **MVP (2–3 Weeks)**

* Directory
* Tags
* Basic mindmap
* Chrome capture
* JSON storage

### **v1.1**

* Workflows
* Goals
* Import/export

### **v1.2 (This Version)**

✔ AI clustering
✔ Redundancy detection
✔ High-leverage tools
✔ Monetization clusters
✔ **Filter-driven clustering**
✔ Cluster mode selector

---

# 9. ACCEPTANCE CRITERIA

* Mindmap reorganizes based on:

  * Tags
  * Workflows
  * Usage
  * Redundancy
  * Goals
  * Monetization
  * **Filters**
* Filtering hides nodes and recalculates clusters
* Clearing filters returns to full AI Auto cluster
* Suggested workflows show accurate tool relationships
* Usage tracking updates gravity properly
* Exports are accurate and complete

---

# 10. FUTURE EXPANSIONS

* Cloud sync
* Team/shared view
* Automation triggers
* Marketplace for workflows and stacks
* AI “Tool Advisor” chatbot
* Mobile app version
 
