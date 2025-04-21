import { getCircleCIClient } from '../../clients/client.js';
import { Pipeline } from '../../clients/schemas.js';

export type TriggerPipelineParams = {
  projectSlug: string;
  jobName: string;
  envVars?: Record<string, string>;
};

// type StepLog = {
//   stepName: string;
//   logs: {
//     output: string;
//     error: string;
//   };
// };

// type JobWithStepLogs = {
//   jobName: string;
//   steps: (StepLog | null)[];
// };

/**
 * Retrieves job logs from CircleCI
 * @param params Object containing project slug, job numbers, and optional flag to filter for failed steps only
 * @param params.projectSlug The slug of the project to retrieve logs for
 * @param params.jobName The name of the job to trigger
 * @param params.envVars The environment variables to pass to the job
 * @returns Array of job logs with step information
 */
const triggerJob = async ({
  projectSlug,
  jobName,
  envVars,
}: TriggerPipelineParams): Promise<Pipeline> => {
  const circleci = getCircleCIClient();

  return await circleci.pipelines.triggerJob({
        projectSlug,
        jobName,
        envVars,
  });
};

export default triggerJob;

export const formatPipeline = (pipeline: Pipeline) => {
  return {
    content: [
      {
        type: 'text' as const,
        text: `Pipeline triggered: ${pipeline?.number}\n`,
      },
    ],
  };
};
  