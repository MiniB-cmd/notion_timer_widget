document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     상태 변수
  ========================= */
  let startTime = null;
  let duration = 0;      // countdown용
  let elapsed = 0;       // countup용
  let interval = null;
  let isRunning = false;
  let mode = "down";     // "down" | "up"

  /* =========================
     DOM
  ========================= */
  const timeDisplay = document.getElementById("time-display");
  const startBtn = document.getElementById("start-btn");
  const resetBtn = document.getElementById("reset-btn");

  /* =========================
     누적 시간 버튼 (카운트다운 전용)
  ========================= */
  document.querySelectorAll("[data-add-minutes]").forEach(btn => {
    btn.addEventListener("click", () => {
      const addMinutes = Number(btn.dataset.addMinutes);
      duration += addMinutes * 60 * 1000;

      mode = "down";
      clearInterval(interval);
      startTime = null;
      isRunning = false;

      updateDisplay(duration);
      updateStartButton();
    });
  });

  /* =========================
     START / PAUSE
  ========================= */
  startBtn.addEventListener("click", () => {

    // ▶️ START
    if (!isRunning) {
      startTime = Date.now();
      isRunning = true;

      if (duration <= 0) {
        mode = "up";
        elapsed = elapsed || 0;
      } else {
        mode = "down";
      }

      startTimer();
    }
    // ⏸ PAUSE
    else {
      clearInterval(interval);

      if (mode === "down") {
        duration -= Date.now() - startTime;
      } else {
        elapsed += Date.now() - startTime;
      }

      startTime = null;
      isRunning = false;
    }

    updateStartButton();
  });

  /* =========================
     RESET
  ========================= */
  resetBtn.addEventListener("click", () => {
    clearInterval(interval);

    startTime = null;
    duration = 0;
    elapsed = 0;
    isRunning = false;
    mode = "down";

    updateDisplay(0);
    updateStartButton();
  });

  /* =========================
     타이머
  ========================= */
  function startTimer() {
    clearInterval(interval);

    interval = setInterval(() => {
      const diff = Date.now() - startTime;

      if (mode === "down") {
        const remaining = duration - diff;
        if (remaining <= 0) {
          finishTimer();
          return;
        }
        updateDisplay(remaining);
      } else {
        updateDisplay(elapsed + diff);
      }
    }, 1000);
  }

  function finishTimer() {
    clearInterval(interval);

    startTime = null;
    duration = 0;
    isRunning = false;
    mode = "down";

    updateDisplay(0);
    updateStartButton();
  }

  /* =========================
     UI
  ========================= */
  function updateDisplay(ms) {
    const sec = Math.floor(ms / 1000);
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    timeDisplay.textContent = `${m}:${s}`;
  }

  function updateStartButton() {
    startBtn.textContent = isRunning ? "PAUSE" : "START";
  }

});
