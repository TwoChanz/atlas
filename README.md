# 📘 **README.md — Atlas: Personal Tool Intelligence System**

<p align="center">
  <img src="https://dummyimage.com/600x180/000/fff&text=Atlas+—+Personal+Tool+Intelligence+System" />
</p>

Atlas is a personal knowledge engine for organizing **tools**, **websites**, **workflows**, and **goals**, powered by an **AI-driven mindmap** with dynamic clustering.
It helps you understand your tool ecosystem, discover workflows, track usage, and surface monetizable insights.

---

# 🚀 **Features**

### ✅ Smart Tool Directory

Organize all tools, sites, apps, and resources with tags, metadata, notes, and AI insights.

### ✅ AI Mindmap

A dynamic knowledge graph built with Cytoscape.js that automatically clusters based on:

* Tags
* Workflows
* Usage
* Goals
* Redundancies
* Monetization potential
* **Active filters (filter-driven clustering)**

### ✅ Workflow Builder

Drag-and-drop workflows, auto-suggested sequences, and Markdown export.

### ✅ Goal Alignment Engine

Attach tools + workflows to high-level goals and discover gaps.

### ✅ Chrome Extension

Instantly capture any tool from your browser with auto-tagging, metadata extraction, and side-panel view.

### ✅ Usage Tracking

Tracks visit frequency + recency using the extension to surface high-leverage tools.

### ✅ AI Insight Engine

Provides recommendations, detects overlaps, reveals redundancies, and highlights monetizable patterns.

### ✅ Export & Sync

Export JSON, Markdown, and Obsidian-compatible vaults.

---

# 🧠 **Tech Stack**

| Layer             | Technology                      |
| ----------------- | ------------------------------- |
| Frontend          | React + TypeScript              |
| Graph             | Cytoscape.js                    |
| Local DB          | IndexedDB + Chrome Storage Sync |
| Browser Extension | Chrome MV3                      |
| State             | Zustand or Recoil               |
| Styling           | Tailwind or standard CSS        |
| Build             | Vite or Next.js                 |
| Optional AI       | Local or remote LLM endpoints   |

---

# 📂 **Project Structure**

```
atlas/
│
├── apps/
│   ├── web/                     # Main React web app
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── mindmap/
│   │   │   ├── storage/
│   │   │   ├── insights/
│   │   │   ├── workflows/
│   │   │   └── goals/
│   │   ├── public/
│   │   ├── index.html
│   │   └── package.json
│   │
│   └── extension/               # Chrome MV3 extension
│       ├── src/
│       │   ├── sidepanel/
│       │   ├── background.ts
│       │   ├── content.ts
│       │   └── capture.ts
│       ├── manifest.json
│       └── package.json
│
├── packages/
│   ├── core/                    # Shared types + data models
│   ├── insights/                # AI Insight Engine
│   └── storage/                 # IndexedDB and sync logic
│
├── README.md
├── LICENSE
└── package.json
```

---

# ⚙️ **Setup & Installation**

## **Prerequisites**

* Node.js 18+
* Git
* Chrome browser (for extension)
* pnpm (recommended) or npm/yarn

---

# 🧩 **1. Clone the Repo**

```bash
git clone https://github.com/YOUR-USERNAME/atlas.git
cd atlas
```

---

# 🛠️ **2. Install Dependencies**

Using pnpm (preferred):

```bash
pnpm install
```

Or npm:

```bash
npm install
```

---

# 🌐 **3. Run the Web App**

Inside `apps/web`:

```bash
cd apps/web
pnpm dev
```

Web app should be live at:

```
http://localhost:5173
```

---

# 🔌 **4. Run the Chrome Extension (Side Panel)**

Open Chrome → Extensions → **Developer Mode → Load Unpacked**
Select:

```
atlas/apps/extension
```

You’ll see:

* Capture Button
* Side Panel
* Auto-sync with web app storage

---

# 🧠 **5. Build Insight Engine (Optional AI)**

Inside `packages/insights`:

```bash
pnpm build
```

---

# 🗃️ **6. Build the Entire Monorepo**

```bash
pnpm build
```

---

# 🧼 **7. Clean & Reset**

```bash
pnpm clean
```

---

# 🚀 Development Workflow

### **Frontend (Web App)**

Located at: `apps/web`

Run development:

```bash
pnpm --filter web dev
```

Build for production:

```bash
pnpm --filter web build
```

---

### **Extension**

Located at: `apps/extension`

Build:

```bash
pnpm --filter extension build
```

Watch mode:

```bash
pnpm --filter extension dev
```

Load into Chrome after each build refresh.

---

# ✨ **Key Concepts**

### **InsightEdges**

AI relationships that fuel clustering.

### **AI Cluster Modes**

* Auto
* Filter-driven
* Tag-only
* Goal-focused

### **Usage Heatmap**

Visual thickness of nodes based on usage count.

### **Monetization Cluster**

Tools that support revenue generation.

---

# 🤝 Contributing

Pull requests welcome.
Before submitting:

1. Run lint & format
2. Update documentation
3. Include tests for core features

---

# 📄 License

MIT License © Six1Five Studio
