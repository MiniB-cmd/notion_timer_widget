let startTime = null;
let duration = 0;
let interval = null;

/* =========================
   누적 시간 버튼 (10분 / 30분)
========================= */
document.querySelectorAll("[data-add-minutes]").forEach(btn => {
  btn.addEventListener("click", () => {
    const addMinutes = Number(btn.dataset.addMinutes);
    duration += addMinutes * 60 * 1000;

    startTime = null;
    updateDisplay(duration);
  });
});

/* =========================
   START 버튼
========================= */
document.getElementById("startBtn").addEventListener("click", () => {
  if (duration <= 0) return;

  startTime = Date.now();
  localStorage.setItem("startTime", startTime);
  localStorage.setItem("duration", duration);

  startTimer();
});

/* =========================
   RESET 버튼
========================= */
document.getElementById("resetBtn").addEventListener("click", () => {
  clearInterval(interval);
  interval = null;

  startTime = null;
  duration = 0;

  localStorage.removeItem("startTime");
  localStorage.removeItem("duration");

  updateDisplay(0);
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

    const displayTime =
      remaining >= 0 ? remaining : Math.abs(remaining);

    updateDisplay(displayTime);
  }, 1000);
}

/* =========================
   화면 표시
========================= */
function updateDisplay(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  document.getElementById("time-display").innerText =
    `${minutes}:${seconds}`;
}

/* =========================
   새로고침 복구
========================= */
window.onload = () => {
  const savedStart = localStorage.getItem("startTime");
  const savedDuration = localStorage.getItem("duration");

  if (savedStart && savedDuration) {
    startTime = Number(savedStart);
    duration = Number(savedDuration);
    startTimer();
  }
};
