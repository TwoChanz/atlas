import React, { useState } from 'react';
import { useToolsStore } from '../../store/toolsStore';
import { useWorkflowsStore } from '../../store/workflowsStore';
import { useGoalsStore } from '../../store/goalsStore';
import type { Goal } from '@atlas/core';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { TagInput } from '../common/TagInput';
import './GoalManager.css';

interface GoalManagerProps {
  className?: string;
}

export function GoalManager({ className = '' }: GoalManagerProps) {
  const tools = useToolsStore((state) => state.tools);
  const workflows = useWorkflowsStore((state) => state.workflows);
  const goals = useGoalsStore((state) => state.goals);
  const addGoal = useGoalsStore((state) => state.addGoal);
  const updateGoal = useGoalsStore((state) => state.updateGoal);
  const deleteGoal = useGoalsStore((state) => state.deleteGoal);

  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    status: 'active' as 'active' | 'completed' | 'archived',
    targetDate: '',
    tags: [] as string[],
  });
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>([]);
  const [selectedWorkflowIds, setSelectedWorkflowIds] = useState<string[]>([]);

  const selectedGoal = selectedGoalId ? goals.find((g) => g.id === selectedGoalId) : null;

  const handleSelectGoal = (goal: Goal) => {
    setSelectedGoalId(goal.id);
    setIsCreating(false);
    setFormData({
      name: goal.name,
      description: goal.description,
      priority: goal.priority,
      status: goal.status,
      targetDate: goal.targetDate ? new Date(goal.targetDate).toISOString().split('T')[0]! : '',
      tags: goal.tags || [],
    });
    setSelectedToolIds(goal.relatedTools);
    setSelectedWorkflowIds(goal.relatedWorkflows);
  };

  const handleCreateNew = () => {
    setSelectedGoalId(null);
    setIsCreating(true);
    setFormData({
      name: '',
      description: '',
      priority: 'medium',
      status: 'active',
      targetDate: '',
      tags: [],
    });
    setSelectedToolIds([]);
    setSelectedWorkflowIds([]);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      alert('Please provide a name and description');
      return;
    }

    const goalData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      status: formData.status,
      targetDate: formData.targetDate ? new Date(formData.targetDate).getTime() : undefined,
      tags: formData.tags,
      relatedTools: selectedToolIds,
      relatedWorkflows: selectedWorkflowIds,
    };

    if (selectedGoalId) {
      updateGoal(selectedGoalId, goalData);
    } else {
      addGoal(goalData);
      setIsCreating(false);
    }

    // Reset form
    handleCancel();
  };

  const handleDelete = () => {
    if (!selectedGoalId) return;
    if (window.confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(selectedGoalId);
      handleCancel();
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setSelectedGoalId(null);
    setFormData({
      name: '',
      description: '',
      priority: 'medium',
      status: 'active',
      targetDate: '',
      tags: [],
    });
    setSelectedToolIds([]);
    setSelectedWorkflowIds([]);
  };

  const toggleTool = (toolId: string) => {
    setSelectedToolIds((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
  };

  const toggleWorkflow = (workflowId: string) => {
    setSelectedWorkflowIds((prev) =>
      prev.includes(workflowId) ? prev.filter((id) => id !== workflowId) : [...prev, workflowId]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#DC2626';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#3B82F6';
      case 'completed':
        return '#10B981';
      case 'archived':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const isEditing = selectedGoalId !== null || isCreating;

  return (
    <div className={`goal-manager ${className}`}>
      <div className="goal-manager-sidebar">
        <div className="sidebar-header">
          <h2>Goals</h2>
          <Button size="sm" onClick={handleCreateNew}>
            + New
          </Button>
        </div>
        <div className="goal-list">
          {goals.length === 0 ? (
            <div className="empty-state-small">
              <p>No goals yet</p>
              <p className="text-sm">Create your first goal</p>
            </div>
          ) : (
            goals.map((goal) => (
              <div
                key={goal.id}
                className={`goal-item ${selectedGoalId === goal.id ? 'active' : ''}`}
                onClick={() => handleSelectGoal(goal)}
              >
                <div className="goal-item-header">
                  <div className="goal-item-name">{goal.name}</div>
                  <div
                    className="goal-item-priority"
                    style={{ backgroundColor: getPriorityColor(goal.priority) }}
                  >
                    {goal.priority}
                  </div>
                </div>
                <div className="goal-item-meta">
                  <span
                    className="goal-item-status"
                    style={{ color: getStatusColor(goal.status) }}
                  >
                    {goal.status}
                  </span>
                  {goal.targetDate && (
                    <span className="goal-item-date">
                      Due: {new Date(goal.targetDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="goal-manager-main">
        {!isEditing ? (
          <div className="goal-empty-state">
            <p>Select a goal to view details or create a new one</p>
          </div>
        ) : (
          <>
            <div className="goal-form">
              <Input
                label="Goal Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Launch SaaS Product"
              />

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your goal in detail..."
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as typeof formData.priority,
                      })
                    }
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as typeof formData.status,
                      })
                    }
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Target Date</label>
                  <input
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  />
                </div>
              </div>

              <TagInput
                label="Tags"
                tags={formData.tags}
                onChange={(tags) => setFormData({ ...formData, tags })}
                placeholder="Add tags..."
              />
            </div>

            <div className="goal-relationships">
              <div className="relationship-section">
                <h3>Related Tools ({selectedToolIds.length})</h3>
                <p className="relationship-hint">Select tools that support this goal</p>
                <div className="relationship-grid">
                  {tools.map((tool) => (
                    <label key={tool.id} className="relationship-item">
                      <input
                        type="checkbox"
                        checked={selectedToolIds.includes(tool.id)}
                        onChange={() => toggleTool(tool.id)}
                      />
                      <span className="relationship-name">{tool.name}</span>
                    </label>
                  ))}
                  {tools.length === 0 && (
                    <p className="empty-hint">No tools available. Add some tools first.</p>
                  )}
                </div>
              </div>

              <div className="relationship-section">
                <h3>Related Workflows ({selectedWorkflowIds.length})</h3>
                <p className="relationship-hint">Select workflows that support this goal</p>
                <div className="relationship-grid">
                  {workflows.map((workflow) => (
                    <label key={workflow.id} className="relationship-item">
                      <input
                        type="checkbox"
                        checked={selectedWorkflowIds.includes(workflow.id)}
                        onChange={() => toggleWorkflow(workflow.id)}
                      />
                      <span className="relationship-name">{workflow.name}</span>
                    </label>
                  ))}
                  {workflows.length === 0 && (
                    <p className="empty-hint">
                      No workflows available. Create some workflows first.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="goal-actions">
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              {selectedGoalId && (
                <Button variant="secondary" onClick={handleDelete}>
                  Delete
                </Button>
              )}
              <Button onClick={handleSave}>Save Goal</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
