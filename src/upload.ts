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

  const formData = new FormData();
  
  formData.append('spec', new Blob([fs.readFileSync(pathToOpenApi)]), path.basename(pathToOpenApi));

  if (dryRun) {
    formData.append('dry_run', 'true');
  }

  console.log('🔥🔥🔥')
  console.log(process.env)

  // const formData: Record<string, string | number | boolean> = {
  //   // github_repo: process.env.GITHUB_REPOSITORY!,
  //   // github_repo_id: process.env.GITHUB_REPOSITORY_ID!,
  // }

  const response = await fetch(`${baseUrl}/v1/specs`, {
    body: formData,
    headers: {
      Authorization: `Bearer ${heyApiToken}`,
    },
    method: 'POST'
  })

  if (response.status >= 300) {
    const error = await response.json()
    throw new Error(JSON.stringify(error))
  }
}
