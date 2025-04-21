import { getCircleCIClient } from '../../clients/client.js';
import { Pipeline } from '../../clients/schemas.js';
// import { GetPipelineJobLogsParams } from '../pipeline-job-logs/getPipelineJobLogs.js';
// import getJobLogs from '../pipeline-job-logs/getJobLogs.js';

export type GetPipelinesWithWorkflowParams = {
  projectSlug: string;
  branch?: string;
  workflowNames?: string[];
};

const getPipelinesWithWorkflow = async ({
  projectSlug,
  branch,
  workflowNames,
}: GetPipelinesWithWorkflowParams) => {
  const circleci = getCircleCIClient();

  if (!branch) {
    branch = "main";
  }

  const pipelines = await circleci.pipelines.getPipelinesByBranch({
    projectSlug,
    branch,
  });

  if (!pipelines) {
    throw new Error('Pipelines not found');
  }

  return await Promise.all(pipelines.map(async (pipeline) => {
    const pipelineWorkflows = await circleci.workflows.getPipelineWorkflows({
      pipelineId: pipeline.id,
    });
    
    if (workflowNames && workflowNames.length > 0) {
      // Filter workflows to only include those with matching IDs
      const pipelineWorkflowNames = pipelineWorkflows.map(wf => wf.name);
        if (workflowNames.every(name => pipelineWorkflowNames.includes(name))) {
          return pipeline.id;
        }
    }
  }));
  
  // const jobs = (
  //   await Promise.all(
  //     filteredPipelines.flat().map(async (workflow) => {
  //       return await circleci.jobs.getWorkflowJobs({
  //         workflowId: workflow.id,
  //       });
  //     }),
  //   )
  // ).flat();

  // const jobNumbers = jobs
  //   .filter(
  //     (job): job is typeof job & { job_number: number } =>
  //       job.job_number != null,
  //   )
  //   .map((job) => job.job_number);

  // return await getJobLogs({
  //   projectSlug,
  //   jobNumbers,
  //   failedStepsOnly: true,
  // });
};

export default getPipelinesWithWorkflow;
