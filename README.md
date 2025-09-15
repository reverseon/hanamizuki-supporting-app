# Hanamizuki Supporting Apps

This repo holds the custom apps for my personal Kubernetes cluster, "Hanamizuki." It's a playground for me to explore different technologies and practice building and managing a containerized environment.

## What's Inside?

The Hanamizuki cluster is where I experiment with cloud-native tech. These apps provide key services like authentication and UIs.

For cluster general info and its manifests, see https://github.com/reverseon/hanamizuki-k8s-cluster

## The Apps

Here's a quick look at the apps in this monorepo:

| App | What it does | Tech | URL |
|---|---|---|---|
| `ishiori-landing-page` | A landing page for my Homelab Network. | Go and Simple HTML | https://hello.ishiori.net |
| `k8s-dex-client` | Auth client for the cluster, using Dex for identity. | Go, Simple HTML, and OAuth2 via DexIDP | https://login.hana.ishiori.net |
| `k8s-landing-page` | Simple landing page for cluster. | Go and Simple HTML | https://hello.hana.ishiori.net |

## Tech Stack

I'm using a mix of technologies to get the job done and expand my skills:

- **Languages:** Go, Ruby
- **Containers:** Docker, Kubernetes
- **Automation:** Rake
- **Auth:** Dex, OAuth2
- **Frontend:** HTML, CSS, JavaScript

## DevOps

The `devops` folder has all the scripts for building, testing, and deploying these apps. I'm using Rake for automation and Docker for container images.

## Why So Many Languages?

I'm using different languages on purpose. It's a great way to learn and see which language works best for different problems. It's all about growing as a developer.


