#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Shilpa-Kala Showcase — unified dev startup
# Usage:   ./start.sh            (starts API + Web)
#          ./start.sh --all      (starts API + Web + Mobile Metro)
#          ./start.sh --stop     (kills everything)
# ─────────────────────────────────────────────────────────────────────────────

ROOT="$(cd "$(dirname "$0")" && pwd)"
API_PORT=5001
WEB_PORT=3000
LOG_DIR="/tmp/shilpakala-logs"
mkdir -p "$LOG_DIR"

GREEN="\033[0;32m"
BLUE="\033[0;34m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
BOLD="\033[1m"
NC="\033[0m"

banner() {
  echo ""
  echo -e "${BOLD}🪨  Shilpa-Kala Showcase${NC}"
  echo -e "────────────────────────────────"
}

kill_ports() {
  echo -e "${YELLOW}⏹  Stopping all services...${NC}"
  lsof -ti :$API_PORT | xargs kill -9 2>/dev/null && echo "  API (port $API_PORT) stopped" || echo "  API not running"
  lsof -ti :$WEB_PORT | xargs kill -9 2>/dev/null && echo "  Web (port $WEB_PORT) stopped" || echo "  Web not running"
  pkill -f "react-native start" 2>/dev/null && echo "  Mobile Metro stopped" || true
  echo -e "${GREEN}✅ Done${NC}"
  exit 0
}

wait_for_port() {
  local port=$1 label=$2 retries=30
  echo -n -e "  Waiting for ${label}..."
  for i in $(seq 1 $retries); do
    if curl -s "http://localhost:$port/health" > /dev/null 2>&1; then
      echo -e " ${GREEN}ready!${NC}"
      return 0
    fi
    sleep 1
    echo -n "."
  done
  echo -e " ${RED}timed out!${NC}"
  return 1
}

# ── --stop flag ───────────────────────────────────────────────────────────────
[[ "$1" == "--stop" ]] && kill_ports

banner

# ── Kill any stale processes ───────────────────────────────────────────────────
echo -e "${YELLOW}Clearing ports $API_PORT and $WEB_PORT...${NC}"
lsof -ti :$API_PORT | xargs kill -9 2>/dev/null || true
lsof -ti :$WEB_PORT | xargs kill -9 2>/dev/null || true
sleep 1

# ── Start Backend ─────────────────────────────────────────────────────────────
echo -e "\n${BLUE}▶  Starting API (port $API_PORT)...${NC}"
cd "$ROOT/packages/backend"
PORT=$API_PORT nohup npx ts-node src/server.ts > "$LOG_DIR/api.log" 2>&1 &
API_PID=$!
echo "  PID: $API_PID  |  Log: $LOG_DIR/api.log"

wait_for_port $API_PORT "API" || {
  echo -e "${RED}✗ API failed to start. Check: $LOG_DIR/api.log${NC}"
  cat "$LOG_DIR/api.log" | tail -20
  exit 1
}

# ── Start Web ─────────────────────────────────────────────────────────────────
echo -e "\n${GREEN}▶  Starting Web Dashboard (port $WEB_PORT)...${NC}"
cd "$ROOT/packages/web"
nohup npx vite > "$LOG_DIR/web.log" 2>&1 &
WEB_PID=$!
echo "  PID: $WEB_PID  |  Log: $LOG_DIR/web.log"
sleep 4

# ── Start Mobile Expo (optional) ──────────────────────────────────────────────
if [[ "$1" == "--all" ]]; then
  echo -e "\n${YELLOW}▶  Starting Expo (Expo Go / Android / iOS)...${NC}"
  cd "$ROOT/packages/mobile"
  nohup npx expo start --no-dev --minify > "$LOG_DIR/mobile.log" 2>&1 &
  echo "  PID: $!  |  Log: $LOG_DIR/mobile.log"
fi

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo -e "────────────────────────────────────────"
echo -e "${BOLD}✅ All services started!${NC}"
echo -e ""
echo -e "  🪨  API          ${BLUE}http://localhost:$API_PORT${NC}"
echo -e "  🌐  Web Admin    ${GREEN}http://localhost:$WEB_PORT${NC}"
  [[ "$1" == "--all" ]] && echo -e "  📱  Expo Metro  http://localhost:8081 (scan QR in Expo Go)"
echo -e ""
echo -e "  📋 Logs:  $LOG_DIR/"
echo -e "  ⏹  Stop: ${YELLOW}./start.sh --stop${NC}"
echo -e "────────────────────────────────────────"
echo ""

