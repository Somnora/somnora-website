const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('has-js');

const PRICING = {
  founders: { monthly: "9.99", yearly: "59.99" },
  standard: { monthly: "9.99", yearly: "79.99" }
};

/* ========== MODES STEPPER ========== */
const modeSteps = document.querySelectorAll('.mode-step');
const modeDetailLabel = document.getElementById('mode-detail-label');
const modeDetailTitle = document.getElementById('mode-detail-title');
const modeDetailPurpose = document.getElementById('mode-detail-purpose');
const modeDetailList = document.getElementById('mode-detail-list');

const MODE_DETAILS = {
  dream: {
    label: "Mode 01 · Dream",
    title: "Dream",
    purpose: "Purpose: capture dream fragments, emotional residue, and whatever still feels present in the morning.",
    points: [
      "Begin with an image, feeling, or line of dialogue, no perfect memory required.",
      "Let Nora reflect back the thread without overexplaining it.",
      "Leave with one clearer thought to carry into the day."
    ]
  },
  eureka: {
    label: "Mode 02 · Eureka",
    title: "Eureka",
    purpose: "Purpose: catch late-night ideas while they still have energy.",
    points: [
      "Drop in the loose thought before it slips away.",
      "Use Nora to shape the signal without sanding off its edge.",
      "End with a clearer thread worth following in daylight."
    ]
  },
  analytics: {
    label: "Mode 03 · Analytics",
    title: "Analytics",
    purpose: "Purpose: notice what repeats across nights, moods, and ideas.",
    points: [
      "Review patterns across sleep, reflection, mood, and what keeps resurfacing.",
      "Spot gentle relationships worth paying attention to.",
      "Build context over time without forcing a conclusion."
    ]
  },
  mindful: {
    label: "Mode 04 · Mindful",
    title: "Mindful",
    purpose: "Purpose: close the day with a steadier body and a quieter mental field.",
    points: [
      "Follow a brief breathing rhythm that asks very little of you.",
      "Use one grounding prompt to set down mental noise before sleep.",
      "Finish with a steadier handoff into the night."
    ]
  }
};

function renderModeDetail(mode) {
  const detail = MODE_DETAILS[mode];
  if (!detail || !modeDetailLabel || !modeDetailTitle || !modeDetailPurpose || !modeDetailList) return;

  modeDetailLabel.textContent = detail.label;
  modeDetailTitle.textContent = detail.title;
  modeDetailPurpose.textContent = detail.purpose;
  modeDetailList.innerHTML = detail.points.map((point) => `<li>${point}</li>`).join("");
}

if (modeSteps.length && modeDetailList) {
  modeSteps.forEach((step) => {
    step.addEventListener('click', () => {
      const mode = step.dataset.mode;
      if (!mode || !MODE_DETAILS[mode]) return;

      modeSteps.forEach((btn) => {
        const isActive = btn === step;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });

      renderModeDetail(mode);
    });
  });

  const initialMode = document.querySelector('.mode-step.is-active')?.dataset.mode || modeSteps[0].dataset.mode;
  if (initialMode) renderModeDetail(initialMode);
}

/* ========== PRICING TOGGLE ========== */
const toggleBtnFounders = document.getElementById('btn-founders');
const toggleBtnStandard = document.getElementById('btn-standard');
const priceValues = document.querySelectorAll('.price-value');

