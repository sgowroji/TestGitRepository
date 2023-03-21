const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  const token = core.getInput('GITHUB_TOKEN');
  const octokit = github.getOctokit(token);

  const owner = github.context.payload.repository.owner.login;
  const repo = github.context.payload.repository.name;

  const { data: pullRequests } = await octokit.pulls.list({
    owner,
    repo,
    state: 'open'
  });

  for (const pullRequest of pullRequests) {
    const reviews = await octokit.pulls.listReviews({
      owner,
      repo,
      pull_number: pullRequest.number
    });

    const approvedReviews = reviews.data.filter(
      (review) => review.state === 'APPROVED'
    );

    if (approvedReviews.length > 0) {
      const lastApprovedReview = approvedReviews[approvedReviews.length - 1];
      const now = new Date();
      const oneDayAgo = new Date(now.setDate(now.getDate() - 1));

      if (new Date(lastApprovedReview.submitted_at) < oneDayAgo) {
        const message = `Hello @${pullRequest.user.login}, it has been more than 24 hours since this pull request was approved. Can we merge this now? :smile:`;
        await octokit.issues.createComment({
          owner,
          repo,
          issue_number: pullRequest.number,
          body: message
        });
      }
    }
  }
}

run();
