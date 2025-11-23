/**
 * Background service worker for Atlas Chrome Extension
 */

import type { Tool } from '@atlas/core';
import { createTool } from '@atlas/core';
import { saveTool } from '@atlas/storage';

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Atlas extension installed');
});

// Handle action button click - open side panel
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

// Message handler
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CAPTURE_TOOL') {
    handleCaptureTool(message.data)
      .then((tool) => {
        sendResponse({ success: true, tool });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep channel open for async response
  }

  if (message.type === 'GET_PAGE_INFO') {
    handleGetPageInfo(sender.tab)
      .then((pageInfo) => {
        sendResponse({ success: true, pageInfo });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
});

/**
 * Capture current page as a tool
 */
async function handleCaptureTool(data: {
  url: string;
  title: string;
  favicon?: string;
  description?: string;
}): Promise<Tool> {
  const tool = createTool({
    name: data.title,
    url: data.url,
    type: 'Site',
    tags: [],
    metadata: {
      favicon: data.favicon,
      description: data.description,
    },
    usage: {
      visitCount: 1,
      lastVisited: Date.now(),
      firstVisited: Date.now(),
    },
  });

  await saveTool(tool);
  return tool;
}

/**
 * Get page information from active tab
 */
async function handleGetPageInfo(tab?: chrome.tabs.Tab): Promise<{
  url: string;
  title: string;
  favicon?: string;
}> {
  if (!tab) {
    throw new Error('No active tab');
  }

  return {
    url: tab.url || '',
    title: tab.title || 'Untitled',
    favicon: tab.favIconUrl,
  };
}

// Track usage when user navigates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // TODO: Check if URL matches any existing tools and update usage
    trackToolUsage(tab.url);
  }
});

/**
 * Track tool usage
 */
async function trackToolUsage(url: string): Promise<void> {
  // TODO: Implement usage tracking
  // This will query storage for tools matching the URL and update visit count
  console.log('Tracking usage for:', url);
}
