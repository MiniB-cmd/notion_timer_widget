document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     상태 변수
  ========================= */
  let startTime = null;
  let duration = 0;
  let interval = null;
  let isRunning = false;

  /* =========================
     DOM
  ========================= */
  const timeDisplay = document.getElementById("time-display");
  const startBtn = document.getElementById("start-btn");
  const resetBtn = document.getElementById("reset-btn");

  /* =========================
     누적 시간 버튼
  ========================= */
  document.querySelectorAll("[data-add-minutes]").forEach(btn => {
    btn.addEventListener("click", () => {
      const addMinutes = Number(btn.dataset.addMinutes);
      duration += addMinutes * 60 * 1000;

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
    if (duration <= 0) return;

    if (!isRunning) {
      startTime = Date.now();
      isRunning = true;

      localStorage.setItem("startTime", startTime);
      localStorage.setItem("duration", duration);

      startTimer();
    } else {
      clearInterval(interval);
      duration -= Date.now() - startTime;

      startTime = null;
      isRunning = false;

      localStorage.removeItem("startTime");
      localStorage.setItem("duration", duration);
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
    isRunning = false;

    localStorage.clear();

    updateDisplay(0);
    updateStartButton();
  });

  /* =========================
     타이머
  ========================= */
  function startTimer() {
    clearInterval(interval);

    interval = setInterval(() => {
      const remaining = duration - (Date.now() - startTime);

      if (remaining <= 0) {
        finishTimer();
        return;
      }

      updateDisplay(remaining);
    }, 1000);
  }

  function finishTimer() {
    clearInterval(interval);

    startTime = null;
    duration = 0;
    isRunning = false;

    localStorage.clear();

    updateDisplay(0);
    updateStartButton();
  }

  /* =========================
     UI
  ========================= */
  function updateDisplay(ms) {
    const sec = Math.max(0, Math.floor(ms / 1000));
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    timeDisplay.textContent = `${m}:${s}`;
  }

  function updateStartButton() {
    startBtn.textContent = isRunning ? "PAUSE" : "START";
  }

  /* =========================
     새로고침 복구
  ========================= */
  const savedStart = localStorage.getItem("startTime");
  const savedDuration = localStorage.getItem("duration");

  if (savedDuration) {
    duration = Number(savedDuration);
    updateDisplay(duration);
  }

  if (savedStart) {
    startTime = Number(savedStart);
    isRunning = true;
    startTimer();
    updateStartButton();
  }

});
