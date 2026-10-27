(function () {
  "use strict";

  window.PORTFOLIO_PROJECT_ORDER = [
    "somnora",
    "manifold",
    "agentic",
    "warden",
    "today-in-time",
    "callsheet-companion",
    "squadsync",
    "setview",
    "homeplate",
    "cosmo-trader",
    "locked"
  ];

  window.PORTFOLIO_PROJECTS = {
    "somnora": {
      name: "Somnora",
      category: "Agentic Wellness Companion",
      status: "App Store",
      statusKind: "live",
      icon: "logos/somnora.png",
      eyebrow: "iPhone, Apple Watch, and private cloud",
      summary: "A companion for nights and the days they shape. Nora brings dreams, mood, sleep, and reflection into one private conversation, then chooses restraint when there is not enough evidence to be useful.",
      facts: [
        ["Client", "Native SwiftUI for iPhone and Apple Watch"],
        ["Context", "Dreams, mood, journals, and read-only HealthKit signals"],
        ["Cloud", "Private Cloud Run gateway with provider failover"],
        ["Memory", "Salience, synthesis, retrieval, and duplicate control"]
      ],
      overview: [
        "Somnora is built around Nora, a conversational companion that can reflect on a dream, help unpack a mood, notice longer-term patterns, or give a half-formed idea somewhere to go. Health signals are supporting context rather than a diagnosis, and the product is designed to stay quiet when the evidence does not justify an interruption.",
        "The app spans an iPhone client, an Apple Watch capture path, local context and permission services, and a private gateway for model calls. Creative flows keep the conversation primary. Any reminder or follow-on action is offered only after Nora responds, through a separate consent step."
      ],
      features: [
        ["A companion, not a dashboard", "Dreams, mood, and sleep are interpreted in a human conversation instead of reduced to scores and streaks."],
        ["Permissioned context", "HealthKit access is read-only, and each source has an explicit reason to exist in the response."],
        ["Memory with editorial judgment", "Formation, synthesis, decay, reinforcement, and retrieval decide what deserves to persist."],
        ["Consent before action", "Nora answers first. Reminders and other actions arrive afterward as optional, inspectable invitations."]
      ],
      architectureIntro: "Signals stay separated from decisions until the context layer can establish provenance, relevance, and permission. The private gateway isolates model providers from the app, while Nora's response and any optional action remain two distinct product moments.",
      architectureFlows: [
        {
          title: "Context to response",
          nodes: [
            ["01 · Signals", "Dreams, mood, sleep, voice", "User entries, read-only HealthKit data, and Watch recordings begin as separate sources."],
            ["02 · Permissions", "Source and consent boundary", "Managers expose only authorized context and preserve where each observation came from."],
            ["03 · Context", "Timeline and retrieval", "Relevant observations and high-value memories are selected under a bounded context budget."],
            ["04 · Gateway", "Private Cloud Run proxy", "The client reaches hosted inference through a controlled gateway with caching and failover."],
            ["05 · Nora", "Conversation and creative flows", "Nora responds in context, including Dream, Eureka, Insights, and Mindful experiences."],
            ["06 · Outcome", "Response, then invitation", "The answer lands first. Any reminder or action is offered separately and requires consent."]
          ]
        }
      ],
      architectureNote: "Boundary to keep: Health signals inform reflection but do not become diagnoses, and an inferred need never becomes an automatic action.",
      links: [
        ["App Store", "https://apps.apple.com/il/app/somnora/id6755064744", true]
      ]
    },

    "manifold": {
      name: "Manifold",
      category: "GPU Platform",
      status: "Open Source",
      statusKind: "",
      icon: "logos/manifold.svg",
      eyebrow: "One guarded door to rented compute",
      summary: "A local cockpit for launching cloud GPUs, running durable jobs, serving open-weight models, and shutting everything down without losing work or leaking budget.",
      facts: [
        ["Clients", "Next.js dashboard, Tauri desktop app, MCP, and local API"],
        ["Control plane", "Python, FastAPI, SQLite, and audited policy guards"],
        ["Providers", "Lambda Cloud first, with bounded Google Cloud support"],
        ["Runtime", "Supervised containers, SSH tunnels, jobs, and persistent filesystems"]
      ],
      overview: [
        "Manifold makes rented GPU infrastructure feel like a local workstation while keeping every expensive or destructive action behind one backend. The UI, desktop shell, MCP tools, and OpenAI-compatible proxy are intentionally thin clients. Budget, ownership, concurrency, data safety, and teardown rules live in the control plane where no client can bypass them.",
        "Work runs as durable job templates rather than fragile shell sessions. A job can rent its own instance, stream logs, synchronize outputs, and terminate the machine when complete. Before any teardown, Manifold attempts to rescue ephemeral files and refuses to proceed when its data-safety policy cannot be satisfied."
      ],
      features: [
        ["Spend that stops itself", "Budget, concurrency, idle, active-time, and absolute-lifetime ceilings are enforced by the backend."],
        ["Jobs over terminals", "Versioned YAML templates supervise serving, fine-tuning, synthesis, media, and custom work."],
        ["Agents share the same walls", "MCP tools route through the exact policy and audit path used by the human dashboard."],
        ["Save before destroy", "Termination rescues files first, records the result, and requires an explicit override to burn unsaved work."]
      ],
      architectureIntro: "Every interface converges on the same FastAPI gateway. That gateway owns policy, provider credentials, audit history, job state, and teardown, so adding a new client does not create a new route around the guardrails.",
      architectureFlows: [
        {
          title: "Request to safe compute",
          nodes: [
            ["01 · Interfaces", "Dashboard, desktop, MCP", "People and agents submit the same typed launch, job, storage, and model requests."],
            ["02 · Gateway", "FastAPI control plane", "Authentication, ownership, request validation, and all mutations meet at one door."],
            ["03 · Guards", "Budget, policy, audit", "Spend ceilings, concurrency, purpose, attribution, and data safety are evaluated centrally."],
            ["04 · Providers", "Lambda and Google Cloud", "Provider adapters launch bounded infrastructure and expose only managed connection paths."],
            ["05 · Work", "Jobs, models, and files", "Supervised containers stream logs, survive restarts, and synchronize durable outputs."],
            ["06 · Teardown", "Rescue, verify, stop", "Files are saved, resources are terminated, and the final state is written to the audit log."]
          ]
        }
      ],
      architectureNote: "The invariant is architectural, not conversational: clients request work, but only the guarded backend can spend money or destroy a resource.",
      links: [
        ["GitHub", "https://github.com/Somnora/Manifold", true]
      ]
    },

    "agentic": {
      name: "Agentic",
      category: "Agent-Native Commerce",
      status: "Working Title",
      statusKind: "dev",
      icon: "logos/agentic.webp",
      eyebrow: "Merchant data that people and agents can inspect",
      summary: "A commerce platform in two deliberately separate tracks: a merchant-authorized Shopify publishing product, and a public WebMCP research surface for evidence-rich product discovery with a human-controlled handoff.",
      facts: [
        ["Merchant product", "Shopify embedded app and signed App Proxy routes"],
        ["Research track", "Browser WebMCP tools and a normalized Offer protocol"],
        ["Runtime", "Cloudflare Workers, KV, TypeScript, and JavaScript"],
        ["Boundary", "Read-only discovery and proposal, never autonomous checkout"]
      ],
      overview: [
        "The merchant product lets a store publish current, active product and variant data as compact Markdown on its own shop domain. Shopify App Bridge identifies the merchant session, signed App Proxy requests protect the public catalog routes, and the app requests only read_products. Tokens and configuration remain server-side in Cloudflare KV.",
        "The WebMCP project is a separate public research build. It converts allowlisted product origins into normalized Offers with field-level provenance, visible freshness, delivered-price context, and deterministic ranking. It can stage a purchase review, but only a visible human action creates a handoff to the merchant. It does not share the commercial app's secrets or mutate a cart."
      ],
      features: [
        ["Merchant-authorized publishing", "Only active Shopify catalog data crosses the signed App Proxy, with narrow read-only access."],
        ["Evidence before recommendation", "Price, condition, shipping, returns, seller context, freshness, and provenance remain inspectable."],
        ["Allowlisted origins", "Exact hosts, paths, adapters, response sizes, and redirects are governed by an origin manifest."],
        ["A hard human seam", "Agents can research, compare, and propose. Checkout and payment remain on the source merchant under human control."]
      ],
      architectureIntro: "The two flows share product values but not runtime authority. The merchant platform publishes authenticated catalog data. The WebMCP build studies how agents can reason over allowlisted public offers without importing commercial credentials or gaining purchase authority.",
      architectureFlows: [
        {
          title: "Merchant publishing product",
          nodes: [
            ["01 · Merchant", "Shopify Admin and App Bridge", "The installed merchant opens an embedded dashboard and grants read_products only."],
            ["02 · Identity", "Session token and HMAC", "Worker routes validate Shopify identity, destination shop, timestamps, and signatures."],
            ["03 · Catalog", "Admin GraphQL", "The Worker reads current active products and variants from the authorized shop."],
            ["04 · Transform", "Compact Markdown", "Catalog and product records are normalized into agent-readable, human-readable pages."],
            ["05 · Publish", "Signed App Proxy", "The output appears on the merchant's own shop domain with server-side credentials hidden."]
          ]
        },
        {
          title: "WebMCP research and human handoff",
          nodes: [
            ["01 · Browser", "Manual UI and WebMCP tools", "The same visible page actions are available to a person or a compatible agent client."],
            ["02 · Origin gate", "Exact allowlist manifest", "HTTPS host, path, adapter, byte, redirect, and freshness rules constrain every request."],
            ["03 · Adapters", "JSON, GraphQL, JSON-LD, HTML", "Public sources are read through explicit adapters with labeled fallback behavior."],
            ["04 · Offer graph", "Provenance and ranking", "Fields retain their source while deterministic scoring exposes why options rank."],
            ["05 · Decision", "Visible purchase review", "A proposal becomes a handoff only when the person approves it in the page."],
            ["06 · Merchant", "Human-controlled checkout", "The source merchant owns cart, account, payment, and the final transaction."]
          ]
        }
      ],
      architectureNote: "The commercial Shopify app and the WebMCP challenge project are separate systems. The research build imports no commercial secret, token, storage, Admin API access, or checkout capability.",
      links: [
        ["Live WebMCP Demo", "https://agentic-webmcp.somnora.workers.dev/", true],
        ["GitHub", "https://github.com/Somnora/agentic-webmcp", false]
      ]
    },

    "warden": {
      name: "Warden",
      category: "Agent Fleet Governance",
      status: "Open Source",
      statusKind: "",
      icon: "logos/warden.webp",
      eyebrow: "Zero-trust control for autonomous infrastructure work",
      summary: "A governed control plane that puts policy, spend ceilings, teardown deadlines, identity, human approvals, DLP, and tamper-evident evidence between an AI agent and cloud infrastructure.",
      facts: [
        ["Agent runtime", "Google ADK fleet with Gemini model selection"],
        ["Control plane", "FastAPI dashboard, CLI, and desktop launcher"],
        ["Durability", "Firestore workflows and OIDC-authenticated Cloud Tasks"],
        ["Evidence", "SHA-256 audit chain, traces, and cloud posture snapshots"]
      ],
      overview: [
        "Warden is designed for the uncomfortable gap between an agent proposing infrastructure work and a provider actually doing it. Every tool call passes through a runner-level policy plugin before execution. Budget, placement, TTL, identity, approval quorum, DLP, and global capacity are enforcement inputs, not suggestions in a prompt.",
        "High-risk work can park as a durable workflow, wait for a verified human decision, and resume asynchronously. Approved authority is bound to a specific envelope and consumed transactionally. Each decision and outcome is sealed into an audit chain so an operator can verify not only what ran, but also what was denied, approved, cleaned up, or left uncertain."
      ],
      features: [
        ["Policy before provider", "The ADK interception layer can deny or park a tool call before the underlying cloud adapter runs."],
        ["Durable human approval", "Workflows survive the wait for an OIDC-identified, single-use, role-appropriate human grant."],
        ["Bounded missions", "Cost, TTL, placement, action count, instance count, and cleanup live inside an immutable execution envelope."],
        ["Evidence that can be checked", "Hash chaining, durable checkpoints, traces, and cleanup receipts expose tampering and missing outcomes."]
      ],
      architectureIntro: "Warden separates intent, governance, execution, and evidence. Gemini and the ADK fleet may plan and select tools, but the policy plugin, workflow store, and provider adapters hold the authority to proceed.",
      architectureFlows: [
        {
          title: "Governed fleet execution",
          nodes: [
            ["01 · Operator", "Dashboard, CLI, or desktop", "A verified person defines an objective, policy profile, and bounded mission envelope."],
            ["02 · Fleet", "Gemini and Google ADK", "A lead agent delegates work to registered specialists and proposes typed tool calls."],
            ["03 · Gate", "Warden policy plugin", "Identity, cost, TTL, placement, capacity, DLP, and approval rules are evaluated before execution."],
            ["04 · Workflow", "Firestore and Cloud Tasks", "Calls that need sign-off park durably, gather quorum, and resume with authenticated tasks."],
            ["05 · Provider", "Cloud tools and Manifold bridge", "Only approved, in-envelope actions reach Google Cloud or another controlled compute backend."],
            ["06 · Evidence", "Ledger, traces, and receipts", "Results, denials, spend, cleanup, and uncertainty are sealed into verifiable operator evidence."]
          ]
        }
      ],
      architectureNote: "Approval does not override a hard policy denial. It grants one bounded action or mission envelope, and the execution path still enforces spend, TTL, placement, DLP, and cleanup rules.",
      links: [
        ["GitHub", "https://github.com/Somnora/Warden", true]
      ]
    },

    "today-in-time": {
      name: "Today In Time",
      category: "Daily Almanac",
      status: "App Store",
      statusKind: "live",
      icon: "logos/today.png",
      eyebrow: "A sourced, editorial history app",
      summary: "A small daily collection of real stories from this date in history, with source provenance, adjustable tone, saved reading, quizzes, and a companion widget.",
      facts: [
        ["Client", "Dependency-free SwiftUI iPhone app"],
        ["Corpus", "Bundled, validated editorial JSON records"],
        ["State", "Local preferences, saved stories, feedback, and quiz history"],
        ["Extension", "One-event-per-day widget data slice"]
      ],
      overview: [
        "Today In Time treats historical material as an editorial product rather than an infinite scraped feed. Each event has a stable record contract, publishable status, tone, category, narrative fields, and one or more sources. The app can present an uplifting, balanced, or more unflinching selection without hiding where the story came from.",
        "The runtime is intentionally simple and offline-friendly. A bundled corpus is decoded into a stable HistoricalEvent model, then reused by the feed, detail, Explore, Saved, and Quiz experiences. A smaller generated slice feeds the widget, and CI prevents that slice from drifting away from the main corpus."
      ],
      features: [
        ["Editorial, not scraped", "Records are sourced, reviewed, status-gated, and shaped for a calm reading experience."],
        ["Tone without erasure", "Uplifting, balanced, and somber preferences change selection while preserving provenance."],
        ["Offline by construction", "The main reading experience ships with the app instead of depending on a network request."],
        ["One contract, many surfaces", "Feed, detail, search, saved stories, quizzes, notifications, and the widget share the same event model."]
      ],
      architectureIntro: "The editorial corpus is validated before it reaches Xcode. At runtime, one loader and one normalized model insulate every view from the source JSON shape, while local stores preserve user choices without requiring an account.",
      architectureFlows: [
        {
          title: "Editorial record to daily reading",
          nodes: [
            ["01 · Editorial", "Sourced event records", "Each record carries date, narrative, category, tone, status, and provenance."],
            ["02 · Data gate", "Validation and widget slice", "Scripts reject invalid records and regenerate the smaller one-per-day widget corpus."],
            ["03 · Bundle", "Local JSON resources", "The validated main corpus and widget slice ship inside their respective targets."],
            ["04 · Model", "DataLoader and HistoricalEvent", "Fallback fields, aliases, and publishability rules become one stable app model."],
            ["05 · Experience", "Feed, detail, Explore, Quiz", "SwiftUI surfaces select stories by date, tone, category, and user intent."],
            ["06 · Personal state", "Saved, feedback, widget", "Local stores remember reading choices and share the daily record with the widget."]
          ]
        }
      ],
      architectureNote: "The source corpus is an input artifact, not a live content API. That keeps reading fast and predictable, while CI holds the app and widget to the same editorial contract.",
      links: [
        ["App Store", "https://apps.apple.com/il/app/today-in-time/id6766169103", true],
        ["GitHub", "https://github.com/Somnora/Today", false]
      ]
    },

    "callsheet-companion": {
      name: "Callsheet Companion",
      category: "Crew Finances",
      status: "App Store",
      statusKind: "live",
      icon: "logos/callsheet.png",
      eyebrow: "The business side of working on set",
      summary: "A local-first production, time, money, gear, document, and relationship system built for freelance film and television crew who move from job to job.",
      facts: [
        ["Client", "SwiftUI on iOS"],
        ["Data", "SwiftData models with backup and optional CloudKit sync"],
        ["Integrations", "Calendar, location, notifications, camera, photos, and PDF"],
        ["Outputs", "Invoices, time cards, tax summaries, mileage logs, and CVs"]
      ],
      overview: [
        "Callsheet Companion starts with the actual unit of freelance crew life: a production made of shoot days, rates, kit, mileage, expenses, contacts, paperwork, and payment status. It handles overtime and golden-time calculations, tracks what is still owed, and turns the same underlying records into invoices, time cards, tax material, and a work-history CV.",
        "The app keeps the working set on the device through SwiftData, then layers in first-party Apple services where they help. EventKit can place shoot days on a calendar, Core Location supports set and mileage context, local notifications chase late payments, and PDF generators create documents without shipping production data to a third-party service."
      ],
      features: [
        ["Built from a real shoot day", "Call, wrap, day rate, overtime, kit, mileage, per diem, bumps, meals, and turnaround share one record."],
        ["One source for every deliverable", "Invoices, time cards, tax summaries, mileage exports, and CVs derive from the same production history."],
        ["A local production vault", "Documents, receipts, contacts, gear, and deal information stay organized around the job that created them."],
        ["Quiet operational help", "Calendar events, payment reminders, suggestions, and aging views surface the next useful action."]
      ],
      architectureIntro: "SwiftData is the center of the app. Views write structured production records, domain utilities calculate money and generate documents, and Apple integrations project the same source of truth into calendars, notifications, files, and optional sync.",
      architectureFlows: [
        {
          title: "Shoot day to paid record",
          nodes: [
            ["01 · Capture", "Jobs, days, rates, and receipts", "SwiftUI forms and quick-log tools capture the production's operational facts."],
            ["02 · Store", "SwiftData production graph", "Productions connect to shoot days, contacts, expenses, gear, rentals, and documents."],
            ["03 · Calculate", "Earnings and tax domain", "Dedicated utilities compute overtime, golden time, totals, reimbursements, and gear ROI."],
            ["04 · Integrate", "Calendar, location, reminders", "First-party services add schedule, distance, document capture, and local follow-up."],
            ["05 · Deliver", "Invoices, cards, PDFs, and CSV", "Generators turn the source records into production-ready business documents."],
            ["06 · Protect", "Backup, vault, and optional sync", "Local storage remains primary, with export, restore, and CloudKit paths around it."]
          ]
        }
      ],
      architectureNote: "Financial calculations live outside the views so the dashboard, invoice, time card, and tax surfaces all read the same numbers.",
      links: [
        ["App Store", "https://apps.apple.com/il/app/callsheet-companion/id6757967487", true]
      ]
    },

    "squadsync": {
      name: "SquadSync",
      category: "Squad Planner",
      status: "In Development",
      statusKind: "dev",
      icon: "logos/squadsync.png",
      eyebrow: "Make the plan, get everyone there, run it back",
      summary: "A coordination system for gaming friend groups, spanning squads, sessions, expiring invites, ready checks, chat, presence, reminders, recaps, and a one-tap rematch path.",
      facts: [
        ["Clients", "SwiftUI app, widget, Live Activity, Watch, App Clip, and Messages"],
        ["API", "Python 3.11 and FastAPI"],
        ["Data", "PostgreSQL with Alembic migrations and Redis-backed realtime state"],
        ["Hosting", "Containerized backend on Google Cloud Run"]
      ],
      overview: [
        "SquadSync replaces the fragile group-chat plan with a structured session that knows who is invited, who is ready, when people are running late, and whether the group wants to play again. Invite codes expire, archived squads revoke outstanding access, and Run It Back turns a finished session into a new one without rebuilding the roster by hand.",
        "The product reaches beyond the main iPhone app. Widgets and Live Activities expose the next session, the Watch can show the plan and send a running-late update, an App Clip previews an invite, and the Messages extension shares squads and sessions. All of those clients converge on the same versioned FastAPI contract."
      ],
      features: [
        ["A session, not a chat promise", "Time, roster, readiness, attendance, lateness, chat, and outcome live on one durable object."],
        ["Invites with a lifecycle", "Codes can expire, cap their use, be revoked, and disappear when the squad is archived."],
        ["Realtime where it matters", "WebSockets, presence, typing state, voice rooms, push, widgets, and Live Activities keep the plan current."],
        ["Run It Back", "Completed sessions can become a rematch with the prior group and context already attached."]
      ],
      architectureIntro: "A family of Apple clients shares one API contract. FastAPI services enforce squad, invite, chat, and session lifecycles over PostgreSQL, while Redis and WebSockets handle short-lived presence and realtime coordination.",
      architectureFlows: [
        {
          title: "Invite to after-action recap",
          nodes: [
            ["01 · Surfaces", "App, Watch, widget, Clip", "Each surface presents a focused slice of the same squad and session model."],
            ["02 · Client", "Swift models and services", "Typed requests, auth state, deep links, notifications, and shared extension data meet here."],
            ["03 · API", "FastAPI route contract", "Versioned endpoints coordinate users, squads, sessions, messages, voice, safety, and invites."],
            ["04 · Domain", "Lifecycle services", "Business rules enforce membership, readiness, expiry, rematches, reports, and account deletion."],
            ["05 · State", "PostgreSQL and Redis", "Durable records use migrated relational data; presence and realtime coordination use bounded fast state."],
            ["06 · Delivery", "WebSockets, APNs, Live Activity", "Updates return to the group on the screen and device surface that needs them."]
          ]
        }
      ],
      architectureNote: "Extensions do not invent parallel state. They read shared, scoped projections of the backend session model so a widget, Watch, and phone do not disagree about the plan.",
      links: [
        ["Product Page", "https://somnora.app/SquadSync/", true]
      ]
    },

    "setview": {
      name: "SetView",
      category: "AR Previsualization",
      status: "Open Source",
      statusKind: "",
      icon: "logos/setview.png",
      eyebrow: "Find the frame in the real location",
      summary: "A browser-based WebXR previsualization tool for blocking actors, lenses, cameras, focus, lighting, and scene timing inside the physical location before a crew arrives.",
      facts: [
        ["Runtime", "WebXR immersive AR in Meta Quest Browser"],
        ["Stack", "Three.js, TypeScript, Vite, and native browser APIs"],
        ["Storage", "localStorage, IndexedDB, and portable scene JSON"],
        ["Handoff", "Plans, shot lists, video takes, and Unreal Engine import"]
      ],
      overview: [
        "SetView is made for the moment a cinematographer stands in a real room and needs to answer practical questions before the day begins. Virtual actors can be placed on the real floor, given keyframed blocking and stance changes, then viewed through cameras with real sensor formats, focal lengths, aperture, focus distance, and anamorphic options.",
        "The core scene, lens, timeline, pose, history, and plan logic is pure TypeScript. WebXR services translate controller, hand, hit-test, anchor, scan, and headset input into that domain model. The same scene can be prepared on a laptop, played back in AR, recorded with scratch audio, exported as production documents, or imported into Unreal Engine."
      ],
      features: [
        ["Optics that mean something", "Filmback, focal length, T-stop, circle of confusion, and rack focus shape the virtual camera view."],
        ["Blocking with time", "Actor marks preserve stance, scale, facing, position, and timing instead of acting like static furniture."],
        ["Light inside the location", "Point, spot, and area fixtures carry intensity, Kelvin, cone, position, and plan-export data."],
        ["A production handoff", "Scene JSON can become floorplans, lighting plans, shot lists, recordings, and an Unreal Engine sequence."]
      ],
      architectureIntro: "SetView keeps the cinematic rules in pure domain modules and puts device-specific WebXR behavior around them. That separation lets desktop prep, headset AR, exporters, tests, and the Unreal importer all agree on one scene model.",
      architectureFlows: [
        {
          title: "Physical room to production handoff",
          nodes: [
            ["01 · Input", "Hands, controllers, desktop", "Raycasts, buttons, head pose, desktop forms, mic, and room features become typed commands."],
            ["02 · XR session", "Hit tests, anchors, and scan", "The browser establishes real-world placement and feature-detects the headset's granted capabilities."],
            ["03 · Domain", "Scene, lens, timeline, history", "Pure modules own actors, cameras, blocking, optics, lights, undo, and plan geometry."],
            ["04 · Runtime", "Three.js scene systems", "Actors, keyframes, camera view, depth of field, lights, room mesh, and playback render each frame."],
            ["05 · Persistence", "Local save and scene JSON", "Small state uses localStorage, scan geometry uses IndexedDB, and scenes remain portable."],
            ["06 · Output", "Plans, takes, analysis, Unreal", "The same scene becomes documents, recorded camera feeds, shot analysis, or a UE sequence."]
          ]
        }
      ],
      architectureNote: "Core AR needs no backend. The optional AI shot-analysis seam is an assistant around exported scene facts, not the source of the lens, blocking, or lighting model.",
      links: [
        ["GitHub", "https://github.com/Somnora/Set-View", true]
      ]
    },

    "homeplate": {
      name: "HomePlate",
      category: "Friend Status",
      status: "In Development",
      statusKind: "dev",
      icon: "logos/homeplate.png",
      eyebrow: "A social app without a forever feed",
      summary: "A friend-only availability signal for saying available, maybe, or busy, adding a little context, and letting the post expire instead of building a permanent performance of your life.",
      facts: [
        ["Client", "SwiftUI iPhone app"],
        ["Identity", "Firebase Authentication and user profiles"],
        ["Realtime data", "Cloud Firestore listeners, friendships, posts, and waves"],
        ["Delivery", "Firebase Cloud Functions and push notifications"]
      ],
      overview: [
        "HomePlate is designed around a much smaller social question: are your actual friends free right now? A person posts available, maybe, or busy, optionally adds a note, activity, or location, and shares it only across accepted friendships. The signal expires rather than accumulating into a public history.",
        "Firebase Authentication owns account identity, while Firestore holds profiles, friend relationships, availability posts, and waves. Swift view models maintain live listeners and translate that shared state into the feed. Friend codes and QR codes make the graph explicit, and Cloud Functions handle push delivery without turning the app into an open follower network."
      ],
      features: [
        ["Small, current, useful", "Availability answers a present-tense question and expires when it stops being true."],
        ["Friends by explicit code", "Connections are formed through a friend code or QR flow rather than public discovery and follower counts."],
        ["No permanent performance", "The product avoids a global feed and does not ask people to build an archive for engagement."],
        ["Lightweight contact", "Waves and focused push notifications provide a small opening without manufacturing constant conversation."]
      ],
      architectureIntro: "The iOS client is reactive to two forms of identity: the authenticated Firebase user and the accepted friendship graph. Firestore listeners project only relevant current posts into the feed, and server-side functions deliver bounded notifications.",
      architectureFlows: [
        {
          title: "Status to trusted friends",
          nodes: [
            ["01 · Person", "Sign in, friend code, status", "The user establishes identity, accepts specific friends, and creates a time-bounded post."],
            ["02 · Client", "SwiftUI and view models", "Auth, feed, friend, post, wave, and profile state are presented as focused flows."],
            ["03 · Services", "Auth and Firestore boundary", "Typed services validate models, listener scope, friendship state, and post visibility."],
            ["04 · Firebase", "Auth, Firestore, and rules", "Profiles, friendships, current posts, and waves persist in realtime under access rules."],
            ["05 · Delivery", "Cloud Functions and push", "Relevant friend activity becomes a targeted notification and returns people to the live state."]
          ]
        }
      ],
      architectureNote: "The social boundary is mutual friendship, not public reach. Expiration is part of the product model, so old availability does not become an accidental location history.",
      links: []
    },

    "cosmo-trader": {
      name: "Cosmo Trader",
      category: "Astrology and Markets",
      status: "Open Source",
      statusKind: "",
      icon: "logos/cosmo.png",
      eyebrow: "A playful lens on the tape",
      summary: "A stock and portfolio tracker that overlays real market data with zodiac profiles, moon phases, Mercury retrograde windows, cosmic correlations, and a clear entertainment-only boundary.",
      facts: [
        ["Client", "SwiftUI iPhone app and WidgetKit extension"],
        ["Market data", "Typed quote services, caching, and portfolio import"],
        ["Astrology", "Deterministic date, phase, transit, and compatibility engines"],
        ["Backend", "Firebase identity plus a FastAPI and Firestore service surface"]
      ],
      overview: [
        "Cosmo Trader takes the language and visual density of a market terminal and crosses it with the irreverence of a horoscope app. A holding gets a zodiac sign from a founding date, charts can carry lunar and retrograde overlays, and a portfolio can receive a shareable cosmic read. The app repeatedly states the important part: astrology is not a trading signal.",
        "Real quote and historical data stay separate from the entertainment layer. Typed services fetch, cache, and normalize market records. Deterministic astronomy and astrology services calculate phases, sign seasons, transits, and compatibility. View models then compose those sources into charts, cards, horoscopes, portfolio diagnostics, and widget snapshots."
      ],
      features: [
        ["Real data, playful framing", "Quotes and holdings are factual inputs; the cosmic interpretation is labeled entertainment."],
        ["Deep-history charts", "Price history can be aligned with dated moon phases, retrograde windows, and company cycles."],
        ["Portfolio import without trading", "Holdings can be parsed and tracked, but the product has no brokerage execution path."],
        ["A deliberate signal boundary", "Language and compliance guards prevent astrology or model copy from posing as financial advice."]
      ],
      architectureIntro: "Market facts and cosmic interpretation travel through separate services before a view model combines them. That makes it possible to audit a price, test an astronomical calculation, and govern the final language independently.",
      architectureFlows: [
        {
          title: "Market fact to cosmic card",
          nodes: [
            ["01 · Inputs", "Quotes, history, and holdings", "Remote market APIs, portfolio files, manual shares, and cached records enter through typed adapters."],
            ["02 · Data services", "Normalize, cache, diagnose", "Quote clients and history caches establish coverage, freshness, and a stable stock model."],
            ["03 · Astro engines", "Phases, signs, and transits", "Deterministic services compute the entertainment context from dates and orbital calendars."],
            ["04 · Framing", "View models and language policy", "Market and astro context are combined under not-financial-advice and signal-framing rules."],
            ["05 · Experience", "Charts, portfolio, horoscope", "SwiftUI renders correlation timelines, discovery, readings, roasts, and diagnostics."],
            ["06 · Surfaces", "Widget, notifications, optional cloud", "Bounded summaries reach the home screen while profile and referral state can use the backend."]
          ]
        }
      ],
      architectureNote: "The architecture preserves a non-negotiable distinction: market values can be factual, but any astrological correlation remains an entertainment overlay and never becomes an execution signal.",
      links: [
        ["GitHub", "https://github.com/Somnora/Cosmo-Trader", true]
      ]
    },

    "locked": {
      name: "Locked",
      category: "Virtual Camera",
      status: "In Development",
      statusKind: "dev",
      icon: null,
      eyebrow: "A camera operator inside a locked-off webcam",
      summary: "A local Windows camera pipeline that tracks one subject, composes the frame with patience, fires cinematic moves through a restraint system, and presents the result to OBS as a virtual camera.",
      facts: [
        ["Runtime", "Local Python pipeline for Windows 11"],
        ["Vision", "MediaPipe face detection, subject lock, and motion smoothing"],
        ["Triggers", "Hotkeys, offline voice phrases, claps, loud moments, lean, and Twitch"],
        ["Output", "OBS Virtual Camera, local clips, and a loopback control panel"]
      ],
      overview: [
        "Locked turns extra resolution around a streamer into camera movement. It finds and holds the chosen subject, calculates a composed crop, waits through a dead zone instead of chasing every twitch, then commits to a smooth recenter. Punch-ins, shakes, drifts, focus-like effects, and aspect changes are data-driven moves rather than edits burned into a scene.",
        "Every trigger passes through a restraint layer that understands cooldowns, effects budget, the active look, panic state, and whether a latching move is being released. Audio and keyword recognition stay on the machine. The control panel listens only on loopback, clips remain local, and the program frame reaches streaming software through the OBS Virtual Camera driver."
      ],
      features: [
        ["Patience is the motion model", "Dead zones, sustained displacement, damping, and subject lock make the camera feel operated instead of reactive."],
        ["Triggers with taste", "Voice, audio, hotkeys, lean, and viewer rewards request moves, but restraint decides whether they are allowed."],
        ["A real panic path", "One command kills every effect and returns to a clean composed frame in a bounded transition."],
        ["Private by default", "Vision, audio, clips, tuning, session counts, and the control panel all remain on the local machine."]
      ],
      architectureIntro: "The frame pipeline is split between perception, composition, movement, restraint, and output. Triggers never edit pixels directly. They request a move, the restraint layer arbitrates it, and one renderer combines the composed crop with the active look.",
      architectureFlows: [
        {
          title: "Webcam to virtual operator",
          nodes: [
            ["01 · Capture", "Webcam, mic, hotkeys, Twitch", "Newest-frame capture and bounded event adapters collect visual and intentional input."],
            ["02 · Perception", "Detection and subject lock", "Reduced-cadence face detection, identity continuity, smoothing, and audio features describe the moment."],
            ["03 · Composition", "Good frame and motion", "Eye line, headroom, thirds, overscan, dead zones, and committed recenter define the camera window."],
            ["04 · Direction", "Triggers, moves, and restraint", "Requested moves pass through cooldown, look, effect-budget, latch, and panic rules."],
            ["05 · Render", "Crop, grade, and overlays", "The active window, cinematic move, look, and optional HUD become one program frame."],
            ["06 · Output", "OBS, clips, and local panel", "The virtual camera feeds the stream while local tools expose control, recap, and instant replay."]
          ]
        }
      ],
      architectureNote: "The restraint layer is the creative control point. A trigger may be detected correctly and still be refused because the current look, cooldown, effects budget, or panic lock says the shot should stay quiet.",
      links: []
    }
  };
})();
