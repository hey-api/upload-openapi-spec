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
    const heyApiToken: string = core.getInput('hey-api-token', {
      required: true
    })
    const pathToOpenApi: string = core.getInput('path-to-openapi', {
      required: true
    })

    core.debug(`Path to OpenAPI: ${pathToOpenApi}`)
    core.debug(`Upload started: ${new Date().toTimeString()}`)
    await upload({
      dryRun,
      heyApiToken,
      pathToOpenApi,
    })
    core.debug(`Upload completed: ${new Date().toTimeString()}`)
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}
