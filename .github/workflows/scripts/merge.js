
module.exports = async ({ github, context }) => {
const prs = ${{ steps.get_prs.outputs.prs }};
const now = new Date();
const dayInMillis = 1000 * 60 * 60 * 24;
for (const pr of prs) {
  const mergedAt = new Date(pr.merged_at);
  if (now - mergedAt >= dayInMillis) {
    const comment = `This pull request was approved and merged more than a day ago. Thank you for your contribution! :smile: :+1:`;
    await github.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pr.number,
      body: comment
    });
  }
}
}
