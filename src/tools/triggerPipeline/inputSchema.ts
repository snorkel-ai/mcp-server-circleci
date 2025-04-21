import { z } from 'zod';

export const triggerJobInputSchema = z.object({
  workspaceRoot: z
    .string()
    .describe(
      'The absolute path to the root directory of your project workspace. ' +
        'This should be the top-level folder containing your source code, configuration files, and dependencies. ' +
        'For example: "/home/user/my-project" or "C:\\Users\\user\\my-project"',
    )
    .optional(),
  gitRemoteURL: z
    .string()
    .describe(
      'The URL of the remote git repository. This should be the URL of the repository that you cloned to your local workspace. ' +
        'For example: "https://github.com/user/my-project.git"',
    )
    .optional(),
  projectURL: z
    .string()
    .describe(
      'The URL of the CircleCI project. Can be any of these formats:\n' +
        '- Project URL: https://app.circleci.com/pipelines/gh/organization/project\n' +
        '- Project URL with branch: https://app.circleci.com/pipelines/gh/organization/project?branch=feature-branch\n' +
        '- Pipeline URL: https://app.circleci.com/pipelines/gh/organization/project/123\n' +
        '- Workflow URL: https://app.circleci.com/pipelines/gh/organization/project/123/workflows/abc-def\n' +
        '- Job URL: https://app.circleci.com/pipelines/gh/organization/project/123/workflows/abc-def/jobs/xyz',
    )
    .optional(),
  envVars: z
    .record(z.string())
    .describe(
      'Env vars to pass to the job. These should be in the format of "KEY=VALUE". ' +
        'For example: "FOO=bar" or "BAZ=qux". Depending on the job manifest, they can be optional or required.',
    )
    .optional(),
  jobName: z
    .string()
    .describe(
      'The name of the job to trigger. This should be the name of the job as it appears in the CircleCI project.',
    )
    .optional(),
});
