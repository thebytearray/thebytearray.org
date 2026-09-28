# Deployment runbook

Production is `thebytearray.org`, served from a single VPS at `141.95.16.116`
(Ubuntu 24.04, OVH). This file is the operational reference: how a deploy
happens, how to undo one, and what to check when something is wrong.

## Topology

```
Cloudflare (proxied, JS challenge on)
        │
        ▼
:443 ── edge container ──▶ app container ──▶ static files
         nginx + certbot     nginx
         TLS, HSTS,          the Next.js static
         security headers    export from dist/
```

`edge` binds the host's 80/443 and reverse-proxies to `app` over the internal
bridge network. `app` is a plain nginx serving `dist/`; there is no Node server
in production because `next.config.ts` uses `output: "export"`.

Both are defined in `docker-compose.yml` + `docker-compose.prod.yml`.

- Live layout: `/srv/thebytearray/repo` (a git clone, checked out per deploy)
- Deployed tag of record: `/srv/thebytearray/deployed-tag`
- Deployment log: `docker logs thebytearray_edge`

## How a deploy happens

Push to `main` → `.github/workflows/deploy.yml`:

1. `lint` and `tsc --noEmit`
2. build the site image, tagged with the 12-char commit SHA
3. diff `Dockerfile.edge` and `nginx/edge/` against the commit currently
   deployed; only rebuild and ship the ~350MB edge image if those changed
4. stream the images to the VPS over SSH and `docker load` them
5. run `scripts/vps-deploy.sh` on the VPS
6. prune superseded images, then re-verify the origin over TLS

Images travel over the SSH channel rather than a registry: the repo is public
and the VPS holds no registry credentials, so this avoids a credential to leak
or rotate. Deploys are serialised by a `production` concurrency group.

`scripts/vps-deploy.sh` writes the target tag into `.env` before calling
`compose up`. That indirection is deliberate: a `.env` file in the project
directory takes precedence over the shell environment for compose interpolation,
so setting `IMAGE_TAG` as an environment variable alone silently does nothing.

After switching, the script asserts the running container's image is actually
the requested tag, then health-checks through the TLS terminator. Plain HTTP
cannot be used for the health check because `edge` 301s everything to HTTPS.

## Rolling back

Deploys roll back on their own. If the new container is unhealthy, or the
running image is not the requested tag, the script restores the previous tag,
re-checks it, and fails the workflow. If that rollback is also unhealthy it
leaves the host alone and asks for a human.

To roll back by hand:

```bash
# what is live now
cat /srv/thebytearray/deployed-tag

# switch to a specific image tag that is still on the host
DEPLOY_TAG=<tag> /srv/thebytearray/repo/scripts/vps-deploy.sh
```

Each deploy keeps the live image plus the one before it, so there is always a
rollback target. Re-running a specific commit is also available from the
Actions tab via `workflow_dispatch` → `deploy_sha`.

## Secrets

Repo secrets (Settings → Secrets and variables → Actions):

| Secret | Value |
| --- | --- |
| `VPS_HOST` | `141.95.16.116` |
| `VPS_USER` | `deploy` |
| `VPS_SSH_PRIVATE_KEY` | private key for the CI-only keypair |
| `VPS_KNOWN_HOSTS` | pinned host keys for the VPS |

The CI keypair's public half is in `/home/deploy/.ssh/authorized_keys`. To
revoke CI access, remove that line and rotate the secret. The `deploy` user has
passwordless sudo, so treat the key as equivalent to root.

## TLS

Certbot runs inside the `edge` container and renews twice a day against
Let's Encrypt, reloading nginx on success. Certificates live in the
`thebytearray_certbot_etc` volume, so `docker compose down -v` would delete them
and force re-issuance.

To force renewal:

```bash
docker exec thebytearray_edge certbot renew --force-renewal
docker restart thebytearray_edge
```

## Access

SSH accepts keys only. `PasswordAuthentication` is off and `PermitRootLogin` is
no; the allowed users are `ubuntu` (admin, `NOPASSWD` sudo) and `deploy` (CI).
The hardening lives in `/etc/ssh/sshd_config.d/00-thebytearray-hardening.conf` —
it must sort before `50-cloud-init.conf`, because sshd honours the first value
it reads for a keyword.

UFW allows only 22, 80, and 443.

## Cloudflare caveat

The domain is proxied and returns **403 "Just a moment..."** to `curl`, because
a JavaScript challenge runs before the request reaches the origin. Real browsers
pass it, so the site is fine, but anything scripted must not assume a 200:

- uptime monitors must either solve the challenge or check the origin directly
- CI deliberately verifies the origin via `--resolve`, bypassing Cloudflare

This also means the A record's real value is hidden. Confirm the origin is
serving by bypassing the proxy:

```bash
curl -sS -o /dev/null -w '%{http_code} %{http_version}\n' \
  --resolve thebytearray.org:443:141.95.16.116 https://thebytearray.org
```

## Routine checks

```bash
docker ps --filter name=thebytearray
docker logs --tail 50 thebytearray_edge
docker compose -f docker-compose.yml -f docker-compose.prod.yml ps
df -h /                  # keep an eye on image accumulation
```

Update Docker and the host:

```bash
sudo apt update && sudo apt upgrade -y
sudo systemctl reload ssh   # required after a sshd update
```
