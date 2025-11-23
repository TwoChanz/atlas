import type { Tool, InsightEdge } from '@atlas/core';
import { createInsightEdge } from '@atlas/core';

/**
 * Calculate similarity between two tools based on multiple factors
 */
export function calculateSimilarity(tool1: Tool, tool2: Tool): number {
  // Tag similarity (Jaccard)
  const tagSimilarity = calculateJaccardSimilarity(tool1.tags, tool2.tags);

  // Type similarity
  const typeSimilarity = tool1.type === tool2.type ? 1 : 0;

  // Name similarity (basic string matching)
  const nameSimilarity = calculateStringSimilarity(tool1.name, tool2.name);

  // Weighted combination
  return tagSimilarity * 0.5 + typeSimilarity * 0.3 + nameSimilarity * 0.2;
}

/**
 * Jaccard similarity coefficient
 */
function calculateJaccardSimilarity(set1: string[], set2: string[]): number {
  const intersection = set1.filter((item) => set2.includes(item));
  const union = new Set([...set1, ...set2]);

  if (union.size === 0) return 0;

  return intersection.length / union.size;
}

/**
 * Basic string similarity using character overlap
 */
function calculateStringSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();

  if (s1 === s2) return 1;

  const longer = s1.length > s2.length ? s1 : s2;

  if (longer.length === 0) return 1;

  const editDistance = calculateEditDistance(s1, s2);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Levenshtein distance (edit distance)
 */
function calculateEditDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0]![j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2[i - 1] === str1[j - 1]) {
        matrix[i]![j] = matrix[i - 1]![j - 1]!;
      } else {
        matrix[i]![j] =
          Math.min(
            matrix[i - 1]![j - 1]!, // substitution
            matrix[i]![j - 1]!, // insertion
            matrix[i - 1]![j]! // deletion
          ) + 1;
      }
    }
  }

  return matrix[str2.length]![str1.length]!;
}

/**
 * Generate similarity edges between all tools
 */
export function generateSimilarityEdges(
  tools: Tool[],
  threshold: number = 0.3
): InsightEdge[] {
  const edges: InsightEdge[] = [];

  for (let i = 0; i < tools.length; i++) {
    for (let j = i + 1; j < tools.length; j++) {
      const tool1 = tools[i]!;
      const tool2 = tools[j]!;

      const similarity = calculateSimilarity(tool1, tool2);

      if (similarity >= threshold) {
        edges.push(
          createInsightEdge({
            source: tool1.id,
            target: tool2.id,
            weight: similarity,
            type: 'similarity',
            metadata: {
              strength: similarity,
            },
          })
        );
      }
    }
  }

  return edges;
}

/**
 * Find similar tools for a given tool
 */
export function findSimilarTools(tool: Tool, allTools: Tool[], limit: number = 5): Tool[] {
  const similarities = allTools
    .filter((t) => t.id !== tool.id)
    .map((t) => ({
      tool: t,
      similarity: calculateSimilarity(tool, t),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  return similarities.map((s) => s.tool);
}
