import { useState, useMemo, useEffect } from 'react';
import { useToolsStore } from '../../store/toolsStore';
import { ToolCard } from './ToolCard';
import { Button } from '../common/Button';
import { AddToolModal } from './AddToolModal';
import { EditToolModal } from './EditToolModal';
import { SearchAndFilter } from './SearchAndFilter';
import { extractAllTags } from '@atlas/insights';
import type { Tool } from '@atlas/core';

export function ToolList() {
  const tools = useToolsStore((state) => state.tools);
  const loadTools = useToolsStore((state) => state.loadTools);
  const isLoading = useToolsStore((state) => state.isLoading);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    loadTools();
  }, [loadTools]);

  // Extract all available tags
  const availableTags = useMemo(() => extractAllTags(tools), [tools]);

  // Filter tools based on search and tags
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          tool.name.toLowerCase().includes(query) ||
          tool.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          tool.notes?.toLowerCase().includes(query);

        if (!matchesSearch) return false;
      }

      // Tag filter
      if (selectedTags.length > 0) {
        const matchesTags = selectedTags.some((tag) => tool.tags.includes(tag));
        if (!matchesTags) return false;
      }

      return true;
    });
  }, [tools, searchQuery, selectedTags]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-lg">
        <p className="text-gray-500">Loading tools...</p>
      </div>
    );
  }

  if (tools.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center p-lg text-center">
          <p className="text-gray-500 mb-4">No tools yet</p>
          <Button onClick={() => setIsAddModalOpen(true)}>Add Your First Tool</Button>
        </div>
        <AddToolModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <Button onClick={() => setIsAddModalOpen(true)} className="w-full mb-4">
        Add Tool
      </Button>

      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTags={selectedTags}
        availableTags={availableTags}
        onTagToggle={handleTagToggle}
        onClearFilters={handleClearFilters}
      />

      {filteredTools.length === 0 ? (
        <div className="text-center p-lg">
          <p className="text-gray-500">No tools match your filters</p>
          <button
            className="text-primary text-sm mt-2"
            onClick={handleClearFilters}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onClick={() => setEditingTool(tool)} />
          ))}
        </div>
      )}

      <AddToolModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      {editingTool && (
        <EditToolModal
          isOpen={!!editingTool}
          onClose={() => setEditingTool(null)}
          tool={editingTool}
        />
      )}
    </>
  );
}
