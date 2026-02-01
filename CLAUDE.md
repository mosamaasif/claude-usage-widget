# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Python macOS menu bar application that monitors Claude API usage limits (5-hour session and 7-day rolling). It polls the Claude usage API every 3 minutes, displays utilization percentages in the menu bar, and sends macOS notifications when usage crosses configurable thresholds (25%, 50%, 75%, 90%).

## Setup & Running

```bash
# Install Python dependencies
pip3 install -r requirements.txt

# Newman (Postman CLI) must be installed globally
npm install -g newman

# The app requires a curl.txt file in the project root containing
# the cURL command for the Claude usage API endpoint

# Run the application
python3 claude_usage_menubar.py &
```

There are no build, lint, or test commands — this is a single-file Python script.

## Architecture

The entire application lives in `claude_usage_menubar.py` (~515 lines). Key components:

**MenuBarApp (rumps.App subclass)** — The main class managing the menu bar UI and two timer loops:
- **Auto-update timer** (180s interval): Calls `update_usage()` to fetch and display new data
- **Countdown timer** (1s interval): Updates the "Next Update" display

**Data pipeline:**
1. `parse_curl()` reads the cURL command from `curl.txt`
2. `generate_postman_collection_from_curl()` converts it to a Postman collection JSON
3. `run_newman()` executes the collection via Newman CLI, writes results to `output.json`
4. `get_usage_from_newman_json()` extracts utilization percentages and reset timestamps

**Notification system:**
- Tracks which thresholds have been notified per limit type in `notification_state.json`
- `should_send_notification()` returns only the highest crossed threshold to prevent spam
- `reset_notifications_if_needed()` clears thresholds when usage drops below them
- Uses dual delivery: rumps notification + osascript fallback

## Tech Stack

- **Python 3** with **rumps** (menu bar framework for macOS)
- **Newman** (Postman CLI) for HTTP requests
- **osascript** for macOS notification fallback
- JSON files for runtime state (all gitignored: `notification_state.json`, `output.json`, `MyCollection.postman_collection.json`, `curl.txt`)

## Key Constants

```python
UPDATE_INTERVAL = 180    # Polling interval in seconds
THRESHOLDS = [25, 50, 75, 90]  # Notification trigger points (%)
DEBUG = False            # Toggle debug print output
```
