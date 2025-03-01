import * as core from '@actions/core'
import { upload } from './upload'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const dryRun: boolean =
      core.getInput('dry-run', {
        required: false
      }) === 'true'
    const baseUrl: string = core.getInput('base-url', {
      required: false
    })
    const heyApiToken: string = core.getInput('hey-api-token', {
      required: true
    })
    const pathToOpenApi: string = core.getInput('path-to-openapi', {
      required: true
    })
    const tags: string = core.getInput('tags', {
      required: false
    })

    core.debug(`Path to OpenAPI: ${pathToOpenApi}`)
    core.debug(`Upload started: ${new Date().toTimeString()}`)
    await upload({
      baseUrl,
      dryRun,
      heyApiToken,
      pathToOpenApi,
      tags
    })
    core.debug(`Upload completed: ${new Date().toTimeString()}`)
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}
