const { Octokit } = require('@octokit/rest');
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

octokit.issues.listForRepo({
  owner: process.env.OWNER,
  repo: process.env.REPO,
  state: 'open',
  labels: process.env.P0_LABEL
}).then(({ data: issues }) => {
  issues.forEach(issue => {
    const p0Label = issue.labels.find(label => label.name === process.env.P0_LABEL);
    const p1Label = issue.labels.find(label => label.name === process.env.P1_LABEL);
    if (p0Label && ((new Date()) - (new Date(p0Label.created_at))) > (process.env.AGE_THRESHOLD_DAYS * 86400000)) {
      octokit.issues.removeLabel({
        owner: process.env.OWNER,
        repo: process.env.REPO,
        issue_number: issue.number,
        name: process.env.P0_LABEL
      });
      if (!p1Label) {
        octokit.issues.addLabels({
          owner: process.env.OWNER,
          repo: process.env.REPO,
          issue_number: issue.number,
          labels: [process.env.P1_LABEL]
        });
      }
    }
  });
}).catch(error => {
  console.error(error);
});
