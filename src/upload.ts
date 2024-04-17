import * as core from '@actions/core'
import { readFileSync } from 'node:fs'

/**
 * Read and upload the provided OpenAPI specification to Hey API.
 * @param pathToOpenApi Path to the OpenAPI specification file.
 * @param heyApiToken Hey API token.
 * @returns {Promise<void>} Resolves after the file is uploaded.
 */
export async function upload(
  pathToOpenApi: string,
  heyApiToken: string,
  dryRun?: boolean
): Promise<void> {
  return new Promise(async resolve => {
    if (!pathToOpenApi) {
      throw new Error('invalid OpenAPI path')
    }

    let data: Buffer
    try {
      data = readFileSync(pathToOpenApi)
    } catch (error) {
      throw new Error('invalid OpenAPI path')
    }

    const formData: Record<string, string | number | boolean> = {
      github_repo: process.env.GITHUB_REPOSITORY!,
      github_repo_id: process.env.GITHUB_REPOSITORY_ID!,
      openapi: data.toString()
    }

    if (dryRun) {
      formData['dry-run'] = dryRun
    }

    core.debug(`GitHub repo: ${process.env.GITHUB_REPOSITORY}`)
    core.debug(`GitHub repo ID: ${process.env.GITHUB_REPOSITORY_ID}`)

    const body = Object.entries(formData)
      .flatMap(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join('&')

    const response = await fetch(
      'https://platform-production-25fb.up.railway.app/api/openapi',
      {
        body,
        headers: {
          Authorization: `Bearer ${heyApiToken}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST'
      }
    )

    if (response.status >= 300) {
      const error = await response.json()
      throw new Error(JSON.stringify(error))
    }

    resolve()
  })
}
