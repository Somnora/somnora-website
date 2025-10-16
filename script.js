/* ========== PARALLAX STARFIELD (HERO) ========== */
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = Array(180).fill().map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 1.5 + 0.2,
    speed: 0.15 + Math.random() * 0.35
  }));
}
function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  stars.forEach(s => {
    ctx.globalAlpha = 0.45 + Math.random() * 0.4;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
    s.y += s.speed;          // slow drift downward
    if (s.y > canvas.height) s.y = 0;
  });
  requestAnimationFrame(animateStars);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
animateStars();

/* ========== SMOOTH SCROLL ========== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    e.preventDefault();
    document.querySelector(a.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});

/* ========== WAITLIST FORM (INLINE CONFIRMATION) ========== */
const form = document.getElementById("waitlist-form");
const responseEl = document.getElementById("form-response");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
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
        responseEl.textContent = "Hmm… something went wrong. Please try again.";
      }
    } catch {
      responseEl.textContent = "Network error. Please try again.";
    }
  });
}

/* ========== AMBIENT AUDIO TOGGLE (ON BY DEFAULT) ========== */
const audio = document.getElementById("ambientAudio");
const toggle = document.getElementById("audioToggle");

window.addEventListener("load", () => {
  if (audio) {
    audio.volume = 0.25;
    audio.play().catch(() => {}); // some browsers require interaction
  }
});

toggle?.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    toggle.textContent = "🔊";
    toggle.classList.remove("muted");
  } else {
    audio.pause();
    toggle.textContent = "🔇";
    toggle.classList.add("muted");
  }
});

/* ========== TYPING EFFECT (EUREKA) ========== */
const phrases = ["voice notes", "midnight ideas", "sketches", "thoughts on the go"];
const typedText = document.getElementById("typed-text");
let i = 0, j = 0, current = [], deleting = false;

function typeLoop() {
  if (!typedText) return;

  const speed = deleting ? 50 : 110;

  if (!deleting && j <= phrases[i].length) {
    current.push(phrases[i][j]);
    typedText.textContent = current.join("");
    j++;
  }

  if (deleting && j >= 0) {
    current.pop();
    typedText.textContent = current.join("");
    j--;
  }

  if (j === phrases[i].length) {
    deleting = true;
    setTimeout(typeLoop, 1200);
    return;
  }
  if (deleting && j === 0) {
    deleting = false;
    i = (i + 1) % phrases.length;
  }
  setTimeout(typeLoop, speed);
}
typeLoop();
