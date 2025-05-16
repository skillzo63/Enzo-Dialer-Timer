// ==UserScript==
// @name         Enzo Dialer Timer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Work timer that auto-resets, is draggable, customizable, and saves formatted logs by date/month
// @match        https://v05.enzodialer.com/*
// @grant        none
// @updateURL    https://skillzo63.github.io/Enzo-Dialer-Timer/enzo-timer.user.js
// @downloadURL  https://skillzo63.github.io/Enzo-Dialer-Timer/enzo-timer.user.js
// ==/UserScript==

(function () {
  const TIME_KEY = 'customLiveTimer_seconds';
  const RESET_KEY = 'customLiveTimer_lastReset';
  const LOGS_KEY = 'customLiveTimer_logsByMonth';
  const WRAP_KEY = 'customLiveTimer_wrapSeconds';


  const now = new Date();
  const todayStr = now.getFullYear() + '-' +
                 String(now.getMonth() + 1).padStart(2, '0') + '-' +
                 String(now.getDate()).padStart(2, '0');
  const monthKey = todayStr.slice(0, 7); // e.g. 2025-05
  const lastReset = localStorage.getItem(RESET_KEY);
  let seconds = parseInt(localStorage.getItem(TIME_KEY)) || 0;
  let wrapSeconds = parseInt(localStorage.getItem(WRAP_KEY)) || 0;
  let wrapInterval = null;

    function formatTime(secs) {
      const h = String(Math.floor(secs / 3600)).padStart(2, '0');
      const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
      const s = String(secs % 60).padStart(2, '0');
      return `${h}:${m}:${s}`;
    }
    function formatMinutesSeconds(secs) {
      const m = String(Math.floor(secs / 60)).padStart(2, '0');
      const s = String(secs % 60).padStart(2, '0');
      return `${m}:${s}`;
    }

  // Save and reset timer if new day after 2AM (Maximum time for work)
  // If the last reset was today, do not save
  if (now.getHours() >= 2 && lastReset !== todayStr) {
    if (lastReset && seconds > 0) {
      const logs = JSON.parse(localStorage.getItem(LOGS_KEY) || '{}');
      const month = lastReset.slice(0, 7);
      logs[month] = logs[month] || {};
      logs[month][lastReset] = formatTime(seconds);
      localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
    }

    seconds = 0;
    localStorage.setItem(TIME_KEY, 0);
    localStorage.setItem(RESET_KEY, todayStr);
  }


  window.addEventListener('load', () => {
    const timerBox = document.createElement('div');
    timerBox.id = 'customTimerBox';
    timerBox.style.position = 'fixed';
    timerBox.style.top = '10px';
    timerBox.style.right = '10px';
    timerBox.style.padding = '10px 16px';
    timerBox.style.fontSize = '16px';
    timerBox.style.fontFamily = 'monospace';
    timerBox.style.borderRadius = '8px';
    timerBox.style.zIndex = '9999';
    timerBox.style.cursor = 'move';
    timerBox.style.minWidth = '150px';
    timerBox.style.minHeight = '60px';

    const bg = localStorage.getItem('timer_bg_color') || ('#f9f9f9');
    const fg = localStorage.getItem('timer_text_color') || ('#060');
    timerBox.style.backgroundColor = bg;
    timerBox.style.color = fg;
    timerBox.style.border = `2px solid ${fg}`;
    timerBox.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';

    const timerText = document.createElement('div');
    timerText.id = 'customTimerText';
    timerText.textContent = 'Ready: 00:00:00';
    timerBox.appendChild(timerText);

     const wrapUpText = document.createElement('div');
      wrapUpText.id = 'wrapUpTimerText';
      wrapUpText.textContent = 'Wrap-up: 00:00:00';
      wrapUpText.style.marginTop = '4px';
      timerBox.appendChild(wrapUpText);


    const settingsBox = document.createElement('div');
    settingsBox.style.display = 'none';
    settingsBox.style.marginTop = '8px';

    const bgLabel = document.createElement('label');
    bgLabel.textContent = 'Background: ';
    const bgPicker = document.createElement('input');
    bgPicker.type = 'color';
    bgPicker.value = bg;
    bgPicker.style.marginLeft = '4px';

    const textLabel = document.createElement('label');
    textLabel.textContent = 'Text: ';
    textLabel.style.marginLeft = '10px';
    const fgPicker = document.createElement('input');
    fgPicker.type = 'color';
    fgPicker.value = fg;
    fgPicker.style.marginLeft = '4px';

    const exportBtn = document.createElement('button');
    exportBtn.textContent = '📁 Export Month';
    exportBtn.style.marginLeft = '10px';
    exportBtn.style.padding = '2px 6px';
    exportBtn.style.fontSize = '12px';
    exportBtn.style.cursor = 'pointer';

    bgLabel.appendChild(bgPicker);
    textLabel.appendChild(fgPicker);
    settingsBox.appendChild(bgLabel);
    settingsBox.appendChild(textLabel);
    settingsBox.appendChild(exportBtn);
    timerBox.appendChild(settingsBox);
    document.body.appendChild(timerBox);

    timerBox.addEventListener('click', () => {
      settingsBox.style.display = settingsBox.style.display === 'none' ? 'block' : 'none';
    });

    bgPicker.addEventListener('input', () => {
      timerBox.style.backgroundColor = bgPicker.value;
      localStorage.setItem('timer_bg_color', bgPicker.value);
    });

    fgPicker.addEventListener('input', () => {
      timerBox.style.color = fgPicker.value;
      timerBox.style.border = `2px solid ${fgPicker.value}`;
      localStorage.setItem('timer_text_color', fgPicker.value);
    });

    exportBtn.addEventListener('click', () => {
      const logs = JSON.parse(localStorage.getItem(LOGS_KEY) || '{}');
      const currentMonthLogs = logs[monthKey] || {};
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

      let csv = 'Date,Time\n';
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${monthKey}-${String(day).padStart(2, '0')}`;
        const timeStr = currentMonthLogs[dateStr] || '00:00:00';
        csv += `${dateStr},${timeStr}\n`;
      }

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `work_log_${monthKey}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    });

    // Timer logic


    function updateDisplay() {
      timerText.textContent = `Ready: ${formatTime(seconds)}`;
    }

    function startTimer() {
      if (!window.timerInterval) {
        window.timerInterval = setInterval(() => {
          seconds++;
          localStorage.setItem(TIME_KEY, seconds);
          updateDisplay();
        }, 1000);
      }
    }

    function pauseTimer() {
      if (window.timerInterval) {
        clearInterval(window.timerInterval);
        window.timerInterval = null;
      }
    }
    function updateWrapDisplay() {
        wrapUpText.textContent = `Wrap-up: ${formatMinutesSeconds(wrapSeconds)}`;
    }

function checkWrapUpBoxVisibility() {
  const dispoBox = document.getElementById('DispoSelectBox')
  const hangUp = document.getElementsByName("livecall");
  if (!dispoBox) return;

  const style = window.getComputedStyle(dispoBox);
  const isVisible = style.visibility !== 'hidden';
  const currSrc = hangUp.valueOf('src')[0].currentSrc
  const isDead = currSrc == 'https://v05.enzodialer.com/agent/img/agc_live_call_DEAD.png';
    console.log(isDead);

  if ((isVisible ||isDead) && !wrapInterval) {
    wrapInterval = setInterval(() => {
      wrapSeconds++;
      localStorage.setItem(WRAP_KEY, wrapSeconds);
      updateWrapDisplay();
    }, 1000);
  } else if (!(isVisible ||isDead) && wrapInterval) {
    clearInterval(wrapInterval);
    wrapInterval = null;
  }
}




    function checkButtonState() {
      const active = document.querySelector('button.btn-success[title="You are active"]');
      const disabled = document.querySelector('button.btn-secondery[title="You are paused"]');
      const paused = document.querySelector('button.btn-warning[title="You are paused"]');
      if (active || disabled) startTimer();
      else if (paused) pauseTimer();
    }

    updateDisplay();
    updateWrapDisplay();
    setInterval(() => {
  checkButtonState();
  checkWrapUpBoxVisibility();
}, 500);



    // Drag handling
    let drag = false, offsetX = 0, offsetY = 0;
    timerBox.addEventListener('mousedown', e => {
      drag = true;
      offsetX = e.clientX - timerBox.getBoundingClientRect().left;
      offsetY = e.clientY - timerBox.getBoundingClientRect().top;
      timerBox.style.cursor = 'grabbing';
      e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
      if (drag) {
        timerBox.style.left = `${e.clientX - offsetX}px`;
        timerBox.style.top = `${e.clientY - offsetY}px`;
        timerBox.style.right = 'auto';
      }
    });

    document.addEventListener('mouseup', () => {
      drag = false;
      timerBox.style.cursor = 'move';
    });
  });
})();
