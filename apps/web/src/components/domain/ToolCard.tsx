import React from 'react';
import type { Tool } from '@atlas/core';
import './ToolCard.css';

interface ToolCardProps {
  tool: Tool;
  onClick?: () => void;
}

export function ToolCard({ tool, onClick }: ToolCardProps) {
  return (
    <div className="tool-card" onClick={onClick}>
      <div className="tool-card-header">
        <h3 className="tool-card-title">{tool.name}</h3>
        {tool.type && <span className="tool-card-type">{tool.type}</span>}
      </div>

      {tool.url && (
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="tool-card-url"
          onClick={(e) => e.stopPropagation()}
        >
          {tool.url}
        </a>
      )}

      {tool.tags.length > 0 && (
        <div className="tool-card-tags">
          {tool.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      {tool.notes && <p className="tool-card-notes">{tool.notes}</p>}

      {tool.usage && (
        <div className="tool-card-usage">
          <span className="text-sm text-gray-500">Visits: {tool.usage.visitCount}</span>
          <span className="text-sm text-gray-500">
            Last: {new Date(tool.usage.lastVisited).toLocaleDateString()}
          </span>
        </div>
      )}
    </div>
  );
}
