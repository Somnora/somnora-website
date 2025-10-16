const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let stars = []; let w, h;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  stars = Array.from({ length: 130 }, () => ({
    x: Math.random() * w, y: Math.random() * h,
    r: Math.random() * 1.3 + 0.3, o: Math.random() * 0.6 + 0.3
  }));
}
resize(); window.addEventListener('resize', resize);

let offsetX = 0, offsetY = 0;
document.addEventListener('mousemove', e => {
  offsetX = (e.clientX / window.innerWidth - 0.5) * 40;
  offsetY = (e.clientY / window.innerHeight - 0.5) * 40;
});

function draw() {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#E2C67A';
  stars.forEach(s => {
    ctx.globalAlpha = s.o;
    ctx.beginPath();
    ctx.arc(s.x + offsetX, s.y + offsetY, s.r, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(draw);
}
draw();

gsap.registerPlugin(ScrollTrigger);

const bulbGlow = document.querySelector('.bulb-glow');
gsap.to(bulbGlow, { opacity: 0.4, scale: 1.05, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut' });

// Smooth color shift scroll
gsap.to('body', {
  background: 'linear-gradient(180deg, #071022 0%, #121C33 40%, #F3EAD2 100%)',
  ease: 'none',
  scrollTrigger: { trigger: '.dawn', start: 'top bottom', end: 'bottom top', scrub: true }
});

// Animate cards in
gsap.utils.toArray('.card').forEach(card => {
  gsap.from(card, { opacity: 0, y: 40, duration: 1, scrollTrigger: { trigger: card, start: 'top 90%' } });
});

// Formspree
const form = document.querySelector('.waitlist-form');
if(form){
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      form.innerHTML = '<p class="thank-you">✨ Thank you for joining the waitlist! Nora will reach out soon.</p>';
    } else {
      form.innerHTML = '<p class="thank-you">Hmm... something went wrong. Try again later.</p>';
    }
  });
}

// Fade-in effect for dawn text
const dawnTexts = document.querySelectorAll('.dawn p');
function revealText() {
  dawnTexts.forEach(p => {
    const rect = p.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      p.classList.add('revealed');
    }
  });
}
window.addEventListener('scroll', revealText);
revealText();
// Fade-in on scroll for all section text
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

// Fade stars as you scroll into daylight
window.addEventListener('scroll', () => {
  const heroHeight = document.querySelector('.hero').offsetHeight;
  const scrollY = window.scrollY;
  const stars = document.getElementById('stars');
  const opacity = Math.max(0, 1 - scrollY / (heroHeight * 0.8));
  stars.style.opacity = opacity * 0.4;
});
