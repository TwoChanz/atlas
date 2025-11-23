import type { Tool, Workflow, Goal } from '@atlas/core';

/**
 * Export utilities for Atlas data
 */

/**
 * Export all data as JSON
 */
export function exportToJSON(tools: Tool[], workflows: Workflow[], goals: Goal[]): string {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    tools,
    workflows,
    goals,
  };

  return JSON.stringify(data, null, 2);
}

/**
 * Download JSON file
 */
export function downloadJSON(
  tools: Tool[],
  workflows: Workflow[],
  goals: Goal[],
  filename: string = 'atlas-export.json'
): void {
  const json = exportToJSON(tools, workflows, goals);
  downloadFile(json, filename, 'application/json');
}

/**
 * Export tools to Markdown
 */
export function exportToolsToMarkdown(tools: Tool[]): string {
  let markdown = '# Atlas Tools Export\n\n';
  markdown += `Exported: ${new Date().toLocaleString()}\n`;
  markdown += `Total Tools: ${tools.length}\n\n`;

  // Group by type
  const byType = tools.reduce((acc, tool) => {
    const type = tool.type || 'Uncategorized';
    if (!acc[type]) acc[type] = [];
    acc[type]!.push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  // Write each type section
  for (const [type, typeTools] of Object.entries(byType)) {
    markdown += `## ${type}\n\n`;

    for (const tool of typeTools) {
      markdown += `### ${tool.name}\n\n`;

      if (tool.url) {
        markdown += `**URL:** [${tool.url}](${tool.url})\n\n`;
      }

      if (tool.tags.length > 0) {
        markdown += `**Tags:** ${tool.tags.map((t) => `\`${t}\``).join(', ')}\n\n`;
      }

      if (tool.notes) {
        markdown += `**Notes:** ${tool.notes}\n\n`;
      }

      if (tool.usage) {
        markdown += `**Usage:** ${tool.usage.visitCount} visits, last visited ${new Date(
          tool.usage.lastVisited
        ).toLocaleDateString()}\n\n`;
      }

      markdown += '---\n\n';
    }
  }

  return markdown;
}

/**
 * Download Markdown file
 */
export function downloadMarkdown(
  tools: Tool[],
  filename: string = 'atlas-tools.md'
): void {
  const markdown = exportToolsToMarkdown(tools);
  downloadFile(markdown, filename, 'text/markdown');
}

/**
 * Export to Obsidian vault format
 * Creates individual markdown files for each tool
 */
export function exportToObsidian(tools: Tool[], workflows: Workflow[], goals: Goal[]): string {
  let vault = '# Obsidian Vault Export\n\n';
  vault += 'This export creates a folder structure for Obsidian.\n\n';
  vault += '## Structure\n\n';
  vault += '```\n';
  vault += 'Atlas/\n';
  vault += '├── Tools/\n';
  vault += '│   ├── [tool-name].md\n';
  vault += '├── Workflows/\n';
  vault += '│   ├── [workflow-name].md\n';
  vault += '├── Goals/\n';
  vault += '│   ├── [goal-name].md\n';
  vault += '└── README.md\n';
  vault += '```\n\n';

  vault += '## Files to Create\n\n';

  // Tools
  vault += '### Tools\n\n';
  for (const tool of tools) {
    const filename = sanitizeFilename(tool.name);
    vault += `**${filename}.md**\n\n`;
    vault += '```markdown\n';
    vault += generateToolMarkdown(tool);
    vault += '```\n\n';
  }

  // Workflows
  if (workflows.length > 0) {
    vault += '### Workflows\n\n';
    for (const workflow of workflows) {
      const filename = sanitizeFilename(workflow.name);
      vault += `**${filename}.md**\n\n`;
      vault += '```markdown\n';
      vault += generateWorkflowMarkdown(workflow, tools);
      vault += '```\n\n';
    }
  }

  // Goals
  if (goals.length > 0) {
    vault += '### Goals\n\n';
    for (const goal of goals) {
      const filename = sanitizeFilename(goal.name);
      vault += `**${filename}.md**\n\n`;
      vault += '```markdown\n';
      vault += generateGoalMarkdown(goal, tools, workflows);
      vault += '```\n\n';
    }
  }

  return vault;
}

/**
 * Generate markdown for a single tool (Obsidian format)
 */
function generateToolMarkdown(tool: Tool): string {
  let md = `# ${tool.name}\n\n`;

  if (tool.type) {
    md += `**Type:** ${tool.type}\n\n`;
  }

  if (tool.url) {
    md += `**URL:** ${tool.url}\n\n`;
  }

  if (tool.tags.length > 0) {
    md += `**Tags:** ${tool.tags.map((t) => `#${t}`).join(' ')}\n\n`;
  }

  if (tool.notes) {
    md += `## Notes\n\n${tool.notes}\n\n`;
  }

  if (tool.usage) {
    md += `## Usage Stats\n\n`;
    md += `- **Visit Count:** ${tool.usage.visitCount}\n`;
    md += `- **Last Visited:** ${new Date(tool.usage.lastVisited).toLocaleString()}\n`;
    md += `- **First Visited:** ${new Date(tool.usage.firstVisited).toLocaleString()}\n\n`;
  }

  md += `---\n`;
  md += `*Created: ${new Date(tool.createdAt).toLocaleDateString()}*\n`;
  md += `*Updated: ${new Date(tool.updatedAt).toLocaleDateString()}*\n`;

  return md;
}

/**
 * Generate markdown for a workflow (Obsidian format)
 */
function generateWorkflowMarkdown(workflow: Workflow, tools: Tool[]): string {
  let md = `# ${workflow.name}\n\n`;

  if (workflow.description) {
    md += `${workflow.description}\n\n`;
  }

  if (workflow.tags.length > 0) {
    md += `**Tags:** ${workflow.tags.map((t) => `#${t}`).join(' ')}\n\n`;
  }

  if (workflow.frequency) {
    md += `**Frequency:** ${workflow.frequency}\n\n`;
  }

  md += `## Steps\n\n`;
  workflow.steps.forEach((toolId, index) => {
    const tool = tools.find((t) => t.id === toolId);
    if (tool) {
      md += `${index + 1}. [[${sanitizeFilename(tool.name)}|${tool.name}]]\n`;
    } else {
      md += `${index + 1}. Unknown Tool (${toolId})\n`;
    }
  });
  md += '\n';

  if (workflow.notes) {
    md += `## Notes\n\n${workflow.notes}\n\n`;
  }

  md += `---\n`;
  md += `*Created: ${new Date(workflow.createdAt).toLocaleDateString()}*\n`;

  return md;
}

/**
 * Generate markdown for a goal (Obsidian format)
 */
function generateGoalMarkdown(goal: Goal, tools: Tool[], workflows: Workflow[]): string {
  let md = `# ${goal.name}\n\n`;

  md += `${goal.description}\n\n`;

  md += `**Priority:** ${goal.priority}\n`;
  md += `**Status:** ${goal.status}\n\n`;

  if (goal.targetDate) {
    md += `**Target Date:** ${new Date(goal.targetDate).toLocaleDateString()}\n\n`;
  }

  if (goal.relatedTools.length > 0) {
    md += `## Related Tools\n\n`;
    goal.relatedTools.forEach((toolId) => {
      const tool = tools.find((t) => t.id === toolId);
      if (tool) {
        md += `- [[${sanitizeFilename(tool.name)}|${tool.name}]]\n`;
      }
    });
    md += '\n';
  }

  if (goal.relatedWorkflows.length > 0) {
    md += `## Related Workflows\n\n`;
    goal.relatedWorkflows.forEach((workflowId) => {
      const workflow = workflows.find((w) => w.id === workflowId);
      if (workflow) {
        md += `- [[${sanitizeFilename(workflow.name)}|${workflow.name}]]\n`;
      }
    });
    md += '\n';
  }

  md += `---\n`;
  md += `*Created: ${new Date(goal.createdAt).toLocaleDateString()}*\n`;

  return md;
}

/**
 * Sanitize filename for file systems
 */
function sanitizeFilename(name: string): string {
  return name
    .replace(/[<>:"/\\|?*]/g, '-')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

/**
 * Generic file download helper
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
