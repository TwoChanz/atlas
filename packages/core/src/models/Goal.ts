import type { GoalPriority, GoalStatus } from '../types';

export interface Goal {
  id: string;
  name: string;
  description: string;
  /** Tool IDs related to this goal */
  relatedTools: string[];
  /** Workflow IDs related to this goal */
  relatedWorkflows: string[];
  priority: GoalPriority;
  status: GoalStatus;
  targetDate?: number;
  createdAt: number;
  updatedAt: number;
  tags?: string[];
}

/**
 * Factory function to create a new Goal with defaults
 */
export function createGoal(
  data: Pick<Goal, 'name' | 'description'> &
    Partial<Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>>
): Goal {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    name: data.name,
    description: data.description,
    relatedTools: data.relatedTools || [],
    relatedWorkflows: data.relatedWorkflows || [],
    priority: data.priority || 'medium',
    status: data.status || 'active',
    targetDate: data.targetDate,
    createdAt: now,
    updatedAt: now,
    tags: data.tags,
  };
}
