import { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  getProjectSlugFromURL,
  identifyProjectSlug,
} from '../../lib/project-detection/index.js';
import {
  formatFlakyTests,
} from '../../lib/flaky-tests/getFlakyTests.js';
import { getWorkflowFailedLogsInputSchema } from './inputSchema.js';
import mcpErrorOutput from '../../lib/mcpErrorOutput.js';
import getWorkflowFailedRuns from '../../lib/failed-workflow/summarizeFailedWorkflow.js';

export const getWorkflowFailedLogs: ToolCallback<{
  params: typeof getWorkflowFailedLogsInputSchema;
}> = async (args) => {
  const { workspaceRoot, gitRemoteURL, projectURL, workflowName, startDate, endDate } = args.params;

  let projectSlug: string | null | undefined;

  if (projectURL) {
    projectSlug = getProjectSlugFromURL(projectURL);
  } else if (workspaceRoot && gitRemoteURL) {
    projectSlug = await identifyProjectSlug({
      gitRemoteURL,
    });
  } else {
    return mcpErrorOutput(
      'No inputs provided. Ask the user to provide the inputs user can provide based on the tool description.',
    );
  }

  if (!projectSlug) {
    return mcpErrorOutput(`
          Project not found. Ask the user to provide the inputs user can provide based on the tool description.

          Project slug: ${projectSlug}
          Git remote URL: ${gitRemoteURL}
          `);
  }

  const tests = await getWorkflowFailedRuns({
    projectSlug,
    workflowName,
    options: {
      numberOfRuns: 1,
      startDate,
      endDate,
      status: 'failed',
    },
  });

  return formatFlakyTests(tests);
};
