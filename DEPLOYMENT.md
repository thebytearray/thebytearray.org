# Deployment runbook

Production is `thebytearray.org`, served by nginx on a VPS. This file is the
operational reference: how a deploy happens, how to undo one, and what to check
when something is wrong.

## Topology

```
Cloudflare (proxied, browser check on)
        │
        ▼
:443 ── nginx on the VPS ──▶ <site-dir>/current
         TLS, security          a symlink to the live release in
         headers, caching       <site-dir>/releases/
```

The site is a static Astro build (`npm run build` writes `dist/`), so there is
no Node server in production. Each deploy uploads `dist/` as a new directory
under `releases/`, named with a UTC timestamp, and points `current` at it.

- Site directory: `<site-dir>` (group `deploy`, see below)
- nginx site: `<nginx-site-file>`; the copy of
  record is `deploy/nginx/thebytearray.org.conf`
- TLS and security-header snippets: `<nginx-snippet>`
  and `<nginx-snippet>` (on the server only)

## How a deploy happens

`deploy/deploy.sh` does the whole thing, from a laptop or from CI:

1. `npm run build`
2. write the release name to `dist/release.txt`
3. `rsync` the build to `releases/.<release>.tmp` on the server
4. run `deploy/publish-release.sh` on the server over SSH, which:
   - renames the upload to `releases/<release>` and switches `current` to it
     in one step
   - reads `https://thebytearray.org/release.txt` back from the server's own
     nginx (`curl --resolve … 127.0.0.1`) and expects the new release name
   - on a mismatch, points `current` back at the previous release, deletes the
     new one and fails
   - keeps the newest five releases and removes older ones

### By hand

```sh
npm run deploy
```

The server address is not in the repo. Put it in a git-ignored `.env.deploy`:

```sh
DEPLOY_HOST=user@server-address
# DEPLOY_KEY=~/.ssh/deploy_key   (default)
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
| `VPS_USER` | a user that can write `<site-dir>` |
| `VPS_SSH_PRIVATE_KEY` | private key of a keypair that user accepts |
| `VPS_KNOWN_HOSTS` | the server's host keys (`ssh-keyscan <address>`) |

CI logs in as `deploy`, a user with no sudo whose only write access is the
site directory. Its key is used by CI alone; to revoke it, empty
`the CI user's authorized_keys file` on the server and replace the secret.

## Who can publish

`<site-dir>` belongs to the `deploy` group, is group-writable and
has the setgid bit, so releases uploaded by one account can be pruned by
another. Members: `deploy` (CI) and the admin user that runs `npm run deploy`.
sshd only admits users listed under `AllowUsers` in
`<sshd-config-file>`.

## Rolling back

A deploy that is not being served rolls back on its own. To go back to an
older release by hand, on the server:

```sh
cd <site-dir>
ls releases/                       # newest five, named by UTC timestamp
ln -sfn releases/<release> current.tmp && mv -Tf current.tmp current
```

## Changing the nginx config

Edit `deploy/nginx/thebytearray.org.conf`, copy it to
`<nginx-site-file>` on the server, then:

```sh
sudo nginx -t && sudo systemctl reload nginx
```

## Cloudflare caveat

The domain is proxied and can answer **403 "Just a moment..."** to `curl`,
because a browser check runs before the request reaches the server. Real
browsers pass it, so the site is fine, but anything scripted must not assume a
200:

- uptime monitors must either pass the check or ask the server directly
- the deploy verifies on the server itself, bypassing Cloudflare

To confirm the server is serving, from the server:

```sh
curl -sS -o /dev/null -w '%{http_code} %{http_version}\n' \
  --resolve thebytearray.org:443:127.0.0.1 https://thebytearray.org
curl -sS --resolve thebytearray.org:443:127.0.0.1 https://thebytearray.org/release.txt
```
