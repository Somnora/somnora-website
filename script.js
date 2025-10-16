// --- STARFIELD ---
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let stars = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 1.5,
    speed: Math.random() * 0.02 + 0.02
  }));
}
resize();
window.addEventListener('resize', resize);

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  stars.forEach(s => {
    ctx.globalAlpha = 0.5 + Math.random() * 0.5;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
    s.y += s.speed * 100;
    if (s.y > canvas.height) s.y = 0;
  });
  requestAnimationFrame(animateStars);
}
animateStars();

// --- FADE-IN ON SCROLL ---
const fadeElems = document.querySelectorAll('.section p, .section h2, .card');
function revealOnScroll() {
  fadeElems.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      el.classList.add('revealed');
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// --- FADE STARS OUT WHEN SCROLLING ---
window.addEventListener('scroll', () => {
  const heroHeight = document.querySelector('.hero').offsetHeight;
  const scrollY = window.scrollY;
  const opacity = Math.max(0, 1 - scrollY / (heroHeight * 0.8));
  canvas.style.opacity = opacity * 0.45;
});

// --- AUDIO TOGGLE WITH FADE ---
const audio = document.getElementById('ambient-audio');
const toggle = document.getElementById('audio-toggle');

window.addEventListener('load', () => {
  audio.volume = 0.25;
  audio.play().catch(() => {});
});

function fadeVolume(target, duration) {
  const start = audio.volume;
  const step = (target - start) / (duration / 50);
  const fade = setInterval(() => {
    audio.volume += step;
    if ((step < 0 && audio.volume <= target) || (step > 0 && audio.volume >= target)) {
      clearInterval(fade);
      audio.volume = target;
    }
  }, 50);
}

toggle.addEventListener('click', () => {
  if (audio.muted) {
    audio.muted = false;
    fadeVolume(0.25, 800);
    toggle.textContent = '🔊';
    toggle.classList.remove('muted');
  } else {
    fadeVolume(0, 600);
    setTimeout(() => { audio.muted = true; }, 600);
    toggle.textContent = '🔇';
    toggle.classList.add('muted');
  }
});
