/* =============================================================
 * Experimentation Maturity Assessment — frontend logic
 * Static single-page app. State encoded in URL hash for shareable
 * stateless results links. Benchmark submission is a stub (POST
 * hook lives in submitBenchmark()); everything else is client-side.
 * ============================================================= */

/* --------------------- Reference data --------------------- */

const INDUSTRIES = [
  "E-commerce & Retail",
  "SaaS & Software",
  "Financial Services",
  "Media & Entertainment",
  "Travel & Hospitality",
  "Healthcare & Life Sciences",
  "Marketplace / Consumer Apps",
  "Gaming",
  "Telecommunications",
  "Other",
];

const SIZES = [
  { label: "Startup",         hint: "1–50 employees" },
  { label: "Small",           hint: "51–250 employees" },
  { label: "Mid-market",      hint: "251–1,000 employees" },
  { label: "Enterprise",      hint: "1,001–10,000 employees" },
  { label: "Large enterprise",hint: "10,000+ employees" },
];

/* Six categories, mapped by question id */
const CATEGORIES = [
  {
    key: "strategy",
    name: "Strategy & Business Alignment",
    short: "Strategy",
    questionIds: [1, 2, 3],
    steps: [
      {
        text: "Map every active experiment to a specific KPI on the company scorecard — if it doesn't ladder up, question whether it should run.",
        read: [{ title: "Product-Led Experimentation", url: "https://amplitude.com/blog/product-led-experimentation" }],
      },
      {
        text: "Publish an experimentation charter that ties test priorities to company OKRs, and review it quarterly with the leadership team.",
        read: [{ title: "The Rise of Experimentation", url: "https://statsig.com/blog/the-rise-of-experimentation" }],
      },
      {
        text: "Expand experimentation beyond product and growth into marketing, pricing, support, and operations — pick one non-obvious surface this quarter.",
        read: [{ title: "5 Trends in A/B Testing", url: "https://amplitude.com/blog/ab-testing-trends" }],
      },
      {
        text: "Have your CEO or CPO cite an experiment result in their next all-hands or board update. Public rituals shift what teams believe leadership values.",
        read: [{ title: "How Culture Drives Experimentation", url: "https://statsig.com/blog/how-culture-drives-successful-experimentation" }],
      },
      "Run a program design workshop with the Statsig team to shape your experimentation vision, roadmap, and cross-functional operating model.",
    ],
  },
  {
    key: "culture",
    name: "Leadership & Culture",
    short: "Culture",
    questionIds: [4, 5, 6, 7],
    steps: [
      {
        text: "Recruit an executive sponsor who will publicly cite experiment results — including surprising ones that contradict their own intuition.",
        read: [{ title: "Experimentation Is a Culture, Not a Task", url: "https://amplitude.com/blog/experimentation-is-a-culture" }],
      },
      {
        text: "Track and publish your experiment failure rate as a positive metric. Kohavi's benchmark: 10–15% success is normal. A high win rate signals under-ambitious hypotheses.",
        read: [
          { title: "Finding Value in a Failed A/B Test", url: "https://amplitude.com/blog/find-value-failed-ab-test" },
          { title: "Why Data and Intuition Aren't Enemies", url: "https://statsig.com/blog/why-data-and-intuition-arent-enemies" },
        ],
      },
      {
        text: "Run a monthly 'surprises' forum where teams share results that challenged assumptions. Normalize being wrong out loud.",
        read: [{ title: "Creating a Culture of Experimentation", url: "https://amplitude.com/blog/culture-of-experimentation" }],
      },
      {
        text: "Invest in experimentation literacy across all functions with a short internal training (statistical basics, guardrail metrics, when not to test).",
        read: [{ title: "Statsig University", url: "https://statsig.com/blog/helping-customers-move-faster-the-story-behind-statsig-university" }],
      },
    ],
  },
  {
    key: "velocity",
    name: "Volume & Velocity",
    short: "Velocity",
    questionIds: [8, 9, 10],
    steps: [
      {
        text: "Set a target for tests-per-team-per-month and track cadence weekly. Aim for a step-change (e.g., 2x within two quarters). Don't over-worry about experiment interactions — the research shows you can run many concurrent tests safely.",
        read: [
          { title: "A/B Interactions: A Call to Relax", url: "https://www.microsoft.com/en-us/research/articles/a-b-interactions-a-call-to-relax/" },
          { title: "Speeding up A/B Tests with Discipline", url: "https://statsig.com/blog/speeding-up-a-b-tests-with-discipline" },
        ],
      },
      {
        text: "Audit your idea-to-live pipeline and eliminate the single longest step — usually approvals, QA, or platform provisioning.",
        read: [{ title: "Top 8 Experimentation Mistakes", url: "https://statsig.com/blog/top-8-common-experimentation-mistakes-how-to-fix" }],
      },
      "Invest in self-serve tooling so PMs, marketers, and engineers can launch experiments without a data-science bottleneck.",
      {
        text: "Treat every launched feature as a hypothesis: schedule follow-up iterations rather than shipping once and moving on.",
        read: [{ title: "Chasing Metrics, Not Tasks", url: "https://statsig.com/blog/chasing-metrics-not-tasks-why-outcome-obsessed-pms-win" }],
      },
      {
        text: "Add a low-code experimentation solution so marketing and growth teams can launch tests without waiting on engineering — often the single highest-ROI move for velocity.",
        read: [
          { title: "No-Code Web Experimentation at Amplitude", url: "https://amplitude.com/blog/amplitude-team-web-experimentation" },
          { title: "Statsig Sidecar for Website A/B Tests", url: "https://statsig.com/blog/statsig-sidecar-website-ab-tests" },
        ],
      },
    ],
  },
  {
    key: "process",
    name: "Process & Methodology",
    short: "Process",
    questionIds: [11, 12, 13, 14],
    steps: [
      {
        text: "Standardize a hypothesis template (problem → change → predicted outcome → metrics) that every experiment must fill in before launch.",
        read: [
          { title: "5 Overlooked Steps in A/B Testing", url: "https://amplitude.com/blog/overlooked-ab-test-steps" },
          { title: "What's the Point of Hypothesizing?", url: "https://statsig.com/blog/whats-the-point-of-hypothesizing" },
        ],
      },
      {
        text: "Define reusable experiment templates that standardize hypothesis, metrics, guardrails, and analysis for the common test types you run.",
        read: [
          { title: "Design Better Experiments with Briefs", url: "https://amplitude.com/blog/experiment-brief" },
          { title: "Statsig Experiment Templates", url: "https://statsig.com/blog/experiment-templates-streamline-ab-testing" },
        ],
      },
      {
        text: "Adopt a prioritization framework (RICE, ICE, or PXL) and apply it consistently across all teams — inconsistency erodes trust in the pipeline.",
        read: [{ title: "PM Roundtable: Prioritizing Experiments", url: "https://statsig.com/blog/pm-roundtable-prioritize-experiments" }],
      },
      {
        text: "Build a searchable knowledge base for experiment write-ups so future teams don't rerun tests you've already learned from.",
        read: [{ title: "Meta-Analysis and the Knowledge Base", url: "https://statsig.com/blog/experimental-meta-analysis-and-knowledge-base" }],
      },
      {
        text: "Use session replay to strengthen ideation and background research — watching real user friction turns qualitative signal into testable hypotheses.",
        read: [{ title: "5 Things to Do with Session Replay", url: "https://statsig.com/blog/session-replay-things-to-try" }],
      },
      "Run an experiment ideation workshop with the Statsig team to seed your backlog with high-quality, testable hypotheses.",
    ],
  },
  {
    key: "metrics",
    name: "Metrics & Measurement",
    short: "Metrics",
    questionIds: [15, 16, 17],
    steps: [
      {
        text: "Define a company-wide Overall Evaluation Criterion (OEC) that balances short-term revenue with long-term user satisfaction, following Kohavi's Bing model.",
        read: [
          { title: "Elevating the Maturity Model (Kohavi)", url: "https://amplitude.com/blog/webinar-recap-ronny-kohavi" },
          { title: "Decoding Metrics with Ron Kohavi", url: "https://statsig.com/blog/decoding-metrics-ron-kohavi" },
        ],
      },
      {
        text: "Establish a standard guardrail suite (latency, retention, crash rate, SRM check) that every experiment inherits automatically.",
        read: [
          { title: "The Power of Continuous Learning", url: "https://amplitude.com/blog/continuous-learning-benefits" },
          { title: "What Are Guardrail Metrics?", url: "https://statsig.com/blog/what-are-guardrail-metrics-in-ab-tests" },
        ],
      },
      {
        text: "Shift measurement from surface-level metrics (clicks, page views) to behavioral north-star metrics tied to retention and LTV.",
        read: [{ title: "Metrics That Make or Break Experiments", url: "https://statsig.com/blog/product-metrics-that-make-or-break-your-experiments" }],
      },
      {
        text: "Bring in warehouse metrics rather than relying on proxy metrics — analyze experiments against the same governed definitions your business already trusts.",
        read: [{ title: "Why Warehouse-Native Experimentation", url: "https://statsig.com/blog/warehouse-native-experimentation-value-props" }],
      },
      {
        text: "Run periodic long-term holdouts to validate that short-term experiment wins actually deliver sustained impact.",
        read: [{ title: "Monitoring Long-Term Experiment Effects", url: "https://statsig.com/blog/how-to-monitor-the-long-term-effects-of-your-experiment" }],
      },
    ],
  },
  {
    key: "tools",
    name: "Tools & Infrastructure",
    short: "Tools",
    questionIds: [18, 19, 20, 21],
    steps: [
      {
        text: "Roll out feature flags as standard practice for every product launch — decouple deployment from release so risky bets can be tested safely.",
        read: [
          { title: "A/B Testing + Feature Flagging (Amplitude)", url: "https://amplitude.com/blog/experiment-feature-management" },
          { title: "Experiments vs. Feature Flags", url: "https://statsig.com/blog/distinction-between-experiments-and-feature-flags" },
        ],
      },
      {
        text: "Integrate your experimentation platform with your data warehouse and metric layer so results and analytics stay in sync.",
        read: [{ title: "Building a Metrics Library on Statsig", url: "https://statsig.com/blog/how-to-build-metrics-library-statsig-best-practices" }],
      },
      {
        text: "Progress up the sophistication ladder: A/B → MVT → multi-armed bandits → contextual bandits and personalization.",
        read: [
          { title: "Multi-Armed Bandits vs. A/B Testing", url: "https://amplitude.com/blog/multi-armed-bandit-vs-ab-testing" },
          { title: "Statsig Autotune: Contextual Bandits", url: "https://statsig.com/blog/statsig-autotune-contextual-bandits-personalization" },
        ],
      },
      "Add a feature experimentation solution (like Statsig) so teams can launch experiments anywhere in the stack — client, server, backend logic, or ML models.",
      {
        text: "Add a low-code experimentation solution to unlock marketing and growth teams without requiring engineering to ship each test.",
        read: [
          { title: "Self-Service A/B Testing (Amplitude)", url: "https://amplitude.com/blog/amplitude-web-experimentation-launch" },
          { title: "No-Code Experimentation with Statsig Layers", url: "https://statsig.com/blog/no-code-experimentation-layers" },
        ],
      },
      "Bring in the Statsig team for a platform design review to align infrastructure choices with where you want your program in 12–18 months.",
    ],
  },
  {
    key: "ai",
    name: "AI Product Experimentation",
    short: "AI",
    questionIds: [22, 23],
    steps: [
      {
        text: "Treat every AI change — model swap, prompt update, thinking-level change, tool/config change — as an experiment. Never ship AI changes to 100% without a measured comparison.",
        read: [
          { title: "AI Broke Experimentation", url: "https://amplitude.com/blog/ai-broke-experimentation" },
          { title: "4 Trends in AI Experimentation", url: "https://statsig.com/blog/experimentation-and-ai-trend" },
        ],
      },
      {
        text: "Stand up an offline eval harness against a golden dataset so prompt and model changes are scored before they reach production.",
        read: [
          { title: "Building the AI Validation Stack", url: "https://amplitude.com/blog/building-the-validation-stack-for-ai-product-development" },
          { title: "How We Optimized Statbot with Evals", url: "https://statsig.com/blog/statbot-ai-evals-experimentation" },
        ],
      },
      {
        text: "Instrument LLM-as-a-Judge scoring on production traffic so quality is measured continuously, not just at launch.",
        read: [
          { title: "Beyond Prompts: LLM Optimization", url: "https://statsig.com/blog/llm-optimization-online-experimentation" },
          { title: "Statsig AI Prompt Experiments", url: "https://statsig.com/blog/ai-prompt-experiments" },
        ],
      },
      {
        text: "Track the full metric stack on every AI feature: quality score, error/refusal rate, user frustration signals (retries, thumbs-down, session abandonment), cost per request, and end-to-end latency.",
        read: [
          { title: "Balancing Inference Cost and UX for Agents", url: "https://amplitude.com/blog/agent-analytics-beta" },
          { title: "Ship, Measure, and Optimize AI Code", url: "https://statsig.com/blog/measure-optimize-ai-generated-code" },
        ],
      },
      {
        text: "Use Statsig to gate every AI change behind a feature flag, ramp progressively, monitor guardrails in real time, and roll back in seconds.",
        read: [{ title: "Automating Safe AI Config Rollouts", url: "https://statsig.com/blog/automating-safe-ai-config-rollouts" }],
      },
      {
        text: "Use Amplitude to correlate AI feature quality with downstream product outcomes (retention, engagement, conversion) — quality in a vacuum doesn't matter if it doesn't move business metrics.",
        read: [
          { title: "Building an AI-First Product", url: "https://amplitude.com/blog/ai-first-product" },
          { title: "Your Users Are Your Best Benchmark", url: "https://statsig.com/blog/guide-to-testing-optimizing-ai" },
        ],
      },
    ],
  },
];

