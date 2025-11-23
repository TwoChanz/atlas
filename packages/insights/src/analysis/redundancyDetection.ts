import type { Tool, InsightEdge } from '@atlas/core';
import { createInsightEdge } from '@atlas/core';
import { calculateSimilarity } from './similarityAnalysis';

/**
 * Detect redundant tools (tools with overlapping functionality)
 */
export function detectRedundantTools(tools: Tool[], threshold: number = 0.7): InsightEdge[] {
  const edges: InsightEdge[] = [];

  for (let i = 0; i < tools.length; i++) {
    for (let j = i + 1; j < tools.length; j++) {
      const tool1 = tools[i]!;
      const tool2 = tools[j]!;

      const similarity = calculateSimilarity(tool1, tool2);

      // High similarity suggests redundancy
      if (similarity >= threshold) {
        edges.push(
          createInsightEdge({
            source: tool1.id,
            target: tool2.id,
            weight: similarity,
            type: 'redundancy',
            metadata: {
              strength: similarity,
              reason: `High overlap detected (${(similarity * 100).toFixed(0)}% similar)`,
            },
          })
        );
      }
    }
  }

  return edges;
}

/**
 * Group redundant tools into clusters
 */
export interface RedundancyCluster {
  tools: Tool[];
  averageSimilarity: number;
}

export function groupRedundantTools(
  tools: Tool[],
  threshold: number = 0.7
): RedundancyCluster[] {
  const edges = detectRedundantTools(tools, threshold);
  const clusters: RedundancyCluster[] = [];
  const processed = new Set<string>();

  // Build adjacency list
  const adjacency = new Map<string, Set<string>>();
  for (const edge of edges) {
    if (!adjacency.has(edge.source)) {
      adjacency.set(edge.source, new Set());
    }
    if (!adjacency.has(edge.target)) {
      adjacency.set(edge.target, new Set());
    }
    adjacency.get(edge.source)!.add(edge.target);
    adjacency.get(edge.target)!.add(edge.source);
  }

  // Find connected components (clusters)
  for (const tool of tools) {
    if (processed.has(tool.id)) continue;

    const cluster = new Set<string>();
    const queue = [tool.id];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (processed.has(current)) continue;

      processed.add(current);
      cluster.add(current);

      const neighbors = adjacency.get(current);
      if (neighbors) {
        for (const neighbor of neighbors) {
          if (!processed.has(neighbor)) {
            queue.push(neighbor);
          }
        }
      }
    }

    if (cluster.size > 1) {
      const clusterTools = tools.filter((t) => cluster.has(t.id));
      const avgSimilarity = calculateAverageSimilarity(clusterTools);

      clusters.push({
        tools: clusterTools,
        averageSimilarity: avgSimilarity,
      });
    }
  }

  return clusters.sort((a, b) => b.averageSimilarity - a.averageSimilarity);
}

/**
 * Calculate average similarity within a cluster
 */
function calculateAverageSimilarity(tools: Tool[]): number {
  if (tools.length < 2) return 0;

  let totalSimilarity = 0;
  let count = 0;

  for (let i = 0; i < tools.length; i++) {
    for (let j = i + 1; j < tools.length; j++) {
      totalSimilarity += calculateSimilarity(tools[i]!, tools[j]!);
      count++;
    }
  }

  return count > 0 ? totalSimilarity / count : 0;
}
