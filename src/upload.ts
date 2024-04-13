import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)

/**
 * Read and upload the provided OpenAPI specification to Hey API.
 * @param pathToOpenApi Path to the OpenAPI specification file.
 * @returns {Promise<void>} Resolves after the file is uploaded.
 */
export async function upload(pathToOpenApi: string): Promise<void> {
  return new Promise(async resolve => {
    // TODO: throw if path is invalid
    if (!pathToOpenApi) {
      throw new Error('OpenAPI path is invalid')
    }

    const fileBody = readFileSync(pathToOpenApi)

    const match = pathToOpenApi.match(/\.[0-9a-z]+$/i)
    const extension = match ? match[0] : ''

    // TODO: replace with unique bucket name
    const fileName = new Date().toISOString() + extension
    const org = '@hey-api'
    const project = 'upload-openapi-spec'
    const filePath = `${org}/${project}/${fileName}`

    const uploadResponse = await supabase.storage
      .from('openapi-specs')
      .upload(filePath, fileBody, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadResponse.error) {
      throw new Error(uploadResponse.error.message)
    }

    const insertResponse = await supabase.from('openapi-specs').insert({
      org,
      path: filePath,
      project
    })

    if (insertResponse.error) {
      throw new Error(insertResponse.error.message)
    }

    resolve()
  })
}
