<div align="center">
  <img alt="Hey API logo" height="150" src="https://heyapi.dev/images/logo-300w.png" width="150">
  <h1 align="center"><b>Upload OpenAPI Specification</b></h1>
  <p align="center">🚀 A GitHub Action for uploading specifications to Hey API</p>
</div>

> Before using this GitHub Action, you must create a free account with
> [Hey API](https://app.heyapi.dev/) and generate a project API key.

## Usage

Create a new GitHub workflow or add an upload step to an existing workflow
inside your API codebase.

```yaml
name: Upload OpenAPI Specification

on:
  push:
    branches:
      - main
  pull_request:

jobs:
  upload-openapi-spec:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Upload OpenAPI spec
        uses: hey-api/upload-openapi-spec@v1.2.0
        with:
          api-key: ${{ secrets.HEY_API_TOKEN }}
          path-to-file: path/to/openapi.json
          tags: optional,custom,tags
```

The example above will upload your OpenAPI specification to Hey API on every
pull request and push to the `main` branch.

## Inputs

To successfully upload an OpenAPI specification, you need to provide the
following inputs (see `with` in the example above)

### `api-key`

This is the project API key you obtained from
[Hey API](https://app.heyapi.dev/).

> Note: Personal API keys can't be used to upload specifications.

### `path-to-file`

A relative path to your OpenAPI file within the repository. Note that you might
need an additional step in your GitHub workflow to generate this file (see
[FastAPI example](https://fastapi.tiangolo.com/how-to/extending-openapi/#generate-the-openapi-schema)).

### `tags` (optional)

A comma-separated string value representing any custom tags you wish to add to
your OpenAPI specification.

## Next Steps

Please follow the
[integrations guide](https://heyapi.dev/openapi-ts/integrations) on our website
for the next steps.
