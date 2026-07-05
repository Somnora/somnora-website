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
    purpose: "Purpose: catch the night before it fades — even half-awake.",
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
      "Dreams with creative charge can spark concept notes on their own — waiting in your Eureka inbox by morning."
    ]
  },
  analytics: {
    label: "Mode 03 · Insights",
    title: "Insights",
    purpose: "Purpose: context for how you're really doing — never a diagnosis.",
    points: [
      "Sleep balance from your real nights — durations and trends, not a judgment score.",
      "A dream climate that maps what your nights keep returning to.",
      "Resilience: how your body actually settles during breathing sessions."
    ]
  },
  mindful: {
    label: "Mode 04 · Mindful",
    title: "Mindful",
    purpose: "Purpose: close the day with a steadier body and a quieter mind.",
    points: [
      "A 90-second guided wind-down — breathing that asks very little of you.",
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
    // The lightening starts soon after the stars and stretches across the
    // middle of the page; ink text (pricing on) always lands on light sky.
    const vh = window.innerHeight;
    const dayAt = firstDayZone
      ? firstDayZone.offsetTop - vh * 0.9
      : (document.documentElement.scrollHeight - vh) * 0.6;
    const band = vh * 3.6;
    const t = clamp01((window.scrollY - (dayAt - band)) / band);

    const night = Math.max(0, 1 - t * 1.6);                   // stars ride this down
    const upper = Math.max(0, 1 - Math.abs(t - 0.45) / 0.38); // the deep-blue passage
    const day = clamp01((t - 0.5) / 0.42);                    // soft blue settles in

    // The ground rises to meet the footer.
    const maxScroll = document.documentElement.scrollHeight - vh;
    const g = clamp01((window.scrollY - (maxScroll - vh * 1.7)) / (vh * 1.35));

    skyNight.style.opacity = night.toFixed(3);
    skyUpper.style.opacity = Math.min(1, upper).toFixed(3);
    skyDay.style.opacity = day.toFixed(3);

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

    document.body.classList.toggle('zone-day', t > 0.74);
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
    let clouds = [];
    let holeX = -9999, holeY = -9999, holeS = 0;

    // A believable cloud can't be a pile of soft gradients — it needs a
    // dense body, a bright top, a shaded flat base. Each cloud is painted
    // ONCE onto an offscreen sprite with three passes, then drawn whole
    // (never sliced — slice seams read as stripes).

    function paintCloudSprite(scale) {
      const sw = Math.round(560 * scale * dpr);
      const sh = Math.round(280 * scale * dpr);
      const off = document.createElement('canvas');
      off.width = sw; off.height = sh;
      const o = off.getContext('2d');
      const baseline = sh * 0.68;
      const cx = sw / 2;

      // Puff cluster: many small ellipses along a lens profile
      const puffs = [];
      const n = 16 + Math.floor(Math.random() * 6);
      for (let k = 0; k < n; k++) {
        const t = (k / (n - 1)) * 2 - 1;                  // -1..1 across
        const lens = Math.sqrt(Math.max(0, 1 - t * t));   // tall middle
        puffs.push({
          x: cx + t * sw * 0.36 + (Math.random() - 0.5) * sw * 0.06,
          y: baseline - lens * sh * (0.2 + Math.random() * 0.16) - Math.random() * sh * 0.05,
          r: (0.09 + 0.1 * lens + Math.random() * 0.05) * sw * 0.5,
          sx: 1.25 + Math.random() * 0.45,
          sy: 0.8 + Math.random() * 0.2
        });
      }

      function pass(tint, alpha, dy2, shrink) {
        puffs.forEach((p2) => {
          o.save();
          o.translate(p2.x, p2.y + dy2);
          o.scale(p2.sx, p2.sy);
          const r2 = p2.r * shrink;
          const g2 = o.createRadialGradient(0, 0, r2 * 0.15, 0, 0, r2);
          g2.addColorStop(0, `rgba(${tint}, ${alpha})`);
          g2.addColorStop(0.72, `rgba(${tint}, ${alpha * 0.78})`);
          g2.addColorStop(1, `rgba(${tint}, 0)`);
          o.beginPath();
          o.arc(0, 0, r2, 0, Math.PI * 2);
          o.fillStyle = g2;
          o.fill();
          o.restore();
        });
      }

      // 1) shadowed underbelly, 2) dense body, 3) sunlit crown
      pass('172, 158, 150', 0.5, sh * 0.045, 1.06);
      pass('247, 244, 238', 0.88, 0, 1.0);
      pass('255, 253, 249', 0.5, -sh * 0.07, 0.62);

      // Flatten the base: erase softly below the baseline
      o.globalCompositeOperation = 'destination-out';
      const wipe = o.createLinearGradient(0, baseline, 0, baseline + sh * 0.24);
      wipe.addColorStop(0, 'rgba(0,0,0,0)');
      wipe.addColorStop(0.55, 'rgba(0,0,0,0.75)');
      wipe.addColorStop(1, 'rgba(0,0,0,1)');
      o.fillStyle = wipe;
      o.fillRect(0, baseline, sw, sh - baseline);
      o.globalCompositeOperation = 'source-over';

      return off;
    }

    function makeCloud(i, count) {
      const depth = Math.min(1, 0.35 + (i / Math.max(1, count - 1)) * 0.6 + Math.random() * 0.08);
      const scale = (0.75 + Math.random() * 0.6) * (0.5 + depth * 0.6);
      return {
        x: Math.random() * w,
        baseY: Math.random() * h * 1.7,
        vx: (0.04 + Math.random() * 0.08) * dpr * (Math.random() < 0.5 ? -1 : 1),
        depth,
        sprite: paintCloudSprite(scale),
        ox: 0, oy: 0
      };
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
          base: big ? 0.38 : 0.2,
          tw: Math.random() * Math.PI * 2,
          ts: 0.006 + Math.random() * 0.016,
          tint: Math.random() < 0.7 ? '250, 242, 228' : '242, 210, 156',
          flare: big && Math.random() < 0.55 ? (8 + Math.random() * 12) * dpr : 0,
          rot: Math.random() * Math.PI
        };
      });

      const flyCount = Math.min(16, Math.floor(innerWidth / 95));
      flies = Array.from({ length: flyCount }, () => spawnFly());

      const cloudCount = Math.max(4, Math.min(7, Math.floor(innerWidth / 300)));
      clouds = Array.from({ length: cloudCount }, (_, i) => makeCloud(i, cloudCount));
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

      // Clouds: whole shaded sprites, only in the blue sky. Nearby clouds
      // ease away from the cursor, and a soft hollow is carved through the
      // cloud layer where it glides (destination-out, before the stars
      // draw) — vapor parting with no seams anywhere.
      const blue = atmo.blue;
      if (blue > 0.04) {
        const mxc = mouse.x * dpr, myc = mouse.y * dpr;
        const band = h * 1.7;
        const scrollDev = window.scrollY * dpr;
        const PR = 320 * dpr;

        clouds.forEach((c) => {
          c.x += c.vx;
          const sw = c.sprite.width, sh2 = c.sprite.height;
          if (c.x < -sw) c.x = w + sw * 0.9;
          if (c.x > w + sw) c.x = -sw * 0.9;

          const rate = 0.16 + 0.5 * c.depth;
          const yScreen = (((c.baseY - scrollDev * rate) % band) + band) % band - h * 0.3;

          const cdx = c.x - mxc, cdy = yScreen - myc;
          const cd = Math.hypot(cdx, cdy);
          let tox = 0, toy = 0;
          if (cd < PR && cd > 0.001) {
            const f = 1 - cd / PR;
            const push = f * f * 34 * dpr * (0.4 + 0.6 * c.depth);
            tox = (cdx / cd) * push * 1.3;
            toy = (cdy / cd) * push * 0.5;
          }
          c.ox += (tox - c.ox) * 0.05;
          c.oy += (toy - c.oy) * 0.05;

          const a = blue * (0.42 + 0.5 * c.depth);
          if (a <= 0.02) return;
          ctx.globalAlpha = a;
          ctx.drawImage(c.sprite, c.x - sw / 2 + c.ox, yScreen - sh2 / 2 + c.oy);
        });
        ctx.globalAlpha = 1;

        // The carve: a soft ellipse of clearing that trails the pointer
        holeS += (((finePointer && mouse.x > -9000) ? 1 : 0) - holeS) * 0.06;
        if (holeS > 0.02) {
          holeX += (mxc - holeX) * 0.14;
          holeY += (myc - holeY) * 0.14;
          const hr = 200 * dpr;
          ctx.save();
          ctx.globalCompositeOperation = 'destination-out';
          ctx.translate(holeX, holeY);
          ctx.scale(1.4, 0.85);
          const hg = ctx.createRadialGradient(0, 0, 0, 0, 0, hr);
          hg.addColorStop(0, `rgba(0,0,0,${(0.92 * holeS).toFixed(3)})`);
          hg.addColorStop(0.55, `rgba(0,0,0,${(0.45 * holeS).toFixed(3)})`);
          hg.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.beginPath();
          ctx.arc(0, 0, hr, 0, Math.PI * 2);
          ctx.fillStyle = hg;
          ctx.fill();
          ctx.restore();
          ctx.globalCompositeOperation = 'source-over';
        }
      }

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
      // the sky — random position, direction, and pace; they retire as
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
