import type { Tool, Workflow } from '@atlas/core';
import { createWorkflow } from '@atlas/core';
import { calculateSimilarity } from '../analysis/similarityAnalysis';

/**
 * Suggest new workflows based on tool relationships
 */
export function suggestWorkflows(tools: Tool[], existingWorkflows: Workflow[]): Workflow[] {
  const suggestions: Workflow[] = [];

  // Find tools that are frequently tagged together but not in workflows
  const tagClusters = findTagClusters(tools);

  for (const cluster of tagClusters) {
    // Check if this cluster already has a workflow
    const hasWorkflow = existingWorkflows.some((w) =>
      cluster.every((toolId) => w.steps.includes(toolId))
    );

    if (!hasWorkflow && cluster.length >= 2) {
      const clusterTools = tools.filter((t) => cluster.includes(t.id));
      const commonTags = findCommonTags(clusterTools);

      suggestions.push(
        createWorkflow({
          name: `Suggested: ${commonTags[0] || 'Unnamed'} workflow`,
          description: `Auto-suggested workflow based on tag patterns`,
          steps: cluster,
          tags: commonTags,
        })
      );
    }
  }

  return suggestions;
}

/**
 * Find clusters of tools with shared tags
 */
function findTagClusters(tools: Tool[]): string[][] {
  const clusters: string[][] = [];
  const tagIndex = new Map<string, string[]>();

  // Build tag index
  for (const tool of tools) {
    for (const tag of tool.tags) {
      if (!tagIndex.has(tag)) {
        tagIndex.set(tag, []);
      }
      tagIndex.get(tag)!.push(tool.id);
    }
  }

  // Find clusters with 2+ tools
  for (const toolIds of tagIndex.values()) {
    if (toolIds.length >= 2) {
      clusters.push(toolIds);
    }
  }

  return clusters;
}

/**
 * Find common tags across tools
 */
function findCommonTags(tools: Tool[]): string[] {
  if (tools.length === 0) return [];

  const tagCounts = new Map<string, number>();

  for (const tool of tools) {
    for (const tag of tool.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
  }

  // Return tags that appear in at least half the tools
  const threshold = Math.ceil(tools.length / 2);
  return Array.from(tagCounts.entries())
    .filter(([, count]) => count >= threshold)
    .map(([tag]) => tag)
    .sort((a, b) => (tagCounts.get(b) || 0) - (tagCounts.get(a) || 0));
}

/**
 * Suggest next steps in a workflow based on existing patterns
 */
export function suggestNextSteps(
  currentWorkflow: Workflow,
  allTools: Tool[],
  allWorkflows: Workflow[]
): Tool[] {
  const suggestions: { tool: Tool; score: number }[] = [];

  // Get tools already in the workflow
  const workflowToolIds = new Set(currentWorkflow.steps);
  const lastStepId = currentWorkflow.steps[currentWorkflow.steps.length - 1];

  if (!lastStepId) return [];

  const lastTool = allTools.find((t) => t.id === lastStepId);

  if (!lastTool) return [];

  // Find similar tools not yet in the workflow
  for (const tool of allTools) {
    if (workflowToolIds.has(tool.id)) continue;

    let score = 0;

    // Score based on tag overlap with last tool
    const tagOverlap = lastTool.tags.filter((t) => tool.tags.includes(t)).length;
    score += tagOverlap * 0.3;

    // Score based on similarity
    score += calculateSimilarity(lastTool, tool) * 0.5;

    // Score based on appearance in other workflows after similar tools
    score += scoreFromWorkflowPatterns(tool.id, lastStepId, allWorkflows) * 0.2;

    if (score > 0.3) {
      suggestions.push({ tool, score });
    }
  }

  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((s) => s.tool);
}

/**
 * Score based on workflow patterns
 */
function scoreFromWorkflowPatterns(
  toolId: string,
  afterToolId: string,
  workflows: Workflow[]
): number {
  let score = 0;

  for (const workflow of workflows) {
    const afterIndex = workflow.steps.indexOf(afterToolId);
    const toolIndex = workflow.steps.indexOf(toolId);

    if (afterIndex >= 0 && toolIndex > afterIndex) {
      // Tool appears after the reference tool
      score += 1;
    }
  }

  return Math.min(1, score / workflows.length);
}
