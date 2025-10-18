/* ========== PARALLAX STARFIELD (HERO) ========== */
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d", { alpha: true });
let stars = [];
let rafId = null;

const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

function starCount() {
  // Responsive density: cap to keep perf nice
  const area = window.innerWidth * window.innerHeight;
  return Math.min(260, Math.max(160, Math.round(area / 12000)));
}

function resizeCanvas() {
  // DPR scaling for crisp glow
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const N = starCount();
  stars = Array(N).fill().map(() => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 1.6 + 0.25,
    speed: (prefersReduced ? 0.08 : 0.15) + Math.random() * (prefersReduced ? 0.18 : 0.35),
  }));
}

function animateStars() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.fillStyle = "#fff";

  for (const s of stars) {
    ctx.globalAlpha = 0.55 + Math.random() * 0.35; // gentle twinkle
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();

    s.y += s.speed;
    if (s.y > window.innerHeight) {
      s.y = -2;
      s.x = Math.random() * window.innerWidth;
    }
  }
  rafId = requestAnimationFrame(animateStars);
}

window.addEventListener("resize", () => {
  cancelAnimationFrame(rafId);
  resizeCanvas();
  animateStars();
});
resizeCanvas();
animateStars();

/* ========== SMOOTH SCROLL ========== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

/* ========== WAITLIST FORM (INLINE CONFIRMATION) ========== */
const form = document.getElementById("waitlist-form");
const responseEl = document.getElementById("form-response");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    responseEl.textContent = "Sending…";
    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      });
      if (res.ok) {
        responseEl.textContent = "Nora will reach out soon! ✨";
        form.reset();
      } else {
        responseEl.textContent = "Something went wrong. Please try again.";
      }
    } catch {
      responseEl.textContent = "Network error. Please try again.";
    }
  });
}

/* ========== AMBIENT AUDIO TOGGLE (ON BY DEFAULT) ========== */
const audio = document.getElementById("ambientAudio");
const toggle = document.getElementById("audioToggle");

function syncAudioToggle() {
  if (!toggle || !audio) return;
  const playing = !audio.paused;
  toggle.textContent = playing ? "🔊" : "🔇";
  toggle.classList.toggle("muted", !playing);
  toggle.setAttribute("aria-pressed", playing ? "true" : "false");
}

window.addEventListener("load", () => {
  if (!audio) return;
  audio.volume = 0.22;
  audio.play().catch(() => {
    // Autoplay blocked until user interacts
  }).finally(syncAudioToggle);
});
toggle?.addEventListener("click", () => {
  if (!audio) return;
  if (audio.paused) audio.play(); else audio.pause();
  syncAudioToggle();
});

