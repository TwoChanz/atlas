import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import './MindmapView.css';

export function MindmapView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Cytoscape
    const cy = cytoscape({
      container: containerRef.current,
      elements: [
        // Sample nodes for demonstration
        { data: { id: 'welcome', label: 'Welcome to Atlas' } },
      ],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#3b82f6',
            label: 'data(label)',
            color: '#374151',
            'text-valign': 'center',
            'text-halign': 'center',
            width: 60,
            height: 60,
            'font-size': '12px',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 2,
            'line-color': '#94a3af',
            'target-arrow-color': '#94a3af',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
          },
        },
      ],
      layout: {
        name: 'preset',
        fit: true,
        padding: 30,
      },
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, []);

  return (
    <div className="mindmap-container">
      <div className="mindmap-header">
        <h2 className="text-lg font-semibold">Mindmap</h2>
      </div>
      <div ref={containerRef} className="mindmap-canvas" />
    </div>
  );
}
