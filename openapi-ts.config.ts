import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: {
    path: `https://get.heyapi.dev/hey-api/backend?api_key=${process.env.HEY_API_USER_TOKEN}`,
    include:
      '^(#/paths/v1/specifications/post|#/components/schemas/Specification)$'
  },
  output: './src/client',
  plugins: [
    {
      exportFromIndex: true,
      name: '@hey-api/client-fetch'
    },
    '@hey-api/typescript',
    '@hey-api/sdk'
  ]
})
