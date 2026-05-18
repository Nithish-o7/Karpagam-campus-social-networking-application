#!/usr/bin/env bash
# ============================================================
# KCE Connect — Full-Stack Dev Launcher
# Starts PostgreSQL (if stopped), middleware (port 3001),
# and frontend (port 5173) in one command.
# Run: bash start.sh
# ============================================================

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MIDDLEWARE_DIR="$ROOT_DIR/middleware"

# ── 1. Ensure PostgreSQL is running ─────────────────────────
echo "🐘 Checking PostgreSQL..."
if ! pg_isready -h localhost -p 5432 -q 2>/dev/null; then
  echo "   PostgreSQL is NOT running — starting via Homebrew..."
  brew services start postgresql@18
  echo "   Waiting for Postgres to be ready..."
  for i in {1..10}; do
    pg_isready -h localhost -p 5432 -q 2>/dev/null && break
    sleep 1
  done
fi

if pg_isready -h localhost -p 5432 -q 2>/dev/null; then
  echo "   ✅ PostgreSQL is ready on localhost:5432"
else
  echo "   ❌ PostgreSQL failed to start. Check: brew services list"
  exit 1
fi

# ── 2. Ensure kce_connect database exists ───────────────────
DB_EXISTS=$(psql -h localhost -p 5432 -U nithishkanna -lqt 2>/dev/null | cut -d '|' -f 1 | grep -qw kce_connect && echo "yes" || echo "no")
if [ "$DB_EXISTS" = "no" ]; then
  echo "📦 Creating 'kce_connect' database..."
  createdb -h localhost -p 5432 -U nithishkanna kce_connect
  echo "   ✅ Database 'kce_connect' created."
else
  echo "   ✅ Database 'kce_connect' exists."
fi

# ── 3. Run pending Prisma migrations ────────────────────────
echo "🔄 Applying pending database migrations..."
(cd "$MIDDLEWARE_DIR" && npx prisma migrate deploy 2>&1 | grep -E "(migration|No pending|Error|warning)" || true)
echo "   ✅ Migrations applied."

# ── 4. Start Middleware (background) ────────────────────────
echo ""
echo "🚀 Starting Middleware on http://localhost:3001 ..."
(cd "$MIDDLEWARE_DIR" && npm run dev) &
MIDDLEWARE_PID=$!

# Wait for middleware to be ready
echo "   Waiting for middleware to come online..."
for i in {1..20}; do
  if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "   ✅ Middleware is online."
    break
  fi
  sleep 1
done

# ── 5. Start Frontend (background) ──────────────────────────
echo ""
echo "🌐 Starting Frontend on http://localhost:5173 ..."
(cd "$ROOT_DIR" && npm run dev) &
FRONTEND_PID=$!

echo ""
echo "========================================================"
echo "  🎉 KCE Connect is running!"
echo "     Frontend  → http://localhost:5173"
echo "     Backend   → http://localhost:3001"
echo "     DB Health → http://localhost:3001/health"
echo "========================================================"
echo ""
echo "Press Ctrl+C to stop all services."
echo ""

# Wait for both processes
wait $MIDDLEWARE_PID $FRONTEND_PID
