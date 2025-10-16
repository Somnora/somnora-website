// STARFIELD PARALLAX
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = Array(180).fill().map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 1.5,
    speed: 0.2 + Math.random() * 0.4
  }));
}
function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#FFF";
  stars.forEach(star => {
    ctx.globalAlpha = Math.random() * 0.6 + 0.4;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
    star.y += star.speed;
    if (star.y > canvas.height) star.y = 0;
  });
  requestAnimationFrame(animateStars);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
animateStars();

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", e => {
    e.preventDefault();
    document.querySelector(anchor.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});

// FORM HANDLING
const form = document.getElementById("waitlist-form");
const responseEl = document.getElementById("form-response");

form.addEventListener("submit", async e => {
  e.preventDefault();
  const formData = new FormData(form);
  const res = await fetch(form.action, { method: "POST", body: formData });
  if (res.ok) {
    responseEl.textContent = "Nora will reach out soon!";
    form.reset();
  } else {
    responseEl.textContent = "Something went wrong. Please try again later.";
  }
});

// AUDIO TOGGLE
const audio = document.getElementById("ambientAudio");
const toggle = document.getElementById("audioToggle");

toggle.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    toggle.textContent = "🔊";
  } else {
    audio.pause();
    toggle.textContent = "🔇";
  }
});

// TYPING EFFECT (EUREKA)
const phrases = ["voice notes", "midnight ideas", "sketches", "thoughts on the go"];
const typedText = document.getElementById("typed-text");
let i = 0, j = 0, currentPhrase = [], isDeleting = false;

function loop() {
  const speed = isDeleting ? 50 : 120;
  if (!isDeleting && j <= phrases[i].length) {
    currentPhrase.push(phrases[i][j]);
    typedText.textContent = currentPhrase.join('');
    j++;
  }
  if (isDeleting && j >= 0) {
    currentPhrase.pop();
    typedText.textContent = currentPhrase.join('');
    j--;
  }
  if (j === phrases[i].length) {
    isDeleting = true;
    setTimeout(loop, 1200);
    return;
  }
  if (isDeleting && j === 0) {
    isDeleting = false;
    i = (i + 1) % phrases.length;
  }
  setTimeout(loop, speed);
}
if (typedText) loop();
