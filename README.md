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

Open Scriptable > tap **+** > name it **Claude Usage** > paste the script below.

Replace `YOUR_GIST_ID` with the `gist_id` from your `config.json`.

```javascript
const GIST_URL = "https://gist.githubusercontent.com/raw/YOUR_GIST_ID/claude_usage.json"

const BG = new Color("#1a1a2e")
const LABEL = new Color("#8888aa")
const TEXT = Color.white()
const BAR_BG = new Color("#2a2a4a")

function barColor(pct) {
  if (pct >= 90) return new Color("#ff4444")
  if (pct >= 75) return new Color("#ff8800")
  if (pct >= 50) return new Color("#ffcc00")
  return new Color("#44cc88")
}

function formatReset(isoStr) {
  let reset = new Date(isoStr)
  let now = new Date()
  let diff = reset - now
  if (diff < 0) return "soon"
  let h = Math.floor(diff / 3600000)
  let m = Math.floor((diff % 3600000) / 60000)
  if (h > 24) {
    let d = Math.floor(h / 24)
    h = h % 24
    return `${d}d ${h}h`
  }
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function drawBar(pct) {
  let ctx = new DrawContext()
  let w = 300, h = 16, r = 8
  ctx.size = new Size(w, h)
  ctx.opaque = false

  let bgPath = new Path()
  bgPath.addRoundedRect(new Rect(0, 0, w, h), r, r)
  ctx.addPath(bgPath)
  ctx.setFillColor(BAR_BG)
  ctx.fillPath()

  let fill = Math.max(0, Math.min(pct, 100)) / 100 * w
  if (fill > 0) {
    let fgPath = new Path()
    fgPath.addRoundedRect(new Rect(0, 0, fill, h), r, r)
    ctx.addPath(fgPath)
    ctx.setFillColor(barColor(pct))
    ctx.fillPath()
  }

  return ctx.getImage()
}

function addSection(widget, label, pct, resetStr) {
  let row = widget.addStack()
  row.layoutHorizontally()
  row.centerAlignContent()

  let lbl = row.addText(label)
  lbl.font = Font.mediumSystemFont(13)
  lbl.textColor = LABEL

  row.addSpacer()

  let val = row.addText(`${pct}%`)
  val.font = Font.boldMonospacedSystemFont(16)
  val.textColor = barColor(pct)

  widget.addSpacer(3)

  let barImg = widget.addImage(drawBar(pct))
  barImg.imageSize = new Size(300, 10)

  widget.addSpacer(2)

  let reset = widget.addText(`Resets in ${formatReset(resetStr)}`)
  reset.font = Font.systemFont(10)
  reset.textColor = LABEL
}

let widget = new ListWidget()
widget.backgroundColor = BG
widget.setPadding(12, 16, 12, 16)

try {
  let req = new Request(GIST_URL)
  let data = await req.loadJSON()

  let title = widget.addText("Claude Usage")
  title.font = Font.boldSystemFont(14)
  title.textColor = TEXT
  widget.addSpacer(8)

  addSection(widget, "5-Hour", data.five_hour.utilization, data.five_hour.resets_at)
  widget.addSpacer(8)

  addSection(widget, "7-Day", data.seven_day.utilization, data.seven_day.resets_at)
  widget.addSpacer(8)

  let d = new Date(data.last_updated)
  let timeStr = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
  let updated = widget.addText(`Updated ${timeStr}`)
  updated.font = Font.systemFont(9)
  updated.textColor = new Color("#555566")
} catch (e) {
  let err = widget.addText("Failed to load data")
  err.font = Font.systemFont(13)
  err.textColor = new Color("#ff4444")
}

widget.refreshAfterDate = new Date(Date.now() + 5 * 60 * 1000)

Script.setWidget(widget)
Script.complete()
```

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
