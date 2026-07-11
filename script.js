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
    purpose: "Purpose: catch the night before it fades, even half-awake.",
    points: [
      "Speak it half-asleep: one tap from the morning nudge and Nora is already listening.",
      "She remembers your past threads and asks the one question worth asking.",
      "Every dream is saved, titled, and searchable in your private archive."
    ]
  },
  eureka: {
    label: "Mode 02 · Eureka",
    title: "Eureka",
    purpose: "Purpose: catch late-night ideas while they still have energy.",
    points: [
      "Drop in the loose thought before it slips away.",
      "Use Nora to shape the signal without sanding off its edge.",
      "Dreams with creative charge can spark concept notes on their own, waiting in your Eureka inbox by morning."
    ]
  },
  analytics: {
    label: "Mode 03 · Insights",
    title: "Insights",
    purpose: "Purpose: context for how you're really doing, never a diagnosis.",
    points: [
      "Sleep balance from your real nights: durations and trends, not a judgment score.",
      "A dream climate that maps what your nights keep returning to.",
      "Resilience: how your body actually settles during breathing sessions."
    ]
  },
  mindful: {
    label: "Mode 04 · Mindful",
    title: "Mindful",
    purpose: "Purpose: close the day with a steadier body and a quieter mind.",
    points: [
      "A 90-second guided wind-down: breathing that asks very little of you.",
      "Meditations and gratitude prompts, read aloud in Nora's own voice.",
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
    const isOpened = navLinks.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', isOpened ? 'true' : 'false');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Escape and outside-tap both dismiss the open menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (!navLinks.classList.contains('open')) return;
    if (navLinks.contains(e.target) || mobileToggle.contains(e.target)) return;
    navLinks.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
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
  const skyUpper = document.querySelector('.sky-upper');
  const skyDay = document.querySelector('.sky-day');
  const cloudField = document.getElementById('cloudfield');
  const hillFar = document.querySelector('.hill-far');
  const hillBack = document.querySelector('.hill-back');
  const hillMid = document.querySelector('.hill-mid');
  const grassEl = document.querySelector('.ground .grass');
  const firstDayZone = document.querySelector('[data-zone="day"]');

  // Single source of truth for the atmosphere, shared with the canvas
  const atmo = { night: 1, day: 0, ground: 0, blue: 0 };
  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const easeOut = (x) => 1 - Math.pow(1 - x, 3);

  function updateSky() {
    if (!skyNight || !skyUpper || !skyDay) return;

    // One continuous descent: space → upper atmosphere → soft blue sky.
    // The band is pinned to start at the very top of the page, so the hero
    // sits in full night and the whole scroll down to the first day zone is
    // one long, gradual dawn; ink text (pricing on) always lands on light sky.
    const vh = window.innerHeight;
    const dayAt = firstDayZone
      ? firstDayZone.offsetTop - vh * 0.9
      : (document.documentElement.scrollHeight - vh) * 0.6;
    const band = Math.max(vh * 2, Math.min(vh * 5.6, dayAt));
    const t = clamp01((window.scrollY - (dayAt - band)) / band);

    // The three layers stack (night below, dawn, day on top), so brightness
    // stays monotonic by construction: the dawn blue rises once over the
    // night and HOLDS (it never fades back out) and broad daylight only
    // eases in over the last stretch, covering the dawn rather than
    // replacing it. (The old triangular dawn envelope faded before the day
    // arrived, which read as brighter → darker → brighter.)
    const night = clamp01(1 - t * 1.45);                      // stars thin out as the dawn blue takes over
    const upper = clamp01((t - 0.18) / 0.5);                  // dawn covers the night by ~2/3 scroll, then holds
    const dp = clamp01((t - 0.82) / 0.18);                    // just the last little bit is broad daylight,
    const day = dp * dp * (3 - 2 * dp);                       // eased so it never snaps in
    const cloudGate = clamp01((t - 0.52) / 0.26);             // clouds drift in during the late dawn

    // The ground rises to meet the footer.
    const maxScroll = document.documentElement.scrollHeight - vh;
    const g = clamp01((window.scrollY - (maxScroll - vh * 1.7)) / (vh * 1.35));

    skyNight.style.opacity = night.toFixed(3);
    skyUpper.style.opacity = Math.min(1, upper).toFixed(3);
    skyDay.style.opacity = day.toFixed(3);
    // Fade clouds out as the ground rises so none protrude into the hills.
    if (cloudField) cloudField.style.opacity = (cloudGate * (1 - Math.min(1, g * 1.3))).toFixed(3);

    // Ground layers arrive in parallax: far ridge, back hill, mid, grass
    if (hillBack) {
      if (hillFar) hillFar.style.transform = `translateY(${((1 - easeOut(clamp01(g / 0.7))) * 112).toFixed(2)}%)`;
      hillBack.style.transform = `translateY(${((1 - easeOut(clamp01((g - 0.08) / 0.82))) * 112).toFixed(2)}%)`;
      hillMid.style.transform = `translateY(${((1 - easeOut(clamp01((g - 0.12) / 0.88))) * 112).toFixed(2)}%)`;
      grassEl.style.transform = `translateY(${((1 - easeOut(clamp01((g - 0.26) / 0.74))) * 108).toFixed(2)}%)`;
    }

    atmo.night = night;
    atmo.day = t;
    atmo.ground = g;
    atmo.blue = day;

    // Flip the ink text on the sky's actual brightness, not the scroll
    // position, so the swap always lands on a light-enough backdrop.
    document.body.classList.toggle('zone-day', day > 0.45);
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
    let meteors = [];
    let nextMeteorAt = performance.now() + 1600;
    let birds = [];
    let nextBirdAt = 0;
    let skyTurned = false;

    function spawnBird() {
      const goingRight = Math.random() < 0.5;
      birds.push({
        x: goingRight ? -50 * dpr : w + 50 * dpr,
        y: (0.14 + Math.random() * 0.28) * h,
        vx: (0.9 + Math.random() * 0.7) * dpr * (goingRight ? 1 : -1),
        size: (12 + Math.random() * 8) * dpr,
        bob: (0.5 + Math.random() * 0.6),
        phase: Math.random() * Math.PI * 2,
        flap: 0.11 + Math.random() * 0.05,
        t: 0
      });
    }


    function sizeCanvas() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = Math.floor(innerWidth * dpr);
      h = canvas.height = Math.floor(innerHeight * dpr);
      canvas.style.width = innerWidth + 'px';
      canvas.style.height = innerHeight + 'px';

      const starCount = Math.min(240, Math.floor(innerWidth / 8));
      stars = Array.from({ length: starCount }, () => {
        const big = Math.random() < 0.16;
        return {
          bx: Math.random() * w,
          by: Math.random() * h * 0.9,
          ox: 0, oy: 0,
          r: (big ? (Math.random() * 1.2 + 1.1) : (Math.random() * 0.8 + 0.35)) * dpr,
          depth: 0.5 + Math.random() * 0.9,
          base: big ? 0.44 : 0.24,
          tw: Math.random() * Math.PI * 2,
          ts: 0.006 + Math.random() * 0.016,
          tint: Math.random() < 0.7 ? '250, 242, 228' : '242, 210, 156',
          flare: big && Math.random() < 0.55 ? (8 + Math.random() * 12) * dpr : 0,
          rot: Math.random() * Math.PI
        };
      });

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
      const nightness = atmo.night; // shared with the sky crossfade
      const dayness = 1 - nightness;

      updateClouds();

      // Stars: layered glow cores, spring displacement away from the
      // cursor, and diffraction spikes on the bright few
      if (nightness > 0.02) {
        const mx = mouse.x * dpr, my = mouse.y * dpr;
        const R = 180 * dpr;
        stars.forEach((s) => {
          s.tw += s.ts;

          // The cursor parts the stars; they drift back on a soft spring
          const ddx = s.bx - mx, ddy = s.by - my;
          const d = Math.hypot(ddx, ddy);
          let txo = 0, tyo = 0;
          if (d < R && d > 0.001) {
            const f = 1 - d / R;
            const push = f * f * 34 * dpr * s.depth;
            txo = (ddx / d) * push;
            tyo = (ddy / d) * push;
          }
          s.ox += (txo - s.ox) * 0.07;
          s.oy += (tyo - s.oy) * 0.07;
          const x = s.bx + s.ox, y = s.by + s.oy;

          const near = d < R ? 1 - d / R : 0;
          const twinkle = 0.55 + 0.45 * Math.sin(s.tw);
          const a = Math.min(1, (s.base + 0.3 * twinkle + near * 0.35) * nightness);

          if (s.r > 1.05 * dpr) {
            // Bright star: soft radial bloom instead of a flat dot
            const g = ctx.createRadialGradient(x, y, 0, x, y, s.r * 3.4);
            g.addColorStop(0, `rgba(${s.tint}, ${a.toFixed(3)})`);
            g.addColorStop(0.4, `rgba(${s.tint}, ${(a * 0.32).toFixed(3)})`);
            g.addColorStop(1, `rgba(${s.tint}, 0)`);
            ctx.beginPath();
            ctx.arc(x, y, s.r * 3.4, 0, Math.PI * 2);
            ctx.fillStyle = g;
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(x, y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${s.tint}, ${a.toFixed(3)})`;
            ctx.fill();
          }

          // Subtle lens-flare cross on the bright few, breathing slowly
          if (s.flare) {
            const fa = a * (0.32 + 0.22 * Math.sin(s.tw * 0.6));
            if (fa > 0.02) {
              const L = s.flare * (1 + near * 0.6);
              ctx.save();
              ctx.translate(x, y);
              ctx.rotate(s.rot);
              for (let k = 0; k < 2; k++) {
                const grad = ctx.createLinearGradient(-L, 0, L, 0);
                grad.addColorStop(0, `rgba(${s.tint}, 0)`);
                grad.addColorStop(0.5, `rgba(${s.tint}, ${fa.toFixed(3)})`);
                grad.addColorStop(1, `rgba(${s.tint}, 0)`);
                ctx.strokeStyle = grad;
                ctx.lineWidth = dpr * 0.9;
                ctx.beginPath();
                ctx.moveTo(-L, 0);
                ctx.lineTo(L, 0);
                ctx.stroke();
                ctx.rotate(Math.PI / 2);
              }
              ctx.restore();
            }
          }
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

      // Shooting stars: brief streaks dancing across different parts of
      // the sky: random position, direction, and pace; they retire as
      // morning arrives (nightness gates both spawning and alpha)
      if (nightness > 0.06 && performance.now() >= nextMeteorAt) {
        const goingRight = Math.random() < 0.5;
        const ang = (0.12 + Math.random() * 0.2) * Math.PI;
        const speed = (7 + Math.random() * 6) * dpr;
        meteors.push({
          x: (goingRight ? 0.02 + Math.random() * 0.5 : 0.48 + Math.random() * 0.5) * w,
          y: (0.04 + Math.random() * 0.55) * h,
          vx: Math.cos(ang) * speed * (goingRight ? 1 : -1),
          vy: Math.sin(ang) * speed,
          t: 0,
          life: 55 + Math.random() * 35,
          size: (0.8 + Math.random() * 0.7) * dpr
        });
        nextMeteorAt = performance.now() + 2600 + Math.random() * 5400;
      }
      meteors = meteors.filter((m) => m.t < m.life && m.x > -60 && m.x < w + 60 && m.y < h + 60);
      meteors.forEach((m) => {
        m.t++;
        m.x += m.vx;
        m.y += m.vy;
        const lifeP = m.t / m.life;
        const fade = Math.min(lifeP / 0.12, 1, (1 - lifeP) / 0.35);
        const a = Math.max(0, fade) * nightness * 0.9;
        if (a <= 0.012) return;

        const tailX = m.x - m.vx * 9;
        const tailY = m.y - m.vy * 9;
        const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        grad.addColorStop(0, 'rgba(250, 242, 228, 0)');
        grad.addColorStop(0.7, `rgba(250, 242, 228, ${(a * 0.35).toFixed(3)})`);
        grad.addColorStop(1, `rgba(255, 250, 240, ${a.toFixed(3)})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = m.size;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();

        const hg = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.size * 3.2);
        hg.addColorStop(0, `rgba(255, 250, 240, ${a.toFixed(3)})`);
        hg.addColorStop(1, 'rgba(255, 250, 240, 0)');
        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size * 3.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Birds: the daylight counterpart to the night's shooting stars. The
      // first appears the moment the sky turns to day, its partner follows a
      // few seconds later; at most two share the sky at once.
      const blue = atmo.blue;
      if (blue > 0.4) {
        if (!skyTurned) {
          skyTurned = true;
          spawnBird();
          nextBirdAt = performance.now() + 3200;
        } else if (birds.length < 2 && performance.now() >= nextBirdAt) {
          spawnBird();
          nextBirdAt = performance.now() + 6500 + Math.random() * 9000;
        }
      } else if (blue <= 0.05) {
        skyTurned = false; // re-arm for the next descent into day
      }
      birds = birds.filter((b) => b.x > -90 * dpr && b.x < w + 90 * dpr);
      birds.forEach((b) => {
        b.t++;
        b.x += b.vx;
        b.phase += b.flap;
        const a = Math.min(1, blue) * 0.42;
        if (a <= 0.02) return;
        const s = b.size;
        const y = b.y + Math.sin(b.t * 0.02) * b.bob * s;
        // A gull silhouette: two wings sweeping up from the body, the tips
        // rising and falling as it flaps.
        const lift = s * (0.4 + 0.34 * Math.sin(b.phase));
        ctx.strokeStyle = `rgba(58, 50, 46, ${a.toFixed(3)})`;
        ctx.lineWidth = Math.max(1.4 * dpr, s * 0.12);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(b.x - s, y - lift * 0.2);
        ctx.quadraticCurveTo(b.x - s * 0.44, y - lift, b.x, y);
        ctx.quadraticCurveTo(b.x + s * 0.44, y - lift, b.x + s, y - lift * 0.2);
        ctx.stroke();
      });

      requestAnimationFrame(frame);
    }

    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);
    requestAnimationFrame(frame);
  }

  /* ---------- Photographic clouds (DOM) ----------
     Real Imagen renders with true alpha, drifting on the wind and riding
     the scroll in depth parallax. Hovering a cloud slowly fades it away;
     it breathes back once the pointer moves on. Gated to the blue sky by
     the field's container opacity (set in updateSky). */
  const domClouds = [];
  if (cloudField) {
    const srcs = Array.from({ length: 10 }, (_, k) => `clouds/cloud-${String(k + 1).padStart(2, '0')}.webp`);
    const GOLD = 0.6180339887;
    // Order the renders by a golden-ratio hop so two identical shapes never end
    // up sitting next to each other as the field is laid out.
    const order = srcs
      .map((s, k) => ({ s, r: (k * GOLD) % 1 }))
      .sort((a, b) => a.r - b.r)
      .map((o) => o.s);
    // Touch devices get fewer clouds (each moving layer is fill-rate on a mobile
    // GPU) but sized much larger, so on a narrow screen they read as real clouds
    // rather than wisps.
    const coarse = (window.matchMedia && matchMedia('(pointer: coarse)').matches) || innerWidth < 700;
    // A handful of large clouds with room to breathe.
    const count = coarse
      ? 5
      : Math.max(6, Math.min(9, Math.round(innerWidth / 240)));
    // Spread the (few, large) clouds across the day-zone document height with a
    // gentle parallax and NO wrap: each sits far apart so different shapes don't
    // stack, and there's no modulo sawtooth to jump them around on scroll reversal.
    const docH = document.documentElement.scrollHeight;
    const dayTop = (firstDayZone ? firstDayZone.offsetTop : docH * 0.55) - innerHeight * 1.4;
    const dayBot = docH - innerHeight * 0.5;   // keep clouds above the footer ground
    const dayRange = Math.max(innerHeight * 2, dayBot - dayTop);
    const slotH = dayRange / count;
    for (let i = 0; i < count; i++) {
      const img = document.createElement('img');
      img.src = order[i % order.length];
      img.alt = '';
      img.decoding = 'async';
      img.draggable = false;
      img.className = 'cloud-img';
      // Depth interleaved (golden ratio) so near and far clouds alternate down
      // the page instead of marching big-to-small.
      const depth = 0.32 + 0.68 * ((i * GOLD + 0.13) % 1);
      // Large cumulus scaled to the viewport so each reads as a real cloud, not
      // a wisp; nearer clouds are larger. On a narrow (touch) screen they take a
      // much bigger share of the width. Tall renders are capped by max-height.
      const sizeFrac = coarse ? (0.66 + 0.34 * depth) : (0.4 + 0.34 * depth);
      const wpx = Math.round(innerWidth * sizeFrac * (0.9 + Math.random() * 0.22));
      const baseOp = +(0.5 + 0.4 * depth).toFixed(2);
      // One cloud per even document slot (gentle jitter) so they're spread far
      // apart down the page; a per-cloud parallax rate < 1 so it drifts up a
      // little slower than the content.
      const docY = dayTop + (i + 0.5) * slotH + (Math.random() - 0.5) * slotH * 0.5;
      const rate = 0.72 + 0.16 * depth;
      // Center-based horizontal spread so clouds disperse evenly left↔right. The
      // previous formula pushed cloud centers past the right edge, so their
      // visible mass piled up on the left (worst on narrow screens).
      const x = ((i * GOLD + 0.37) % 1) * innerWidth - wpx * 0.5;
      const c = {
        el: img, depth, w: wpx, h: wpx * 0.5,
        flip: i % 2 === 0 ? 1 : -1,
        x, docY, rate,
        vx: (0.05 + Math.random() * 0.09) * (i % 2 === 0 ? 1 : -1),
        baseOp, faded: false
      };
      img.style.width = wpx + 'px';
      img.style.opacity = String(baseOp);
      img.style.transform = `translate3d(${c.x.toFixed(0)}px, ${(c.docY - window.scrollY * c.rate).toFixed(0)}px, 0) scaleX(${c.flip})`;
      img.onload = () => {
        // Read the displayed size (respects the CSS max-height cap) so hover
        // hit-testing stays accurate for capped clouds.
        c.w = img.offsetWidth || wpx;
        c.h = img.offsetHeight || wpx * (img.naturalHeight / img.naturalWidth);
      };
      cloudField.appendChild(img);
      domClouds.push(c);
    }
  }

  function updateClouds() {
    if (!domClouds.length) return;
    const sy = window.scrollY;
    domClouds.forEach((c) => {
      c.x += c.vx;
      if (c.x < -c.w - 80) c.x = innerWidth + 60;
      if (c.x > innerWidth + 80) c.x = -c.w - 60;
      // Document-anchored parallax, no modulo wrap: the cloud stays put in the
      // page and drifts up a little slower than the content. (The old wrap made
      // clouds jump to new positions when you reversed scroll direction.)
      const y = c.docY - sy * c.rate;
      c.el.style.transform = `translate3d(${c.x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scaleX(${c.flip})`;

      // Hover: rest the pointer on a cloud and it slowly dissolves
      const over =
        mouse.x > c.x + c.w * 0.08 && mouse.x < c.x + c.w * 0.92 &&
        mouse.y > y + c.h * 0.1 && mouse.y < y + c.h * 0.9;
      if (over !== c.faded) {
        c.faded = over;
        c.el.style.opacity = over ? '0' : String(c.baseOp);
      }
    });
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
      // Reveal each bubble in turn, so the exchange plays regardless of how
      // many turns are in the markup (user fragment, Nora's reply, typing…).
      bubbles.forEach((b, i) => {
        setTimeout(() => b.classList.add('shown'), 700 + i * 1400);
      });
    }
  }
})();
