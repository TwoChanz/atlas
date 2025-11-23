import React from 'react';
import { Layout } from '../components/layout/Layout';
import { GoalManager } from '../components/domain/GoalManager';

export function GoalsPage() {
  return (
    <Layout>
      <Layout.FullWidth>
        <GoalManager />
      </Layout.FullWidth>
    </Layout>
  );
}
