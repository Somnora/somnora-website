/* ========== PARALLAX STARFIELD ========== */
const canvas = document.getElementById("stars");
const ctx = canvas?.getContext("2d", { alpha: true });
let stars = [];
let rafId = null;

const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

function starCount() {
  const area = window.innerWidth * window.innerHeight;
  return Math.min(260, Math.max(160, Math.round(area / 12000)));
}

function resizeCanvas() {
  if (!canvas || !ctx) return;
  
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
  if (!canvas || !ctx) return;
  
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.fillStyle = "#fff";

  for (const s of stars) {
    ctx.globalAlpha = 0.55 + Math.random() * 0.35;
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

if (canvas && ctx) {
  window.addEventListener("resize", () => {
    cancelAnimationFrame(rafId);
    resizeCanvas();
    animateStars();
  });
  resizeCanvas();
  animateStars();
}

/* ========== MOBILE MENU ========== */
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle && navLinks) {
  mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
    });
  });
}

/* ========== SMOOTH SCROLL ========== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (!target) return;
    
    e.preventDefault();
    
    // Account for fixed nav height
    const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
    const targetPosition = target.offsetTop - navHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: "smooth"
    });
  });
});

/* ========== NAV SCROLL EFFECT ========== */
const nav = document.querySelector('.nav');
let lastScroll = 0;

if (nav) {
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow when scrolled
    if (currentScroll > 50) {
      nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
      nav.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
  });
}

/* ========== WAITLIST FORM ========== */
const form = document.getElementById("waitlist-form");
const responseEl = document.getElementById("form-response");

if (form && responseEl) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    
    button.textContent = "Sending...";
    button.disabled = true;
    responseEl.textContent = "";
    
    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      });
      
      if (res.ok) {
        responseEl.textContent = "✨ Welcome to Somnora! Check your email for confirmation.";
        responseEl.style.color = "#C6A95E";
        form.reset();
        
        // Track conversion (if you add analytics later)
        if (typeof gtag !== 'undefined') {
          gtag('event', 'waitlist_signup', {
            'event_category': 'engagement',
            'event_label': 'footer_form'
          });
        }
      } else {
        responseEl.textContent = "Something went wrong. Please try again or email us directly.";
        responseEl.style.color = "#d9534f";
      }
    } catch (error) {
      responseEl.textContent = "Network error. Please check your connection and try again.";
      responseEl.style.color = "#d9534f";
    } finally {
      button.textContent = originalText;
      button.disabled = false;
    }
  });
}

/* ========== AMBIENT AUDIO TOGGLE ========== */
const audio = document.getElementById("ambientAudio");
const toggle = document.getElementById("audioToggle");

function syncAudioToggle() {
  if (!toggle || !audio) return;
  const playing = !audio.paused;
  toggle.textContent = playing ? "🔊" : "🔇";
  toggle.classList.toggle("muted", !playing);
  toggle.setAttribute("aria-pressed", playing ? "true" : "false");
  
  // Save preference
  localStorage.setItem('audioEnabled', playing ? 'true' : 'false');
}

if (audio && toggle) {
  // Check saved preference
  const audioEnabled = localStorage.getItem('audioEnabled') !== 'false';
  
  window.addEventListener("load", () => {
    audio.volume = 0.22;
    
    if (audioEnabled) {
      audio.play().catch(() => {
        // Autoplay blocked - will need user interaction
      }).finally(syncAudioToggle);
    } else {
      syncAudioToggle();
    }
  });
  
  toggle.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
    syncAudioToggle();
  });
}

/* ========== INLINE WORD ROTATOR (EUREKA SECTION) ========== */
const rotatePhrases = ["voice notes", "midnight ideas", "sketches", "thoughts on the go", "inspirations", "eureka moments"];
const rotEl = document.getElementById("idea-rotate");
const eureka = document.getElementById("eureka");

let rotIndex = 0;
let rotTimer = null;

function rotateWord() {
  if (!rotEl) return;
  
  rotEl.classList.remove("fade-in");
  rotEl.classList.add("fade-out");
  
  setTimeout(() => {
    rotIndex = (rotIndex + 1) % rotatePhrases.length;
    rotEl.textContent = rotatePhrases[rotIndex];
    rotEl.classList.remove("fade-out");
    rotEl.classList.add("fade-in");
  }, 280);
}

function startRotate() {
  if (rotTimer || !rotEl) return;
  rotEl.classList.add("fade-in");
  rotTimer = setInterval(rotateWord, 2800);
}

// Start rotation when eureka section enters viewport
if (eureka && rotEl && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      startRotate();
      io.disconnect();
    }
  }, { threshold: 0.2 });
  io.observe(eureka);
} else if (rotEl) {
  startRotate();
}

/* ========== SCROLL ANIMATIONS ========== */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Animate cards, steps, pricing cards, team members
  const animateElements = document.querySelectorAll('.card, .step, .pricing-card, .team-member, .comparison-item, .faq-item');
  
  animateElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
  });
}

// Initialize animations when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
  initScrollAnimations();
}

/* ========== COUNTER ANIMATION ========== */
function animateCounter() {
  const counter = document.querySelector('.counter-number');
  if (!counter) return;
  
  const target = parseInt(counter.textContent.replace(/,/g, ''));
  const duration = 2000; // 2 seconds
  const steps = 60;
  const increment = target / steps;
  let current = 0;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      counter.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      counter.textContent = Math.floor(current).toLocaleString();
    }
  }, duration / steps);
}

// Trigger counter animation when visible
const counterElement = document.querySelector('.waitlist-counter');
if (counterElement && 'IntersectionObserver' in window) {
  const counterObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounter();
      counterObserver.disconnect();
    }
  }, { threshold: 0.5 });
  
  counterObserver.observe(counterElement);
}

/* ========== FAQ ACCORDIONS ========== */
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const summary = item.querySelector('summary');
  
  summary?.addEventListener('click', (e) => {
    // Close other FAQs when opening one (optional)
    // faqItems.forEach(otherItem => {
    //   if (otherItem !== item && otherItem.open) {
    //     otherItem.open = false;
    //   }
    // });
  });
});

/* ========== PERFORMANCE OPTIMIZATION ========== */
// Lazy load images (if you add product screenshots)
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

/* ========== KEYBOARD NAVIGATION ========== */
document.addEventListener('keydown', (e) => {
  // ESC to close mobile menu
  if (e.key === 'Escape' && navLinks?.classList.contains('active')) {
    navLinks.classList.remove('active');
    mobileMenuToggle?.classList.remove('active');
  }
});

/* ========== CONSOLE EASTER EGG ========== */
console.log(
  '%c🌙 Somnora ',
  'font-size: 24px; font-weight: bold; color: #F0B56A; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);'
);
console.log(
  '%cWhere Science Meets the Subconscious',
  'font-size: 14px; color: #A7B4D5;'
);
console.log(
  '%cInterested in joining our team? Email: jmcshanedp@gmail.com',
  'font-size: 12px; color: #F9E9D2; font-style: italic;'
);
