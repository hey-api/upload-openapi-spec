import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

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
    const parts = pathToOpenApi.split('/')
    // TODO: replace with unique bucket name
    const name = `test/${parts[parts.length - 1]}-${new Date().toTimeString()}`
    const { error } = await supabase.storage
      .from('openapi-specs')
      .upload(name, fileBody, {
        cacheControl: '3600',
        upsert: false
      })
    
      if (error) {
        throw new Error(error.message)
      }

    resolve()
  })
}
