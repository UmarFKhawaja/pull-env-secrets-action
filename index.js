const core = require('@actions/core');
const github = require('@actions/github');

try {
  const sourceURL = core.getInput('source-url');

  console.log(`Fetch .env variables from ${sourceURL}`);

  core.setOutput('env-variables', {
    foo: 'FOO',
    bar: 'BAR',
    baz: 'BAZ',
    timestamp: new Date()
  });

  const payload = github.context.payload;

  console.log(`Log the webhook payload for the event that triggered the workflow`);
  console.log(JSON.stringify(payload, undefined, 2));
} catch (error) {
  core.setFailed(error.message);
}
