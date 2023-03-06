from datetime import datetime, timedelta
from github import Github
import os

# Get the GitHub API token
token = os.environ['GITHUB_TOKEN']

# Create a GitHub instance
g = Github(token)

# Get the repo object
repo = g.get_repo('owner/repo')

# Get all open issues with the P0 label
label = repo.get_label('P0')
issues = repo.get_issues(labels=[label], state='open')

# Check if the P0 label was added more than 60 days ago
for issue in issues:
    for event in issue.get_events():
        if event.event == 'labeled' and event.label.name == label.name:
            time_added = event.created_at
            time_diff = datetime.now() - time_added
            if time_diff.days > 60:
                # Add the P1 label and remove the P0 label
                issue.add_to_labels('P1')
                issue.remove_from_labels(label)
                print('P1 label has been added and P0 label has been removed from issue #{}'.format(issue.number))
