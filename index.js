const core = require('@actions/core');
const github = require('@actions/github');
const { HttpClient } = require('@actions/http-client');
const { parse } = require('yaml');

process.nextTick(async () => {
  try {
    const httpClient = new HttpClient();

    const sourceURL = core.getInput('source-url');

    const repositoryOwner = github.context.payload.repository.owner.login;
    const repositoryName = github.context.payload.repository.name;
    const repositoryBranch = github.context.ref.replace(/refs\/heads\//, '');
    const repositoryPath = `${repositoryOwner}/${repositoryName}/${repositoryBranch}`;

    const url = new URL(`${repositoryPath}/env-variables.yaml`, sourceURL).toString();

    core.info(`Fetch .env variables for ${sourceURL}:${repositoryPath} from ${url}`);

    const response = await httpClient.get(url);

    if (response.message.statusCode !== 200) {
      core.setFailed(`unexpected response ${response.message.statusCode} ${response.message.statusMessage}`);
    } else {
      const envVariables = parse(
        await response.readBody()
      );

      core.setOutput('env-variables', envVariables);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
});
