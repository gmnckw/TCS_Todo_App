#!/usr/bin/env bash
# Starts the Todo App backend and frontend together and stops both on exit.
#
# Configuration (environment variables, or backend/.env which the API loads itself):
#   JWT_SECRET     optional; a random per-run secret is generated when unset
#   SEED_PASSWORD  required unless backend/.env defines it (min 8 characters)
#   PORT           backend port (default 4000)
#   FRONTEND_PORT  frontend port (default 5173)
set -euo pipefail

readonly ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
readonly BACKEND_DIR="${ROOT_DIR}/backend"
readonly FRONTEND_DIR="${ROOT_DIR}/frontend"
readonly BACKEND_PORT="${PORT:-4000}"
readonly FRONTEND_DEV_PORT="${FRONTEND_PORT:-5173}"
readonly HEALTH_URL="http://localhost:${BACKEND_PORT}/api/v1/health"
readonly HEALTH_MAX_ATTEMPTS=30
readonly HEALTH_POLL_SECONDS=1
readonly JWT_SECRET_BYTES=32

pids=()

log() { printf '[run-app] %s\n' "$*"; }

fail() {
  printf '[run-app] ERROR: %s\n' "$*" >&2
  exit 1
}

kill_tree() {
  local pid="$1" child
  for child in $(pgrep -P "${pid}" || true); do
    kill_tree "${child}"
  done
  kill "${pid}" 2>/dev/null || true
}

cleanup() {
  trap - EXIT INT TERM
  log "Stopping services..."
  for pid in "${pids[@]:-}"; do
    if [[ -n "${pid}" ]]; then kill_tree "${pid}"; fi
  done
  wait 2>/dev/null || true
}

install_if_missing() {
  local dir="$1"
  if [[ ! -d "${dir}/node_modules" ]]; then
    log "Installing dependencies in ${dir##*/}/"
    (cd "${dir}" && npm install)
  fi
}

require_configuration() {
  command -v node >/dev/null || fail "Node.js 22 or later is required."
  if [[ -z "${SEED_PASSWORD:-}" && ! -f "${BACKEND_DIR}/.env" ]]; then
    fail "Set SEED_PASSWORD (min 8 chars) or create backend/.env from backend/.env.example."
  fi
  if [[ -z "${JWT_SECRET:-}" && ! -f "${BACKEND_DIR}/.env" ]]; then
    JWT_SECRET="$(openssl rand -hex "${JWT_SECRET_BYTES}")"
    export JWT_SECRET
    log "Generated a temporary JWT_SECRET for this run."
  fi
}

wait_for_backend() {
  for ((attempt = 1; attempt <= HEALTH_MAX_ATTEMPTS; attempt++)); do
    if curl -fs -o /dev/null "${HEALTH_URL}"; then
      return 0
    fi
    sleep "${HEALTH_POLL_SECONDS}"
  done
  fail "Backend did not become healthy at ${HEALTH_URL}."
}

main() {
  require_configuration
  install_if_missing "${BACKEND_DIR}"
  install_if_missing "${FRONTEND_DIR}"

  trap cleanup EXIT INT TERM

  log "Starting backend on port ${BACKEND_PORT}..."
  (cd "${BACKEND_DIR}" && PORT="${BACKEND_PORT}" npm start) &
  pids+=("$!")
  wait_for_backend

  log "Starting frontend on port ${FRONTEND_DEV_PORT}..."
  (cd "${FRONTEND_DIR}" && FRONTEND_PORT="${FRONTEND_DEV_PORT}" API_PROXY_TARGET="http://localhost:${BACKEND_PORT}" npm run dev) &
  pids+=("$!")

  log "Backend:  http://localhost:${BACKEND_PORT}/api/v1"
  log "Frontend: http://localhost:${FRONTEND_DEV_PORT}"
  log "Press Ctrl+C to stop."
  wait
}

main "$@"
