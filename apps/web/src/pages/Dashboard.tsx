import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { ToolList } from '../components/domain/ToolList';
import { MindmapView } from '../mindmap/MindmapView';
import { ExportModal } from '../components/domain/ExportModal';
import { Button } from '../components/common/Button';

export function Dashboard() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <Layout>
      <Layout.Sidebar>
        <div className="p-lg">
          <h2 className="text-xl font-bold mb-4">Tools</h2>
          <ToolList />
        </div>
      </Layout.Sidebar>

      <Layout.Main>
        <div className="flex flex-col h-full">
          <div className="p-lg border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Atlas</h1>
                <p className="text-gray-600">Personal Tool Intelligence System</p>
              </div>
              <Button variant="secondary" onClick={() => setIsExportModalOpen(true)} size="sm">
                Export Data
              </Button>
            </div>
          </div>
          <div className="flex-1 p-lg">
            <div className="text-center text-gray-500 mt-8">
              <p>Welcome to Atlas!</p>
              <p className="text-sm mt-2">
                Start by adding your first tool or explore the mindmap.
              </p>
            </div>
          </div>
        </div>
      </Layout.Main>

      <Layout.RightPanel>
        <div className="h-full">
          <MindmapView />
        </div>
      </Layout.RightPanel>

      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </Layout>
  );
}
