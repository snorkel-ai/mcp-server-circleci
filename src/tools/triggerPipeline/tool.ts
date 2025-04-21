import { triggerJobInputSchema } from './inputSchema.js';

export const triggerJobTool = {
  name: 'trigger_job' as const,
  description: `
    This tool triggers a job in a CircleCI project. 
    
    The agent receiving this output MUST provide the link to the pipeline in the CircleCI project.

    Input options (EXACTLY ONE of these two options must be used):

    Option 1 - Direct URL (provide ONE of these):
    - projectURL: The URL of the CircleCI project in any of these formats:
      * Project URL: https://app.circleci.com/pipelines/gh/organization/project
      * Pipeline URL: https://app.circleci.com/pipelines/gh/organization/project/123
      * Workflow URL: https://app.circleci.com/pipelines/gh/organization/project/123/workflows/abc-def
      * Job URL: https://app.circleci.com/pipelines/gh/organization/project/123/workflows/abc-def/jobs/xyz

    Option 2 - Project Detection (ALL of these must be provided together):
    - workspaceRoot: The absolute path to the workspace root
    - gitRemoteURL: The URL of the git remote repository

    IMPORTANT:
    - Never call this tool with incomplete parameters
    - If using Option 1, the URLs MUST be provided by the user - do not attempt to construct or guess URLs
    - If using Option 2, BOTH parameters (workspaceRoot, gitRemoteURL) must be provided
    - If neither option can be fully satisfied, ask the user for the missing information before making the tool call
    `,
  inputSchema: triggerJobInputSchema,
};
