import { create } from 'zustand';
import type { ClusterMode, FilterState, InsightEdge } from '@atlas/core';
import { createEmptyFilterState } from '@atlas/core';

interface MindmapState {
  clusterMode: ClusterMode;
  filters: FilterState;
  edges: InsightEdge[];
  isGenerating: boolean;

  // Actions
  setClusterMode: (mode: ClusterMode) => void;
  setFilters: (filters: FilterState) => void;
  updateFilter: (key: keyof FilterState, value: unknown) => void;
  clearFilters: () => void;
  setEdges: (edges: InsightEdge[]) => void;
  generateClusters: () => Promise<void>;
}

export const useMindmapStore = create<MindmapState>((set, _get) => ({
  clusterMode: 'auto',
  filters: createEmptyFilterState(),
  edges: [],
  isGenerating: false,

  setClusterMode: (mode) => {
    set({ clusterMode: mode });
  },

  setFilters: (filters) => {
    set({ filters });
  },

  updateFilter: (key, value) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    }));
  },

  clearFilters: () => {
    set({ filters: createEmptyFilterState() });
  },

  setEdges: (edges) => {
    set({ edges });
  },

  generateClusters: async () => {
    set({ isGenerating: true });
    try {
      // TODO: Call clustering algorithms
      // This will be implemented when we connect the mindmap to the stores
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({ isGenerating: false });
    } catch (error) {
      console.error('Failed to generate clusters:', error);
      set({ isGenerating: false });
    }
  },
}));
