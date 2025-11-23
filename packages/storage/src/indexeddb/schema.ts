import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { Tool, Workflow, Goal, InsightEdge } from '@atlas/core';
import { DB_NAME, DB_VERSION } from '@atlas/core';

/**
 * IndexedDB Schema for Atlas
 */
export interface AtlasDB extends DBSchema {
  tools: {
    key: string;
    value: Tool;
    indexes: {
      'by-tag': string;
      'by-type': string;
      'by-updated': number;
    };
  };
  workflows: {
    key: string;
    value: Workflow;
    indexes: {
      'by-tag': string;
      'by-updated': number;
    };
  };
  goals: {
    key: string;
    value: Goal;
    indexes: {
      'by-priority': string;
      'by-status': string;
      'by-updated': number;
    };
  };
  edges: {
    key: string;
    value: InsightEdge;
    indexes: {
      'by-source': string;
      'by-target': string;
      'by-type': string;
    };
  };
}

/**
 * Open the Atlas database
 */
export async function openAtlasDB(): Promise<IDBPDatabase<AtlasDB>> {
  return openDB<AtlasDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      // Tools store
      if (!db.objectStoreNames.contains('tools')) {
        const toolStore = db.createObjectStore('tools', { keyPath: 'id' });
        toolStore.createIndex('by-tag', 'tags', { multiEntry: true });
        toolStore.createIndex('by-type', 'type');
        toolStore.createIndex('by-updated', 'updatedAt');
      }

      // Workflows store
      if (!db.objectStoreNames.contains('workflows')) {
        const workflowStore = db.createObjectStore('workflows', { keyPath: 'id' });
        workflowStore.createIndex('by-tag', 'tags', { multiEntry: true });
        workflowStore.createIndex('by-updated', 'updatedAt');
      }

      // Goals store
      if (!db.objectStoreNames.contains('goals')) {
        const goalStore = db.createObjectStore('goals', { keyPath: 'id' });
        goalStore.createIndex('by-priority', 'priority');
        goalStore.createIndex('by-status', 'status');
        goalStore.createIndex('by-updated', 'updatedAt');
      }

      // Edges store
      if (!db.objectStoreNames.contains('edges')) {
        const edgeStore = db.createObjectStore('edges', { keyPath: 'id' });
        edgeStore.createIndex('by-source', 'source');
        edgeStore.createIndex('by-target', 'target');
        edgeStore.createIndex('by-type', 'type');
      }
    },
  });
}
