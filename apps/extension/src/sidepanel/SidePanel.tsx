import { useState, useEffect } from 'react';
import { CaptureTool } from './components/CaptureTool';
import { QuickView } from './components/QuickView';

export function SidePanel() {
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | null>(null);

  useEffect(() => {
    // Get current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        setCurrentTab(tabs[0]);
      }
    });
  }, []);

  return (
    <div className="sidepanel">
      <div className="sidepanel-header">
        <h1 className="sidepanel-title">Atlas</h1>
        <p className="sidepanel-subtitle">Personal Tool Intelligence</p>
      </div>

      <div className="sidepanel-content">
        {currentTab && <CaptureTool tab={currentTab} />}
        <QuickView />
      </div>
    </div>
  );
}
