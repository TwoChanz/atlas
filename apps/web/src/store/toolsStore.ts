import { create } from 'zustand';
import type { Tool } from '@atlas/core';
import { createTool } from '@atlas/core';
import {
  getAllTools,
  saveTool,
  deleteTool as deleteToolFromStorage,
} from '@atlas/storage';

interface ToolsState {
  tools: Tool[];
  selectedToolId: string | null;
  isLoading: boolean;
  error: Error | null;

  // Actions
  loadTools: () => Promise<void>;
  addTool: (toolData: Partial<Tool>) => Promise<void>;
  updateTool: (id: string, updates: Partial<Tool>) => Promise<void>;
  deleteTool: (id: string) => Promise<void>;
  selectTool: (id: string | null) => void;
}

export const useToolsStore = create<ToolsState>((set, get) => ({
  tools: [],
  selectedToolId: null,
  isLoading: false,
  error: null,

  loadTools: async () => {
    set({ isLoading: true, error: null });
    try {
      const tools = await getAllTools();
      set({ tools, isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  addTool: async (toolData) => {
    const newTool = createTool({
      name: toolData.name || 'Unnamed Tool',
      ...toolData,
    });

    try {
      await saveTool(newTool);
      set((state) => ({
        tools: [...state.tools, newTool],
      }));
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  updateTool: async (id, updates) => {
    const tool = get().tools.find((t) => t.id === id);
    if (!tool) return;

    const updatedTool = {
      ...tool,
      ...updates,
      updatedAt: Date.now(),
    };

    try {
      await saveTool(updatedTool);
      set((state) => ({
        tools: state.tools.map((t) => (t.id === id ? updatedTool : t)),
      }));
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  deleteTool: async (id) => {
    try {
      await deleteToolFromStorage(id);
      set((state) => ({
        tools: state.tools.filter((t) => t.id !== id),
        selectedToolId: state.selectedToolId === id ? null : state.selectedToolId,
      }));
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  selectTool: (id) => {
    set({ selectedToolId: id });
  },
}));