/* Questions. Each option array is ordered 1..5 (least → most mature). */
const QUESTIONS = [
  /* --- Strategy & Business Alignment --- */
  {
    id: 1, category: "strategy",
    q: "How connected are your experiments to broader business strategy?",
    options: [
      "Experiments are ad hoc, driven by whoever has an idea that week.",
      "Some experiments align with team OKRs, but most are opportunistic.",
      "Experiments are tied to team-level goals and product roadmaps.",
      "Experiments ladder up to company-wide objectives and strategic bets.",
      "Company strategy itself is shaped by an ongoing portfolio of experiments.",
    ],
    weakAdvice: "Start by mapping every active experiment to a top-line business KPI. If a test can't be traced to a strategic outcome, deprioritize it.",
  },
  {
    id: 2, category: "strategy",
    q: "What percentage of significant product, marketing, or UX launches are validated with a controlled experiment before full rollout?",
    options: [
      "Under 10% — most things ship on intuition.",
      "10–25%.",
      "25–50%.",
      "50–80%.",
      "Over 80% — shipping without a test is the exception, not the norm.",
    ],
    weakAdvice: "Set a policy that anything touching a top-line metric requires a test. Start with one product surface and expand from there.",
  },
  {
    id: 3, category: "strategy",
    q: "Where in your organization does experimentation actually happen today?",
    options: [
      "One team or one channel (usually product or growth).",
      "2–3 teams; other areas ship without testing.",
      "Product + marketing + parts of engineering.",
      "Most digital surfaces — web, app, email, notifications, backend/ranking.",
      "Everywhere digital and increasingly offline — pricing, support, sales scripts, physical experience.",
    ],
    weakAdvice: "Pick one non-obvious surface (pricing, email, support scripts) and pilot experimentation there this quarter. Breadth is a maturity signal.",
  },

  /* --- Leadership & Culture --- */
  {
    id: 4, category: "culture",
    q: "How would you describe leadership's engagement with experimentation?",
    options: [
      "Leaders rarely engage — the highest-paid person's opinion (HiPPO) usually wins.",
      "A few executives are supportive, but most decisions still bypass testing.",
      "Leadership accepts experiments for tactical decisions; strategy is set top-down.",
      "Leadership actively cites experiment results and expects tests before major launches.",
      "Experimentation is a stated company value; leaders' own ideas are subject to test like anyone else's.",
    ],
    weakAdvice: "Find one executive sponsor and equip them with a single high-impact result to cite publicly. Cultural change starts with visible endorsement.",
  },
  {
    id: 5, category: "culture",
    q: "When an experiment result contradicts a senior leader's intuition, what usually happens?",
    options: [
      "The team ships the leader's version anyway.",
      "There's a debate, but seniority usually wins.",
      "The team runs a follow-up to 'double-check' the surprising result.",
      "The team accepts the data and adjusts the plan.",
      "Leadership publicly celebrates the surprise as a learning moment.",
    ],
    weakAdvice: "This is the Semmelweis Reflex. Create a written norm that experiment results are dispositive on tactical decisions — even when they surprise leaders.",
  },
  {
    id: 6, category: "culture",
    q: "How does your organization treat experiments that fail (i.e., don't move the metric)?",
    options: [
      "Failures are seen as wasted effort; teams avoid running risky ones.",
      "Failures are quietly shelved; only wins get shared.",
      "Failures are documented, but rarely reviewed by others.",
      "Failures are treated as valuable learnings and shared broadly.",
      "Failure rates are tracked as a positive metric — a low rate is a red flag for under-ambition.",
    ],
    weakAdvice: "Publish your failure rate. Kohavi's Bing team ran at ~85% failure — that's a healthy exploration rate. Reward the team that fails the most instructive test each quarter.",
  },
  {
    id: 7, category: "culture",
    q: "How would you describe experimentation literacy across teams (PMs, engineers, designers, marketers)?",
    options: [
      "Most people can't explain what an A/B test does or why randomization matters.",
      "Product teams are literate; other functions are not.",
      "Product and data teams are strong; marketing and CX are catching up.",
      "Most functions can design and interpret their own tests with light support.",
      "Experimentation vocabulary and rigor are shared fluency across all functions.",
    ],
    weakAdvice: "Ship a lightweight internal course covering statistical basics, guardrail metrics, and when NOT to test. Aim for 80% of PMs and marketers to complete it in 90 days.",
  },

  /* --- Volume & Velocity --- */
  {
    id: 8, category: "velocity",
    q: "Roughly how many controlled experiments does your organization run per month?",
    options: [
      "0–1 (sporadic, ad hoc).",
      "2–5.",
      "6–20.",
      "20–100.",
      "100+ (multiple concurrent experiments per team per week).",
    ],
    weakAdvice: "Volume is a leading indicator of maturity. Set an explicit tests-per-team target and instrument it; what gets measured gets tested.",
  },
  {
    id: 9, category: "velocity",
    q: "From 'we have an idea' to 'the test is live in production,' how long does a typical experiment take?",
    options: [
      "Months — every test is a bespoke project.",
      "3–6 weeks.",
      "1–2 weeks.",
      "A few days.",
      "Hours — self-serve setup with lightweight review.",
    ],
    weakAdvice: "Audit the pipeline and eliminate the single slowest step. Usually it's manual QA, provisioning, or approvals — not the test itself.",
  },
  {
    id: 10, category: "velocity",
    q: "How often do teams run multiple experiments in sequence against the same surface (iterative vs. one-and-done)?",
    options: [
      "Never — we test once and move on.",
      "Occasionally, when results are inconclusive.",
      "Frequently for high-value surfaces, rarely elsewhere.",
      "Most meaningful features go through 2–3 iterations informed by prior results.",
      "Continuous iteration is the norm — surfaces are treated as evolving hypotheses.",
    ],
    weakAdvice: "Compounding growth = growth rate ^ turns. One-and-done kills compounding. Schedule a v2 for every launched winner before the v1 ships.",
  },

  /* --- Process & Methodology --- */
  {
    id: 11, category: "process",
    q: "How are experiment hypotheses generated and prioritized?",
    options: [
      "Whoever has an idea runs a test.",
      "Ideas come from a backlog, but prioritization is informal.",
      "We use a scoring framework (ICE, PIE, RICE, etc.) inconsistently.",
      "We have a documented, standardized prioritization process used across teams.",
      "Prioritization is data-driven, informed by prior test results, research, and impact estimates.",
    ],
    weakAdvice: "Adopt one prioritization framework (RICE works well) and require every experiment idea to be scored before it enters the backlog.",
  },
  {
    id: 12, category: "process",
    q: "How rigorous is your typical experiment design (sample size, power, guardrails)?",
    options: [
      "We rarely calculate sample size; we stop tests when they 'look right'.",
      "We check significance at the end but don't pre-plan.",
      "We pre-calculate sample sizes and stopping rules for major tests.",
      "Every experiment has a pre-registered design with primary, secondary, and guardrail metrics.",
      "We use advanced methods (sequential testing, CUPED, variance reduction) to increase power and reduce false positives.",
    ],
    weakAdvice: "Stopping tests when they 'look right' is the #1 source of false positives. Pre-register sample size and duration for every experiment before it launches.",
  },
  {
    id: 13, category: "process",
    q: "How are experiment results documented and shared?",
    options: [
      "Results live in the head of whoever ran the test.",
      "Results are shared in Slack or email, then forgotten.",
      "We have a repository of write-ups, but search is manual.",
      "There's a central, searchable knowledge base that teams actively reference.",
      "Learnings feed automatically into a shared insights layer that informs future test design and strategy.",
    ],
    weakAdvice: "Without a searchable repository, teams re-run the same tests. Start with a shared doc index this week, then invest in a proper knowledge base.",
  },
  {
    id: 14, category: "process",
    q: "How does research (qualitative and quantitative discovery) feed into your experimentation pipeline?",
    options: [
      "We rarely do research; ideas come from meetings and intuition.",
      "Research is done ad hoc when a specific question arises.",
      "We do periodic research sprints that inform quarterly test plans.",
      "Research and experimentation are tightly coupled — quant and qual continuously feed each other.",
      "'Always-on' research (surveys, interviews, behavioral analytics) constantly seeds the experiment pipeline.",
    ],
    weakAdvice: "Standing research (interviews, session replay, feedback surveys) 10x's your win rate by seeding better hypotheses. Set a target of X interviews per sprint.",
  },

  /* --- Metrics & Measurement --- */
  {
    id: 15, category: "metrics",
    q: "Do you have a defined Overall Evaluation Criterion (OEC) or primary success metric for experiments?",
    options: [
      "No — success is judged case by case.",
      "Individual teams define their own metrics per test.",
      "We have a documented primary metric per product area.",
      "We have a company-wide OEC balancing multiple business outcomes.",
      "Our OEC evolves based on meta-analyses of prior experiments and long-term validation.",
    ],
    weakAdvice: "Define a single OEC that ladders to revenue, satisfaction, and retention. Bing's OEC combined 3 metrics; ship your v1 in 30 days.",
  },
  {
    id: 16, category: "metrics",
    q: "How do you handle guardrail metrics (things you don't want to hurt)?",
    options: [
      "We don't formally track them.",
      "We eyeball obvious ones (revenue, retention) after the fact.",
      "Every experiment has a defined set of guardrail metrics.",
      "Guardrails are automated with alerts and auto-shutoff for severe regressions.",
      "We monitor trust metrics (SRM, novelty, primacy) and long-term holdout effects continuously.",
    ],
    weakAdvice: "Every experiment needs guardrails on latency, crash rate, retention, and a data-quality (SRM) check. Standardize a template and apply universally.",
  },
  {
    id: 17, category: "metrics",
    q: "What types of metrics do experiments most often move?",
    options: [
      "Surface-level UI/UX or vanity metrics (clicks, page views).",
      "Conversion at a single funnel step.",
      "End-to-end funnel and short-term revenue.",
      "Retention, LTV, and behavioral north-star metrics.",
      "Long-term causal metrics validated through holdouts and downstream measurement.",
    ],
    weakAdvice: "Click and page-view wins often don't translate to business impact. Push measurement one level deeper — behavior, retention, revenue.",
  },

  /* --- Tools & Infrastructure --- */
  {
    id: 18, category: "tools",
    q: "Which best describes your experimentation platform?",
    options: [
      "Manual code branches or no dedicated tooling.",
      "Basic A/B testing tool used by one team.",
      "Dedicated feature-flag / experimentation platform used by some teams.",
      "Enterprise platform used company-wide with SDKs across web, mobile, and backend.",
      "Integrated platform with automated analysis, decisioning, and personalization built in (or a mature in-house build).",
    ],
    weakAdvice: "Manual branches make every test expensive and every failure catastrophic. A dedicated platform is table stakes above ~5 tests/month.",
  },
  {
    id: 19, category: "tools",
    q: "How does your team use feature flags for progressive delivery and safe deployment?",
    options: [
      "We don't use feature flags — releases go out to 100% of users at once.",
      "We use flags for major launches only, decided case by case.",
      "Most new features are gated behind flags with manual, gradual rollouts.",
      "Feature flags are standard practice with kill switches, targeting, and progressive rollouts by default.",
      "Feature flags are fully decoupled from experiments and power targeting, entitlements, kill switches, and continuous delivery across all surfaces.",
    ],
    weakAdvice: "Feature flags are the safest on-ramp to experimentation. Deploy behind a flag, roll out gradually, monitor guardrails, then treat it as a test.",
  },
  {
    id: 20, category: "tools",
    q: "How integrated is your experimentation platform with your analytics and data stack?",
    options: [
      "Not integrated — results live in silos.",
      "Manual data pulls for post-hoc analysis.",
      "Basic integration; experiment data lands in the warehouse.",
      "Full integration; experiment metrics are automatically derived from a governed metric layer.",
      "Bidirectional — experiment results feed personalization models, ML systems, and downstream decisioning.",
    ],
    weakAdvice: "Siloed experiment data means every analysis is bespoke. Land experiment assignment and events in your warehouse so metrics reuse your existing definitions.",
  },
  {
    id: 21, category: "tools",
    q: "What kinds of experiments can your infrastructure support today?",
    options: [
      "Simple front-end A/B tests.",
      "Server-side A/B tests on key flows.",
      "MVTs and holdouts across product areas.",
      "Multi-armed bandits, switchbacks, quasi-experiments.",
      "Full personalization, contextual bandits, and causal ML at scale.",
    ],
    weakAdvice: "Client-only tests limit you to UI changes. Server-side testing unlocks pricing, ranking, and backend logic — where most business impact lives.",
  },

  /* --- AI Product Experimentation --- */
  {
    id: 22, category: "ai",
    q: "How does your team ship changes to AI/LLM features (model swaps, prompt updates, thinking-level changes, tool or config changes)?",
    options: [
      "We don't ship AI features — or we push AI changes to 100% of traffic without measurement.",
      "We eyeball a handful of outputs manually, then ship.",
      "We run offline evals on a sample dataset before shipping.",
      "We A/B test material AI changes on a subset of traffic with at least one quality metric.",
      "Every AI change flows through a controlled experiment with production evals, guardrails, and progressive rollout.",
    ],
    weakAdvice: "Every prompt tweak, model swap, or thinking-level change is a new hypothesis. Gate them behind feature flags and measure quality, cost, and latency on a subset of traffic before you ramp — untested AI changes are the fastest way to ship a regression you can't see.",
  },
  {
    id: 23, category: "ai",
    q: "What signals do you capture to evaluate AI/LLM features in production?",
    options: [
      "We rely on user complaints or manual review as the primary quality signal.",
      "We track a single dimension (usually cost or latency) — quality is subjective.",
      "We track quality via periodic manual review plus a couple of ops metrics.",
      "We track a broad set — quality, error rate, latency, cost — but mostly via offline evals.",
      "We run LLM-as-a-Judge evals in production with automated quality scoring alongside error rate, user frustration signals (retries, thumbs-down, abandonment), cost per request, and latency.",
    ],
    weakAdvice: "Manual review doesn't scale and user complaints are a lagging indicator. Instrument LLM-as-a-Judge scoring in production and track the full stack: quality, error/refusal rate, user frustration (retries, thumbs-down, session abandonment), cost per request, and latency — for every AI-powered surface.",
  },
];

