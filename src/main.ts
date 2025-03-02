import * as core from '@actions/core'
import { upload } from './upload'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  if (!process.env.API_KEY) {
    core.setFailed('The API_KEY environment variable is required.')
  }

  if (!process.env.GITHUB_TOKEN) {
    core.setFailed('The GITHUB_TOKEN environment variable is required.')
  }

  try {
    const baseUrl: string = core.getInput('base-url', {
      required: false
    })
    const dryRun: boolean =
      core.getInput('dry-run', {
        required: false
      }) === 'true'
    const pathToFile: string = core.getInput('path-to-file', {
      required: true
    })
    const tags: string = core.getInput('tags', {
      required: false
    })

    core.debug(`Path to OpenAPI: ${pathToFile}`)
    core.debug(`Upload started: ${new Date().toTimeString()}`)
    await upload({
      baseUrl,
      dryRun,
      pathToFile,
      tags
    })
    core.debug(`Upload completed: ${new Date().toTimeString()}`)
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}
