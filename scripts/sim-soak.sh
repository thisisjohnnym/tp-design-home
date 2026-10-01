#!/usr/bin/env bash
# Soak the site in iOS Simulator Safari (real iOS WebKit) and watch for crashes.
#
#   scripts/sim-soak.sh [url] [minutes]
#   SIM_DEVICE="iPhone 17 Pro" scripts/sim-soak.sh http://localhost:3002 5
#
# Opens the page with ?autoscroll, samples the simulator's WebContent and GPU
# processes with `footprint`, and reports any WebContent restart (a tab crash;
# Safari reloads silently) plus fresh crash reports and WebKit log lines.
set -euo pipefail

URL="${1:-https://tp-design-home.vercel.app}"
MINUTES="${2:-5}"
LEG_SECONDS="${LEG_SECONDS:-10}"
export DEVELOPER_DIR="${DEVELOPER_DIR:-$(ls -d /Applications/Xcode*.app/Contents/Developer ~/Downloads/Xcode*.app/Contents/Developer 2>/dev/null | head -1)}"

device="${SIM_DEVICE:-$(xcrun simctl list devices available | grep -oE 'iPhone [^(]+' | head -1 | sed 's/ *$//')}"
echo "device: $device"
xcrun simctl boot "$device" 2>/dev/null || true
xcrun simctl bootstatus "$device" -b >/dev/null
udid=$(xcrun simctl list devices | grep "$device (" | grep Booted | grep -oE '[0-9A-F-]{36}' | head -1)

# Fresh Safari so earlier soak tabs are not still scrolling in the background.
xcrun simctl terminate "$udid" com.apple.mobilesafari 2>/dev/null || true
sleep 2

sep="?"; [[ "$URL" == *"?"* ]] && sep="&"
start_ts=$(date "+%Y-%m-%d %H:%M:%S")
xcrun simctl openurl "$udid" "${URL}${sep}autoscroll=${LEG_SECONDS}&soak=$(date +%s)"

# Simulator WebKit processes run on the host from the iOS runtime's path.
sim_pids() {
  pgrep -f "SimulatorRuntime.*$1" 2>/dev/null || true
}
mb() {
  footprint -p "$1" 2>/dev/null |
    awk '{for (i = 1; i < NF; i++) if ($i == "Footprint:") {v = $(i + 1); u = $(i + 2); if (u == "KB") v /= 1024; if (u == "GB") v *= 1024; printf "%d", v; exit}}'
}
# The tab's process is the WebContent with the largest footprint.
busiest_web() {
  local best="" best_mb=0 m
  for pid in $(sim_pids "WebKit.WebContent"); do
    m=$(mb "$pid"); m=${m:-0}
    if (( m > best_mb )); then best=$pid; best_mb=$m; fi
  done
  echo "$best $best_mb"
}

warmup=$(( $(date +%s) + 20 ))   # process swaps while the first load settles
last_web=""
restarts=0
peak_web=0
peak_gpu=0
end=$(( $(date +%s) + MINUTES * 60 ))
while (( $(date +%s) < end )); do
  sleep 3
  read -r web w <<<"$(busiest_web)"
  gpu=$(sim_pids "WebKit.GPU" | head -1)
  g=$([[ -n "$gpu" ]] && mb "$gpu" || echo 0); g=${g:-0}; w=${w:-0}
  if (( $(date +%s) > warmup )) && [[ -n "$web" && -n "$last_web" && "$web" != "$last_web" ]]; then
    restarts=$((restarts + 1))
    echo "$(date +%T) !! tab process changed ($last_web -> $web): tab crashed or reloaded"
  fi
  [[ -n "$web" ]] && last_web="$web"
  (( w > peak_web )) && peak_web=$w
  (( g > peak_gpu )) && peak_gpu=$g
  echo "$(date +%T) web ${w}MB gpu ${g}MB"
done

echo
echo "peak web ${peak_web}MB, peak gpu ${peak_gpu}MB, WebContent restarts: $restarts"
echo "--- crash reports since start ---"
find ~/Library/Logs/DiagnosticReports -newermt "$start_ts" -iname "*WebContent*" -o -newermt "$start_ts" -iname "*Safari*" 2>/dev/null | head
echo "--- WebKit termination log lines ---"
xcrun simctl spawn "$udid" log show --start "$start_ts" --style compact \
  --predicate 'eventMessage CONTAINS[c] "WebProcess" AND (eventMessage CONTAINS[c] "crash" OR eventMessage CONTAINS[c] "terminat" OR eventMessage CONTAINS[c] "memory")' 2>/dev/null | tail -20
(( restarts == 0 ))
