// Scriptable widget for displaying Claude usage on iOS
// Replace YOUR_GIST_ID with the gist_id from your config.json
const GIST_URL = "https://gist.githubusercontent.com/raw/YOUR_GIST_ID/claude_usage.json"

// Color scheme
const BG = new Color("#1a1a2e")
const LABEL = new Color("#8888aa")
const TEXT = Color.white()
const BAR_BG = new Color("#2a2a4a")

// Widget refresh interval (5 minutes)
const REFRESH_INTERVAL_MS = 5 * 60 * 1000

// Progress bar dimensions
const BAR_WIDTH = 300
const BAR_HEIGHT = 16
const BAR_RADIUS = 8

function barColor(percentage) {
  if (percentage >= 90) return new Color("#ff4444")  // Red
  if (percentage >= 75) return new Color("#ff8800")  // Orange
  if (percentage >= 50) return new Color("#ffcc00")  // Yellow
  return new Color("#44cc88")                        // Green
}

function formatReset(isoTimestamp) {
  const resetTime = new Date(isoTimestamp)
  const now = new Date()
  const diffMs = resetTime - now

  if (diffMs < 0) return "soon"

  const hours = Math.floor(diffMs / 3600000)
  const minutes = Math.floor((diffMs % 3600000) / 60000)

  if (hours > 24) {
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    return `${days}d ${remainingHours}h`
  }

  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

function drawBar(percentage) {
  const ctx = new DrawContext()
  ctx.size = new Size(BAR_WIDTH, BAR_HEIGHT)
  ctx.opaque = false

  // Draw background bar
  const bgPath = new Path()
  bgPath.addRoundedRect(new Rect(0, 0, BAR_WIDTH, BAR_HEIGHT), BAR_RADIUS, BAR_RADIUS)
  ctx.addPath(bgPath)
  ctx.setFillColor(BAR_BG)
  ctx.fillPath()

  // Draw filled portion (clamped between 0-100%)
  const fillWidth = Math.max(0, Math.min(percentage, 100)) / 100 * BAR_WIDTH
  if (fillWidth > 0) {
    const fgPath = new Path()
    fgPath.addRoundedRect(new Rect(0, 0, fillWidth, BAR_HEIGHT), BAR_RADIUS, BAR_RADIUS)
    ctx.addPath(fgPath)
    ctx.setFillColor(barColor(percentage))
    ctx.fillPath()
  }

  return ctx.getImage()
}

function addSection(widget, label, percentage, resetTimestamp) {
  // Header row with label and percentage
  const headerRow = widget.addStack()
  headerRow.layoutHorizontally()
  headerRow.centerAlignContent()

  const labelText = headerRow.addText(label)
  labelText.font = Font.mediumSystemFont(13)
  labelText.textColor = LABEL

  headerRow.addSpacer()

  const percentageText = headerRow.addText(`${percentage}%`)
  percentageText.font = Font.boldMonospacedSystemFont(16)
  percentageText.textColor = barColor(percentage)

  widget.addSpacer(3)

  // Progress bar
  const barImage = widget.addImage(drawBar(percentage))
  barImage.imageSize = new Size(300, 10)

  widget.addSpacer(2)

  // Reset time
  const resetText = widget.addText(`Resets in ${formatReset(resetTimestamp)}`)
  resetText.font = Font.systemFont(10)
  resetText.textColor = LABEL
}

// Create and configure widget
const widget = new ListWidget()
widget.backgroundColor = BG
widget.setPadding(12, 16, 12, 16)

try {
  // Fetch usage data from GitHub Gist
  const request = new Request(GIST_URL)
  const data = await request.loadJSON()

  // Title
  const title = widget.addText("Claude Usage")
  title.font = Font.boldSystemFont(14)
  title.textColor = TEXT
  widget.addSpacer(8)

  // 5-hour limit section
  addSection(widget, "5-Hour", data.five_hour.utilization, data.five_hour.resets_at)
  widget.addSpacer(8)

  // 7-day limit section
  addSection(widget, "7-Day", data.seven_day.utilization, data.seven_day.resets_at)
  widget.addSpacer(8)

  // Last updated timestamp
  const lastUpdated = new Date(data.last_updated)
  const timeString = lastUpdated.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
  const updatedText = widget.addText(`Updated ${timeString}`)
  updatedText.font = Font.systemFont(9)
  updatedText.textColor = new Color("#555566")
} catch (error) {
  // Display error message if data fetch fails
  const errorText = widget.addText(`Failed to load data\n${error.message}`)
  errorText.font = Font.systemFont(13)
  errorText.textColor = new Color("#ff4444")
}

// Schedule next widget refresh
widget.refreshAfterDate = new Date(Date.now() + REFRESH_INTERVAL_MS)

Script.setWidget(widget)
Script.complete()
App.close()
