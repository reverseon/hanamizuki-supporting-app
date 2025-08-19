# Docker Setup for k8s-dex-client

## Environment Configuration

This setup uses a combination of:
- **dev.yaml**: Contains all non-sensitive environment variables (committed to git)
- **.env.secret**: Contains sensitive information like CLIENT_SECRET (gitignored)

## Setup Instructions

1. Copy the secret template to create your secret file:
   ```bash
   cp .env.secret.template .env.secret
   ```

2. Edit `.env.secret` and replace `your_actual_client_secret_here` with your actual client secret.

3. Run the development environment:
   ```bash
   # From the root of the project
   cd devops
   bundle exec rake k8s_dex_client:dev_up
   ```

## File Structure

- `dev.yaml` - Docker Compose configuration with non-sensitive environment variables
- `.env.secret` - Contains CLIENT_SECRET (this file is gitignored)
- `.env.secret.template` - Template for the secret file (safe to commit)

## Security Notes

- Never commit `.env.secret` to git
- The `.env.secret` file is automatically loaded by Docker Compose via the `env_file` directive
- All other environment variables remain in the `dev.yaml` file for easy configuration
