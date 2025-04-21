import { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  getProjectSlugFromURL,
  identifyProjectSlug,
} from '../../lib/project-detection/index.js';
import { triggerJobInputSchema } from './inputSchema.js';
import {
  default as libTriggerJob,
  formatPipeline,
} from '../../lib/trigger-pipeline/triggerPipeline.js';
import mcpErrorOutput from '../../lib/mcpErrorOutput.js';

export const triggerJob: ToolCallback<{
  params: typeof triggerJobInputSchema;
}> = async (args) => {
  const { workspaceRoot, gitRemoteURL, projectURL, jobName, envVars } = args.params;

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

  if (!jobName) {
    return mcpErrorOutput(`
          Job name not found. Ask the user to provide the inputs user can provide based on the tool description.
          `);
  }

  const pipeline = await libTriggerJob({
    projectSlug,
    jobName,
    envVars,
  });

  return formatPipeline(pipeline);
};
