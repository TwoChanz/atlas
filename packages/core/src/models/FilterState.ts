import type { ToolType, UsageRecency } from '../types';

export interface FilterState {
  tags?: string[];
  types?: ToolType[];
  goals?: string[];
  workflows?: string[];
  usageRecency?: UsageRecency;
  monetizationOnly?: boolean;
  searchQuery?: string;
}

/**
 * Check if any filters are active
 */
export function hasActiveFilters(filters: FilterState): boolean {
  return !!(
    (filters.tags && filters.tags.length > 0) ||
    (filters.types && filters.types.length > 0) ||
    (filters.goals && filters.goals.length > 0) ||
    (filters.workflows && filters.workflows.length > 0) ||
    filters.usageRecency ||
    filters.monetizationOnly ||
    filters.searchQuery
  );
}

/**
 * Create an empty FilterState
 */
export function createEmptyFilterState(): FilterState {
  return {};
}
