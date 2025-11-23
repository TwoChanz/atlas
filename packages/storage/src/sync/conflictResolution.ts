import type { Tool, Workflow, Goal } from '@atlas/core';

/**
 * Conflict resolution strategies
 */

export type ConflictResolutionStrategy = 'last-write-wins' | 'manual' | 'merge';

/**
 * Resolve conflicts between local and remote data using last-write-wins strategy
 */
export function resolveConflictLastWriteWins<T extends { id: string; updatedAt: number }>(
  local: T,
  remote: T
): T {
  return local.updatedAt > remote.updatedAt ? local : remote;
}

/**
 * Merge two arrays of items, resolving conflicts using the provided strategy
 */
export function mergeItems<T extends { id: string; updatedAt: number }>(
  localItems: T[],
  remoteItems: T[],
  strategy: ConflictResolutionStrategy = 'last-write-wins'
): T[] {
  const merged = new Map<string, T>();

  // Add all local items
  for (const item of localItems) {
    merged.set(item.id, item);
  }

  // Merge remote items
  for (const remoteItem of remoteItems) {
    const localItem = merged.get(remoteItem.id);

    if (!localItem) {
      // Item only exists in remote
      merged.set(remoteItem.id, remoteItem);
    } else if (strategy === 'last-write-wins') {
      // Resolve conflict using last-write-wins
      merged.set(remoteItem.id, resolveConflictLastWriteWins(localItem, remoteItem));
    }
    // For 'manual' strategy, keep local version (requires UI intervention)
  }

  return Array.from(merged.values());
}

/**
 * Merge tools from local and remote sources
 */
export function mergeTools(
  localTools: Tool[],
  remoteTools: Tool[],
  strategy?: ConflictResolutionStrategy
): Tool[] {
  return mergeItems(localTools, remoteTools, strategy);
}

/**
 * Merge workflows from local and remote sources
 */
export function mergeWorkflows(
  localWorkflows: Workflow[],
  remoteWorkflows: Workflow[],
  strategy?: ConflictResolutionStrategy
): Workflow[] {
  return mergeItems(localWorkflows, remoteWorkflows, strategy);
}

/**
 * Merge goals from local and remote sources
 */
export function mergeGoals(
  localGoals: Goal[],
  remoteGoals: Goal[],
  strategy?: ConflictResolutionStrategy
): Goal[] {
  return mergeItems(localGoals, remoteGoals, strategy);
}
