# Pull .env Variables Action

This action pulls `.env` variables from a URL to populate secrets in a GitHub workflow.

## Inputs

### `source-url`

**Required** The source URL for the .env variables.

## Outputs

### `env`

The .env variables

## Usage

```yaml
uses: actions/pull-env-variables-action@v1.0
with:
  source-url: https://www.example.com/envs
```