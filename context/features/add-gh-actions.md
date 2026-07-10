# Add GitHub Actions Spec

## Overview

Create a GitHub Actions deployment pipeline that runs on push and publishes the Next.js production build output from `.next/` to a Linux server, then serves the app behind Apache2.

The workflow should build the app in CI, package the required `.next` runtime assets, transfer them to the server, restart the app process, and ensure Apache2 routes traffic to the running Next.js server.

## Requirements

- Add a workflow file at `.github/workflows/deploy-apache.yml`
- Trigger deployment on `push` to `main`
- Use Node.js 22 and run `npm ci` and `npm run build`
- Package deployment assets from `.next/`:
  - `.next/standalone/`
  - `.next/static/`
  - `public/` (if present)
- Upload/sync build output to the remote Linux host over SSH using secrets
- Restart the app process on the server after deploy (for example with `pm2` or `systemd`)
- Configure Apache2 as reverse proxy to the Next.js runtime on localhost port `3000`
- Keep HTTPS termination and domain routing in Apache2 virtual host config

## GitHub Secrets

The workflow must use these repository secrets:

- `DEPLOY_HOST`
- `DEPLOY_PORT`
- `DEPLOY_USER`
- `DEPLOY_SSH_KEY`
- `DEPLOY_PATH`
- `DEPLOY_KNOWN_HOSTS` (optional but recommended)

## Workflow Example

```yaml
name: Deploy Next.js to Apache server

on:
	push:
		branches: [main]

concurrency:
	group: deploy-production
	cancel-in-progress: true

jobs:
	deploy:
		runs-on: ubuntu-latest

		steps:
			- name: Checkout
				uses: actions/checkout@v4

			- name: Setup Node
				uses: actions/setup-node@v4
				with:
					node-version: 22
					cache: npm

			- name: Install deps
				run: npm ci --ignore-scripts

			- name: Build app
				run: npm run build

			- name: Prepare deploy bundle
				shell: bash
				run: |
					DEPLOY_DIR="$RUNNER_TEMP/deploy"
					mkdir -p "$DEPLOY_DIR/.next"
					rsync -a --delete .next/standalone/ "$DEPLOY_DIR/"
					rsync -a --delete .next/static/ "$DEPLOY_DIR/.next/static/"
					if [[ -d public ]]; then
						rsync -a --delete public/ "$DEPLOY_DIR/public/"
					fi

			- name: Start SSH agent
				uses: webfactory/ssh-agent@v0.9.0
				with:
					ssh-private-key: ${{ secrets.DEPLOY_SSH_KEY }}

			- name: Configure known_hosts
				shell: bash
				env:
					DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
					DEPLOY_PORT: ${{ secrets.DEPLOY_PORT }}
					DEPLOY_KNOWN_HOSTS: ${{ secrets.DEPLOY_KNOWN_HOSTS }}
				run: |
					mkdir -p ~/.ssh
					chmod 700 ~/.ssh
					if [[ -n "${DEPLOY_KNOWN_HOSTS}" ]]; then
						printf '%s\n' "${DEPLOY_KNOWN_HOSTS}" >> ~/.ssh/known_hosts
					else
						ssh-keyscan -p "${DEPLOY_PORT}" -H "${DEPLOY_HOST}" >> ~/.ssh/known_hosts
					fi

			- name: Sync build to server
				shell: bash
				env:
					DEPLOY_DIR: ${{ runner.temp }}/deploy
					DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
					DEPLOY_PORT: ${{ secrets.DEPLOY_PORT }}
					DEPLOY_USER: ${{ secrets.DEPLOY_USER }}
					DEPLOY_PATH: ${{ secrets.DEPLOY_PATH }}
				run: |
					rsync -az --delete \
						-e "ssh -p $DEPLOY_PORT" \
						"$DEPLOY_DIR/" \
						"$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/"

			- name: Restart app process
				shell: bash
				env:
					DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
					DEPLOY_PORT: ${{ secrets.DEPLOY_PORT }}
					DEPLOY_USER: ${{ secrets.DEPLOY_USER }}
					DEPLOY_PATH: ${{ secrets.DEPLOY_PATH }}
				run: |
					ssh -p "$DEPLOY_PORT" "$DEPLOY_USER@$DEPLOY_HOST" \
						"cd '$DEPLOY_PATH' && pm2 startOrReload ecosystem.config.js --update-env"
```

## Apache2 Server Configuration

Use Apache2 to proxy requests to the Next.js process running on `127.0.0.1:3000`.

```apache
<VirtualHost *:80>
		ServerName nsdi.raliku.com
		ServerAlias www.nsdi.raliku.com

		ProxyPreserveHost On
		ProxyPass / http://127.0.0.1:3000/
		ProxyPassReverse / http://127.0.0.1:3000/

		RequestHeader set X-Forwarded-Proto "http"
		RequestHeader set X-Forwarded-Port "80"
</VirtualHost>
```

For SSL, mirror the same proxy directives in a `*:443` virtual host and terminate TLS with `mod_ssl`.

Use certificate entries for `nsdi-flagship.raliku.com`.

## Acceptance Criteria

- Pushing to `main` triggers the workflow automatically
- CI builds successfully and packages `.next` runtime output
- Deployment artifacts are transferred to server path defined by secrets
- App process is restarted without manual SSH intervention
- Apache2 serves the app through reverse proxy with successful page load
