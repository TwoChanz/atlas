import type { Tool, Workflow, Goal, InsightEdge, EdgeType } from '@atlas/core';
import { openAtlasDB } from './schema';

/**
 * Storage error class
 */
export class StorageError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'StorageError';
  }
}

// ============================================================================
// TOOL OPERATIONS
// ============================================================================

export async function getAllTools(): Promise<Tool[]> {
  try {
    const db = await openAtlasDB();
    return await db.getAll('tools');
  } catch (error) {
    throw new StorageError('Failed to get all tools', error as Error);
  }
}

export async function getTool(id: string): Promise<Tool | undefined> {
  try {
    const db = await openAtlasDB();
    return await db.get('tools', id);
  } catch (error) {
    throw new StorageError(`Failed to get tool ${id}`, error as Error);
  }
}

export async function getToolsByTag(tag: string): Promise<Tool[]> {
  try {
    const db = await openAtlasDB();
    return await db.getAllFromIndex('tools', 'by-tag', tag);
  } catch (error) {
    throw new StorageError(`Failed to get tools by tag ${tag}`, error as Error);
  }
}

export async function getToolsByType(type: string): Promise<Tool[]> {
  try {
    const db = await openAtlasDB();
    return await db.getAllFromIndex('tools', 'by-type', type);
  } catch (error) {
    throw new StorageError(`Failed to get tools by type ${type}`, error as Error);
  }
}

export async function saveTool(tool: Tool): Promise<void> {
  try {
    const db = await openAtlasDB();
    await db.put('tools', tool);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      throw new StorageError('Storage quota exceeded', error);
    }
    throw new StorageError(`Failed to save tool ${tool.id}`, error as Error);
  }
}

export async function saveTools(tools: Tool[]): Promise<void> {
  try {
    const db = await openAtlasDB();
    const tx = db.transaction('tools', 'readwrite');
    await Promise.all([...tools.map((tool) => tx.store.put(tool)), tx.done]);
  } catch (error) {
    throw new StorageError('Failed to save tools', error as Error);
  }
}

export async function deleteTool(id: string): Promise<void> {
  try {
    const db = await openAtlasDB();
    await db.delete('tools', id);
  } catch (error) {
    throw new StorageError(`Failed to delete tool ${id}`, error as Error);
  }
}

// ============================================================================
// WORKFLOW OPERATIONS
// ============================================================================

export async function getAllWorkflows(): Promise<Workflow[]> {
  try {
    const db = await openAtlasDB();
    return await db.getAll('workflows');
  } catch (error) {
    throw new StorageError('Failed to get all workflows', error as Error);
  }
}

export async function getWorkflow(id: string): Promise<Workflow | undefined> {
  try {
    const db = await openAtlasDB();
    return await db.get('workflows', id);
  } catch (error) {
    throw new StorageError(`Failed to get workflow ${id}`, error as Error);
  }
}

export async function saveWorkflow(workflow: Workflow): Promise<void> {
  try {
    const db = await openAtlasDB();
    await db.put('workflows', workflow);
  } catch (error) {
    throw new StorageError(`Failed to save workflow ${workflow.id}`, error as Error);
  }
}

export async function deleteWorkflow(id: string): Promise<void> {
  try {
    const db = await openAtlasDB();
    await db.delete('workflows', id);
  } catch (error) {
    throw new StorageError(`Failed to delete workflow ${id}`, error as Error);
  }
}

// ============================================================================
// GOAL OPERATIONS
// ============================================================================

export async function getAllGoals(): Promise<Goal[]> {
  try {
    const db = await openAtlasDB();
    return await db.getAll('goals');
  } catch (error) {
    throw new StorageError('Failed to get all goals', error as Error);
  }
}

export async function getGoal(id: string): Promise<Goal | undefined> {
  try {
    const db = await openAtlasDB();
    return await db.get('goals', id);
  } catch (error) {
    throw new StorageError(`Failed to get goal ${id}`, error as Error);
  }
}

export async function getGoalsByStatus(status: string): Promise<Goal[]> {
  try {
    const db = await openAtlasDB();
    return await db.getAllFromIndex('goals', 'by-status', status);
  } catch (error) {
    throw new StorageError(`Failed to get goals by status ${status}`, error as Error);
  }
}

export async function saveGoal(goal: Goal): Promise<void> {
  try {
    const db = await openAtlasDB();
    await db.put('goals', goal);
  } catch (error) {
    throw new StorageError(`Failed to save goal ${goal.id}`, error as Error);
  }
}

export async function deleteGoal(id: string): Promise<void> {
  try {
    const db = await openAtlasDB();
    await db.delete('goals', id);
  } catch (error) {
    throw new StorageError(`Failed to delete goal ${id}`, error as Error);
  }
}

// ============================================================================
// EDGE OPERATIONS
// ============================================================================

export async function getAllEdges(): Promise<InsightEdge[]> {
  try {
    const db = await openAtlasDB();
    return await db.getAll('edges');
  } catch (error) {
    throw new StorageError('Failed to get all edges', error as Error);
  }
}

export async function getEdgesBySource(sourceId: string): Promise<InsightEdge[]> {
  try {
    const db = await openAtlasDB();
    return await db.getAllFromIndex('edges', 'by-source', sourceId);
  } catch (error) {
    throw new StorageError(`Failed to get edges by source ${sourceId}`, error as Error);
  }
}

export async function getEdgesByType(type: EdgeType): Promise<InsightEdge[]> {
  try {
    const db = await openAtlasDB();
    return await db.getAllFromIndex('edges', 'by-type', type);
  } catch (error) {
    throw new StorageError(`Failed to get edges by type ${type}`, error as Error);
  }
}

export async function saveEdge(edge: InsightEdge): Promise<void> {
  try {
    const db = await openAtlasDB();
    await db.put('edges', edge);
  } catch (error) {
    throw new StorageError(`Failed to save edge ${edge.id}`, error as Error);
  }
}

export async function saveEdges(edges: InsightEdge[]): Promise<void> {
  try {
    const db = await openAtlasDB();
    const tx = db.transaction('edges', 'readwrite');
    await Promise.all([...edges.map((edge) => tx.store.put(edge)), tx.done]);
  } catch (error) {
    throw new StorageError('Failed to save edges', error as Error);
  }
}

export async function deleteEdge(id: string): Promise<void> {
  try {
    const db = await openAtlasDB();
    await db.delete('edges', id);
  } catch (error) {
    throw new StorageError(`Failed to delete edge ${id}`, error as Error);
  }
}

export async function clearAllEdges(): Promise<void> {
  try {
    const db = await openAtlasDB();
    await db.clear('edges');
  } catch (error) {
    throw new StorageError('Failed to clear all edges', error as Error);
  }
}

// ============================================================================
// BATCH OPERATIONS
// ============================================================================

export async function clearAllData(): Promise<void> {
  try {
    const db = await openAtlasDB();
    const tx = db.transaction(['tools', 'workflows', 'goals', 'edges'], 'readwrite');
    await Promise.all([
      tx.objectStore('tools').clear(),
      tx.objectStore('workflows').clear(),
      tx.objectStore('goals').clear(),
      tx.objectStore('edges').clear(),
      tx.done,
    ]);
  } catch (error) {
    throw new StorageError('Failed to clear all data', error as Error);
  }
}
