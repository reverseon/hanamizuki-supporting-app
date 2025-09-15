# DevOps for Hanamizuki

This folder holds the scripts for building, testing, and deploying the apps in the Hanamizuki cluster. It's a practical take on DevOps for a personal project, with an eye toward a more automated future.

## Rake for Automation

I'm using **Rake**, a Ruby-based build tool, to automate common tasks. It's a great example of picking the right tool for the job, even if it's not the most common choice for a Go project.

### Available Tasks

The Rake tasks are organized in a consistent and predictable way, following the pattern `<app_name>:<environment>_<action>`. This structure makes it easy to manage the different applications and their development and testing lifecycles.

There are three main applications:
- `ishiori_landing_page`
- `k8s_dex_client`
- `k8s_landing_page`

For each of these applications, there are two primary sets of tasks for different environments:

#### Development Environment (`dev`)
These tasks are for managing the local development environment.
- **`dev_up`**: Starts the application's development environment.
- **`dev_down`**: Stops the development environment.
- **`dev_restart`**: Rebuilds and restarts the development environment, which is useful after making code changes.

#### Production Test Environment (`prod_test`)
These tasks are for a simulated production environment to test the application before deployment.
- **`prod_test_up`**: Starts the production test environment.
- **`prod_test_down`**: Stops the production test environment.
- **`prod_test_cycle`**: Runs a full cycle of building, starting, testing, and stopping the application.
- **`prod_test_health`**: Checks the health of the running application in the test environment.
- **`prod_test_logs`**: Displays the logs from the application in the test environment.

## Current State: Manual Automation

Right now, I run these scripts by hand. It's a good fit for a solo project—it's flexible, gives me full control, and avoids the overhead of a full CI/CD pipeline.

## The Future: Full CI/CD

While the manual approach works for now, I've designed the automation to be ready for a full CI/CD pipeline. The Rake tasks are modular and can be easily plugged into tools like Jenkins, GitLab CI, or GitHub Actions when the time comes.

## How to Use

You'll need Ruby and Bundler to run these scripts.

```bash
bundle install
bundle exec rake -T
```

This will list all the available Rake tasks.
