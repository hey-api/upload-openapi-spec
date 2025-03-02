import fs from 'node:fs'

import { postV1Specifications } from './client'

/**
 * Read and upload the provided OpenAPI specification to Hey API.
 */
export async function upload({
  apiKey,
  baseUrl,
  dryRun,
  pathToFile,
  tags
}: {
  /**
   * Hey API token.
   */
  apiKey: string
  /**
   * Custom service url.
   */
  baseUrl?: string
  /**
   * Return mock response?
   */
  dryRun?: boolean
  /**
   * Path to the OpenAPI specification file.
   */
  pathToFile: string
  /**
   * Custom specification tags.
   */
  tags?: string
}): Promise<void> {
  if (!pathToFile) {
    throw new Error('invalid OpenAPI path')
  }

  let commitSha = process.env.GITHUB_SHA
  if (
    commitSha &&
    process.env.GITHUB_EVENT_NAME === 'pull_request' &&
    process.env.GITHUB_EVENT_PATH
  ) {
    const event = JSON.parse(
      fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf-8')
    )
    if (event?.pull_request?.head?.sha) {
      commitSha = event.pull_request.head.sha
    }
  }

  const specification = new Blob([fs.readFileSync(pathToFile)], {
    type:
      pathToFile.endsWith('.yaml') || pathToFile.endsWith('.yaml')
        ? 'application/yaml'
        : 'application/json'
  })

  const { error } = await postV1Specifications({
    auth: apiKey,
    baseUrl: baseUrl || 'https://api.heyapi.dev',
    body: {
      actor: process.env.GITHUB_ACTOR,
      actor_id: process.env.GITHUB_ACTOR_ID,
      branch: process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME,
      branch_base: process.env.GITHUB_BASE_REF,
      ci_platform: 'github',
      commit_sha: commitSha,
      dry_run: dryRun,
      event_name: process.env.GITHUB_EVENT_NAME,
      job: process.env.GITHUB_JOB,
      ref: process.env.GITHUB_REF,
      ref_type: process.env.GITHUB_REF_TYPE,
      repository: process.env.GITHUB_REPOSITORY,
      run_id: process.env.GITHUB_RUN_ID,
      run_number: process.env.GITHUB_RUN_NUMBER,
      specification,
      tags,
      workflow: process.env.GITHUB_WORKFLOW
    }
  })

  if (error) {
    throw new Error(JSON.stringify(error))
  }
}