function setPricing(mode) { // 'founders' or 'standard'
  const activeMode = mode === 'standard' ? 'standard' : 'founders';
  const isStandard = activeMode === 'standard';
  
  // Toggle visual state
  if (toggleBtnFounders && toggleBtnStandard) {
    toggleBtnFounders.setAttribute('aria-pressed', !isStandard);
    toggleBtnStandard.setAttribute('aria-pressed', isStandard);
  }
  
  const slider = document.querySelector('.toggle-slider');
  if(slider) {
    slider.style.transform = isStandard ? 'translateX(100%)' : 'translateX(0)';
  }

  // Show/hide founder reference price on yearly card
  const refPrice = document.getElementById('yearly-ref-price');
  if (refPrice) {
    refPrice.style.display = isStandard ? 'none' : '';
  }

  // Update numbers for ALL cards
  priceValues.forEach(el => {
    const period = el.dataset.pricePeriod;
    if (period && PRICING[activeMode][period]) {
      el.style.opacity = '0';
      setTimeout(() => {
        el.textContent = PRICING[activeMode][period];
        el.style.opacity = '1';
      }, 160);
    }
  });
}

if (toggleBtnFounders && toggleBtnStandard) {
  toggleBtnFounders.addEventListener('click', () => setPricing('founders'));
  toggleBtnStandard.addEventListener('click', () => setPricing('standard'));
  setPricing('founders');
}

