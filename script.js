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
   누적 시간 버튼 (10분 / 30분)
========================= */
document.querySelectorAll("[data-add-minutes]").forEach(btn => {
  btn.addEventListener("click", () => {
    const addMinutes = Number(btn.dataset.addMinutes);
    duration += addMinutes * 60 * 1000;

    startTime = null;
    isRunning = false;
    clearInterval(interval);

    updateDisplay(duration);
    updateStartButton();
  });
});

/* =========================
   START / PAUSE 버튼
========================= */
startBtn.addEventListener("click", () => {
  if (duration <= 0) return;

  // ▶ START
  if (!isRunning) {
    startTime = Date.now();
    isRunning = true;

    localStorage.setItem("startTime", startTime);
    localStorage.setItem("duration", duration);

    startTimer();
  }
  // ⏸ PAUSE
  else {
    clearInterval(interval);
    interval = null;

    duration -= Date.now() - startTime;
    startTime = null;
    isRunning = false;

    localStorage.removeItem("startTime");
    localStorage.setItem("duration", duration);
  }

  updateStartButton();
});

/* =========================
   RESET 버튼
========================= */
resetBtn.addEventListener("click", () => {
  clearInterval(interval);
  interval = null;

  startTime = null;
  duration = 0;
  isRunning = false;

  localStorage.removeItem("startTime");
  localStorage.removeItem("duration");

  updateDisplay(0);
  updateStartButton();
});

/* =========================
   타이머 실행
========================= */
function startTimer() {
  clearInterval(interval);

  interval = setInterval(() => {
    const now = Date.now();
    const elapsed = now - startTime;
    const remaining = duration - elapsed;

    if (remaining <= 0) {
      finishTimer();
      return;
    }

    updateDisplay(remaining);
  }, 1000);
}

/* =========================
   타이머 종료
========================= */
function finishTimer() {
  clearInterval(interval);
  interval = null;

  duration = 0;
  startTime = null;
  isRunning = false;

  localStorage.removeItem("startTime");
  localStorage.removeItem("duration");

  updateDisplay(0);
  updateStartButton();
}

/* =========================
   화면 표시
========================= */
function updateDisplay(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  timeDisplay.innerText = `${minutes}:${seconds}`;
}

/* =========================
   START 버튼 텍스트 변경
========================= */
function updateStartButton() {
  startBtn.innerText = isRunning ? "PAUSE" : "START";
}

/* =========================
   새로고침 복구
========================= */
window.addEventListener("load", () => {
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
