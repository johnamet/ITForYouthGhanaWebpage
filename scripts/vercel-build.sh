#!/usr/bin/env bash
#
# Vercel build entry point.
#
# Build spec §1: "Fail the production build if any {{ }} string exists in
# published content." This is where that gate lives.
#
# It runs on PRODUCTION deploys only. Preview deploys and local
# `npm run build` are deliberately left unblocked, so incomplete content can
# still be built and reviewed — it just cannot reach the public site. That
# split is John's explicit decision: verification may gate a production
# deploy, but must never block a local build.
#
# VERCEL_ENV is set by Vercel to "production", "preview" or "development".
set -euo pipefail

if [ "${VERCEL_ENV:-}" = "production" ]; then
  echo "Production deploy — checking for unresolved {{TOKEN}} content (spec §1)."
  if ! npm run --silent verify:tokens; then
    echo ""
    echo "BUILD STOPPED: unresolved Phase 1 tokens would be published."
    echo "Fill them in at /admin/laptop-bank/records/token, then redeploy."
    echo "A preview deploy of the same commit will still build."
    exit 1
  fi
  echo "No unresolved Phase 1 tokens. Continuing."
else
  echo "${VERCEL_ENV:-local} build — token gate skipped by design (production only)."
fi

npm run build
