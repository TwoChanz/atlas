import type { Tool, Workflow, Goal } from '@atlas/core';
import { STORAGE_KEYS } from '@atlas/core';

/**
 * Chrome Storage Sync Adapter
 * Handles syncing data with Chrome's storage.sync API for cross-device sync
 */

export interface SyncData {
  tools: Tool[];
  workflows: Workflow[];
  goals: Goal[];
  lastSyncTimestamp: number;
}

/**
 * Check if Chrome storage API is available
 */
export function isChromeStorageAvailable(): boolean {
  return typeof chrome !== 'undefined' && !!chrome.storage && !!chrome.storage.sync;
}

/**
 * Save data to Chrome storage sync
 */
export async function saveToChromeSync(data: Partial<SyncData>): Promise<void> {
  if (!isChromeStorageAvailable()) {
    throw new Error('Chrome storage API not available');
  }

  const syncData: Record<string, unknown> = {};

  if (data.tools) {
    syncData[STORAGE_KEYS.tools] = data.tools;
  }
  if (data.workflows) {
    syncData[STORAGE_KEYS.workflows] = data.workflows;
  }
  if (data.goals) {
    syncData[STORAGE_KEYS.goals] = data.goals;
  }
  if (data.lastSyncTimestamp) {
    syncData.lastSyncTimestamp = data.lastSyncTimestamp;
  }

  try {
    await chrome.storage.sync.set(syncData);
  } catch (error) {
    if (error instanceof Error && error.message.includes('QUOTA_BYTES')) {
      throw new Error('Chrome storage quota exceeded');
    }
    throw error;
  }
}

/**
 * Load data from Chrome storage sync
 */
export async function loadFromChromeSync(): Promise<Partial<SyncData>> {
  if (!isChromeStorageAvailable()) {
    throw new Error('Chrome storage API not available');
  }

  const keys = [
    STORAGE_KEYS.tools,
    STORAGE_KEYS.workflows,
    STORAGE_KEYS.goals,
    'lastSyncTimestamp',
  ];

  const result = await chrome.storage.sync.get(keys);

  return {
    tools: (result[STORAGE_KEYS.tools] as Tool[]) || [],
    workflows: (result[STORAGE_KEYS.workflows] as Workflow[]) || [],
    goals: (result[STORAGE_KEYS.goals] as Goal[]) || [],
    lastSyncTimestamp: (result.lastSyncTimestamp as number) || 0,
  };
}

/**
 * Clear Chrome storage sync
 */
export async function clearChromeSync(): Promise<void> {
  if (!isChromeStorageAvailable()) {
    throw new Error('Chrome storage API not available');
  }

  await chrome.storage.sync.clear();
}

/**
 * Listen to Chrome storage changes
 */
export function onChromeSyncChange(
  callback: (changes: chrome.storage.StorageChange, areaName: string) => void
): void {
  if (!isChromeStorageAvailable()) {
    throw new Error('Chrome storage API not available');
  }

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync') {
      callback(changes, areaName);
    }
  });
}
