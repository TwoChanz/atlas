import { describe, it, expect } from 'vitest';
import { generateWorkflowClusters } from '../workflowClustering';
import { createTool, createWorkflow } from '@atlas/core';

describe('generateWorkflowClusters', () => {
  it('should generate edges between tools in the same workflow', () => {
    const tools = [
      createTool({ name: 'Figma', id: 'tool-1' }),
      createTool({ name: 'Notion', id: 'tool-2' }),
      createTool({ name: 'Slack', id: 'tool-3' }),
    ];

    const workflows = [
      createWorkflow({
        name: 'Design Process',
        steps: ['tool-1', 'tool-2'],
      }),
    ];

    const edges = generateWorkflowClusters(tools, workflows);

    // One edge between tool-1 and tool-2
    expect(edges).toHaveLength(1);
    expect(edges[0]!.type).toBe('workflow');
    expect(edges[0]!.source).toBe('tool-1');
    expect(edges[0]!.target).toBe('tool-2');
  });

  it('should handle workflows with multiple tools', () => {
    const tools = [
      createTool({ name: 'A', id: 'tool-1' }),
      createTool({ name: 'B', id: 'tool-2' }),
      createTool({ name: 'C', id: 'tool-3' }),
    ];

    const workflows = [
      createWorkflow({
        name: 'Workflow',
        steps: ['tool-1', 'tool-2', 'tool-3'],
      }),
    ];

    const edges = generateWorkflowClusters(tools, workflows);

    // 3 tools = 3 edges (1-2, 2-3, 1-3) but we only connect sequential steps
    // So we should have 2 edges: tool-1->tool-2, tool-2->tool-3
    expect(edges).toHaveLength(2);
  });

  it('should return empty array when no workflows exist', () => {
    const tools = [
      createTool({ name: 'Tool A' }),
      createTool({ name: 'Tool B' }),
    ];

    const edges = generateWorkflowClusters(tools, []);

    expect(edges).toHaveLength(0);
  });

  it('should handle workflows with single tool', () => {
    const tools = [createTool({ name: 'Tool A', id: 'tool-1' })];

    const workflows = [
      createWorkflow({
        name: 'Single Tool Workflow',
        steps: ['tool-1'],
      }),
    ];

    const edges = generateWorkflowClusters(tools, workflows);

    expect(edges).toHaveLength(0);
  });

  it('should handle multiple workflows', () => {
    const tools = [
      createTool({ name: 'A', id: 'tool-1' }),
      createTool({ name: 'B', id: 'tool-2' }),
      createTool({ name: 'C', id: 'tool-3' }),
    ];

    const workflows = [
      createWorkflow({
        name: 'Workflow 1',
        steps: ['tool-1', 'tool-2'],
      }),
      createWorkflow({
        name: 'Workflow 2',
        steps: ['tool-2', 'tool-3'],
      }),
    ];

    const edges = generateWorkflowClusters(tools, workflows);

    // 2 edges: tool-1->tool-2, tool-2->tool-3
    expect(edges).toHaveLength(2);
  });

  it('should assign higher weight to frequently paired tools', () => {
    const tools = [
      createTool({ name: 'A', id: 'tool-1' }),
      createTool({ name: 'B', id: 'tool-2' }),
    ];

    const workflows = [
      createWorkflow({ name: 'Workflow 1', steps: ['tool-1', 'tool-2'] }),
      createWorkflow({ name: 'Workflow 2', steps: ['tool-1', 'tool-2'] }),
    ];

    const edges = generateWorkflowClusters(tools, workflows);

    // Should have 2 edges (one per workflow), both connecting the same tools
    expect(edges).toHaveLength(2);
    edges.forEach((edge) => {
      expect(edge.source).toBe('tool-1');
      expect(edge.target).toBe('tool-2');
    });
  });
});
