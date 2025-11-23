import type { EdgeType } from '../types';

export interface EdgeMetadata {
  strength?: number;
  reason?: string;
  lastUpdated?: number;
}

export interface InsightEdge {
  id: string;
  /** Source tool ID */
  source: string;
  /** Target tool ID */
  target: string;
  /** Edge weight (0-1), affects visual thickness and clustering */
  weight: number;
  type: EdgeType;
  metadata?: EdgeMetadata;
}

/**
 * Factory function to create a new InsightEdge with defaults
 */
export function createInsightEdge(
  data: Pick<InsightEdge, 'source' | 'target' | 'weight' | 'type'> &
    Partial<Omit<InsightEdge, 'id'>>
): InsightEdge {
  return {
    id: `${data.source}-${data.target}`,
    source: data.source,
    target: data.target,
    weight: data.weight,
    type: data.type,
    metadata: data.metadata,
  };
}
