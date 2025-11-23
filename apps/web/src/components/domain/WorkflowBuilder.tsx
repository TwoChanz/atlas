import React, { useState } from 'react';
import { useToolsStore } from '../../store/toolsStore';
import { useWorkflowsStore } from '../../store/workflowsStore';
import type { Workflow } from '@atlas/core';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { TagInput } from '../common/TagInput';
import './WorkflowBuilder.css';

interface WorkflowBuilderProps {
  className?: string;
}

export function WorkflowBuilder({ className = '' }: WorkflowBuilderProps) {
  const tools = useToolsStore((state) => state.tools);
  const workflows = useWorkflowsStore((state) => state.workflows);
  const addWorkflow = useWorkflowsStore((state) => state.addWorkflow);
  const updateWorkflow = useWorkflowsStore((state) => state.updateWorkflow);
  const deleteWorkflow = useWorkflowsStore((state) => state.deleteWorkflow);

  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: [] as string[],
    frequency: '' as 'daily' | 'weekly' | 'monthly' | 'occasional' | '',
    notes: '',
  });
  const [workflowSteps, setWorkflowSteps] = useState<string[]>([]);
  const [draggedToolId, setDraggedToolId] = useState<string | null>(null);
  const [draggedStepIndex, setDraggedStepIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedWorkflow = selectedWorkflowId
    ? workflows.find((w) => w.id === selectedWorkflowId)
    : null;

  const handleSelectWorkflow = (workflow: Workflow) => {
    setSelectedWorkflowId(workflow.id);
    setIsCreating(false);
    setFormData({
      name: workflow.name,
      description: workflow.description || '',
      tags: workflow.tags,
      frequency: workflow.frequency || '',
      notes: workflow.notes || '',
    });
    setWorkflowSteps(workflow.steps);
  };

  const handleCreateNew = () => {
    setSelectedWorkflowId(null);
    setIsCreating(true);
    setFormData({
      name: '',
      description: '',
      tags: [],
      frequency: '',
      notes: '',
    });
    setWorkflowSteps([]);
  };

  const handleSave = () => {
    if (!formData.name.trim() || workflowSteps.length === 0) {
      alert('Please provide a name and at least one step');
      return;
    }

    const workflowData = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      steps: workflowSteps,
      tags: formData.tags,
      frequency: formData.frequency || undefined,
      notes: formData.notes.trim() || undefined,
    };

    if (selectedWorkflowId) {
      updateWorkflow(selectedWorkflowId, workflowData);
    } else {
      addWorkflow(workflowData);
      setIsCreating(false);
    }

    // Reset form
    setFormData({
      name: '',
      description: '',
      tags: [],
      frequency: '',
      notes: '',
    });
    setWorkflowSteps([]);
    setSelectedWorkflowId(null);
  };

  const handleDelete = () => {
    if (!selectedWorkflowId) return;
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      deleteWorkflow(selectedWorkflowId);
      setSelectedWorkflowId(null);
      setFormData({
        name: '',
        description: '',
        tags: [],
        frequency: '',
        notes: '',
      });
      setWorkflowSteps([]);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setSelectedWorkflowId(null);
    setFormData({
      name: '',
      description: '',
      tags: [],
      frequency: '',
      notes: '',
    });
    setWorkflowSteps([]);
  };

  // Drag and drop handlers
  const handleToolDragStart = (toolId: string) => {
    setDraggedToolId(toolId);
  };

  const handleStepDragStart = (index: number) => {
    setDraggedStepIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnSteps = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedToolId && !workflowSteps.includes(draggedToolId)) {
      setWorkflowSteps([...workflowSteps, draggedToolId]);
    }
    setDraggedToolId(null);
  };

  const handleDropOnStep = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();

    if (draggedStepIndex !== null) {
      // Reordering within steps
      const newSteps = [...workflowSteps];
      const [movedStep] = newSteps.splice(draggedStepIndex, 1);
      newSteps.splice(targetIndex, 0, movedStep!);
      setWorkflowSteps(newSteps);
      setDraggedStepIndex(null);
    } else if (draggedToolId && !workflowSteps.includes(draggedToolId)) {
      // Adding new tool at specific position
      const newSteps = [...workflowSteps];
      newSteps.splice(targetIndex, 0, draggedToolId);
      setWorkflowSteps(newSteps);
      setDraggedToolId(null);
    }
  };

  const handleRemoveStep = (index: number) => {
    setWorkflowSteps(workflowSteps.filter((_, i) => i !== index));
  };

  const filteredTools = tools.filter((tool) =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isEditing = selectedWorkflowId !== null || isCreating;

  return (
    <div className={`workflow-builder ${className}`}>
      <div className="workflow-builder-sidebar">
        <div className="sidebar-header">
          <h2>Workflows</h2>
          <Button size="sm" onClick={handleCreateNew}>
            + New
          </Button>
        </div>
        <div className="workflow-list">
          {workflows.length === 0 ? (
            <div className="empty-state-small">
              <p>No workflows yet</p>
              <p className="text-sm">Create your first workflow</p>
            </div>
          ) : (
            workflows.map((workflow) => (
              <div
                key={workflow.id}
                className={`workflow-item ${selectedWorkflowId === workflow.id ? 'active' : ''}`}
                onClick={() => handleSelectWorkflow(workflow)}
              >
                <div className="workflow-item-name">{workflow.name}</div>
                <div className="workflow-item-meta">
                  {workflow.steps.length} step{workflow.steps.length !== 1 ? 's' : ''}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="workflow-builder-main">
        {!isEditing ? (
          <div className="workflow-empty-state">
            <p>Select a workflow to edit or create a new one</p>
          </div>
        ) : (
          <>
            <div className="workflow-form">
              <Input
                label="Workflow Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Design to Development Handoff"
              />

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this workflow..."
                  rows={2}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Frequency</label>
                  <select
                    value={formData.frequency}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        frequency: e.target.value as typeof formData.frequency,
                      })
                    }
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="occasional">Occasional</option>
                  </select>
                </div>

                <TagInput
                  label="Tags"
                  tags={formData.tags}
                  onChange={(tags) => setFormData({ ...formData, tags })}
                  placeholder="Add tags..."
                />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes..."
                  rows={2}
                />
              </div>
            </div>

            <div className="workflow-steps-section">
              <h3>Workflow Steps</h3>
              <p className="steps-hint">
                Drag tools from the right panel to add them to your workflow
              </p>

              <div
                className="workflow-steps"
                onDragOver={handleDragOver}
                onDrop={handleDropOnSteps}
              >
                {workflowSteps.length === 0 ? (
                  <div className="steps-empty">
                    <p>No steps yet</p>
                    <p className="text-sm">Drag tools here to build your workflow</p>
                  </div>
                ) : (
                  workflowSteps.map((toolId, index) => {
                    const tool = tools.find((t) => t.id === toolId);
                    if (!tool) return null;

                    return (
                      <div
                        key={toolId}
                        className="workflow-step"
                        draggable
                        onDragStart={() => handleStepDragStart(index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDropOnStep(e, index)}
                      >
                        <div className="step-number">{index + 1}</div>
                        <div className="step-content">
                          <div className="step-name">{tool.name}</div>
                          {tool.url && <div className="step-url">{tool.url}</div>}
                        </div>
                        <button
                          className="step-remove"
                          onClick={() => handleRemoveStep(index)}
                          title="Remove step"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="workflow-actions">
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              {selectedWorkflowId && (
                <Button variant="secondary" onClick={handleDelete}>
                  Delete
                </Button>
              )}
              <Button onClick={handleSave}>Save Workflow</Button>
            </div>
          </>
        )}
      </div>

      <div className="workflow-builder-tools">
        <div className="tools-header">
          <h3>Available Tools</h3>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools..."
          />
        </div>
        <div className="tools-list">
          {filteredTools.length === 0 ? (
            <div className="empty-state-small">
              <p>No tools found</p>
            </div>
          ) : (
            filteredTools.map((tool) => (
              <div
                key={tool.id}
                className={`tool-item ${workflowSteps.includes(tool.id) ? 'in-workflow' : ''}`}
                draggable
                onDragStart={() => handleToolDragStart(tool.id)}
              >
                <div className="tool-name">{tool.name}</div>
                {workflowSteps.includes(tool.id) && (
                  <span className="tool-badge">Added</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
