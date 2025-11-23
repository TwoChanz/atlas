import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useToolsStore } from '../../store/toolsStore';
import { useWorkflowsStore } from '../../store/workflowsStore';
import { useGoalsStore } from '../../store/goalsStore';
import { downloadJSON, downloadMarkdown, exportToObsidian } from '../../utils/export';
import './ExportModal.css';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ExportFormat = 'json' | 'markdown' | 'obsidian';

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const tools = useToolsStore((state) => state.tools);
  const workflows = useWorkflowsStore((state) => state.workflows);
  const goals = useGoalsStore((state) => state.goals);

  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('json');
  const [isExporting, setIsExporting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  const handleExport = async () => {
    setIsExporting(true);
    setMessage(null);

    try {
      const timestamp = new Date().toISOString().split('T')[0];

      switch (selectedFormat) {
        case 'json':
          downloadJSON(tools, workflows, goals, `atlas-export-${timestamp}.json`);
          setMessage({ type: 'success', text: 'JSON export downloaded successfully!' });
          break;

        case 'markdown':
          downloadMarkdown(tools, `atlas-tools-${timestamp}.md`);
          setMessage({ type: 'success', text: 'Markdown export downloaded successfully!' });
          break;

        case 'obsidian':
          const obsidianContent = exportToObsidian(tools, workflows, goals);
          const blob = new Blob([obsidianContent], { type: 'text/markdown' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `atlas-obsidian-vault-${timestamp}.md`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          setMessage({
            type: 'success',
            text: 'Obsidian vault structure downloaded! Follow the instructions in the file.',
          });
          break;
      }

      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 2000);
    } catch (error) {
      console.error('Export failed:', error);
      setMessage({ type: 'error', text: 'Export failed. Please try again.' });
    } finally {
      setIsExporting(false);
    }
  };

  const getFormatDescription = () => {
    switch (selectedFormat) {
      case 'json':
        return 'Export all data (tools, workflows, goals) as JSON. Perfect for backups and data portability.';
      case 'markdown':
        return 'Export tools as a formatted Markdown document. Great for documentation and sharing.';
      case 'obsidian':
        return 'Export as Obsidian vault structure with linked notes. Follow the instructions in the exported file to set up your vault.';
    }
  };

  const stats = {
    tools: tools.length,
    workflows: workflows.length,
    goals: goals.length,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Data">
      <div className="export-modal">
        <div className="export-stats">
          <div className="stat-item">
            <span className="stat-value">{stats.tools}</span>
            <span className="stat-label">Tools</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.workflows}</span>
            <span className="stat-label">Workflows</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.goals}</span>
            <span className="stat-label">Goals</span>
          </div>
        </div>

        <div className="export-formats">
          <h3 className="formats-title">Select Export Format</h3>

          <div className="format-options">
            <label className={`format-option ${selectedFormat === 'json' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="format"
                value="json"
                checked={selectedFormat === 'json'}
                onChange={(e) => setSelectedFormat(e.target.value as ExportFormat)}
              />
              <div className="format-info">
                <div className="format-name">JSON</div>
                <div className="format-extension">.json</div>
              </div>
            </label>

            <label className={`format-option ${selectedFormat === 'markdown' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="format"
                value="markdown"
                checked={selectedFormat === 'markdown'}
                onChange={(e) => setSelectedFormat(e.target.value as ExportFormat)}
              />
              <div className="format-info">
                <div className="format-name">Markdown</div>
                <div className="format-extension">.md</div>
              </div>
            </label>

            <label className={`format-option ${selectedFormat === 'obsidian' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="format"
                value="obsidian"
                checked={selectedFormat === 'obsidian'}
                onChange={(e) => setSelectedFormat(e.target.value as ExportFormat)}
              />
              <div className="format-info">
                <div className="format-name">Obsidian Vault</div>
                <div className="format-extension">.md (structured)</div>
              </div>
            </label>
          </div>

          <p className="format-description">{getFormatDescription()}</p>
        </div>

        {message && (
          <div className={`export-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="export-actions">
          <Button variant="secondary" onClick={onClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting || stats.tools === 0}>
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
