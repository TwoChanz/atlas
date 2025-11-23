import type { WorkflowFrequency } from '../types';

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  /** Array of tool IDs in sequence */
  steps: string[];
  tags: string[];
  notes?: string;
  createdAt: number;
  updatedAt: number;
  category?: string;
  frequency?: WorkflowFrequency;
}

/**
 * Factory function to create a new Workflow with defaults
 */
export function createWorkflow(
  data: Pick<Workflow, 'name'> & Partial<Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>>
): Workflow {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    name: data.name,
    description: data.description,
    steps: data.steps || [],
    tags: data.tags || [],
    notes: data.notes,
    createdAt: now,
    updatedAt: now,
    category: data.category,
    frequency: data.frequency,
  };
}
