import type { ToolType } from '../types';

export interface UsageData {
  visitCount: number;
  lastVisited: number;
  firstVisited: number;
  averageSessionTime?: number;
}

export interface AIAttributes {
  /** Count of workflows using this tool */
  workflows: number;
  /** Similarity score with other tools (0-1) */
  similarityScore?: number;
  /** Category density score */
  categoryDensity?: number;
  /** Monetization potential score (0-1) */
  monetizationPotential?: number;
  /** High-leverage score - tools appearing across many contexts */
  leverageScore?: number;
}

export interface ToolMetadata {
  favicon?: string;
  description?: string;
  screenshot?: string;
  ogImage?: string;
}

export interface Tool {
  id: string;
  name: string;
  url?: string;
  type?: ToolType;
  tags: string[];
  notes?: string;
  createdAt: number;
  updatedAt: number;
  usage?: UsageData;
  aiAttributes?: AIAttributes;
  metadata?: ToolMetadata;
}

/**
 * Factory function to create a new Tool with defaults
 */
export function createTool(
  data: Pick<Tool, 'name'> & Partial<Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>>
): Tool {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    name: data.name,
    url: data.url,
    type: data.type,
    tags: data.tags || [],
    notes: data.notes,
    createdAt: now,
    updatedAt: now,
    usage: data.usage,
    aiAttributes: data.aiAttributes,
    metadata: data.metadata,
  };
}
