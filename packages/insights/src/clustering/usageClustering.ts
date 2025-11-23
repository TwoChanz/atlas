import type { Tool, InsightEdge } from '@atlas/core';
import { createInsightEdge, USAGE_RECENCY } from '@atlas/core';

/**
 * Generate edges based on usage patterns
 * Tools used around the same time are likely related
 */
export function generateUsageClusters(tools: Tool[]): InsightEdge[] {
  const edges: InsightEdge[] = [];

  // Filter tools with usage data
  const usedTools = tools.filter((t) => t.usage && t.usage.visitCount > 0);

  // Sort by last visited
  usedTools.sort((a, b) => {
    const aTime = a.usage?.lastVisited || 0;
    const bTime = b.usage?.lastVisited || 0;
    return bTime - aTime;
  });

  // Create edges between tools used close together in time
  for (let i = 0; i < usedTools.length; i++) {
    for (let j = i + 1; j < usedTools.length; j++) {
      const tool1 = usedTools[i]!;
      const tool2 = usedTools[j]!;

      const weight = calculateUsageWeight(tool1, tool2);

      if (weight > 0.1) {
        // Only create edge if weight is significant
        edges.push(
          createInsightEdge({
            source: tool1.id,
            target: tool2.id,
            weight,
            type: 'usage',
          })
        );
      }
    }
  }

  return edges;
}

/**
 * Calculate weight based on temporal proximity and usage frequency
 */
function calculateUsageWeight(tool1: Tool, tool2: Tool): number {
  if (!tool1.usage || !tool2.usage) return 0;

  const timeDiff = Math.abs(tool1.usage.lastVisited - tool2.usage.lastVisited);
  const week = USAGE_RECENCY.week;

  // Temporal proximity score (decreases with time)
  let temporalScore = 0;
  if (timeDiff < week) {
    temporalScore = 1 - timeDiff / week;
  } else if (timeDiff < USAGE_RECENCY.month) {
    temporalScore = 0.5 * (1 - timeDiff / USAGE_RECENCY.month);
  } else {
    temporalScore = 0.1;
  }

  // Usage frequency score
  const avgVisits = (tool1.usage.visitCount + tool2.usage.visitCount) / 2;
  const frequencyScore = Math.min(1, avgVisits / 10); // Normalize to max 1.0

  // Combine scores
  return (temporalScore + frequencyScore) / 2;
}

/**
 * Identify frequently used tools (high-leverage tools)
 */
export function identifyHighLeverageTools(tools: Tool[], threshold: number = 10): Tool[] {
  return tools
    .filter((t) => t.usage && t.usage.visitCount >= threshold)
    .sort((a, b) => {
      const aCount = a.usage?.visitCount || 0;
      const bCount = b.usage?.visitCount || 0;
      return bCount - aCount;
    });
}

/**
 * Filter tools by usage recency
 */
export function filterByUsageRecency(
  tools: Tool[],
  recency: keyof typeof USAGE_RECENCY
): Tool[] {
  const cutoff = Date.now() - USAGE_RECENCY[recency];

  return tools.filter((t) => {
    if (!t.usage) return false;
    return t.usage.lastVisited >= cutoff;
  });
}
