import type { ClusterType } from '../types';

export interface ClusterPosition {
  x: number;
  y: number;
}

export interface Cluster {
  id: string;
  name: string;
  type: ClusterType;
  /** Tool IDs in this cluster */
  toolIds: string[];
  centroid?: ClusterPosition;
  color?: string;
  size?: number;
}

/**
 * Factory function to create a new Cluster with defaults
 */
export function createCluster(
  data: Pick<Cluster, 'name' | 'type'> & Partial<Omit<Cluster, 'id'>>
): Cluster {
  return {
    id: crypto.randomUUID(),
    name: data.name,
    type: data.type,
    toolIds: data.toolIds || [],
    centroid: data.centroid,
    color: data.color,
    size: data.size,
  };
}
