<div align="center">
  <img width="150" height="150" src="https://heyapi.vercel.app/logo.png" alt="Logo">
  <h1 align="center"><b>Upload OpenAPI Specification</b></h1>
  <p align="center">A GitHub Action that uploads your OpenAPI specifications to Hey API 🚀</p>
</div>

To use this action, you have to be registered with
[Hey API](https://heyapi.vercel.app/). If you don't have an account, please
[email us](mailto:lmenus@lmen.us) or
[open an issue](https://github.com/hey-api/upload-openapi-spec/issues) and we
will set you up.

## Usage

Create a new GitHub workflow or add an upload step to your existing workflow
inside your API codebase.

```yaml
name: Upload OpenAPI Specification

on:
  push:
    branches:
      - main

jobs:
  upload-openapi-spec:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Upload OpenAPI spec
        uses: hey-api/upload-openapi-spec@v1
        with:
          hey-api-token: ${{ secrets.HEY_API_TOKEN }}
          path-to-openapi: path/to/openapi.json
```

The example above will send your OpenAPI spec to Hey API on every push to `main`
branch.

## Inputs

To successfully upload an OpenAPI specification, you need to provide the
following inputs (see `with` in the example above)

### `hey-api-token`

This is the authorization token you obtained from us.

### `path-to-openapi`

A relative path to your OpenAPI spec file within the repository. Note that you
might need an additional step in your GitHub workflow to generate this file (see
[FastAPI example](https://fastapi.tiangolo.com/how-to/extending-openapi/#generate-the-openapi-schema)).

## Next Steps

Please follow the
[integrations guide](https://heyapi.vercel.app/openapi-ts/integrations.html) on
our website for the next steps.