/* Five maturity stages. */
const STAGES = [
  { level: 1, name: "Reactive",  synonyms: "Crawl · Awareness · Hubris",
    color: "#EF4444",
    desc: "Testing is sporadic and driven by individuals. There's no shared framework, no owner, and no cultural expectation that decisions should be tested. Almost every step forward will be high-leverage." },
  { level: 2, name: "Emerging",  synonyms: "Belief",
    color: "#F59E0B",
    desc: "Pockets of the organization run experiments regularly, but the practice hasn't scaled. Wins are inconsistent because process, tooling, and leadership support are all uneven." },
  { level: 3, name: "Strategic", synonyms: "Walk · Commitment · Measurement & Control",
    color: "#38BDF8",
    desc: "Experimentation is a recognized discipline with a dedicated team, defined metrics, and executive support. Frameworks exist and are followed inconsistently across surfaces." },
  { level: 4, name: "Integrated",synonyms: "Run · Diffusion",
    color: "#194BFB",
    desc: "Experimentation is embedded across the company. Most digital surfaces test regularly, tools are integrated with the data stack, and results routinely reshape the roadmap." },
  { level: 5, name: "Optimized", synonyms: "Embeddedness · Fundamental Understanding",
    color: "#7B4FFF",
    desc: "The organization operates as a continuous learning system. Experiments run everywhere digital and increasingly offline; leadership's own ideas are tested; results feed personalization and ML." },
];

