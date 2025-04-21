import { getWorkflowFailedLogsInputSchema } from './inputSchema.js';

export const getWorkflowFailedLogsTool = {
  name: 'find_workflow_failed_logs' as const,
  description: `
    This tool retrieves information about failed workflows in a CircleCI project. 
    
    The agent receiving this output MUST analyze the failed workflow data steps and suggest appropriate fixes based on the specific issues identified.
    Please suggest if the steps appear to be flaky or not and if the same error has occurred in the past.

    IMPORTANT:
    - Never call this tool with incomplete parameters
    - The project URLs might not be provided by the user. Use  https://app.circleci.com/pipelines/github/snorkel-ai/strap as a default
    - Start and end dates are optional and can be provided by the user
    - If there are no steps provided for the job/workflow, it means that nothing failed.
    `,
  inputSchema: getWorkflowFailedLogsInputSchema,
};
