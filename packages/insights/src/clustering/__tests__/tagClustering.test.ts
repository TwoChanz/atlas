import { describe, it, expect } from 'vitest';
import { generateTagClusters } from '../tagClustering';
import { createTool } from '@atlas/core';

describe('generateTagClusters', () => {
  it('should generate edges between tools sharing tags', () => {
    const tools = [
      createTool({ name: 'Figma', tags: ['design', 'collaboration'] }),
      createTool({ name: 'Sketch', tags: ['design', 'ui'] }),
      createTool({ name: 'Notion', tags: ['productivity', 'notes'] }),
    ];

    const edges = generateTagClusters(tools);

    // Figma and Sketch share 'design' tag
    expect(edges).toHaveLength(1);
    expect(edges[0]!.type).toBe('tag');
    expect(edges[0]!.weight).toBeGreaterThan(0);
  });

  it('should return empty array when no tools share tags', () => {
    const tools = [
      createTool({ name: 'Tool A', tags: ['a'] }),
      createTool({ name: 'Tool B', tags: ['b'] }),
      createTool({ name: 'Tool C', tags: ['c'] }),
    ];

    const edges = generateTagClusters(tools);

    expect(edges).toHaveLength(0);
  });

  it('should calculate weight based on tag overlap', () => {
    const tools = [
      createTool({ name: 'Tool A', tags: ['design', 'ui', 'collaboration'] }),
      createTool({ name: 'Tool B', tags: ['design', 'ui'] }),
    ];

    const edges = generateTagClusters(tools);

    expect(edges).toHaveLength(1);
    // Jaccard similarity: 2 shared tags / 3 total unique tags = 0.666...
    expect(edges[0]!.weight).toBeCloseTo(0.666, 2);
  });

  it('should handle tools with no tags', () => {
    const tools = [
      createTool({ name: 'Tool A', tags: [] }),
      createTool({ name: 'Tool B', tags: ['design'] }),
    ];

    const edges = generateTagClusters(tools);

    expect(edges).toHaveLength(0);
  });

  it('should create edges for all pairs sharing tags', () => {
    const tools = [
      createTool({ name: 'Tool A', tags: ['design'] }),
      createTool({ name: 'Tool B', tags: ['design'] }),
      createTool({ name: 'Tool C', tags: ['design'] }),
    ];

    const edges = generateTagClusters(tools);

    // 3 tools sharing a tag = 3 pairwise edges (A-B, A-C, B-C)
    expect(edges).toHaveLength(3);
  });

  it('should handle single tool', () => {
    const tools = [createTool({ name: 'Tool A', tags: ['design'] })];

    const edges = generateTagClusters(tools);

    expect(edges).toHaveLength(0);
  });

  it('should handle empty tool list', () => {
    const edges = generateTagClusters([]);

    expect(edges).toHaveLength(0);
  });
});
