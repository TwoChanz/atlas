import type { Tool, Workflow, InsightEdge } from '@atlas/core';
import { createInsightEdge } from '@atlas/core';

/**
 * Generate edges between tools appearing in the same workflows
 */
export function generateWorkflowClusters(_tools: Tool[], workflows: Workflow[]): InsightEdge[] {
  const edges: InsightEdge[] = [];

  // For each workflow, create edges between all tools in the workflow
  for (const workflow of workflows) {
    const steps = workflow.steps;

    for (let i = 0; i < steps.length; i++) {
      for (let j = i + 1; j < steps.length; j++) {
        const sourceId = steps[i];
        const targetId = steps[j];

        if (!sourceId || !targetId) continue;

        // Calculate weight based on proximity in workflow
        const weight = calculateWorkflowWeight(i, j, steps.length);

        edges.push(
          createInsightEdge({
            source: sourceId,
            target: targetId,
            weight,
            type: 'workflow',
            metadata: {
              reason: `Both appear in workflow: ${workflow.name}`,
            },
          })
        );
      }
    }
  }

  // Merge duplicate edges and sum weights
  return mergeEdges(edges);
}

/**
 * Calculate weight based on proximity in workflow
 * Tools closer together in a workflow have higher weight
 */
function calculateWorkflowWeight(index1: number, index2: number, totalSteps: number): number {
  const distance = Math.abs(index2 - index1);
  const maxDistance = totalSteps - 1;

  if (maxDistance === 0) return 1;

  // Inverse distance: closer = higher weight
  return 1 - distance / maxDistance;
}

/**
 * Merge duplicate edges and sum their weights
 */
function mergeEdges(edges: InsightEdge[]): InsightEdge[] {
  const edgeMap = new Map<string, InsightEdge>();

  for (const edge of edges) {
    const key = `${edge.source}-${edge.target}`;
    const existing = edgeMap.get(key);

    if (existing) {
      // Sum weights and normalize to max 1.0
      existing.weight = Math.min(1.0, existing.weight + edge.weight);
    } else {
      edgeMap.set(key, { ...edge });
    }
  }

  return Array.from(edgeMap.values());
}

/**
 * Get workflow count for each tool
 */
export function calculateWorkflowCounts(tools: Tool[], workflows: Workflow[]): Map<string, number> {
  const counts = new Map<string, number>();

  for (const tool of tools) {
    counts.set(tool.id, 0);
  }

  for (const workflow of workflows) {
    for (const toolId of workflow.steps) {
      const current = counts.get(toolId) || 0;
      counts.set(toolId, current + 1);
    }
  }

  return counts;
}