/* --------------------- State --------------------- */

const state = {
  step: 0,                      /* 0=welcome, 1=industry, 2=size, 3..23=questions, 24=submit, 25=results */
  industry: null,
  size: null,
  answers: new Array(QUESTIONS.length).fill(null), /* 1..5 or null */
  benchmark: false,
};

const STEP_KEYS = {
  WELCOME: 0,
  INDUSTRY: 1,
  SIZE: 2,
  FIRST_QUESTION: 3,
  SUBMIT: 3 + QUESTIONS.length,
  RESULTS: 4 + QUESTIONS.length,
};

/* --------------------- Utilities --------------------- */

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/* HTML-escape user-controlled strings before interpolating into innerHTML. */
function esc(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* Steps in CATEGORIES can be a plain string or { text, read: [{ title, url }, ...] }.
   `read` is always an array so a single step can carry multiple suggested
   articles (e.g., Amplitude + Statsig perspectives). */
function stepText(step) {
  return typeof step === "string" ? step : step.text;
}
function stepReadHtml(step) {
  if (typeof step !== "object" || !step || !step.read || !step.read.length) return "";
  const links = step.read.map((r) =>
    `<a class="step-read" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer"><strong>Read:</strong> ${esc(r.title)} →</a>`
  ).join("");
  return `<div class="step-reads">${links}</div>`;
}

function screenId(step) {
  if (step === STEP_KEYS.WELCOME)   return "screen-welcome";
  if (step === STEP_KEYS.INDUSTRY)  return "screen-industry";
  if (step === STEP_KEYS.SIZE)      return "screen-size";
  if (step === STEP_KEYS.SUBMIT)    return "screen-submit";
  if (step === STEP_KEYS.RESULTS)   return "screen-results";
  return "screen-question";
}

function showScreen(step) {
  $$(".screen").forEach((s) => s.classList.remove("active"));
  const id = screenId(step);
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
  updateProgress(step);
}

function updateProgress(step) {
  const progressEl = $("#headerProgress");
  const fillEl = $("#progressFill");
  const textEl = $("#progressText");

  if (step === STEP_KEYS.WELCOME || step === STEP_KEYS.RESULTS) {
    progressEl.classList.remove("visible");
    return;
  }
  progressEl.classList.add("visible");

  const totalSteps = 2 + QUESTIONS.length + 1; /* industry, size, N questions, submit */
  const done = step - 1; /* step 1 (industry) → done=0 progress-wise */
  const pct = Math.min(100, Math.max(0, ((done + 0) / totalSteps) * 100));
  fillEl.style.width = pct + "%";

  if (step === STEP_KEYS.INDUSTRY)      textEl.textContent = "Your organization · 1 of 2";
  else if (step === STEP_KEYS.SIZE)     textEl.textContent = "Your organization · 2 of 2";
  else if (step === STEP_KEYS.SUBMIT)   textEl.textContent = "Ready to submit";
  else {
    const qIdx = step - STEP_KEYS.FIRST_QUESTION + 1;
    textEl.textContent = `Question ${qIdx} of ${QUESTIONS.length}`;
  }
}

/* --------------------- URL state encoding --------------------- */

function encodeUrl() {
  const params = new URLSearchParams();
  if (state.industry) params.set("i", state.industry);
  if (state.size) params.set("s", state.size);
  if (state.answers.every((a) => a !== null)) {
    params.set("r", state.answers.join(""));
  }
  return "#" + params.toString();
}

function tryLoadFromUrl() {
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return false;
  const params = new URLSearchParams(hash);
  const r = params.get("r");
  const i = params.get("i");
  const s = params.get("s");
  if (!r || r.length !== QUESTIONS.length) return false;
  const answers = r.split("").map((c) => parseInt(c, 10));
  if (answers.some((a) => !(a >= 1 && a <= 5))) return false;
  state.answers = answers;
  /* Only accept industry/size values from the known allow-lists.
     Anything else (including XSS payloads) is discarded. */
  state.industry = INDUSTRIES.includes(i) ? i : "Unknown";
  state.size = SIZES.some((sz) => sz.label === s) ? s : "Unknown";
  state.step = STEP_KEYS.RESULTS;
  return true;
}

function pushUrl() {
  const hash = encodeUrl();
  if (window.location.hash !== hash) {
    history.replaceState(null, "", hash || " ");
  }
}

/* --------------------- Rendering: static screens --------------------- */

function renderIndustry() {
  const container = $("#industryOptions");
  container.innerHTML = "";
  INDUSTRIES.forEach((label) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option" + (state.industry === label ? " selected" : "");
    btn.innerHTML = `
      <span class="option-marker"></span>
      <span class="option-text">${label}</span>
    `;
    btn.onclick = () => selectIndustry(label, btn);
    container.appendChild(btn);
  });
}

