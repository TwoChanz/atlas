import { create } from 'zustand';
import type { Workflow } from '@atlas/core';
import { createWorkflow } from '@atlas/core';
import {
  getAllWorkflows,
  saveWorkflow,
  deleteWorkflow as deleteWorkflowFromStorage,
} from '@atlas/storage';

interface WorkflowsState {
  workflows: Workflow[];
  selectedWorkflowId: string | null;
  isLoading: boolean;
  error: Error | null;

  // Actions
  loadWorkflows: () => Promise<void>;
  addWorkflow: (workflowData: Partial<Workflow>) => Promise<void>;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => Promise<void>;
  deleteWorkflow: (id: string) => Promise<void>;
  selectWorkflow: (id: string | null) => void;
}

export const useWorkflowsStore = create<WorkflowsState>((set, get) => ({
  workflows: [],
  selectedWorkflowId: null,
  isLoading: false,
  error: null,

  loadWorkflows: async () => {
    set({ isLoading: true, error: null });
    try {
      const workflows = await getAllWorkflows();
      set({ workflows, isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  addWorkflow: async (workflowData) => {
    const newWorkflow = createWorkflow({
      name: workflowData.name || 'Unnamed Workflow',
      ...workflowData,
    });

    try {
      await saveWorkflow(newWorkflow);
      set((state) => ({
        workflows: [...state.workflows, newWorkflow],
      }));
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  updateWorkflow: async (id, updates) => {
    const workflow = get().workflows.find((w) => w.id === id);
    if (!workflow) return;

    const updatedWorkflow = {
      ...workflow,
      ...updates,
      updatedAt: Date.now(),
    };

    try {
      await saveWorkflow(updatedWorkflow);
      set((state) => ({
        workflows: state.workflows.map((w) => (w.id === id ? updatedWorkflow : w)),
      }));
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  deleteWorkflow: async (id) => {
    try {
      await deleteWorkflowFromStorage(id);
      set((state) => ({
        workflows: state.workflows.filter((w) => w.id !== id),
        selectedWorkflowId: state.selectedWorkflowId === id ? null : state.selectedWorkflowId,
      }));
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  selectWorkflow: (id) => {
    set({ selectedWorkflowId: id });
  },
}));
