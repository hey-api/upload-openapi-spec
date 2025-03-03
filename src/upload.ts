import fs from 'node:fs'

import { postV1Specifications } from './client'

/**
 * Read and upload the provided OpenAPI specification to Hey API.
 */
export async function upload({
  baseUrl,
  dryRun,
  pathToFile,
  tags
}: {
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

  const repository = process.env.GITHUB_REPOSITORY

  const response = await fetch(`https://api.github.com/repos/${repository}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
    }
  })

  let defaultBranch
  if (response.ok) {
    const repo = await response.json()
    defaultBranch = repo.default_branch
  }

  const { error } = await postV1Specifications({
    auth: process.env.API_KEY,
    baseUrl: baseUrl || 'https://api.heyapi.dev',
    body: {
      actor: process.env.GITHUB_ACTOR,
      actor_id: process.env.GITHUB_ACTOR_ID,
      branch: process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME,
      branch_base: process.env.GITHUB_BASE_REF,
      ci_platform: 'github',
      commit_sha: commitSha,
      default_branch: defaultBranch,
      dry_run: dryRun ? 'true' : 'false',
      event_name: process.env.GITHUB_EVENT_NAME,
      job: process.env.GITHUB_JOB,
      ref: process.env.GITHUB_REF,
      ref_type: process.env.GITHUB_REF_TYPE,
      repository,
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
