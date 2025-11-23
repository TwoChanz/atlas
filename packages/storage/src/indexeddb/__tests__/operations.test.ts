import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTool, createWorkflow, createGoal } from '@atlas/core';
import {
  getAllTools,
  getToolById,
  getToolsByTag,
  saveTool,
  updateTool,
  deleteTool,
  getAllWorkflows,
  saveWorkflow,
  getAllGoals,
  saveGoal,
} from '../operations';
import { openAtlasDB } from '../schema';

describe('Tool Operations', () => {
  beforeEach(async () => {
    // Clear database before each test
    const db = await openAtlasDB();
    await db.clear('tools');
    await db.clear('workflows');
    await db.clear('goals');
  });

  afterEach(async () => {
    // Clean up after each test
    const db = await openAtlasDB();
    await db.clear('tools');
    await db.clear('workflows');
    await db.clear('goals');
  });

  describe('saveTool', () => {
    it('should save a tool to the database', async () => {
      const tool = createTool({
        name: 'Figma',
        url: 'https://figma.com',
        tags: ['design'],
      });

      await saveTool(tool);

      const retrieved = await getToolById(tool.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe('Figma');
      expect(retrieved?.url).toBe('https://figma.com');
    });

    it('should update existing tool with same id', async () => {
      const tool = createTool({ name: 'Figma', id: 'test-id' });
      await saveTool(tool);

      const updated = { ...tool, name: 'Figma Updated' };
      await saveTool(updated);

      const retrieved = await getToolById('test-id');
      expect(retrieved?.name).toBe('Figma Updated');
    });
  });

  describe('getAllTools', () => {
    it('should return all tools', async () => {
      const tool1 = createTool({ name: 'Tool 1' });
      const tool2 = createTool({ name: 'Tool 2' });

      await saveTool(tool1);
      await saveTool(tool2);

      const tools = await getAllTools();
      expect(tools).toHaveLength(2);
    });

    it('should return empty array when no tools exist', async () => {
      const tools = await getAllTools();
      expect(tools).toHaveLength(0);
    });
  });

  describe('getToolById', () => {
    it('should return tool by id', async () => {
      const tool = createTool({ name: 'Figma', id: 'test-id' });
      await saveTool(tool);

      const retrieved = await getToolById('test-id');
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe('test-id');
    });

    it('should return undefined for non-existent id', async () => {
      const retrieved = await getToolById('non-existent');
      expect(retrieved).toBeUndefined();
    });
  });

  describe('getToolsByTag', () => {
    it('should return tools with specific tag', async () => {
      const tool1 = createTool({ name: 'Figma', tags: ['design', 'ui'] });
      const tool2 = createTool({ name: 'Sketch', tags: ['design'] });
      const tool3 = createTool({ name: 'Notion', tags: ['productivity'] });

      await saveTool(tool1);
      await saveTool(tool2);
      await saveTool(tool3);

      const designTools = await getToolsByTag('design');
      expect(designTools).toHaveLength(2);
      expect(designTools.map((t) => t.name)).toContain('Figma');
      expect(designTools.map((t) => t.name)).toContain('Sketch');
    });

    it('should return empty array for non-existent tag', async () => {
      const tool = createTool({ name: 'Tool', tags: ['tag1'] });
      await saveTool(tool);

      const tools = await getToolsByTag('non-existent');
      expect(tools).toHaveLength(0);
    });
  });

  describe('updateTool', () => {
    it('should update tool properties', async () => {
      const tool = createTool({ name: 'Figma', tags: ['design'] });
      await saveTool(tool);

      await updateTool(tool.id, {
        name: 'Figma Updated',
        tags: ['design', 'ui'],
      });

      const updated = await getToolById(tool.id);
      expect(updated?.name).toBe('Figma Updated');
      expect(updated?.tags).toEqual(['design', 'ui']);
    });

    it('should update updatedAt timestamp', async () => {
      const tool = createTool({ name: 'Figma' });
      await saveTool(tool);

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      await updateTool(tool.id, { name: 'Updated' });

      const updated = await getToolById(tool.id);
      expect(updated?.updatedAt).toBeGreaterThan(tool.updatedAt);
    });
  });

  describe('deleteTool', () => {
    it('should delete tool from database', async () => {
      const tool = createTool({ name: 'Figma' });
      await saveTool(tool);

      await deleteTool(tool.id);

      const retrieved = await getToolById(tool.id);
      expect(retrieved).toBeUndefined();
    });

    it('should not throw when deleting non-existent tool', async () => {
      await expect(deleteTool('non-existent')).resolves.not.toThrow();
    });
  });
});

describe('Workflow Operations', () => {
  beforeEach(async () => {
    const db = await openAtlasDB();
    await db.clear('workflows');
  });

  it('should save and retrieve workflows', async () => {
    const workflow = createWorkflow({
      name: 'Design Process',
      steps: ['tool-1', 'tool-2'],
    });

    await saveWorkflow(workflow);

    const workflows = await getAllWorkflows();
    expect(workflows).toHaveLength(1);
    expect(workflows[0]!.name).toBe('Design Process');
    expect(workflows[0]!.steps).toEqual(['tool-1', 'tool-2']);
  });
});

describe('Goal Operations', () => {
  beforeEach(async () => {
    const db = await openAtlasDB();
    await db.clear('goals');
  });

  it('should save and retrieve goals', async () => {
    const goal = createGoal({
      name: 'Launch Product',
      description: 'Launch the MVP',
      relatedTools: ['tool-1'],
      relatedWorkflows: ['workflow-1'],
    });

    await saveGoal(goal);

    const goals = await getAllGoals();
    expect(goals).toHaveLength(1);
    expect(goals[0]!.name).toBe('Launch Product');
    expect(goals[0]!.relatedTools).toEqual(['tool-1']);
  });
});
