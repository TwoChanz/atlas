
import { Layout } from '../components/layout/Layout';
import { WorkflowBuilder } from '../components/domain/WorkflowBuilder';

export function WorkflowsPage() {
  return (
    <Layout>
      <Layout.FullWidth>
        <WorkflowBuilder />
      </Layout.FullWidth>
    </Layout>
  );
}
