import React from 'react';
import type { Tool } from '@atlas/core';
import './ToolCard.css';

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <div className="tool-card">
      <div className="tool-card-header">
        <h3 className="tool-card-title">{tool.name}</h3>
        {tool.type && <span className="tool-card-type">{tool.type}</span>}
      </div>

      {tool.tags.length > 0 && (
        <div className="tool-card-tags">
          {tool.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      {tool.usage && (
        <div className="tool-card-usage">
          <span className="text-sm text-gray-500">
            Visits: {tool.usage.visitCount}
          </span>
        </div>
      )}
    </div>
  );
}
