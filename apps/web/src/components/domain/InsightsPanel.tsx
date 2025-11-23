import React, { useMemo, useState } from 'react';
import { useToolsStore } from '../../store/toolsStore';
import { useWorkflowsStore } from '../../store/workflowsStore';
import { useGoalsStore } from '../../store/goalsStore';
import { groupRedundantTools, suggestWorkflows } from '@atlas/insights';
import { Button } from '../common/Button';
import './InsightsPanel.css';

interface InsightsPanelProps {
  className?: string;
}

type InsightTab = 'redundancy' | 'workflows' | 'leverage';

export function InsightsPanel({ className = '' }: InsightsPanelProps) {
  const tools = useToolsStore((state) => state.tools);
  const workflows = useWorkflowsStore((state) => state.workflows);
  const goals = useGoalsStore((state) => state.goals);
  const addWorkflow = useWorkflowsStore((state) => state.addWorkflow);
  const deleteTool = useToolsStore((state) => state.deleteTool);

  const [activeTab, setActiveTab] = useState<InsightTab>('redundancy');
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<Set<string>>(new Set());

  // Calculate insights
  const redundancyClusters = useMemo(() => {
    return groupRedundantTools(tools, 0.6); // Lower threshold for more sensitivity
  }, [tools]);

  const workflowSuggestions = useMemo(() => {
    return suggestWorkflows(tools, workflows);
  }, [tools, workflows]);

  const leverageTools = useMemo(() => {
    // Calculate leverage score: tools appearing in multiple workflows/goals
    return tools
      .map((tool) => {
        const workflowCount = workflows.filter((w) => w.steps.includes(tool.id)).length;
        const goalCount = goals.filter((g) => g.relatedTools.includes(tool.id)).length;
        const leverageScore = workflowCount + goalCount * 2; // Goals weighted more

        return { tool, leverageScore, workflowCount, goalCount };
      })
      .filter((item) => item.leverageScore > 0)
      .sort((a, b) => b.leverageScore - a.leverageScore);
  }, [tools, workflows, goals]);

  const handleAcceptWorkflow = (workflowId: string, workflow: any) => {
    addWorkflow(workflow);
    setAcceptedSuggestions(new Set(acceptedSuggestions).add(workflowId));
  };

  const handleDeleteRedundantTool = (toolId: string) => {
    if (
      window.confirm(
        'Are you sure you want to delete this tool? This action cannot be undone.'
      )
    ) {
      deleteTool(toolId);
    }
  };

  return (
    <div className={`insights-panel ${className}`}>
      <div className="insights-header">
        <h2>AI Insights</h2>
        <p className="insights-subtitle">
          Intelligent analysis of your tool ecosystem
        </p>
      </div>

      <div className="insights-tabs">
        <button
          className={`insight-tab ${activeTab === 'redundancy' ? 'active' : ''}`}
          onClick={() => setActiveTab('redundancy')}
        >
          <span className="tab-icon">⚠️</span>
          <span className="tab-label">Redundancy</span>
          {redundancyClusters.length > 0 && (
            <span className="tab-badge">{redundancyClusters.length}</span>
          )}
        </button>
        <button
          className={`insight-tab ${activeTab === 'workflows' ? 'active' : ''}`}
          onClick={() => setActiveTab('workflows')}
        >
          <span className="tab-icon">💡</span>
          <span className="tab-label">Suggestions</span>
          {workflowSuggestions.length > 0 && (
            <span className="tab-badge">{workflowSuggestions.length}</span>
          )}
        </button>
        <button
          className={`insight-tab ${activeTab === 'leverage' ? 'active' : ''}`}
          onClick={() => setActiveTab('leverage')}
        >
          <span className="tab-icon">⭐</span>
          <span className="tab-label">High-Leverage</span>
          {leverageTools.length > 0 && (
            <span className="tab-badge">{leverageTools.length}</span>
          )}
        </button>
      </div>

      <div className="insights-content">
        {activeTab === 'redundancy' && (
          <div className="insight-section">
            {redundancyClusters.length === 0 ? (
              <div className="empty-state">
                <p>No redundant tools detected</p>
                <p className="empty-state-detail">
                  Your tool ecosystem looks well-optimized!
                </p>
              </div>
            ) : (
              <>
                <p className="section-intro">
                  Found {redundancyClusters.length} cluster
                  {redundancyClusters.length !== 1 ? 's' : ''} of potentially redundant tools
                </p>
                {redundancyClusters.map((cluster, index) => (
                  <div key={index} className="redundancy-cluster">
                    <div className="cluster-header">
                      <h3>Cluster {index + 1}</h3>
                      <span className="similarity-badge">
                        {(cluster.averageSimilarity * 100).toFixed(0)}% similar
                      </span>
                    </div>
                    <div className="cluster-tools">
                      {cluster.tools.map((tool) => (
                        <div key={tool.id} className="cluster-tool">
                          <div className="cluster-tool-info">
                            <div className="cluster-tool-name">{tool.name}</div>
                            <div className="cluster-tool-tags">
                              {tool.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="mini-tag">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDeleteRedundantTool(tool.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="cluster-suggestion">
                      Consider consolidating these tools to simplify your workflow
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {activeTab === 'workflows' && (
          <div className="insight-section">
            {workflowSuggestions.length === 0 ? (
              <div className="empty-state">
                <p>No workflow suggestions available</p>
                <p className="empty-state-detail">
                  Add more tools and tags to unlock AI-powered suggestions
                </p>
              </div>
            ) : (
              <>
                <p className="section-intro">
                  Based on your tool patterns, here are {workflowSuggestions.length} workflow
                  suggestion{workflowSuggestions.length !== 1 ? 's' : ''}
                </p>
                {workflowSuggestions.map((workflow) => {
                  const isAccepted = acceptedSuggestions.has(workflow.id);
                  return (
                    <div key={workflow.id} className="workflow-suggestion">
                      <div className="suggestion-header">
                        <h3>{workflow.name}</h3>
                        {workflow.description && (
                          <p className="suggestion-description">{workflow.description}</p>
                        )}
                      </div>
                      <div className="suggestion-tags">
                        {workflow.tags.map((tag) => (
                          <span key={tag} className="suggestion-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="suggestion-steps">
                        <div className="steps-label">Steps:</div>
                        {workflow.steps.map((stepId, idx) => {
                          const tool = tools.find((t) => t.id === stepId);
                          return tool ? (
                            <div key={stepId} className="suggestion-step">
                              <span className="step-number">{idx + 1}</span>
                              <span className="step-name">{tool.name}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                      <div className="suggestion-actions">
                        <Button
                          onClick={() => handleAcceptWorkflow(workflow.id, workflow)}
                          disabled={isAccepted}
                        >
                          {isAccepted ? 'Added' : 'Add Workflow'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

        {activeTab === 'leverage' && (
          <div className="insight-section">
            {leverageTools.length === 0 ? (
              <div className="empty-state">
                <p>No high-leverage tools yet</p>
                <p className="empty-state-detail">
                  Create workflows and goals to identify keystone tools
                </p>
              </div>
            ) : (
              <>
                <p className="section-intro">
                  These {leverageTools.length} tool{leverageTools.length !== 1 ? 's' : ''}{' '}
                  appear across multiple workflows and goals
                </p>
                {leverageTools.map(({ tool, leverageScore, workflowCount, goalCount }) => (
                  <div key={tool.id} className="leverage-tool">
                    <div className="leverage-tool-main">
                      <div className="leverage-tool-name">{tool.name}</div>
                      <div className="leverage-score">
                        Score: {leverageScore}
                      </div>
                    </div>
                    <div className="leverage-details">
                      <div className="leverage-stat">
                        <span className="stat-value">{workflowCount}</span>
                        <span className="stat-label">workflow{workflowCount !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="leverage-stat">
                        <span className="stat-value">{goalCount}</span>
                        <span className="stat-label">goal{goalCount !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    {tool.tags.length > 0 && (
                      <div className="leverage-tags">
                        {tool.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="mini-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
