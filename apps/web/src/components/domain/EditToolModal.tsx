import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { TagInput } from '../common/TagInput';
import { Button } from '../common/Button';
import { useToolsStore } from '../../store/toolsStore';
import type { Tool, ToolType } from '@atlas/core';

interface EditToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: Tool;
}

const TOOL_TYPES: ToolType[] = ['App', 'Site', 'Blog', 'API', 'Marketplace', 'Service'];

export function EditToolModal({ isOpen, onClose, tool }: EditToolModalProps) {
  const updateTool = useToolsStore((state) => state.updateTool);
  const deleteTool = useToolsStore((state) => state.deleteTool);

  const [formData, setFormData] = useState({
    name: tool.name,
    url: tool.url || '',
    type: tool.type || ('' as ToolType | ''),
    tags: tool.tags,
    notes: tool.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setFormData({
      name: tool.name,
      url: tool.url || '',
      type: tool.type || '',
      tags: tool.tags,
      notes: tool.notes || '',
    });
  }, [tool]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.url && !isValidUrl(formData.url)) {
      newErrors.url = 'Invalid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await updateTool(tool.id, {
        name: formData.name,
        url: formData.url || undefined,
        type: formData.type || undefined,
        tags: formData.tags,
        notes: formData.notes || undefined,
      });

      onClose();
    } catch (error) {
      console.error('Failed to update tool:', error);
      setErrors({ submit: 'Failed to update tool. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteTool(tool.id);
      onClose();
    } catch (error) {
      console.error('Failed to delete tool:', error);
      setErrors({ submit: 'Failed to delete tool. Please try again.' });
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Tool">
      {showDeleteConfirm ? (
        <div>
          <p className="text-base" style={{ marginBottom: '1.5rem' }}>
            Are you sure you want to delete <strong>{tool.name}</strong>? This action cannot be
            undone.
          </p>
          <div className="flex gap-md" style={{ justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Input
            label="Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            placeholder="Enter tool name"
          />

          <Input
            label="URL"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            error={errors.url}
            placeholder="https://example.com"
            type="url"
          />

          <div className="input-group">
            <label className="input-label">Type</label>
            <select
              className="input"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as ToolType })}
            >
              <option value="">Select type...</option>
              {TOOL_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <TagInput
            label="Tags"
            tags={formData.tags}
            onChange={(tags) => setFormData({ ...formData, tags })}
          />

          <div className="input-group">
            <label className="input-label">Notes</label>
            <textarea
              className="input"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add notes about this tool..."
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          {errors.submit && <p style={{ color: 'var(--color-danger)' }}>{errors.submit}</p>}

          <div
            className="flex gap-md"
            style={{ justifyContent: 'space-between', marginTop: '1.5rem' }}
          >
            <Button
              type="button"
              variant="danger"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isSubmitting}
            >
              Delete
            </Button>
            <div className="flex gap-md">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}
