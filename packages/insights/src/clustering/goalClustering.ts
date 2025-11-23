import type { Tool, Goal, InsightEdge } from '@atlas/core';
import { createInsightEdge } from '@atlas/core';

/**
 * Generate edges between tools supporting the same goals
 */
export function generateGoalClusters(tools: Tool[], goals: Goal[]): InsightEdge[] {
  const edges: InsightEdge[] = [];

  // For each goal, create edges between related tools
  for (const goal of goals) {
    const relatedTools = goal.relatedTools;

    for (let i = 0; i < relatedTools.length; i++) {
      for (let j = i + 1; j < relatedTools.length; j++) {
        const sourceId = relatedTools[i];
        const targetId = relatedTools[j];

        if (!sourceId || !targetId) continue;

        // Weight based on goal priority
        const weight = calculateGoalWeight(goal);

        edges.push(
          createInsightEdge({
            source: sourceId,
            target: targetId,
            weight,
            type: 'goal',
            metadata: {
              reason: `Both support goal: ${goal.name}`,
            },
          })
        );
      }
    }
  }

  return mergeEdges(edges);
}

/**
 * Calculate weight based on goal priority
 */
function calculateGoalWeight(goal: Goal): number {
  const priorityWeights = {
    high: 1.0,
    medium: 0.7,
    low: 0.4,
  };

  const baseWeight = priorityWeights[goal.priority];

  // Boost weight if goal is active and has a target date
  if (goal.status === 'active' && goal.targetDate) {
    const daysUntilTarget = (goal.targetDate - Date.now()) / (1000 * 60 * 60 * 24);
    if (daysUntilTarget > 0 && daysUntilTarget < 30) {
      // Urgent goals get a boost
      return Math.min(1.0, baseWeight * 1.2);
    }
  }

  return baseWeight;
}

/**
 * Merge duplicate edges and sum weights
 */
function mergeEdges(edges: InsightEdge[]): InsightEdge[] {
  const edgeMap = new Map<string, InsightEdge>();

  for (const edge of edges) {
    const key = `${edge.source}-${edge.target}`;
    const existing = edgeMap.get(key);

    if (existing) {
      existing.weight = Math.min(1.0, existing.weight + edge.weight * 0.5);
    } else {
      edgeMap.set(key, { ...edge });
    }
  }

  return Array.from(edgeMap.values());
}

/**
 * Get tools not assigned to any active goal (gap analysis)
 */
export function findUnassignedTools(tools: Tool[], goals: Goal[]): Tool[] {
  const assignedToolIds = new Set<string>();

  for (const goal of goals) {
    if (goal.status === 'active') {
      for (const toolId of goal.relatedTools) {
        assignedToolIds.add(toolId);
      }
    }
  }

  return tools.filter((t) => !assignedToolIds.has(t.id));
}
