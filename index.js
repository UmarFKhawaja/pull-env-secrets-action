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
    const repositoryBranch = getRepositoryBranchName();
    const repositoryPath = `${repositoryOwner}/${repositoryName}/${repositoryBranch}`;

    const url = new URL(`${repositoryPath}/env.yaml`, sourceURL).toString();

    core.info(`Fetch .env variables for ${repositoryPath} from ${url}`);

    const response = await httpClient.get(url);

    if (response.message.statusCode !== 200) {
      core.setFailed(`unexpected response ${response.message.statusCode} ${response.message.statusMessage}`);
    } else {
      const { env } = parse(
        await response.readBody()
      );

      env.forEach((variable) => {
        const name = variable['name'];
        const value = variable['value'];
        const isSecret = variable['is-secret'];

        core.exportVariable(name, value);

        if (isSecret) {
          core.setSecret(value);
        }
      });
    }
  } catch (error) {
    core.setFailed(error.message);
  }
});

function getRepositoryBranchName() {
  //GITHUB_HEAD_REF is only set for pull request events https://docs.github.com/en/actions/reference/environment-variables
  const isPullRequest = !!process.env.GITHUB_HEAD_REF;

  let branchName;

  if (isPullRequest && process.env.GITHUB_HEAD_REF) {
    branchName = process.env.GITHUB_HEAD_REF;
  } else {
    if (!process.env.GITHUB_REF) {
      throw new Error('GITHUB_EVENT_PATH is not set');
    }

    branchName = process.env.GITHUB_REF.split('/')
      .slice(2)
      .join('/')
      .replace(/\//g, '-');
  }

  return branchName;
}
