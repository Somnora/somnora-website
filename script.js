const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let stars = []; let w, h;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  stars = Array.from({ length: 120 }, () => ({
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
    ctx.beginPath(); ctx.arc(s.x + offsetX, s.y + offsetY, s.r, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(draw);
}
draw();
const bulbGlow = document.querySelector('.bulb-glow');
gsap.to(bulbGlow, { opacity: 0.4, scale: 1.05, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
gsap.registerPlugin(ScrollTrigger);
gsap.to('body', {
  background: 'linear-gradient(180deg, #0A1323 0%, #1B273E 40%, #FDEFBD 100%)',
  ease: 'none',
  scrollTrigger: { trigger: '.dawn', start: 'top bottom', end: 'bottom top', scrub: true }
});
gsap.utils.toArray('.card').forEach(card => {
  gsap.from(card, { opacity: 0, y: 40, duration: 1, scrollTrigger: { trigger: card, start: 'top 90%' } });
});