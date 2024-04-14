import { readFileSync } from 'node:fs'

/**
 * Read and upload the provided OpenAPI specification to Hey API.
 * @param pathToOpenApi Path to the OpenAPI specification file.
 * @param heyApiToken Hey API token.
 * @returns {Promise<void>} Resolves after the file is uploaded.
 */
export async function upload(
  pathToOpenApi: string,
  heyApiToken: string
): Promise<void> {
  return new Promise(async resolve => {
    // TODO: throw if path is invalid
    if (!pathToOpenApi) {
      throw new Error('OpenAPI path is invalid')
    }

    const data = readFileSync(pathToOpenApi)

    const body = [
      encodeURIComponent('openapi'),
      encodeURIComponent(data.toString())
    ].join('=')

    const response = await fetch(
      // 'https://platform-production-25fb.up.railway.app/api/openapi',
      'https://platform-platform-pr-10.up.railway.app/api/openapi',
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
      throw new Error(JSON.stringify(response.json()))
    }

    resolve()
  })
}
