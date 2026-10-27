#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDirectory, "..");
const portfolioRoot = path.join(siteRoot, "portfolio");
const registryPath = path.join(portfolioRoot, "projects.js");
const outputRoot = path.join(portfolioRoot, "projects");

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(registryPath, "utf8"), sandbox, {
  filename: registryPath
});

const projects = sandbox.window.PORTFOLIO_PROJECTS || {};
const order = sandbox.window.PORTFOLIO_PROJECT_ORDER || [];

const seo = {
  somnora: {
    title: "Somnora Architecture | AI Sleep and Dream Companion",
    description: "Explore the product and system architecture behind Somnora, a private iOS companion for sleep, dreams, mood, reflection, memory, and daily check-ins.",
    operatingSystem: "iOS, watchOS"
  },
  manifold: {
    title: "Manifold Architecture | Guarded Cloud GPU Platform",
    description: "Explore Manifold's architecture for launching cloud GPUs, running durable jobs, serving open models, enforcing budgets, and rescuing files before teardown.",
    operatingSystem: "macOS, Web"
  },
  agentic: {
    title: "Agentic Architecture | Agent-Native Commerce",
    description: "Explore an agent-native commerce architecture with merchant-authorized product data, field-level provenance, deterministic ranking, and human checkout handoff.",
    operatingSystem: "Web"
  },
  warden: {
    title: "Warden Architecture | AI Agent Governance",
    description: "Explore Warden's zero-trust architecture for governing AI agent fleets with policy, spend limits, approvals, DLP, durable workflows, and verifiable audit evidence.",
    operatingSystem: "Web, macOS"
  },
  "today-in-time": {
    title: "Today In Time Architecture | Editorial History App",
    description: "Explore the architecture behind Today In Time, an offline-friendly iOS history app built from sourced editorial records, local state, quizzes, and a daily widget.",
    operatingSystem: "iOS"
  },
  "callsheet-companion": {
    title: "Callsheet Companion Architecture | Film Crew App",
    description: "Explore the local-first architecture behind Callsheet Companion for tracking production days, overtime, invoices, gear, contacts, and sensitive crew documents.",
    operatingSystem: "iOS"
  },
  squadsync: {
    title: "SquadSync Architecture | Gaming Group Coordination",
    description: "Explore SquadSync's architecture for private gaming groups, expiring invite codes, session planning, chat, reminders, reporting, blocking, and account deletion.",
    operatingSystem: "iOS"
  },
  setview: {
    title: "SetView Architecture | Mixed Reality Filmmaking",
    description: "Explore SetView's mixed reality architecture for scouting real locations, blocking virtual actors, simulating cinema lenses, and saving repeatable camera plans.",
    operatingSystem: "visionOS"
  },
  homeplate: {
    title: "HomePlate Architecture | Private Availability App",
    description: "Explore HomePlate's privacy-first architecture for sharing temporary availability with trusted friends through expiring statuses and invite-code connections.",
    operatingSystem: "iOS"
  },
  "cosmo-trader": {
    title: "Cosmo Trader Architecture | Astrology Market App",
    description: "Explore Cosmo Trader's architecture for market data, zodiac profiles, moon phases, retrograde windows, local holdings, and explainable entertainment signals.",
    operatingSystem: "iOS"
  },
  locked: {
    title: "Locked Architecture | Virtual Camera Automation",
    description: "Explore Locked's virtual camera architecture for subject tracking, scene understanding, cinematic reframing, punch-ins, and OBS control from a fixed webcam.",
    operatingSystem: "macOS"
  }
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function absoluteAsset(icon) {
  return `https://somnora.app/portfolio/${icon}`;
}

function externalLinkProperties(project) {
  const properties = {};
  for (const [, url] of project.links) {
    if (url.includes("apps.apple.com")) properties.installUrl = url;
    if (url.includes("github.com")) properties.codeRepository = url;
  }
  return properties;
}

function jsonLd(slug, project, metadata) {
  const canonical = `https://somnora.app/portfolio/projects/${slug}/`;
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Portfolio",
            item: "https://somnora.app/portfolio/"
          },
          {
            "@type": "ListItem",
            position: 2,
            name: project.name,
            item: canonical
          }
        ]
      },
      {
        "@type": "SoftwareApplication",
        name: project.name,
        description: metadata.description,
        applicationCategory: project.category,
        operatingSystem: metadata.operatingSystem,
        url: canonical,
        image: absoluteAsset(project.icon),
        author: {
          "@type": "Person",
          name: "James McShane",
          url: "https://somnora.app/portfolio/"
        },
        ...externalLinkProperties(project)
      }
    ]
  };

  return JSON.stringify(graph, null, 2).replaceAll("<", "\\u003c");
}

