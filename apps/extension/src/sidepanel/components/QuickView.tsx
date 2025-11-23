import React, { useEffect, useState } from 'react';
import type { Tool } from '@atlas/core';
import { getAllTools } from '@atlas/storage';

export function QuickView() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      const allTools = await getAllTools();
      // Show most recent 5 tools
      const recent = allTools
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .slice(0, 5);
      setTools(recent);
    } catch (error) {
      console.error('Failed to load tools:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="quick-view">Loading...</div>;
  }

  return (
    <div className="quick-view">
      <h2 className="quick-view-title">Recent Tools</h2>
      {tools.length === 0 ? (
        <p className="quick-view-empty">No tools captured yet</p>
      ) : (
        <ul className="quick-view-list">
          {tools.map((tool) => (
            <li key={tool.id} className="quick-view-item">
              <span className="quick-view-item-name">{tool.name}</span>
              {tool.tags.length > 0 && (
                <div className="quick-view-item-tags">
                  {tool.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="quick-view-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
