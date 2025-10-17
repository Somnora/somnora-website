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

/* ========== EUREKA TYPING (no-flash overlay) ========== */
const phrases = ["voice notes", "midnight ideas", "sketches", "thoughts on the go"];
const eurekaSection = document.getElementById("eureka");
const caretWrap = eurekaSection?.querySelector(".caret-wrap");

let typedTarget = null;              // created on demand
let pIdx = 0, charIdx = 0, deleting = false, typingStarted = false;

/* Create overlay but keep it invisible until we’re ready */
function ensureOverlay(){
  if (typedTarget || !caretWrap) return;
  typedTarget = document.createElement("span");
  typedTarget.className = "typed-overlay";
  typedTarget.setAttribute("aria-live","polite");
  typedTarget.setAttribute("aria-atomic","true");
  caretWrap.insertBefore(typedTarget, caretWrap.firstChild);
}

/* Two-frame reveal avoids a 1-frame paint on iOS Safari */
function revealOverlaySafely(){
  if (!typedTarget) return;
  requestAnimationFrame(()=>{        // frame 1
    requestAnimationFrame(()=>{      // frame 2
      eurekaSection?.classList.add("typing-visible");
    });
  });
}

function typeStep(){
  if (!caretWrap) return;
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  const typeSpeed   = reduce ? 120 : 100;
  const deleteSpeed = reduce ?  65 :  50;
  const pauseFull   = reduce ? 1400 : 1100;

  const word = phrases[pIdx];

  // First character: make overlay, set first char, then reveal after 2 frames
  if (!deleting && charIdx === 0){
    ensureOverlay();
    typedTarget.textContent = word.charAt(0);
    charIdx = 1;
    revealOverlaySafely();
    return void setTimeout(typeStep, typeSpeed);
  }

  // Type forward
  if (!deleting && charIdx <= word.length){
    typedTarget.textContent = word.slice(0, charIdx++);
    return void setTimeout(typeStep, typeSpeed);
  }

  // Pause at full word
  if (!deleting && charIdx > word.length){
    deleting = true;
    return void setTimeout(typeStep, pauseFull);
  }

  // Delete backward
  if (deleting && charIdx >= 0){
    typedTarget.textContent = word.slice(0, charIdx--);
    return void setTimeout(typeStep, deleteSpeed);
  }

  // Next word
  deleting = false;
  pIdx = (pIdx + 1) % phrases.length;
  setTimeout(typeStep, typeSpeed);
}

function startTypingOnce(){
  if (typingStarted) return;
  typingStarted = true;

  // Start with a clean, hidden overlay
  ensureOverlay();
  if (typedTarget) typedTarget.textContent = "";
  eurekaSection?.classList.remove("typing-visible");

  // Defer to next paint to avoid any initial paint/flicker
  requestAnimationFrame(()=> requestAnimationFrame(typeStep));
}

// Begin when Eureka enters viewport (once)
if (eurekaSection){
  if ("IntersectionObserver" in window){
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries){
        if (entry.isIntersecting && entry.intersectionRatio > 0.35){
          startTypingOnce();
          io.disconnect();
          break;
        }
      }
    }, { threshold: [0, 0.35, 1] });
    io.observe(eurekaSection);
  } else {
    startTypingOnce();
  }
}

