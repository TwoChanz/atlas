import { create } from 'zustand';
import type { Goal } from '@atlas/core';
import { createGoal } from '@atlas/core';
import { getAllGoals, saveGoal, deleteGoal as deleteGoalFromStorage } from '@atlas/storage';

interface GoalsState {
  goals: Goal[];
  selectedGoalId: string | null;
  isLoading: boolean;
  error: Error | null;

  // Actions
  loadGoals: () => Promise<void>;
  addGoal: (goalData: Partial<Goal>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  selectGoal: (id: string | null) => void;
}

export const useGoalsStore = create<GoalsState>((set, get) => ({
  goals: [],
  selectedGoalId: null,
  isLoading: false,
  error: null,

  loadGoals: async () => {
    set({ isLoading: true, error: null });
    try {
      const goals = await getAllGoals();
      set({ goals, isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  addGoal: async (goalData) => {
    const newGoal = createGoal({
      name: goalData.name || 'Unnamed Goal',
      description: goalData.description || '',
      ...goalData,
    });

    try {
      await saveGoal(newGoal);
      set((state) => ({
        goals: [...state.goals, newGoal],
      }));
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  updateGoal: async (id, updates) => {
    const goal = get().goals.find((g) => g.id === id);
    if (!goal) return;

    const updatedGoal = {
      ...goal,
      ...updates,
      updatedAt: Date.now(),
    };

    try {
      await saveGoal(updatedGoal);
      set((state) => ({
        goals: state.goals.map((g) => (g.id === id ? updatedGoal : g)),
      }));
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  deleteGoal: async (id) => {
    try {
      await deleteGoalFromStorage(id);
      set((state) => ({
        goals: state.goals.filter((g) => g.id !== id),
        selectedGoalId: state.selectedGoalId === id ? null : state.selectedGoalId,
      }));
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  selectGoal: (id) => {
    set({ selectedGoalId: id });
  },
}));
