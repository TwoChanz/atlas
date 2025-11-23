import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { TagInput } from '../common/TagInput';
import { Button } from '../common/Button';
import { useToolsStore } from '../../store/toolsStore';
import type { ToolType } from '@atlas/core';

interface AddToolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOOL_TYPES: ToolType[] = ['App', 'Site', 'Blog', 'API', 'Marketplace', 'Service'];

export function AddToolModal({ isOpen, onClose }: AddToolModalProps) {
  const addTool = useToolsStore((state) => state.addTool);

  const [formData, setFormData] = useState({
    name: '',
    url: '',
    type: '' as ToolType | '',
    tags: [] as string[],
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await addTool({
        name: formData.name,
        url: formData.url || undefined,
        type: formData.type || undefined,
        tags: formData.tags,
        notes: formData.notes || undefined,
      });

      // Reset form
      setFormData({
        name: '',
        url: '',
        type: '',
        tags: [],
        notes: '',
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Failed to add tool:', error);
      setErrors({ submit: 'Failed to add tool. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      url: '',
      type: '',
      tags: [],
      notes: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Tool">
      <form onSubmit={handleSubmit}>
        <Input
          label="Name *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          placeholder="Enter tool name"
          autoFocus
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
          placeholder="Press Enter to add tags"
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

        <div className="flex gap-md" style={{ justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Tool'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
