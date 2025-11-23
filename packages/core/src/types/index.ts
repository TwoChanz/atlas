/**
 * Core type definitions for Atlas
 */

export type ToolType = 'App' | 'Site' | 'Blog' | 'API' | 'Marketplace' | 'Service';

export type GoalPriority = 'high' | 'medium' | 'low';
export type GoalStatus = 'active' | 'completed' | 'archived';

export type WorkflowFrequency = 'daily' | 'weekly' | 'monthly' | 'occasional';

export type EdgeType =
  | 'similarity'
  | 'usage'
  | 'workflow'
  | 'goal'
  | 'redundancy'
  | 'filter'
  | 'tag';

export type ClusterType =
  | 'tag'
  | 'workflow'
  | 'usage'
  | 'redundancy'
  | 'goal'
  | 'monetization'
  | 'leverage'
  | 'filter';

export type ClusterMode = 'auto' | 'filter-driven' | 'tag-only' | 'goal-focused';

export type UsageRecency = 'week' | 'month' | 'quarter';
