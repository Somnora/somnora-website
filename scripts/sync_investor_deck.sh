#!/usr/bin/env bash
set -euo pipefail

SOURCE="$HOME/Downloads/Somnora_Investor_Briefing.html"
TARGET_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/investors"
TARGET="$TARGET_DIR/deck.html"

if [[ ! -f "$SOURCE" ]]; then
  echo "Source file not found: $SOURCE" >&2
  exit 1
fi

mkdir -p "$TARGET_DIR"
cp "$SOURCE" "$TARGET"
echo "Deck synced. Commit and push to publish."
