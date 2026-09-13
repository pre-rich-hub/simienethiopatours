#!/usr/bin/env bash
# Local API-up / P4 staging rehearsal prep (no invented staging hostnames).
# Usage: from repo root — ./scripts/staging-local-prep.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

CONTAINER_NAME="${GST_PG_CONTAINER:-gst-postgres}"
PG_IMAGE="${GST_PG_IMAGE:-postgres:16-alpine}"
PG_USER=gst
PG_PASSWORD=gst
PG_DB=gondar_simien_tours
PG_PORT=5432
DATABASE_URL="postgresql://${PG_USER}:${PG_PASSWORD}@127.0.0.1:${PG_PORT}/${PG_DB}"

start_postgres() {
  if docker ps --format '{{.Names}}' | grep -qx "$CONTAINER_NAME"; then
    echo "==> Postgres container already running ($CONTAINER_NAME)"
    return
  fi
  if docker ps -a --format '{{.Names}}' | grep -qx "$CONTAINER_NAME"; then
    echo "==> Starting existing Postgres container ($CONTAINER_NAME)"
    docker start "$CONTAINER_NAME" >/dev/null
    return
  fi
  echo "==> Starting local Postgres ($PG_IMAGE as $CONTAINER_NAME)"
  docker run -d \
    --name "$CONTAINER_NAME" \
    -e POSTGRES_USER="$PG_USER" \
    -e POSTGRES_PASSWORD="$PG_PASSWORD" \
    -e POSTGRES_DB="$PG_DB" \
    -p "${PG_PORT}:5432" \
    "$PG_IMAGE" >/dev/null
}

echo "==> Ensuring local Postgres"
start_postgres

echo "==> Waiting for Postgres"
for _ in $(seq 1 60); do
  if docker exec "$CONTAINER_NAME" pg_isready -U "$PG_USER" -d "$PG_DB" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done
docker exec "$CONTAINER_NAME" pg_isready -U "$PG_USER" -d "$PG_DB" >/dev/null

if [[ ! -f backend/.env ]]; then
  echo "==> Creating backend/.env from .env.example (edit secrets before production use)"
  cp backend/.env.example backend/.env
fi

# Point local pairing at the container database without inventing remote hosts.
if grep -q '^DATABASE_URL=' backend/.env; then
  sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"${DATABASE_URL}\"|" backend/.env
  sed -i "s|^DIRECT_URL=.*|DIRECT_URL=\"${DATABASE_URL}\"|" backend/.env
fi

if [[ ! -f frontend/.env.local ]]; then
  echo "==> Creating frontend/.env.local"
  cat > frontend/.env.local <<'EOF'
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
EOF
fi

echo "==> Backend migrate + seed + admin bootstrap"
(
  cd backend
  npm run prisma:deploy
  npm run db:seed
  npm run db:admin
)

echo "==> Done. Next steps:"
echo "  1. cd backend && npm run dev"
echo "  2. cd frontend && npm run dev"
echo "  3. Publish one tour/destination in /admin and confirm public pages update"
echo "  4. Record evidence in frontend/docs/qa.md (leave real staging hosts blank until ops assigns them)"
echo "  5. npm run content:export  (backend) after approving content for outage snapshot"
echo ""
echo "Postgres: ${DATABASE_URL}"
echo "Stop later with: docker stop ${CONTAINER_NAME}"
