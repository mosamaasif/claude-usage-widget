<img width="1640" height="1546" alt="image" src="https://github.com/user-attachments/assets/7629a9dd-02c5-48b4-bcc5-2660033e3837" /># claude-usage-widget

Python script to view the Claude session and weekly limit in the Mac menu bar
<img width="447" height="105" alt="image" src="https://github.com/user-attachments/assets/eab27feb-a278-475b-9dae-4528e22228c1" />


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
