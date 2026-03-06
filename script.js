const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const PRICING = {
  founders: { monthly: "9.99", quarterly: "20.99", yearly: "44.99" },
  standard: { monthly: "9.99", quarterly: "26.99", yearly: "59.99" }
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
    purpose: "Purpose: optional reflection when a night leaves emotional residue.",
    points: [
      "Log the night in one short reflection, no pressure for perfect wording.",
      "Receive a concise summary that helps separate emotion from noise.",
      "Carry one actionable note into the next day with less mental clutter."
    ]
  },
  eureka: {
    label: "Mode 02 · Eureka",
    title: "Eureka",
    purpose: "Purpose: capture half-formed ideas and turn them into a realistic next step.",
    points: [
      "Core Loop: capture idea, pressure-test assumptions, choose one concrete move.",
      "Unique Hook: short-first prompts keep momentum without forcing hype.",
      "Risks: surface weak points early before they become expensive distractions.",
      "Next Step: finish with one realistic action for tomorrow."
    ]
  },
  analytics: {
    label: "Mode 03 · Analytics",
    title: "Analytics",
    purpose: "Purpose: trends over time, framed as signals, not conclusions.",
    points: [
      "Track sleep and reflection patterns across nights with clear visual summaries.",
      "Highlight gentle correlations to explore, no overreach and no hard claims.",
      "Use signals to adjust evening routines with calmer expectations."
    ]
  },
  mindful: {
    label: "Mode 04 · Mindful",
    title: "Mindful",
    purpose: "Purpose: short breathing loop plus grounding prompt.",
    points: [
      "Start a brief breath cycle with a simple rhythm, inhale 4, hold 4, exhale 6.",
      "Follow one grounding prompt to settle thought loops before rest.",
      "Exit with a calmer state and one clear intention for sleep."
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
