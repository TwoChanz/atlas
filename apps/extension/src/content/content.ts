/**
 * Content script for Atlas Chrome Extension
 * Extracts metadata from web pages
 */

/**
 * Extract page metadata
 */
function extractMetadata(): {
  title: string;
  description?: string;
  favicon?: string;
  ogImage?: string;
  keywords?: string[];
} {
  const getMetaContent = (name: string): string | undefined => {
    const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
    return meta?.getAttribute('content') || undefined;
  };

  const getLinkHref = (rel: string): string | undefined => {
    const link = document.querySelector(`link[rel="${rel}"]`);
    return link?.getAttribute('href') || undefined;
  };

  return {
    title: document.title,
    description: getMetaContent('description') || getMetaContent('og:description'),
    favicon: getLinkHref('icon') || getLinkHref('shortcut icon'),
    ogImage: getMetaContent('og:image'),
    keywords: getMetaContent('keywords')?.split(',').map((k) => k.trim()),
  };
}

/**
 * Listen for metadata requests from background script
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'EXTRACT_METADATA') {
    const metadata = extractMetadata();
    sendResponse({ success: true, metadata });
    return true;
  }
});

// Auto-detect if page is a tool/service
function detectToolType(): string | null {
  const url = window.location.hostname;

  // Common patterns
  if (url.includes('github.com')) return 'Development';
  if (url.includes('figma.com')) return 'Design';
  if (url.includes('notion.so')) return 'Productivity';
  if (url.includes('chatgpt.com') || url.includes('claude.ai')) return 'AI';

  return null;
}

// Export for potential future use
export { extractMetadata, detectToolType };