function renderLinks(project) {
  return project.links
    .map(([label, href, primary]) => {
      const className = primary
        ? "project-action project-action-primary"
        : "project-action";
      return `<a class="${className}" href="${escapeHtml(href)}" target="_blank" rel="noopener">${escapeHtml(label)}</a>`;
    })
    .join("\n            ");
}

function renderFacts(project) {
  return project.facts
    .map(([term, description]) => `
          <div class="project-fact">
            <dt>${escapeHtml(term)}</dt>
            <dd>${escapeHtml(description)}</dd>
          </div>`)
    .join("");
}

function renderFeatures(project) {
  return project.features
    .map(([title, description], index) => `
          <article class="project-feature">
            <span class="project-feature-number">${String(index + 1).padStart(2, "0")}</span>
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(description)}</p>
          </article>`)
    .join("");
}

function renderFlows(project) {
  return project.architectureFlows
    .map((flow) => `
          <article class="architecture-flow">
            <h3>${escapeHtml(flow.title)}</h3>
            <ol class="architecture-track">
              ${flow.nodes.map(([step, title, description]) => `
              <li class="architecture-node">
                <span class="architecture-step">${escapeHtml(step)}</span>
                <h4>${escapeHtml(title)}</h4>
                <p>${escapeHtml(description)}</p>
              </li>`).join("")}
            </ol>
          </article>`)
    .join("");
}

function renderSwitcher(currentSlug) {
  return order
    .filter((slug) => slug !== currentSlug && projects[slug])
    .map((slug) => {
      const project = projects[slug];
      return `
          <a class="project-switch" href="../${slug}/">
            <img src="../../${escapeHtml(project.icon)}" alt="" width="42" height="42" loading="lazy" decoding="async" />
            <span>
              <strong>${escapeHtml(project.name)}</strong>
              <small>${escapeHtml(project.category)}</small>
            </span>
          </a>`;
    })
    .join("");
}

