/**
 * Constants used across the Atlas application
 */

// Performance
export const MAX_VISIBLE_NODES = 1000;
export const CLUSTERING_TIMEOUT_MS = 200;

// Edge weights
export const DEFAULT_EDGE_WEIGHT = 0.5;
export const MIN_EDGE_WEIGHT = 0.1;
export const MAX_EDGE_WEIGHT = 1.0;

// Usage recency in milliseconds
export const USAGE_RECENCY = {
  week: 7 * 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000,
  quarter: 90 * 24 * 60 * 60 * 1000,
} as const;

// Cluster colors
export const CLUSTER_COLORS = {
  tag: '#3B82F6', // Blue
  workflow: '#10B981', // Green
  usage: '#F59E0B', // Amber
  redundancy: '#F97316', // Orange
  goal: '#8B5CF6', // Purple
  monetization: '#EAB308', // Gold
  leverage: '#1E40AF', // Deep Blue
  filter: '#06B6D4', // Cyan
} as const;

// Node styles by type
export const NODE_COLORS = {
  tool: '#3B82F6', // Blue
  tag: '#9CA3AF', // Gray
  workflow: '#10B981', // Green
  goal: '#8B5CF6', // Purple
} as const;

// Storage keys
export const STORAGE_KEYS = {
  tools: 'atlas-tools',
  workflows: 'atlas-workflows',
  goals: 'atlas-goals',
  edges: 'atlas-edges',
  settings: 'atlas-settings',
} as const;

// Database name
export const DB_NAME = 'atlas-db';
export const DB_VERSION = 1;
