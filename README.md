# thebytearray.org

Privacy-focused software studio building developer tools, libraries, and apps.

```
npm install
npm run dev
```

Built with Next.js + TypeScript + HeroUI v3 + Tailwind CSS 4.

[thebytearray.org](https://thebytearray.org) · GPL-3.0

## Deployment

Pushing to `main` deploys to production automatically: CI verifies, builds the
container images, ships them to the VPS over SSH, and rolls back on its own if
the site fails its health check. See [DEPLOYMENT.md](DEPLOYMENT.md) for the
runbook.
