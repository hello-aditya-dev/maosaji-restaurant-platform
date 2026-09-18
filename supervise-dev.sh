#!/usr/bin/env bash
# Supervisor: keep the Next.js dev server alive.
cd /home/z/my-project
while true; do
  if ! pgrep -f "next-server" > /dev/null 2>&1; then
    echo "[supervisor $(date +%H:%M:%S)] starting next dev..." >> /home/z/my-project/dev-supervisor.log
    npx next dev -p 3000 >> /home/z/my-project/dev.log 2>&1 &
    echo $! > /home/z/my-project/dev.pid
  fi
  sleep 5
done
