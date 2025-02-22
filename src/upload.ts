import fs from 'node:fs'
import path from 'node:path'

/**
 * Read and upload the provided OpenAPI specification to Hey API.
 */
export async function upload({
  baseUrl = 'https://platform-production-25fb.up.railway.app',
  dryRun,
  heyApiToken,
  pathToOpenApi
}: {
  baseUrl?: string
  dryRun?: boolean
  /**
   * Hey API token.
   */
  heyApiToken: string
  /**
   * Path to the OpenAPI specification file.
   */
  pathToOpenApi: string
}): Promise<void> {
  if (!pathToOpenApi) {
    throw new Error('invalid OpenAPI path')
  }

  const formData = new FormData()

  if (process.env.GITHUB_ACTOR) {
    formData.append('actor', process.env.GITHUB_ACTOR)
  }

  if (process.env.GITHUB_ACTOR_ID) {
    formData.append('actor_id', process.env.GITHUB_ACTOR_ID)
  }

  const branch = process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME
  if (branch) {
    formData.append('branch', branch)
  }

  if (process.env.GITHUB_BASE_REF) {
    formData.append('branch_base', process.env.GITHUB_BASE_REF)
  }

  formData.append('ci_platform', 'github')

  if (process.env.GITHUB_SHA) {
    let commitSha = process.env.GITHUB_SHA

    if (
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

    formData.append('commit_sha', commitSha)
  }

  if (dryRun) {
    formData.append('dry_run', 'true')
  }

  if (process.env.GITHUB_EVENT_NAME) {
    formData.append('event_name', process.env.GITHUB_EVENT_NAME)
  }

  if (process.env.GITHUB_JOB) {
    formData.append('job', process.env.GITHUB_JOB)
  }

  if (process.env.GITHUB_REF) {
    formData.append('ref', process.env.GITHUB_REF)
  }

  if (process.env.GITHUB_REF_TYPE) {
    formData.append('ref_type', process.env.GITHUB_REF_TYPE)
  }

  if (process.env.GITHUB_REPOSITORY) {
    formData.append('repository', process.env.GITHUB_REPOSITORY)
  }

  if (process.env.GITHUB_RUN_ID) {
    formData.append('run_id', process.env.GITHUB_RUN_ID)
  }

  if (process.env.GITHUB_RUN_NUMBER) {
    formData.append('run_number', process.env.GITHUB_RUN_NUMBER)
  }

  formData.append(
    'specification',
    new Blob([fs.readFileSync(pathToOpenApi)]),
    path.basename(pathToOpenApi)
  )

  if (process.env.GITHUB_WORKFLOW) {
    formData.append('workflow', process.env.GITHUB_WORKFLOW)
  }

  const response = await fetch(`${baseUrl}/v1/specifications`, {
    body: formData,
    headers: {
      Authorization: `Bearer ${heyApiToken}`
    },
    method: 'POST'
  })

  if (response.status >= 300) {
    const error = await response.json()
    throw new Error(JSON.stringify(error))
  }
}
