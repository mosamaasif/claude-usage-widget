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
