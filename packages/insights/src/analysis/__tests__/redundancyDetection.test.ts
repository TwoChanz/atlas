import { describe, it, expect } from 'vitest';
import { detectRedundantTools, groupRedundantTools } from '../redundancyDetection';
import { createTool } from '@atlas/core';

describe('detectRedundantTools', () => {
  it('should detect tools with high similarity', () => {
    const tools = [
      createTool({
        name: 'Figma',
        tags: ['design', 'collaboration', 'ui'],
      }),
      createTool({
        name: 'Sketch',
        tags: ['design', 'ui', 'prototyping'],
      }),
      createTool({
        name: 'Notion',
        tags: ['productivity', 'notes'],
      }),
    ];

    const edges = detectRedundantTools(tools, 0.5);

    // Figma and Sketch share 2/4 unique tags = 0.5 similarity
    expect(edges.length).toBeGreaterThan(0);
    expect(edges[0]!.type).toBe('redundancy');
  });

  it('should respect threshold parameter', () => {
    const tools = [
      createTool({ name: 'Tool A', tags: ['design', 'ui'] }),
      createTool({ name: 'Tool B', tags: ['design'] }),
    ];

    // Low threshold - should find edge
    const edgesLowThreshold = detectRedundantTools(tools, 0.3);
    expect(edgesLowThreshold).toHaveLength(1);

    // High threshold - should not find edge
    const edgesHighThreshold = detectRedundantTools(tools, 0.9);
    expect(edgesHighThreshold).toHaveLength(0);
  });

  it('should include similarity score in metadata', () => {
    const tools = [
      createTool({ name: 'Tool A', tags: ['a', 'b', 'c'] }),
      createTool({ name: 'Tool B', tags: ['a', 'b', 'c'] }),
    ];

    const edges = detectRedundantTools(tools, 0.5);

    expect(edges).toHaveLength(1);
    expect(edges[0]!.metadata?.strength).toBeCloseTo(1.0, 1);
    expect(edges[0]!.metadata?.reason).toContain('100% similar');
  });

  it('should return empty array when no redundant tools found', () => {
    const tools = [
      createTool({ name: 'Tool A', tags: ['a'] }),
      createTool({ name: 'Tool B', tags: ['b'] }),
    ];

    const edges = detectRedundantTools(tools, 0.7);

    expect(edges).toHaveLength(0);
  });
});

describe('groupRedundantTools', () => {
  it('should group tools into redundancy clusters', () => {
    const tools = [
      createTool({ name: 'Figma', tags: ['design', 'ui', 'collaboration'], id: 'tool-1' }),
      createTool({ name: 'Sketch', tags: ['design', 'ui'], id: 'tool-2' }),
      createTool({ name: 'Adobe XD', tags: ['design', 'ui', 'prototyping'], id: 'tool-3' }),
      createTool({ name: 'Notion', tags: ['productivity'], id: 'tool-4' }),
    ];

    const clusters = groupRedundantTools(tools, 0.4);

    // Should have one cluster with the 3 design tools
    expect(clusters.length).toBeGreaterThan(0);
    expect(clusters[0]!.tools.length).toBeGreaterThanOrEqual(2);
  });

  it('should calculate average similarity for clusters', () => {
    const tools = [
      createTool({ name: 'A', tags: ['tag1', 'tag2'], id: 'tool-1' }),
      createTool({ name: 'B', tags: ['tag1', 'tag2'], id: 'tool-2' }),
    ];

    const clusters = groupRedundantTools(tools, 0.5);

    expect(clusters).toHaveLength(1);
    expect(clusters[0]!.averageSimilarity).toBeGreaterThan(0);
  });

  it('should sort clusters by average similarity', () => {
    const tools = [
      createTool({ name: 'A', tags: ['a', 'b', 'c'], id: 'tool-1' }),
      createTool({ name: 'B', tags: ['a', 'b', 'c'], id: 'tool-2' }),
      createTool({ name: 'C', tags: ['x', 'y'], id: 'tool-3' }),
      createTool({ name: 'D', tags: ['x'], id: 'tool-4' }),
    ];

    const clusters = groupRedundantTools(tools, 0.3);

    if (clusters.length > 1) {
      // First cluster should have higher similarity than second
      expect(clusters[0]!.averageSimilarity).toBeGreaterThanOrEqual(
        clusters[1]!.averageSimilarity
      );
    }
  });

  it('should return empty array when no redundancy found', () => {
    const tools = [
      createTool({ name: 'A', tags: ['a'] }),
      createTool({ name: 'B', tags: ['b'] }),
    ];

    const clusters = groupRedundantTools(tools, 0.9);

    expect(clusters).toHaveLength(0);
  });

  it('should not include single-tool clusters', () => {
    const tools = [
      createTool({ name: 'A', tags: ['a', 'b'], id: 'tool-1' }),
      createTool({ name: 'B', tags: ['a', 'b'], id: 'tool-2' }),
      createTool({ name: 'C', tags: ['x'], id: 'tool-3' }),
    ];

    const clusters = groupRedundantTools(tools, 0.5);

    // Should only have cluster with A and B, not C alone
    clusters.forEach((cluster) => {
      expect(cluster.tools.length).toBeGreaterThan(1);
    });
  });
});