/* ========== MOBILE MENU ========== */
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileToggle && navLinks) {
  mobileToggle.setAttribute('aria-expanded', 'false');
  mobileToggle.addEventListener('click', () => {
    const isOpened = navLinks.classList.toggle('is-open');
    mobileToggle.setAttribute('aria-expanded', isOpened ? 'true' : 'false');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      mobileToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ========== FAQ DETAILS ========== */
const details = document.querySelectorAll("details");
details.forEach((targetDetail) => {
  targetDetail.addEventListener("toggle", () => {
    if (!targetDetail.open) return;

    details.forEach((detail) => {
      if (detail !== targetDetail) {
        detail.removeAttribute("open");
      }
    });
  });
});

/* ========== SUBTLE SCROLL REVEAL ========== */
const revealTargets = document.querySelectorAll('.modes-header, .modes-layout, .mode-mobile-card, .section-header, .pricing-card, .faq-item, .footer h2, .footer .btn-group, .feature-item, .io-card, .privacy-bullet-box');

if (revealTargets.length) {
  revealTargets.forEach((el) => el.classList.add('reveal'));

  if (prefersReducedMotion) {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px"
    });

    revealTargets.forEach((el) => revealObserver.observe(el));
  }
}

/* ============================================================
   NIGHT → MORNING ATMOSPHERE ENGINE
   Sky crossfade, starfield/fireflies, cursor lantern, parallax,
   card tilt, magnetic buttons, scroll reveals, Nora chat loop.
   Everything degrades gracefully and respects reduced motion.
   ============================================================ */

(function () {
  const reduced = prefersReducedMotion;
  if (reduced) document.documentElement.classList.add('reduced-motion');

  const finePointer = window.matchMedia('(pointer: fine)').matches;

  /* ---------- Scroll reveals ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('revealed'));
  }

  /* ---------- Sky crossfade + day-zone detection ---------- */
  const skyNight = document.querySelector('.sky-night');
  const skyDusk = document.querySelector('.sky-dusk');
  const skyDawn = document.querySelector('.sky-dawn');
  const firstDayZone = document.querySelector('[data-zone="day"]');

  function updateSky() {
    if (!skyNight || !skyDusk || !skyDawn) return;

    // Anchor the sunrise to the first morning section: the sky must be
    // fully light BEFORE ink text arrives, regardless of page length.
    const vh = window.innerHeight;
    const dawnAt = firstDayZone
      ? firstDayZone.offsetTop - vh * 0.9
      : (document.documentElement.scrollHeight - vh) * 0.6;
    const band = vh * 1.4; // the night→dawn transition happens across this band
    const t = Math.max(0, Math.min(1, (window.scrollY - (dawnAt - band)) / band));

    const night = Math.max(0, 1 - t * 1.35);
    const dusk = Math.max(0, 1 - Math.abs(t - 0.45) / 0.4); // bell around mid-transition
    const dawn = Math.max(0, Math.min(1, (t - 0.5) / 0.4));

    skyNight.style.opacity = night.toFixed(3);
    skyDusk.style.opacity = Math.min(1, dusk).toFixed(3);
    skyDawn.style.opacity = dawn.toFixed(3);

    // Flip chrome (nav, lantern) in step with the sunrise
    document.body.classList.toggle('zone-day', t > 0.62);
  }

  /* ---------- Parallax ---------- */
  const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'));

  function updateParallax() {
    if (reduced) return;
    const y = window.scrollY;
    parallaxEls.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0.15;
      el.style.transform = `translateY(${(y * speed).toFixed(1)}px)`;
    });
  }

  let scrollScheduled = false;
  function onScroll() {
    if (scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(() => {
      updateSky();
      updateParallax();
      scrollScheduled = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  updateSky();

  /* ---------- Nightfield: stars above, fireflies rising, cursor-aware ---------- */
  const canvas = document.getElementById('nightfield');
  const mouse = { x: -9999, y: -9999 };

  if (canvas && !reduced) {
    const ctx = canvas.getContext('2d');
    let w, h, dpr;
    let stars = [];
    let flies = [];

    function sizeCanvas() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = Math.floor(innerWidth * dpr);
      h = canvas.height = Math.floor(innerHeight * dpr);
      canvas.style.width = innerWidth + 'px';
      canvas.style.height = innerHeight + 'px';

      const starCount = Math.min(120, Math.floor(innerWidth / 17));
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h * 0.85,
        r: (Math.random() * 1.1 + 0.4) * dpr,
        tw: Math.random() * Math.PI * 2,
        ts: 0.004 + Math.random() * 0.012
      }));

      const flyCount = Math.min(16, Math.floor(innerWidth / 95));
      flies = Array.from({ length: flyCount }, () => spawnFly());
    }

    function spawnFly() {
      return {
        x: Math.random() * w,
        y: h * (0.4 + Math.random() * 0.6),
        vx: (Math.random() - 0.5) * 0.18 * dpr,
        vy: -(0.06 + Math.random() * 0.16) * dpr,
        r: (Math.random() * 1.1 + 0.7) * dpr,
        phase: Math.random() * Math.PI * 2,
        glow: 0.26 + Math.random() * 0.34
      };
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      const scrollMax = document.documentElement.scrollHeight - innerHeight;
      const p = scrollMax > 0 ? window.scrollY / scrollMax : 0;
      const nightness = Math.max(0, 1 - p / 0.6); // stars fade as morning comes

      // Stars: gentle twinkle, brighter near the cursor's lantern
      if (nightness > 0.02) {
        stars.forEach((s) => {
          s.tw += s.ts;
          const dx = s.x - mouse.x * dpr;
          const dy = s.y - mouse.y * dpr;
          const near = Math.max(0, 1 - Math.hypot(dx, dy) / (300 * dpr));
          const a = (0.25 + 0.35 * Math.abs(Math.sin(s.tw)) + near * 0.4) * nightness;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r + near * 0.7 * dpr, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(247, 239, 228, ${a.toFixed(3)})`;
          ctx.fill();
        });
      }

      // Fireflies: drift upward, shy away from the cursor
      const flyAlpha = Math.max(0.25, nightness);
      flies.forEach((f, i) => {
        f.phase += 0.02;
        const dx = f.x - mouse.x * dpr;
        const dy = f.y - mouse.y * dpr;
        const d = Math.hypot(dx, dy);
        if (d < 120 * dpr && d > 0.001) {
          f.vx += (dx / d) * 0.028 * dpr;
          f.vy += (dy / d) * 0.028 * dpr;
        }
        f.vx = Math.max(-0.5 * dpr, Math.min(0.5 * dpr, f.vx * 0.985));
        f.vy = Math.max(-0.5 * dpr, Math.min(0.3 * dpr, f.vy * 0.985 - 0.0015 * dpr));
        f.x += f.vx + Math.sin(f.phase) * 0.22 * dpr;
        f.y += f.vy;
        if (f.y < -20 || f.x < -20 || f.x > w + 20) flies[i] = spawnFly(), flies[i].y = h + 10;

        const pulse = 0.55 + 0.45 * Math.sin(f.phase * 1.7);
        const a = f.glow * pulse * flyAlpha;
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 5);
        grad.addColorStop(0, `rgba(232, 184, 109, ${(a).toFixed(3)})`);
        grad.addColorStop(0.4, `rgba(224, 146, 122, ${(a * 0.5).toFixed(3)})`);
        grad.addColorStop(1, 'rgba(224, 146, 122, 0)');
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      requestAnimationFrame(frame);
    }

    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);
    requestAnimationFrame(frame);
  }

  /* ---------- Cursor lantern ---------- */
  const lantern = document.getElementById('lantern');
  if (lantern && finePointer && !reduced) {
    let lx = -9999, ly = -9999, tx = lx, ty = ly;
    window.addEventListener('pointermove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      document.body.classList.add('lantern-on');
    }, { passive: true });
    window.addEventListener('pointerleave', () => {
      document.body.classList.remove('lantern-on');
      mouse.x = mouse.y = -9999;
    });

    (function glide() {
      lx += (tx - lx) * 0.065;
      ly += (ty - ly) * 0.065;
      lantern.style.transform = `translate(${lx.toFixed(1)}px, ${ly.toFixed(1)}px)`;
      requestAnimationFrame(glide);
    })();
  }

  /* ---------- Card tilt + glare (cursor-reactive) ---------- */
  if (finePointer && !reduced) {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      let raf = null;
      let resetTimer = null;
      card.addEventListener('pointerenter', () => {
        // Direct control while the pointer drives the card
        clearTimeout(resetTimer);
        card.style.transition = 'none';
      });
      card.addEventListener('pointermove', (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          const rx = (0.5 - py) * 3.2;
          const ry = (px - 0.5) * 4.2;
          card.style.transform = `perspective(1100px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-2px)`;
          card.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
          card.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
          raf = null;
        });
      });
      card.addEventListener('pointerleave', () => {
        // Hand back to CSS for a soft settle
        card.style.transition = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)';
        card.style.transform = '';
        resetTimer = setTimeout(() => { card.style.transition = ''; }, 700);
      });
    });

    /* ---------- Magnetic buttons ---------- */
    document.querySelectorAll('[data-magnetic]').forEach((btn) => {
      let resetTimer = null;
      btn.addEventListener('pointerenter', () => {
        clearTimeout(resetTimer);
        btn.style.transition = 'box-shadow 0.25s ease, background 0.25s ease';
      });
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const mx = (e.clientX - r.left - r.width / 2) * 0.1;
        const my = (e.clientY - r.top - r.height / 2) * 0.16;
        btn.style.transform = `translate(${mx.toFixed(1)}px, ${my.toFixed(1)}px)`;
      });
      btn.addEventListener('pointerleave', () => {
        btn.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s ease, background 0.25s ease';
        btn.style.transform = '';
        resetTimer = setTimeout(() => { btn.style.transition = ''; }, 550);
      });
    });
  }

  /* ---------- Nora chat demo loop ---------- */
  const chatDemo = document.getElementById('chat-demo');
  if (chatDemo) {
    const bubbles = Array.from(chatDemo.querySelectorAll('.chat-bubble'));
    const typing = chatDemo.querySelector('.bubble-typing');

    if (reduced) {
      bubbles.forEach((b) => b.classList.add('shown'));
      if (typing) typing.style.display = 'none';
    } else {
      const show = (i, delay) => setTimeout(() => bubbles[i] && bubbles[i].classList.add('shown'), delay);
      show(0, 700);      // user's fragment
      show(1, 2100);     // Nora's reply
      show(2, 3600);     // Nora is still thinking…
    }
  }
})();
