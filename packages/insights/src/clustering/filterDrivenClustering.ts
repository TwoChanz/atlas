import type { Tool, Workflow, Goal, FilterState, InsightEdge } from '@atlas/core';
import { hasActiveFilters, USAGE_RECENCY } from '@atlas/core';
import { generateTagClusters } from './tagClustering';
import { generateWorkflowClusters } from './workflowClustering';
import { generateGoalClusters } from './goalClustering';

/**
 * Filter tools based on active filters
 */
export function filterTools(tools: Tool[], filters: FilterState): Tool[] {
  let filtered = [...tools];

  // Filter by tags
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((tool) => filters.tags!.some((tag) => tool.tags.includes(tag)));
  }

  // Filter by types
  if (filters.types && filters.types.length > 0) {
    filtered = filtered.filter((tool) => tool.type && filters.types!.includes(tool.type));
  }

  // Filter by usage recency
  if (filters.usageRecency) {
    const cutoff = Date.now() - USAGE_RECENCY[filters.usageRecency];
    filtered = filtered.filter((tool) => {
      if (!tool.usage) return false;
      return tool.usage.lastVisited >= cutoff;
    });
  }

  // Filter by monetization potential
  if (filters.monetizationOnly) {
    filtered = filtered.filter((tool) => {
      return tool.aiAttributes && (tool.aiAttributes.monetizationPotential || 0) > 0.5;
    });
  }

  // Filter by search query
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (tool) =>
        tool.name.toLowerCase().includes(query) ||
        tool.notes?.toLowerCase().includes(query) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  return filtered;
}

/**
 * Filter workflows based on filters
 */
export function filterWorkflows(workflows: Workflow[], filters: FilterState): Workflow[] {
  let filtered = [...workflows];

  // Filter by workflow IDs
  if (filters.workflows && filters.workflows.length > 0) {
    filtered = filtered.filter((w) => filters.workflows!.includes(w.id));
  }

  // Filter by tags
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((w) => filters.tags!.some((tag) => w.tags.includes(tag)));
  }

  return filtered;
}

/**
 * Filter goals based on filters
 */
export function filterGoals(goals: Goal[], filters: FilterState): Goal[] {
  let filtered = [...goals];

  // Filter by goal IDs
  if (filters.goals && filters.goals.length > 0) {
    filtered = filtered.filter((g) => filters.goals!.includes(g.id));
  }

  return filtered;
}

/**
 * Generate filter-driven clusters
 * Re-cluster based on the filtered subset of tools
 */
export function generateFilterDrivenClusters(
  tools: Tool[],
  workflows: Workflow[],
  goals: Goal[],
  filters: FilterState
): InsightEdge[] {
  if (!hasActiveFilters(filters)) {
    return [];
  }

  // Filter data
  const filteredTools = filterTools(tools, filters);
  const filteredWorkflows = filterWorkflows(workflows, filters);
  const filteredGoals = filterGoals(goals, filters);

  // Generate edges from filtered data
  const edges: InsightEdge[] = [];

  // Tag-based edges
  edges.push(...generateTagClusters(filteredTools));

  // Workflow-based edges
  if (filteredWorkflows.length > 0) {
    edges.push(...generateWorkflowClusters(filteredTools, filteredWorkflows));
  }

  // Goal-based edges
  if (filteredGoals.length > 0) {
    edges.push(...generateGoalClusters(filteredTools, filteredGoals));
  }

  // Mark all edges as filter-driven
  return edges.map((edge) => ({
    ...edge,
    type: 'filter' as const,
    metadata: {
      ...edge.metadata,
      reason: `Filter-driven cluster`,
    },
  }));
}
