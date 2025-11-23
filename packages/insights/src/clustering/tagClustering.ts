import type { Tool, InsightEdge } from '@atlas/core';
import { createInsightEdge } from '@atlas/core';

/**
 * Generate edges between tools sharing tags
 */
export function generateTagClusters(tools: Tool[]): InsightEdge[] {
  const edges: InsightEdge[] = [];

  // Build tag index: tag -> Set of tool IDs
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
        const weight = calculateTagWeight(tools, ids[i]!, ids[j]!);
        if (weight > 0) {
          edges.push(
            createInsightEdge({
              source: ids[i]!,
              target: ids[j]!,
              weight,
              type: 'tag',
            })
          );
        }
      }
    }
  }

  return edges;
}

/**
 * Calculate edge weight based on shared tags (Jaccard similarity)
 */
function calculateTagWeight(tools: Tool[], id1: string, id2: string): number {
  const tool1 = tools.find((t) => t.id === id1);
  const tool2 = tools.find((t) => t.id === id2);

  if (!tool1 || !tool2) return 0;

  const sharedTags = tool1.tags.filter((t) => tool2.tags.includes(t));
  const totalTags = new Set([...tool1.tags, ...tool2.tags]).size;

  if (totalTags === 0) return 0;

  return sharedTags.length / totalTags; // Jaccard similarity
}

/**
 * Get all unique tags from tools
 */
export function extractAllTags(tools: Tool[]): string[] {
  const tags = new Set<string>();
  for (const tool of tools) {
    for (const tag of tool.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags).sort();
}
