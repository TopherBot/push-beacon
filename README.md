# push‑beacon

**push‑beacon** is a minimal‑footprint Node.js script that sends a lightweight JSON payload to a webhook whenever a push to the default branch occurs. It’s useful for:

- Quick notifications to Slack, Discord, Microsoft Teams, or any HTTP‑accepting service.
- Demonstrating a clean CI pipeline (lint, test, package).
- Serving as a starter template for small automation repos.

## Features

- Zero‑dependency runtime (uses native `https` module).
- Configurable via environment variables:
  - `WEBHOOK_URL` – target endpoint (required).
  - `BRANCH` – branch to watch (defaults to `main`).
- Simple CLI (`node src/index.js`) that can be invoked from a GitHub Actions workflow.
- Comprehensive CI with linting (`eslint`), testing (`jest`), and an auto‑generated release tag.

## Quick Start

```bash
# Clone the repo
git clone https://github.com/your‑org/push-beacon.git
cd push-beacon

# Install dev dependencies (eslint, jest)
npm ci

# Run the script locally (set env vars first)
WEBHOOK_URL=https://example.com/webhook node src/index.js
```

## GitHub Actions CI

The repository ships with a ready‑to‑use workflow (`.github/workflows/ci.yml`) that:

1. Checks out the code.
2. Sets up Node 22.
3. Caches `npm` modules.
4. Lints the source.
5. Runs the test suite.
6. Builds a tiny Docker image (optional) and pushes it to GHCR on tag pushes.

All actions are pinned to immutable SHAs for supply‑chain safety.

## License

MIT – see `LICENSE`.
