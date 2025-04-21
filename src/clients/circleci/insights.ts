import { z } from 'zod';
import { FlakyTest, WorkflowRun } from '../schemas.js';
import { HTTPClient } from './httpClient.js';
import { defaultPaginationOptions } from './index.js';


const WorkflowRunResponseSchema = z.object({
  items: z.array(WorkflowRun),
  next_page_token: z.string().nullable(),
});

export class InsightsAPI {
  protected client: HTTPClient;

  constructor(httpClient: HTTPClient) {
    this.client = httpClient;
  }

  /**
   * Get all workflows for a pipeline with pagination support
   * @param params Configuration parameters
   * @param params.projectSlug The project slug
   * @returns Flaky test details
   * @throws Error if timeout or max pages reached
   */
  async getProjectFlakyTests({
    projectSlug,
  }: {
    projectSlug: string;
  }): Promise<FlakyTest> {
    console.error("FLLLLLL");
    const rawResult = await this.client.get<unknown>(
      `/insights/${projectSlug}/flaky-tests`,
    );

    const parsedResult = FlakyTest.safeParse(rawResult);
    console.error("parsedResult", parsedResult);
    if (!parsedResult.success) {
      throw new Error('Failed to parse flaky test response');
    }

    return parsedResult.data;
  }

  async getPreviousWorkflowRuns({
    projectSlug,
    workflowName,
    options = {},
  }: {
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
  }): Promise<WorkflowRun[]> {  
    const {
      numberOfRuns = 5,
      startDate,
      endDate,
      maxPages = defaultPaginationOptions.maxPages,
      timeoutMs = defaultPaginationOptions.timeoutMs,
    } = options;

    const startTime = Date.now();
    const allWorkflowRuns: WorkflowRun[] = [];
    let nextPageToken: string | null = null;
    let pageCount = 0;
    do {
      // Check timeout
      if (Date.now() - startTime > timeoutMs) {
        throw new Error(`Timeout reached after ${timeoutMs}ms`);
      }

      // Check page limit
      if (pageCount >= maxPages) {
        throw new Error(`Maximum number of pages (${maxPages}) reached`);
      }

      const params = {
        'start-date': startDate,
        'end-date': endDate,
      } as Record<string, string>;
      if (nextPageToken) {
        params['page-token'] = nextPageToken;
      }
      const rawResult = await this.client.get<unknown>(
        `/insights/${projectSlug}/workflows/${workflowName}`,
        params,
      );

      // Validate the response against our WorkflowResponse schema
      const result = WorkflowRunResponseSchema.parse(rawResult);  

      pageCount++;
      allWorkflowRuns.push(...result.items);
      nextPageToken = result.next_page_token;
    } while (nextPageToken);

    return allWorkflowRuns.filter((run) => run.status === status).slice(0, numberOfRuns);
  }
}
