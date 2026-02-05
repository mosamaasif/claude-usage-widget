# claude-usage-widget

Python script to view the Claude session and weekly limit in the Mac menu bar
<img width="447" height="105" alt="image" src="https://github.com/user-attachments/assets/ce92d374-2688-4c9a-919a-d9fb12b57c5d" />



## Prerequisites:

1. Node.js v16 or later
2. `newman` CLI tool (`npm install -g newman`)
3. `python3` and `pip3`

## Setup:

1. Open chrome dev tools (F12)
2. Go to the [Claude usage status page](https://claude.ai/settings/usage)
3. Filter for "usage" in the Network tab and right click the usage fetch request > Copy > Copy as cURL
<img width="1640" height="1546" alt="image" src="https://github.com/user-attachments/assets/e5eab8af-c3a1-4e0d-9e19-e16d86862a8b" />

4. Paste the cURL in a new file called curl.txt (same root as claude_usage_menubar.py)
5. `pip3 install -r requirements.txt`
6. `python3 claude_usage_menubar.py &`

Happy Vibing!

## iOS Widget (Optional)

Push usage data to a secret GitHub Gist every 3 minutes, then display it on your iPhone home screen using [Scriptable](https://apps.apple.com/app/scriptable/id1405459188).

### 1. Create a GitHub token

Go to **GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)**, generate a new token with only the **gist** scope.

### 2. Create `config.json` in the project root

```json
{ "github_token": "ghp_xxxx", "gist_id": "" }
```

### 3. Restart the Mac app

The first update cycle creates the Gist automatically, prints the raw URL to the console, and saves the `gist_id` back to `config.json`. You can also get the URL anytime from the menu bar: click the app > **Show Gist URL** (copies to clipboard).

### 4. Install Scriptable on your iPhone

Download [Scriptable](https://apps.apple.com/app/scriptable/id1405459188) from the App Store.

### 5. Create the widget script

Open Scriptable > tap **+** > name it **Claude Usage** > paste the contents of [`claude_usage_widget.js`](claude_usage_widget.js).

Replace `YOUR_GIST_ID` at the top of the script with the `gist_id` from your `config.json`.

### 6. Add the widget to your home screen

1. Long press on the home screen > tap **+**
2. Search **Scriptable** > choose the **medium** widget > **Add Widget**
3. Long press the widget > **Edit Widget**
4. Set **Script** to **Claude Usage**
5. Set **When Interacting** to **Run Script** (refreshes on tap without opening the app)

### Notes

- The Mac app pushes fresh data to the Gist every 3 minutes
- iOS controls widget background refresh (typically every 5-15 minutes)
- Tapping the widget triggers an immediate refresh
- The Gist feature is fully opt-in — without `config.json`, the app behaves exactly as before

---

## iOS Widget - Direct API (Alternative)

Fetch usage data directly from Claude API without requiring the Mac app or GitHub Gist. Updates are real-time but require manually managing session credentials.

### 1. Extract API credentials from Chrome

1. Open Chrome DevTools (**F12**) on the [Claude usage page](https://claude.ai/settings/usage)
2. Go to **Network** tab, filter for **usage**, refresh the page
3. Right-click the usage request > **Copy** > **Copy as cURL**
4. Extract these **three values** from the cURL command:
   - **Organization ID**: From URL (`/organizations/XXXXX/usage`)
   - **Session Key**: From Cookie header (`sessionKey=sk-ant-sid01-...`)
   - **Device ID**: From Cookie or header (`anthropic-device-id=XXXXX`)

### 2. Install Scriptable on your iPhone

Download [Scriptable](https://apps.apple.com/app/scriptable/id1405459188) from the App Store.

### 3. Create the widget script

1. Open Scriptable > tap **+** > name it **Claude Usage Direct**
2. Paste contents of [`claude_usage_widget_direct.js`](claude_usage_widget_direct.js)
3. Replace the three configuration values at the top (lines 6-8):
   ```javascript
   const CONFIG = {
     organization_id: "7847e6bb-4d46-4baf-9dc6-5aaae282cc8b",
     session_key: "sk-ant-sid01-Mq4xHYnPqfiSVwWhjPYaB...",
     device_id: "c770e5ca-d697-4bf2-bd93-4c906a881bf3"
   }
   ```

### 4. Add the widget to your home screen

Same steps as Gist-based widget:

1. Long press on the home screen > tap **+**
2. Search **Scriptable** > choose the **medium** widget > **Add Widget**
3. Long press the widget > **Edit Widget**
4. Set **Script** to **Claude Usage Direct**
5. Set **When Interacting** to **Run Script**

### Notes

- **Pros**: Real-time updates, no Mac app dependency, no GitHub token needed
- **Cons**: Session expires after ~30 days, must manually update credentials
- **Security**: Session key stored in plaintext in Scriptable — don't share the script
- **Troubleshooting**: If widget shows "API Error", session likely expired — re-extract credentials from Chrome DevTools

### Choosing Between Widget Options

| Feature | Gist-Based | Direct API |
|---------|------------|------------|
| Setup Complexity | Medium | Medium |
| Mac App Required | Yes | No |
| GitHub Token | Required | Not needed |
| Update Frequency | 3-5 min delay | Real-time |
| Maintenance | Token renewal yearly | Session renewal monthly |
| Dependencies | Mac + Gist + Token | Just credentials |

**Choose Gist-based** if you run the Mac app 24/7 and prefer set-it-and-forget-it.

**Choose Direct API** if you want iOS-only solution with real-time updates.
