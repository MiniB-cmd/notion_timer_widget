let startTime = null;
let duration = 0;
let interval = null;

document.querySelectorAll("[data-minutes]").forEach(btn => {
  btn.addEventListener("click", () => {
    duration = btn.dataset.minutes * 60 * 1000;
    document.getElementById("time-display").innerText =
      `${btn.dataset.minutes}:00`;
  });
});

document.getElementById("start-btn").addEventListener("click", () => {
  startTime = Date.now();
  localStorage.setItem("startTime", startTime);
  localStorage.setItem("duration", duration);
  startTimer();
});

function startTimer() {
  clearInterval(interval);
  interval = setInterval(() => {
    const now = Date.now();
    const elapsed = now - startTime;
    const remaining = duration - elapsed;

    let displayTime = remaining >= 0
      ? remaining
      : elapsed - duration;

    updateDisplay(displayTime);
  }, 1000);
}

function updateDisplay(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  document.getElementById("time-display").innerText =
    `${minutes}:${seconds}`;
}

window.onload = () => {
  const savedStart = localStorage.getItem("startTime");
  const savedDuration = localStorage.getItem("duration");

  if (savedStart && savedDuration) {
    startTime = Number(savedStart);
    duration = Number(savedDuration);
    startTimer();
  }
};
