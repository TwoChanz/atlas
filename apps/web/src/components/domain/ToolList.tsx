import React from 'react';
import { useToolsStore } from '../../store/toolsStore';
import { ToolCard } from './ToolCard';
import { Button } from '../common/Button';

export function ToolList() {
  const tools = useToolsStore((state) => state.tools);
  const addTool = useToolsStore((state) => state.addTool);

  const handleAddTool = () => {
    // TODO: Open modal to add tool
    console.log('Add tool clicked');
  };

  if (tools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-lg text-center">
        <p className="text-gray-500 mb-4">No tools yet</p>
        <Button onClick={handleAddTool}>Add Your First Tool</Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleAddTool} className="w-full mb-4">
        Add Tool
      </Button>
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
}
