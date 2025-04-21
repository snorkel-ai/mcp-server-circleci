import { getCircleCIClient } from '../../clients/client.js';
import { Test } from '../../clients/schemas.js';
import getJobLogs from '../pipeline-job-logs/getJobLogs.js';

type GetWorkflowFailedRunsParams = {
    projectSlug: string;
    workflowName: string;
    options?: {
      numberOfRuns?: number;
      startDate?: string;
      endDate?: string;
      maxPages?: number;
      timeoutMs?: number;
      status?: string;
    };
  };
  
  const getWorkflowFailedRuns = async (
    { projectSlug, workflowName, options }: GetWorkflowFailedRunsParams
  ): Promise<any> => {

    const circleci = getCircleCIClient();
    const previousRuns = await circleci.insights.getPreviousWorkflowRuns({
        projectSlug,
        workflowName,
        options,
    });


    if (!previousRuns) {
        throw new Error('Previous runs not found');
    }

    const jobPromises = previousRuns.map(async (workflow) => {
        return await circleci.jobs.getWorkflowJobs({
            workflowId: workflow.id,
        }); 
    });



    const jobs = (
        await Promise.all(
            previousRuns.map(async (workflow) => {
            return await circleci.jobs.getWorkflowJobs({
              workflowId: workflow.id,
            });
          }),
        )
      ).flat();
    
    const jobNumbers = jobs
    .filter(
        (job): job is typeof job & { job_number: number } =>
        job.job_number != null,
    )
    .map((job) => job.job_number);

    // const jobsForWorkflows = await Promise.all(jobPromises);
    // if (!jobsForWorkflows.length ) {
    //     throw new Error('Jobs for workflows not found');
    // }
    // const jobNumbers = jobsForWorkflows
    //     .filter(
    //     (job): job is typeof job & { job_number: number } =>
    //         job.job_number != null,
    //     )
    //     .map((job) => job.job_number);;
    const jobLogs = await getJobLogs({
        projectSlug,
        jobNumbers: jobNumbers,
        failedStepsOnly: true,
    });
    return jobLogs;
  };


export default getWorkflowFailedRuns;