function selectIndustry(label, btnEl) {
  state.industry = label;
  const buttons = $$("#industryOptions .option");
  buttons.forEach((b) => b.classList.remove("selected"));
  btnEl.classList.add("selected");
  setTimeout(() => {
    state.step = STEP_KEYS.SIZE;
    renderSize();
    showScreen(state.step);
  }, 260);
}

function renderSize() {
  const container = $("#sizeOptions");
  container.innerHTML = "";
  SIZES.forEach(({ label, hint }) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option" + (state.size === label ? " selected" : "");
    btn.innerHTML = `
      <span class="option-marker"></span>
      <span class="option-text"><strong>${label}</strong><div style="color:var(--text-muted);font-size:13px;margin-top:2px">${hint}</div></span>
    `;
    btn.onclick = () => selectSize(label, btn);
    container.appendChild(btn);
  });
}

function selectSize(label, btnEl) {
  state.size = label;
  const buttons = $$("#sizeOptions .option");
  buttons.forEach((b) => b.classList.remove("selected"));
  btnEl.classList.add("selected");
  setTimeout(() => {
    state.step = STEP_KEYS.FIRST_QUESTION;
    renderQuestion();
    showScreen(state.step);
  }, 260);
}

/* --------------------- Rendering: questions --------------------- */

function renderQuestion() {
  const qIndex = state.step - STEP_KEYS.FIRST_QUESTION;
  const q = QUESTIONS[qIndex];
  const cat = CATEGORIES.find((c) => c.key === q.category);

  $("#questionEyebrow").textContent = `${cat.short} · Question ${qIndex + 1} of ${QUESTIONS.length}`;
  $("#questionText").textContent = q.q;
  $("#questionHint").textContent = state.answers[qIndex] !== null
    ? "Change your answer or hit Back to review."
    : "Select an answer to continue";

  const container = $("#questionOptions");
  container.innerHTML = "";
  q.options.forEach((text, idx) => {
    const score = idx + 1;
    const selected = state.answers[qIndex] === score;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option" + (selected ? " selected" : "");
    btn.innerHTML = `
      <span class="option-marker"></span>
      <span class="option-text">${text}</span>
    `;
    btn.onclick = () => selectAnswer(qIndex, score, btn);
    container.appendChild(btn);
  });
}

function selectAnswer(qIndex, score, btnEl) {
  state.answers[qIndex] = score;
  /* Visually reflect selection immediately */
  const buttons = $$("#questionOptions .option");
  buttons.forEach((b) => b.classList.remove("selected"));
  btnEl.classList.add("selected");
  /* Auto-advance with a small delay so the selection is perceptible */
  setTimeout(() => {
    if (state.step - STEP_KEYS.FIRST_QUESTION === QUESTIONS.length - 1) {
      state.step = STEP_KEYS.SUBMIT;
      renderSubmit();
    } else {
      state.step += 1;
      renderQuestion();
    }
    showScreen(state.step);
  }, 260);
}

/* --------------------- Rendering: submit screen --------------------- */

function renderSubmit() {
  const grid = $("#summaryGrid");
  grid.innerHTML = `
    <div class="summary-cell">
      <div class="summary-cell-label">Industry</div>
      <div class="summary-cell-value">${esc(state.industry) || "—"}</div>
    </div>
    <div class="summary-cell">
      <div class="summary-cell-label">Company size</div>
      <div class="summary-cell-value">${esc(state.size) || "—"}</div>
    </div>
    <div class="summary-cell">
      <div class="summary-cell-label">Questions answered</div>
      <div class="summary-cell-value">${state.answers.filter((a) => a !== null).length} of ${QUESTIONS.length}</div>
    </div>
  `;
  $("#benchmarkCheckbox").checked = state.benchmark;
  $("#benchmarkCheckbox").onchange = (e) => { state.benchmark = e.target.checked; };
}

/* --------------------- Scoring --------------------- */

function computeOverall() {
  const total = state.answers.reduce((s, a) => s + (a || 0), 0);
  const max = QUESTIONS.length * 5;
  const pct = (total / max) * 100;
  return { total, max, pct };
}

function computeStage(pct) {
  if (pct < 35) return STAGES[0];
  if (pct < 55) return STAGES[1];
  if (pct < 75) return STAGES[2];
  if (pct < 90) return STAGES[3];
  return STAGES[4];
}

function computeCategoryScores() {
  return CATEGORIES.map((cat) => {
    const answered = cat.questionIds.map((id) => state.answers[id - 1] || 0);
    const total = answered.reduce((s, a) => s + a, 0);
    const max = cat.questionIds.length * 5;
    const pct = (total / max) * 100;
    return { ...cat, total, max, pct, stage: computeStage(pct) };
  });
}

function findWeakestQuestions() {
  return QUESTIONS
    .map((q, i) => ({ q, i, score: state.answers[i] || 0 }))
    .filter((x) => x.score > 0 && x.score <= 2)
    .sort((a, b) => a.score - b.score);
}

/* --------------------- Rendering: results --------------------- */

function renderResults() {
  pushUrl();
  const overall = computeOverall();
  const stage = computeStage(overall.pct);
  const categoryScores = computeCategoryScores();
  const sortedCategories = [...categoryScores].sort((a, b) => a.pct - b.pct);
  const weakestCategory = sortedCategories[0];
  const weakestQuestions = findWeakestQuestions();

  const root = $("#resultsRoot");
  root.innerHTML = `
    ${renderHero(overall, stage)}
    ${renderCategoryCard(categoryScores)}
    ${renderNextStepsCard(weakestCategory)}
    ${renderGapsCard(weakestQuestions)}
    ${renderContactCta()}
    ${renderActionsBar()}
  `;

  wireActions();
  if (state.benchmark) submitBenchmark();
}

