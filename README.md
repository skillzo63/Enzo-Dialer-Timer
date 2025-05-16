
# Enzo Dialer Timer

What is point of programming if it's not making your life easier ? 
Instead of using a stopwatch and keep on pausing it manually just use this script

## ✨ Features

- ⏱️ **Live Timer**: Automatically starts/pauses based on Enzo Dialer status (Active/Paused).
- 🔁 **Auto Reset**: Resets daily after 2:00 AM and saves the previous day's time.
- 📅 **Monthly Logs**: Stores logs by date and month in `localStorage`.
- 📤 **CSV Export**: Download logs for the current month as a CSV file.
- 🎨 **Customizable UI**: Change background and text color with color pickers.
- 🖱️ **Draggable Panel**: Move the timer box anywhere on the screen.
---

## 🛠 Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) if you haven’t already.
2. Enable Developer mode
3. Open Tampermonkey dashboard
4. Click "Create a new script" in Tampermonkey.
5. Paste the script and adjust the dialer's link
6. Save the script (Ctrl + S).
7. Refresh your dialer and Voila 

---

## 📁 Exporting Logs

Click on the timer to open the settings panel.  
Use the **📁 Export Month** button to download your work logs for the current month as a CSV file.

---

## 💾 Data Storage

- Timer progress is saved in `localStorage` under:
  - `customLiveTimer_seconds`
  - `customLiveTimer_lastReset`
  - `customLiveTimer_logsByMonth`
- Color settings are saved with:
  - `timer_bg_color`
  - `timer_text_color`