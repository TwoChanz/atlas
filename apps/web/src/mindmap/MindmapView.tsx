import { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';
import type { InsightEdge } from '@atlas/core';
import { useToolsStore } from '../store/toolsStore';
import { useWorkflowsStore } from '../store/workflowsStore';
import { useGoalsStore } from '../store/goalsStore';
import { useMindmapStore } from '../store/mindmapStore';
import {
  generateTagClusters,
  generateWorkflowClusters,
  generateGoalClusters,
  generateFilterDrivenClusters,
} from '@atlas/insights';
import { CLUSTER_COLORS } from '@atlas/core';
import './MindmapView.css';

// Register Cytoscape extension
cytoscape.use(coseBilkent);

export function MindmapView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  const tools = useToolsStore((state) => state.tools);
  const workflows = useWorkflowsStore((state) => state.workflows);
  const goals = useGoalsStore((state) => state.goals);

  const clusterMode = useMindmapStore((state) => state.clusterMode);
  const filters = useMindmapStore((state) => state.filters);
  const setClusterMode = useMindmapStore((state) => state.setClusterMode);

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Cytoscape
    const cy = cytoscape({
      container: containerRef.current,
      elements: [],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': CLUSTER_COLORS.tag,
            label: 'data(label)',
            color: '#374151',
            'text-valign': 'center',
            'text-halign': 'center',
            width: 'data(size)',
            height: 'data(size)',
            'font-size': '10px',
            'text-wrap': 'wrap',
            'text-max-width': '60px',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 'data(weight)',
            'line-color': '#94a3af',
            'curve-style': 'bezier',
            opacity: 0.6,
          },
        },
        {
          selector: '.tag-edge',
          style: {
            'line-color': CLUSTER_COLORS.tag,
          },
        },
        {
          selector: '.workflow-edge',
          style: {
            'line-color': CLUSTER_COLORS.workflow,
          },
        },
        {
          selector: '.goal-edge',
          style: {
            'line-color': CLUSTER_COLORS.goal,
          },
        },
        {
          selector: '.filter-edge',
          style: {
            'line-color': CLUSTER_COLORS.filter,
          },
        },
      ],
      layout: {
        name: 'cose-bilkent',
        animate: true,
        animationDuration: 1000,
        nodeRepulsion: 4500,
        idealEdgeLength: 100,
        edgeElasticity: 0.45,
        nestingFactor: 0.1,
        gravity: 0.25,
        numIter: 2500,
        tile: true,
        tilingPaddingVertical: 10,
        tilingPaddingHorizontal: 10,
      } as any,
    });

    cyRef.current = cy;

    // Add click handler for nodes
    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      console.log('Clicked node:', node.data());
    });

    return () => {
      cy.destroy();
    };
  }, []);

  // Update graph when data changes
  useEffect(() => {
    if (!cyRef.current || tools.length === 0) return;

    updateGraph();
  }, [tools, workflows, goals, clusterMode, filters]);

  const updateGraph = () => {
    if (!cyRef.current) return;

    setIsGenerating(true);

    try {
      // Generate edges based on cluster mode
      let edges: InsightEdge[] = [];

      if (clusterMode === 'auto') {
        // Combine all clustering methods
        edges = [
          ...generateTagClusters(tools),
          ...generateWorkflowClusters(tools, workflows),
          ...generateGoalClusters(tools, goals),
        ];
      } else if (clusterMode === 'filter-driven') {
        edges = generateFilterDrivenClusters(tools, workflows, goals, filters);
      } else if (clusterMode === 'tag-only') {
        edges = generateTagClusters(tools);
      } else if (clusterMode === 'goal-focused') {
        edges = generateGoalClusters(tools, goals);
      }

      // Create nodes from tools
      const nodes = tools.map((tool) => ({
        data: {
          id: tool.id,
          label: tool.name,
          size: calculateNodeSize(tool),
          tool,
        },
      }));

      // Create edge elements
      const edgeElements = edges.map((edge) => ({
        data: {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          weight: Math.max(1, edge.weight * 3), // Scale weight for visibility
        },
        classes: `${edge.type}-edge`,
      }));

      // Update graph
      const cy = cyRef.current;
      cy.elements().remove();
      cy.add([...nodes, ...edgeElements]);

      // Run layout
      const layout = cy.layout({
        name: 'cose-bilkent',
        animate: true,
        animationDuration: 1000,
        nodeRepulsion: 4500,
        idealEdgeLength: 100,
        edgeElasticity: 0.45,
        gravity: 0.25,
        numIter: 2500,
      } as any);

      layout.run();
    } catch (error) {
      console.error('Error updating graph:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const calculateNodeSize = (tool: any) => {
    const baseSize = 50;
    const usageBonus = tool.usage ? Math.min(30, tool.usage.visitCount * 2) : 0;
    return baseSize + usageBonus;
  };

  const handleModeChange = (mode: typeof clusterMode) => {
    setClusterMode(mode);
  };

  if (tools.length === 0) {
    return (
      <div className="mindmap-container">
        <div className="mindmap-header">
          <h2 className="text-lg font-semibold">Mindmap</h2>
        </div>
        <div className="mindmap-empty">
          <p className="text-gray-500">No tools to visualize yet</p>
          <p className="text-sm text-gray-400 mt-2">Add some tools to see the mindmap</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mindmap-container">
      <div className="mindmap-header">
        <h2 className="text-lg font-semibold">Mindmap</h2>
        <div className="mindmap-controls">
          <select
            className="mindmap-mode-select"
            value={clusterMode}
            onChange={(e) => handleModeChange(e.target.value as typeof clusterMode)}
          >
            <option value="auto">Auto</option>
            <option value="filter-driven">Filter-Driven</option>
            <option value="tag-only">Tag Only</option>
            <option value="goal-focused">Goal Focused</option>
          </select>
        </div>
      </div>
      {isGenerating && (
        <div className="mindmap-loading">
          <p className="text-sm text-gray-600">Generating clusters...</p>
        </div>
      )}
      <div ref={containerRef} className="mindmap-canvas" />
      <div className="mindmap-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: CLUSTER_COLORS.tag }} />
          <span>Tags</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: CLUSTER_COLORS.workflow }} />
          <span>Workflows</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: CLUSTER_COLORS.goal }} />
          <span>Goals</span>
        </div>
      </div>
    </div>
  );
}
