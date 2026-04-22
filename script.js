const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