function renderPage(slug, project) {
  const metadata = seo[slug];
  if (!metadata) throw new Error(`Missing SEO metadata for ${slug}`);

  const canonical = `https://somnora.app/portfolio/projects/${slug}/`;
  const iconUrl = absoluteAsset(project.icon);
  const overview = project.overview.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n          ");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <meta name="theme-color" content="#181310" />
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
  <title>${escapeHtml(metadata.title)}</title>
  <meta name="description" content="${escapeHtml(metadata.description)}" />
  <meta name="author" content="James McShane" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Somnora" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:title" content="${escapeHtml(metadata.title)}" />
  <meta property="og:description" content="${escapeHtml(metadata.description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${iconUrl}" />
  <meta property="og:image:alt" content="${escapeHtml(project.name)} project icon" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${escapeHtml(metadata.title)}" />
  <meta name="twitter:description" content="${escapeHtml(metadata.description)}" />
  <meta name="twitter:image" content="${iconUrl}" />
  <meta name="twitter:image:alt" content="${escapeHtml(project.name)} project icon" />
  <script type="application/ld+json">
${jsonLd(slug, project, metadata)}
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600&amp;family=Inter:wght@400;500;600&amp;display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../../../style.css?v=20260904a" />
  <link rel="stylesheet" href="../../project.css?v=20260904a" />
  <link rel="icon" href="../../../somnora-favicons/favicon.ico" sizes="any" />
  <link rel="icon" type="image/png" sizes="32x32" href="../../../somnora-favicons/favicon-32x32.png" />
  <link rel="apple-touch-icon" href="../../../somnora-favicons/apple-touch-icon.png" />
</head>
<body class="project-body">
  <!-- Generated by scripts/generate_portfolio_pages.mjs. Edit portfolio/projects.js instead. -->
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="project-sky" aria-hidden="true"></div>

  <nav class="nav project-nav" aria-label="Primary navigation">
    <a href="../../../index.html#top" class="logo">Somnora</a>
    <div class="nav-links">
      <a href="../../index.html#dev">All projects</a>
      <a href="mailto:jmcshanedp@gmail.com" class="nav-cta">Get in touch</a>
    </div>
  </nav>

  <main id="main" class="project-main">
    <a class="project-back" href="../../index.html#dev"><span aria-hidden="true">&#8592;</span> Developer portfolio</a>

    <article>
      <header class="project-hero">
        <div class="project-hero-copy">
          <div class="project-identity">
            <img class="project-icon" src="../../${escapeHtml(project.icon)}" alt="${escapeHtml(project.name)} project icon" width="112" height="112" decoding="async" fetchpriority="high" />
            <div>
              <p class="project-kicker">${escapeHtml(project.eyebrow)}</p>
              <h1>${escapeHtml(project.name)}</h1>
              <div class="project-badges">
                <span class="project-badge">${escapeHtml(project.category)}</span>
                <span class="project-badge project-status" data-kind="${escapeHtml(project.statusKind || "")}">${escapeHtml(project.status)}</span>
              </div>
            </div>
          </div>
          <p class="project-summary">${escapeHtml(project.summary)}</p>
          <div class="project-links" aria-label="Project links">
            ${renderLinks(project)}
          </div>
        </div>
        <dl class="project-facts">${renderFacts(project)}
        </dl>
      </header>

      <section class="project-section project-overview" aria-labelledby="overview-title">
        <p class="project-section-label">The project</p>
        <h2 id="overview-title">What it does</h2>
        <div class="project-prose">
          ${overview}
        </div>
      </section>

      <section class="project-section" aria-labelledby="features-title">
        <p class="project-section-label">Built around</p>
        <h2 id="features-title">Product principles</h2>
        <div class="project-feature-grid">${renderFeatures(project)}
        </div>
      </section>

      <section class="project-section project-architecture" aria-labelledby="architecture-title">
        <p class="project-section-label">System architecture</p>
        <h2 id="architecture-title">How the system moves</h2>
        <p class="architecture-intro">${escapeHtml(project.architectureIntro)}</p>
        <div class="architecture-flows">${renderFlows(project)}
        </div>
        <p class="architecture-note">${escapeHtml(project.architectureNote)}</p>
      </section>

      <section class="project-section project-more" aria-labelledby="more-title">
        <p class="project-section-label">Keep exploring</p>
        <h2 id="more-title">More systems</h2>
        <nav class="project-switcher" aria-label="Other software projects">${renderSwitcher(slug)}
        </nav>
      </section>
    </article>
  </main>

  <footer class="project-footer">
    <p>Designed and built by James McShane under Somnora.</p>
    <a href="mailto:jmcshanedp@gmail.com">Get in touch</a>
  </footer>
  <script data-goatcounter="https://somnora.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>
</body>
</html>
`;
}

fs.mkdirSync(outputRoot, { recursive: true });

for (const slug of order) {
  const project = projects[slug];
  if (!project) throw new Error(`Missing project data for ${slug}`);
  const destination = path.join(outputRoot, slug);
  fs.mkdirSync(destination, { recursive: true });
  fs.writeFileSync(path.join(destination, "index.html"), renderPage(slug, project));
}

console.log(`Generated ${order.length} portfolio project pages.`);
