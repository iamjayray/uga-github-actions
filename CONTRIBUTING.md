# Contribution guidelines for ASU admissions application

This repository contains the code-base for the frontend of the new application portal which is owned by EdPlus at ASU unit of ASU. The entire applicatin is a de-coupled system where the frontend is a SPA using Vue2, Vite, Bootstrap, Bootstrap-vue, Pinia and Rocket Design System.

## Environments overview

There are in total 3 environments: `nonprod` aka **dev**, `nonprod-qa` aka **QA/UAT**, and `prod` aka **production**. As per ET guidelines, we have 2 AWS instances where `nonprod`, and `nonprod-qa` are on one AWS instance and we have a separate standalone AWS instance.

## Git workflow

Since there are 3 environments in place, we follow the following git flow for contribution and development on the code repository:

- **_feature_** branches will be created out of the `nonprod` branch.
- **_bugfix_** branches will be created out of either `nonprod` or `nonprod-qa` branch, based on whether the bugfix is being implemented on either **dev** or **qa** envt.
- **_hotfix_** branches will be created out of the `main` branch.

### Main branch

- The `main` branch codebase represents the locked-in code which is deployed to the production environment of the application.
- All code on this branch is stable and has received `OK` from the quality assurance team.

### Nonprod-QA branch

- The `nonprod-qa` branch represents the codebase which is ready for content, analytics, design, functional, and user-acceptance testing.
- This branch will contain all the enhancements, improvements, bugfixes which are supposed to go live in upcoming release.
- Please note that the release items will be discussed with the product and business team, and should be provided before the work is merged into the `nonprod-qa` branch.
- All code on this branch is in a pre-production state and undergoing quality assurance (QA).
- `bugfix/[jira-ticket-number]` can be created out of `nonprod-qa` branch for issues/bugs reported during the testing of features deployed on the `qa` environment.

### Nonprod branch

- This branch represents the developer's work which is yet to get deployed for QA/UAT.
- `bugfix/[jira-ticket-number]` can be created out of `nonprod` branch for issues/bugs reported or encountered during either sanity or unit testing of feature developed on `dev` environment.

## Developer's guide

- Each branch created should have `jira-ticket-number` in them. for example: `feature/UAA-12`, `bugfix/UAA-13`, `hotfix/UAA-41` etc.
- create a pull request from your respective working branch to the appropriate target branch. Please refer to the `Git workflow` section above.

### Hotfix branch

- We create a hotfix branch to tackle issues/bugs encountered in the production environment of the application.
- Implement the fixes and deploy the app on your `local` machine with prod configuration using command: `yarn build:prod`.
- The above command will create a dist folder in the project root directory, which then can be deployed using [`serve`](https://www.npmjs.com/package/serve) npm package.
- Validate the fix by working with a issue/bug reporter, QA team member via zoom or in-person working group session. Once validated, issue a PR on `main` branch.

### Code Review:

- Collaborators and maintainers will review your code, provide feedback, and suggest improvements.
- Make necessary updates based on the feedback received.

### Commit Guidelines

- Use meaningful commit messages following the Conventional Commits format.
- Prefix commits with types like `feat`, `fix`, `docs`, `chore`, `style`, `test`, etc., to categorize changes.
- Use [conventional commits](https://marketplace.visualstudio.com/items?itemName=vivaxy.vscode-conventional-commits) vs code plugin to provide better comments

### Pull Request Guidelines

- PRs should address a specific issue or propose a well-defined enhancement.
- Link related issues in the PR description for better context.

### Additional Notes

Respect the project's license and ensure that all contributions are compliant with it.