function renderHero(overall, stage) {
  return `
    <div class="result-hero" id="resultHero">
      <div class="result-eyebrow">Your experimentation maturity</div>
      <h1 class="result-stage">${stage.name}</h1>
      <p class="result-desc">${stage.desc}</p>

      <div class="score-row">
        <span class="score-big">${overall.total}</span>
        <span class="score-out">/ ${overall.max}</span>
        <span class="score-pct">${Math.round(overall.pct)}%</span>
      </div>

      <div class="curve-wrap">
        ${renderCurve(stage.level)}
        <div class="curve-legend">
          ${STAGES.map((s) => `<div class="${s.level === stage.level ? "active" : ""}">${s.name}</div>`).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderCurve(activeLevel) {
  /* Curved SVG line with 5 dots. Active dot is enlarged and highlighted. */
  const width = 700, height = 160, pad = 40;
  const points = STAGES.map((s, i) => {
    const x = pad + ((width - pad * 2) * i) / 4;
    /* Rising curve: y decreases (higher on screen) as level increases */
    const t = i / 4;
    const y = height - pad - (Math.pow(t, 1.4) * (height - pad * 2));
    return { x, y, stage: s };
  });
  const path = "M " + points.map((p, i) => (i === 0 ? `${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");

  return `
    <svg class="curve-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" aria-label="Maturity curve">
      <defs>
        <linearGradient id="curveGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#EF4444"/>
          <stop offset="25%" stop-color="#F59E0B"/>
          <stop offset="55%" stop-color="#38BDF8"/>
          <stop offset="80%" stop-color="#194BFB"/>
          <stop offset="100%" stop-color="#7B4FFF"/>
        </linearGradient>
      </defs>
      <path d="${path}" stroke="url(#curveGrad)" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.65"/>
      ${points.map((p) => {
        const active = p.stage.level === activeLevel;
        const r = active ? 14 : 7;
        return `
          <circle cx="${p.x}" cy="${p.y}" r="${r + 8}" fill="${p.stage.color}" opacity="${active ? 0.20 : 0}"/>
          <circle cx="${p.x}" cy="${p.y}" r="${r}" fill="${p.stage.color}" stroke="white" stroke-width="${active ? 3 : 2}"/>
          ${active ? `<text x="${p.x}" y="${p.y - r - 12}" text-anchor="middle" fill="white" font-size="12" font-weight="700" letter-spacing="0.06em">YOU</text>` : ""}
        `;
      }).join("")}
    </svg>
  `;
}

function renderCategoryCard(categoryScores) {
  return `
    <details class="card categories-card">
      <summary class="details-summary">
        <div class="details-heading">
          <div class="eyebrow">Category breakdown</div>
          <h3>How you scored across the 6 dimensions</h3>
        </div>
        <span class="details-caret" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </summary>
      <div class="details-body">
        <p class="sub">Organizations rarely mature evenly. Your weakest dimension is where the biggest gains live.</p>
        ${categoryScores.map((cat) => `
          <div class="category-row">
            <div class="category-name">${cat.name}</div>
            <div class="category-score">${cat.total}<span style="color:var(--text-muted);font-weight:500">/${cat.max}</span><span class="pct">${Math.round(cat.pct)}%</span></div>
            <div class="category-bar"><div class="category-bar-fill stage-${cat.stage.level}" style="width:${Math.max(6, cat.pct)}%"></div></div>
            <div class="category-label"><span class="tag">${cat.stage.name}</span></div>
          </div>
        `).join("")}
      </div>
    </details>
  `;
}

function renderNextStepsCard(weakestCategory) {
  return `
    <div class="card next-steps-card">
      <div class="eyebrow">Your next steps</div>
      <div class="priority-header">
        <span class="priority-tag">Priority</span>
        <h3 style="margin:0">${weakestCategory.name}</h3>
      </div>
      <p class="sub">This category scored lowest (${Math.round(weakestCategory.pct)}%). Focus here for the biggest lift.</p>

      <ul class="steps-list">
        ${weakestCategory.steps.slice(0, 6).map((s) => `<li><div class="step-body"><span class="step-text">${stepText(s)}</span>${stepReadHtml(s)}</div></li>`).join("")}
      </ul>
    </div>
  `;
}

function renderGapsCard(weakestQuestions) {
  if (weakestQuestions.length === 0) {
    return `
      <div class="card">
        <div class="eyebrow">Specific gaps to address</div>
        <h3>No individual questions scored in the weakest band</h3>
        <p class="sub" style="margin-bottom:0">
          You didn't score 1 or 2 on any single question. Your gains from here will come from tightening the strong areas and pushing to the next level.
        </p>
      </div>
    `;
  }
  const MAX = 5;
  const total = weakestQuestions.length;
  const shown = weakestQuestions.slice(0, MAX);

  return `
    <details class="card gaps-card">
      <summary class="details-summary">
        <div class="details-heading">
          <div class="eyebrow">Specific gaps to address</div>
          <h3>Lowest scoring questions</h3>
        </div>
        <span class="details-caret" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </summary>
      <div class="details-body">
        <p class="sub">
          ${total > MAX
            ? `Showing the ${MAX} lowest of ${total} — each is a discrete, actionable place to start.`
            : "Each of these is a discrete, actionable place to start."}
        </p>
        ${shown.map((wq) => {
          const cat = CATEGORIES.find((c) => c.key === wq.q.category);
          return `
            <div class="gap-item">
              <div class="gap-cat">${cat.short}</div>
              <div class="gap-q">${wq.q.q}</div>
              <div class="gap-advice">${wq.q.weakAdvice}</div>
            </div>
          `;
        }).join("")}
      </div>
    </details>
  `;
}

function renderContactCta() {
  return `
    <div class="cta-card">
      <div class="cta-content">
        <h3>Uplevel your experimentation program.</h3>
        <p>Chat with an Amplitude + Statsig expert today. We'll help you turn these next steps into a concrete plan — tooling, templates, and workshops tailored to where you are.</p>
      </div>
      <a class="cta-btn" href="https://www.statsig.com/contact/us?source=expmaturitytool" target="_blank" rel="noopener">Chat with an expert →</a>
    </div>
  `;
}

function renderActionsBar() {
  return `
    <div class="actions-bar">
      <button class="btn btn-primary" id="downloadPdfBtn">Download PDF</button>
      <button class="btn btn-outline" id="shareLinkBtn">Copy share link</button>
      <button class="btn btn-ghost" id="retakeBtn">Retake assessment</button>
    </div>
  `;
}

function wireActions() {
  const pdfBtn = document.getElementById("downloadPdfBtn");
  const shareBtn = document.getElementById("shareLinkBtn");
  const retakeBtn = document.getElementById("retakeBtn");

  if (pdfBtn) pdfBtn.onclick = downloadPdf;
  if (shareBtn) shareBtn.onclick = copyShareLink;
  if (retakeBtn) retakeBtn.onclick = retake;
}

/* --------------------- Actions --------------------- */

function downloadPdf() {
  const btn = document.getElementById("downloadPdfBtn");
  const original = btn.textContent;
  btn.textContent = "Preparing…";
  btn.disabled = true;

  const container = buildPdfDocument();
  document.body.appendChild(container);

  const cleanup = () => {
    container.remove();
    btn.textContent = original;
    btn.disabled = false;
  };

  const opts = {
    margin: [12, 12, 14, 12],
    filename: `experimentation-maturity-${(state.industry || "results").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff", windowWidth: 820 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["css", "legacy"], avoid: [".pdf-avoid-break"] },
  };

  if (typeof html2pdf === "undefined") {
    cleanup();
    window.print();
    return;
  }

  html2pdf().set(opts).from(container).save()
    .then(cleanup)
    .catch(() => { cleanup(); window.print(); });
}

/* Builds a print-friendly DOM node containing the full results report.
   Rendered off-screen with inline styles so it survives html2canvas
   rasterization cleanly (no gradient text, no CSS filters, no <details>
   collapse state, no oklch()/backdrop-filter). */
function buildPdfDocument() {
  const overall = computeOverall();
  const stage = computeStage(overall.pct);
  const cats = computeCategoryScores();
  const weakest = [...cats].sort((a, b) => a.pct - b.pct)[0];
  const weakQs = findWeakestQuestions().slice(0, 5);
  const today = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  const wrap = document.createElement("div");
  wrap.setAttribute("aria-hidden", "true");
  wrap.style.cssText = "position:absolute;left:-9999px;top:0;width:800px;background:#ffffff;";

  const stageColor = { 1: "#EF4444", 2: "#F59E0B", 3: "#38BDF8", 4: "#194BFB", 5: "#7B4FFF" }[stage.level];

  wrap.innerHTML = `
    <style>
      .pdf-doc, .pdf-doc * { box-sizing: border-box; font-family: 'Inter', -apple-system, 'Helvetica Neue', Arial, sans-serif; color: #0B0D17; }
      .pdf-doc { width: 800px; padding: 28px 32px; background: #ffffff; line-height: 1.5; }
      .pdf-header { display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 14px; border-bottom: 2px solid #0B0D17; margin-bottom: 24px; }
      .pdf-brand { font-weight: 800; font-size: 20px; letter-spacing: -0.02em; color: #0B0D17; }
      .pdf-brand small { display: block; font-weight: 500; font-size: 11px; letter-spacing: 0.10em; text-transform: uppercase; color: #5F6473; margin-top: 4px; }
      .pdf-meta { text-align: right; font-size: 11px; color: #5F6473; line-height: 1.5; }
      .pdf-meta strong { color: #0B0D17; font-weight: 600; }

      .pdf-hero { padding: 28px 28px 24px; border-radius: 14px; background: #0B0D17; color: #ffffff; margin-bottom: 24px; page-break-inside: avoid; }
      .pdf-hero-eyebrow { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.65); font-weight: 600; margin-bottom: 6px; }
      .pdf-hero-stage { font-size: 42px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.15; padding-bottom: 4px; color: #ffffff; margin: 0 0 12px; }
      .pdf-hero-score { display: flex; align-items: baseline; gap: 10px; margin: 0 0 16px; }
      .pdf-hero-score .num { font-size: 40px; font-weight: 800; line-height: 1; color: #ffffff; letter-spacing: -0.02em; }
      .pdf-hero-score .of { font-size: 15px; color: rgba(255,255,255,0.7); font-weight: 500; }
      .pdf-hero-score .pct { margin-left: auto; padding: 4px 12px; background: rgba(255,255,255,0.14); color: #ffffff; border-radius: 999px; font-size: 12px; font-weight: 600; }
      .pdf-hero-desc { font-size: 13px; line-height: 1.6; color: rgba(255,255,255,0.88); margin: 0 0 20px; }
      .pdf-curve { display: flex; align-items: center; gap: 6px; padding: 14px 16px; background: rgba(255,255,255,0.06); border-radius: 10px; border: 1px solid rgba(255,255,255,0.10); }
      .pdf-curve-stage { flex: 1; text-align: center; font-size: 10px; font-weight: 700; letter-spacing: 0.10em; text-transform: uppercase; color: rgba(255,255,255,0.55); padding: 6px 0; border-radius: 6px; }
      .pdf-curve-stage.active { color: #ffffff; background: ${stageColor}; }
      .pdf-curve-sep { color: rgba(255,255,255,0.35); font-size: 10px; }

      .pdf-section { margin-bottom: 28px; page-break-inside: avoid; }
      .pdf-section h2 { font-size: 20px; font-weight: 700; letter-spacing: -0.015em; margin: 0 0 4px; color: #0B0D17; }
      .pdf-section .lede { font-size: 12px; color: #5F6473; margin: 0 0 14px; }

      .pdf-cats { border: 1px solid #E8EAF0; border-radius: 12px; overflow: hidden; }
      .pdf-cat-row { display: grid; grid-template-columns: 1fr 90px; gap: 4px 12px; padding: 12px 16px; border-top: 1px solid #E8EAF0; align-items: center; page-break-inside: avoid; }
      .pdf-cat-row:first-child { border-top: none; }
      .pdf-cat-name { font-weight: 600; font-size: 13px; color: #0B0D17; }
      .pdf-cat-score { text-align: right; font-size: 13px; font-weight: 700; color: #0B0D17; font-variant-numeric: tabular-nums; }
      .pdf-cat-score span { color: #5F6473; font-weight: 500; margin-left: 6px; }
      .pdf-cat-bar { grid-column: 1 / -1; height: 7px; background: #F0F2F8; border-radius: 999px; overflow: hidden; }
      .pdf-cat-bar-fill { height: 100%; border-radius: 999px; }
      .pdf-cat-tag { grid-column: 1 / -1; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #5F6473; padding-top: 4px; }

      .pdf-priority { display: inline-block; padding: 3px 10px; background: #0B0D17; color: #ffffff; font-size: 10px; font-weight: 700; letter-spacing: 0.10em; text-transform: uppercase; border-radius: 999px; margin-right: 10px; vertical-align: middle; }
      .pdf-steps { padding: 0; margin: 0; list-style: none; }
      .pdf-step { padding: 12px 14px; margin-bottom: 8px; background: #FAFBFD; border: 1px solid #E8EAF0; border-radius: 10px; page-break-inside: avoid; display: flex; gap: 12px; align-items: flex-start; }
      .pdf-step::before { content: ""; flex: none; width: 6px; height: 6px; border-radius: 50%; background: #0B0D17; margin-top: 7px; }
      .pdf-step-body { flex: 1; min-width: 0; }
      .pdf-step-text { font-size: 13px; line-height: 1.55; color: #23263A; }
      .pdf-step-reads { margin-top: 8px; font-size: 11px; color: #5F6473; line-height: 1.6; }
      .pdf-step-reads a { color: #0B0D17; text-decoration: none; word-break: break-word; }
      .pdf-step-reads a strong { font-weight: 700; }
      .pdf-step-reads .sep { color: #C7CBD8; margin: 0 6px; }

      .pdf-gap { padding: 10px 12px 12px; margin-bottom: 8px; border-left: 3px solid #F59E0B; background: #FFFBEB; border-radius: 6px; page-break-inside: avoid; }
      .pdf-gap-cat { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #5F6473; margin-bottom: 2px; }
      .pdf-gap-q { font-size: 12px; font-weight: 600; color: #0B0D17; margin-bottom: 6px; }
      .pdf-gap-a { font-size: 12px; color: #23263A; line-height: 1.55; }

      .pdf-cta { margin-top: 24px; padding: 18px 22px; border-radius: 12px; background: #0B0D17; color: #ffffff; page-break-inside: avoid; }
      .pdf-cta h3 { margin: 0 0 6px; font-size: 16px; font-weight: 700; color: #ffffff; }
      .pdf-cta p { margin: 0 0 8px; font-size: 12px; color: rgba(255,255,255,0.8); }
      .pdf-cta a { color: #C7D2FE; font-size: 12px; font-weight: 600; text-decoration: none; word-break: break-all; }

      .pdf-footer { margin-top: 18px; padding-top: 12px; border-top: 1px solid #E8EAF0; font-size: 10px; color: #9AA0B4; text-align: center; }
    </style>

    <div class="pdf-doc">
      <div class="pdf-header pdf-avoid-break">
        <div class="pdf-brand">
          Statsig
          <small>Experimentation Maturity Assessment</small>
        </div>
        <div class="pdf-meta">
          <div><strong>Industry:</strong> ${esc(state.industry) || "—"}</div>
          <div><strong>Company size:</strong> ${esc(state.size) || "—"}</div>
          <div>${today}</div>
        </div>
      </div>

      <div class="pdf-hero pdf-avoid-break">
        <div class="pdf-hero-eyebrow">Your experimentation maturity</div>
        <div class="pdf-hero-stage">${esc(stage.name)}</div>
        <div class="pdf-hero-score">
          <span class="num">${overall.total}</span>
          <span class="of">/ ${overall.max}</span>
          <span class="pct">${Math.round(overall.pct)}%</span>
        </div>
        <div class="pdf-hero-desc">${esc(stage.desc)}</div>
        <div class="pdf-curve">
          ${STAGES.map((s, i) => `
            ${i > 0 ? '<span class="pdf-curve-sep">›</span>' : ""}
            <div class="pdf-curve-stage${s.level === stage.level ? " active" : ""}">${esc(s.name)}</div>
          `).join("")}
        </div>
      </div>

      <div class="pdf-section pdf-avoid-break">
        <h2>Category breakdown</h2>
        <p class="lede">How you scored across the ${CATEGORIES.length} dimensions.</p>
        <div class="pdf-cats">
          ${cats.map((c) => `
            <div class="pdf-cat-row">
              <div class="pdf-cat-name">${esc(c.name)}</div>
              <div class="pdf-cat-score">${c.total}<span>/ ${c.max}</span></div>
              <div class="pdf-cat-bar"><div class="pdf-cat-bar-fill" style="width:${Math.max(6, c.pct)}%;background:${c.stage.color}"></div></div>
              <div class="pdf-cat-tag">${esc(c.stage.name)} · ${Math.round(c.pct)}%</div>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="pdf-section">
        <h2><span class="pdf-priority">Priority</span>${esc(weakest.name)}</h2>
        <p class="lede">This category scored lowest (${Math.round(weakest.pct)}%). Focus here for the biggest lift.</p>
        <ul class="pdf-steps">
          ${weakest.steps.slice(0, 6).map((s) => {
            const t = stepText(s);
            const reads = (typeof s === "object" && s.read) ? s.read : [];
            const readsHtml = reads.length
              ? `<div class="pdf-step-reads"><strong>Read:</strong> ${reads.map((r) => `<a href="${esc(r.url)}">${esc(r.title)}</a>`).join('<span class="sep">·</span>')}</div>`
              : "";
            return `<li class="pdf-step"><div class="pdf-step-body"><div class="pdf-step-text">${esc(t)}</div>${readsHtml}</div></li>`;
          }).join("")}
        </ul>
      </div>

      ${weakQs.length > 0 ? `
        <div class="pdf-section">
          <h2>Specific gaps to address</h2>
          <p class="lede">${weakQs.length === 1 ? "1 question" : `${weakQs.length} questions`} scored in the lowest band. Each is a discrete, actionable place to start.</p>
          ${weakQs.map((wq) => {
            const cat = CATEGORIES.find((c) => c.key === wq.q.category);
            return `
              <div class="pdf-gap">
                <div class="pdf-gap-cat">${esc(cat.short)}</div>
                <div class="pdf-gap-q">${esc(wq.q.q)}</div>
                <div class="pdf-gap-a">${esc(wq.q.weakAdvice)}</div>
              </div>
            `;
          }).join("")}
        </div>
      ` : ""}

      <div class="pdf-cta pdf-avoid-break">
        <h3>Uplevel your experimentation program.</h3>
        <p>Chat with an Amplitude + Statsig expert — we'll help turn these next steps into a concrete plan.</p>
        <a href="https://www.statsig.com/contact/us?source=expmaturitytool">statsig.com/contact/us?source=expmaturitytool</a>
      </div>

      <div class="pdf-footer">
        Generated with the Experimentation Maturity Assessment · kennethkutyn.github.io/experimentation-maturity
      </div>
    </div>
  `;
  return wrap;
}

function copyShareLink() {
  const btn = document.getElementById("shareLinkBtn");
  const original = btn.textContent;
  const url = window.location.origin + window.location.pathname + encodeUrl();
  const done = () => {
    btn.textContent = "Copied ✓";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove("copied");
    }, 1800);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(done, () => fallbackCopy(url, done));
  } else {
    fallbackCopy(url, done);
  }
}

function fallbackCopy(text, cb) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed"; ta.style.top = "-1000px";
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand("copy"); cb(); }
  catch (e) { window.prompt("Copy this link:", text); }
  document.body.removeChild(ta);
}

function retake() {
  state.step = 0;
  state.industry = null;
  state.size = null;
  state.answers = new Array(QUESTIONS.length).fill(null);
  state.benchmark = false;
  history.replaceState(null, "", window.location.pathname);
  showScreen(0);
}

/* Placeholder — real POST endpoint will be added later. */
function submitBenchmark() {
  /* eslint-disable no-unused-vars */
  const payload = {
    industry: state.industry,
    size: state.size,
    answers: state.answers,
    submittedAt: new Date().toISOString(),
    version: "1.0",
  };
  /* Wire when backend is ready:
     fetch("/api/benchmark", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(payload),
     }).catch(() => {});
  */
}

/* --------------------- App controller --------------------- */

const app = {
  start() {
    state.step = STEP_KEYS.INDUSTRY;
    renderIndustry();
    showScreen(state.step);
  },

  next() {
    if (state.step === STEP_KEYS.INDUSTRY) {
      if (!state.industry) return;
      state.step = STEP_KEYS.SIZE;
      renderSize();
      showScreen(state.step);
      return;
    }
    if (state.step === STEP_KEYS.SIZE) {
      if (!state.size) return;
      state.step = STEP_KEYS.FIRST_QUESTION;
      renderQuestion();
      showScreen(state.step);
      return;
    }
  },

  back() {
    if (state.step === STEP_KEYS.INDUSTRY) {
      state.step = STEP_KEYS.WELCOME;
      showScreen(state.step);
      return;
    }
    if (state.step === STEP_KEYS.SIZE) {
      state.step = STEP_KEYS.INDUSTRY;
      renderIndustry();
      showScreen(state.step);
      return;
    }
    if (state.step === STEP_KEYS.FIRST_QUESTION) {
      state.step = STEP_KEYS.SIZE;
      renderSize();
      showScreen(state.step);
      return;
    }
    if (state.step === STEP_KEYS.SUBMIT) {
      state.step = STEP_KEYS.SUBMIT - 1;
      renderQuestion();
      showScreen(state.step);
      return;
    }
    if (state.step === STEP_KEYS.RESULTS) {
      state.step = STEP_KEYS.SUBMIT;
      renderSubmit();
      showScreen(state.step);
      return;
    }
    /* Middle of the questions */
    state.step -= 1;
    renderQuestion();
    showScreen(state.step);
  },

  showResults() {
    if (state.answers.some((a) => a === null)) return;
    state.step = STEP_KEYS.RESULTS;
    renderResults();
    showScreen(state.step);
  },
};

window.app = app;

/* --------------------- Boot --------------------- */

function renderAdminView(root) {
  root.innerHTML = CATEGORIES.map((cat) => {
    const catQuestions = QUESTIONS.filter((q) => q.category === cat.key);
    return `
      <section class="admin-category">
        <div class="admin-cat-head">
          <span class="admin-cat-badge">${cat.short}</span>
          <h2>${cat.name}</h2>
          <div class="admin-cat-meta">Questions ${cat.questionIds.join(", ")}</div>
        </div>

        <div class="admin-section">
          <div class="eyebrow">Questions in this category</div>
          ${catQuestions.map((q) => renderAdminQuestion(q)).join("")}
        </div>

        <div class="admin-section">
          <div class="eyebrow">Category-level next steps</div>
          <p class="sub">Shown on the results page when this is the user's weakest-scoring category (up to 6 items).</p>
          <ol class="admin-steps">
            ${cat.steps.map((s) => `<li>${stepText(s)}${stepReadHtml(s)}</li>`).join("")}
          </ol>
        </div>
      </section>
    `;
  }).join("");
}

function renderAdminQuestion(q) {
  return `
    <div class="admin-question">
      <div class="admin-q-head">
        <span class="admin-q-num">Q${q.id}</span>
        <div class="admin-q-text">${q.q}</div>
      </div>
      <ol class="admin-options">
        ${q.options.map((opt, i) => `
          <li>
            <span class="admin-opt-score">${i + 1}</span>
            <span class="admin-opt-text">${opt}</span>
          </li>
        `).join("")}
      </ol>
      <div class="admin-gap-advice">
        <div class="admin-gap-label">If scored 1 or 2</div>
        <p>${q.weakAdvice}</p>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  /* Header shadow on scroll (both pages) */
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".header");
    if (header) header.classList.toggle("scrolled", window.scrollY > 6);
  }, { passive: true });

  /* Delegated click handler for [data-action] buttons — avoids inline onclick
     so a strict CSP with script-src 'self' (no 'unsafe-inline') will work. */
  document.addEventListener("click", (e) => {
    const target = e.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;
    if (app && typeof app[action] === "function") app[action]();
  });

  /* Admin view mode */
  const adminRoot = document.getElementById("adminRoot");
  if (adminRoot) {
    renderAdminView(adminRoot);
    return;
  }

  /* Main assessment mode */
  if (!document.getElementById("screen-welcome")) return;

  /* Try to load stateless results from URL */
  if (tryLoadFromUrl()) {
    renderResults();
    showScreen(STEP_KEYS.RESULTS);
    return;
  }

  showScreen(STEP_KEYS.WELCOME);
});
