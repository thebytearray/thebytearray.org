# Deployment

Production is `thebytearray.org`, a static Astro build (`npm run build` writes
`dist/`) served by nginx. There is no Node server in production.

Server details (address, user, paths, nginx configuration) are deliberately
not in this repository. They live in a git-ignored `.env.deploy` file for
deploys by hand and in repository secrets for CI.

## How a deploy happens

Each deploy uploads `dist/` as a new, timestamp-named release and switches the
live site to it. `deploy/deploy.sh` does the whole thing, from a laptop or
from CI:

1. `npm run build`
2. write the release name to `dist/release.txt`
3. upload the build to the server under a temporary name
4. run `deploy/publish-release.sh` on the server over SSH, which:
   - gives the release its final name and switches the live site to it in one
     step
   - reads `release.txt` back from the server's own web server and expects the
     new release name
   - on a mismatch, switches back to the previous release, deletes the new one
     and fails
   - keeps the newest five releases and removes older ones

### By hand

```sh
npm run deploy
```

Put the server details in a git-ignored `.env.deploy`:

```sh
DEPLOY_HOST=user@server-address
DEPLOY_PATH=/path/to/the/site/directory
# DEPLOY_KEY=/path/to/ssh/private/key   (ssh's default otherwise)
# DEPLOY_KEEP=5                         (releases kept for rollback)
```

### Automatically, on push

Pushing to `main` runs `.github/workflows/deploy.yml`: install, type-check,
then the same `deploy/deploy.sh`. Deploys are serialised by a `production`
concurrency group. Other branches and pull requests run
`.github/workflows/ci.yml` (type-check and build only).

Repository secrets (Settings → Secrets and variables → Actions):

| Secret | Value |
| --- | --- |
| `VPS_HOST` | server address |
| `VPS_USER` | a user that can write the site directory |
| `VPS_PATH` | the site directory on the server |
| `VPS_SSH_PRIVATE_KEY` | private key of a keypair that user accepts |
| `VPS_KNOWN_HOSTS` | the server's host keys (`ssh-keyscan <address>`) |

CI uses its own user and its own keypair. That user has no administrator
rights and can write nothing but the site directory, so the key can be revoked
without affecting anyone else.

## Rolling back

A deploy that is not being served rolls back on its own. The server keeps the
newest five releases; to go back by hand, point the live site at an older one.

## Cloudflare caveat

The domain is proxied and can answer **403 "Just a moment..."** to `curl`,
because a browser check runs before the request reaches the server. Real
browsers pass it, so the site is fine, but anything scripted must not assume a
200:

- uptime monitors must either pass the check or ask the server directly
- the deploy verifies on the server itself, bypassing Cloudflare
