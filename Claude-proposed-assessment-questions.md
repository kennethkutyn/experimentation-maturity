# Experimentation Maturity Assessment — Proposed Questions (v1)

A working draft of 20 diagnostic questions designed to place a company on the
experimentation maturity spectrum without feeling like a quiz. Questions are
organized into seven dimensions synthesized from the source material:

- Stefan Thomke / HBS — 5 stages (Awareness → Embeddedness) + 7 cultural attributes
- Ronny Kohavi — 4 stages (Hubris → Fundamental Understanding), OEC, hierarchy of evidence
- Conversion.com — 5 stages (Reactive → Optimized) × 4 areas (Goals, Delivery/Process, Strategy/Culture, Data/Tools)
- Bain — Crawl / Walk / Run + Testing focus, Process, People & skills, Technology & tools
- Statsig (Yuzheng Sun) — Simple + Trustworthy; compounding growth = rate ^ turns

Answer options are ordered from **least mature (1)** to **most mature (5)** so a
simple 1–5 scoring model works out of the box, but the tool is diagnostic first,
scoring second. Every question maps to a stage in at least one of the reference
frameworks (mapping shown in italics).

---

## Dimension 1 — Strategy & Business Alignment

### 1. How connected are your experiments to broader business strategy?
1. Experiments are ad hoc, driven by whoever has an idea that week.
2. Some experiments align with team OKRs, but most are opportunistic.
3. Experiments are tied to team-level goals and product roadmaps.
4. Experiments ladder up to company-wide objectives and strategic bets.
5. Company strategy itself is shaped by an ongoing portfolio of experiments.

*Maps to: Conversion "Experiment Goals" area; Bain "Alignment to strategic value."*

### 2. What percentage of significant product, marketing, or UX launches are validated with a controlled experiment before full rollout?
1. Under 10% — most things ship on intuition.
2. 10–25%.
3. 25–50%.
4. 50–80%.
5. Over 80% — shipping without a test is the exception, not the norm.

*Maps to: Thomke "Commitment → Embeddedness"; Kohavi "Fundamental Understanding."*

### 3. Where in your organization does experimentation happen today?
1. One team or one channel (usually product or growth).
2. 2–3 teams; other areas ship without testing.
3. Product + marketing + parts of engineering.
4. Most digital surfaces — web, app, email, notifications, backend/ranking.
5. Everywhere digital and increasingly offline — pricing, support, sales scripts, physical experience.

*Maps to: Conversion "Integrated → Optimized"; Bain "Breadth of channels tests are run across."*

---

## Dimension 2 — Leadership & Culture

### 4. How would you describe leadership's engagement with experimentation?
1. Leadership rarely engages; the "highest paid person's opinion" (HiPPO) typically wins.
2. A few executives are supportive, but most decisions still bypass testing.
3. Leadership accepts experiments for tactical decisions; strategy is set top-down.
4. Leadership actively cites experiment results and expects tests before major launches.
5. Experimentation is a stated company value; leaders' own ideas are subject to test like anyone else's.

*Maps to: Thomke "Humility" attribute; Kohavi "Semmelweis Reflex."*

### 5. When an experiment result contradicts a senior leader's intuition, what usually happens?
1. The team ships the leader's version anyway.
2. There's a debate, but seniority usually wins.
3. The team runs a follow-up to "double-check" the surprising result.
4. The team accepts the data and adjusts the plan.
5. Leadership publicly celebrates the surprise as a learning moment.

*Maps to: Kohavi "Accept Results / Semmelweis Reflex"; Thomke "Even the boss's assumptions are tested."*

### 6. How does your organization treat experiments that fail (i.e., don't move the metric)?
1. Failed tests are seen as wasted effort; teams avoid running risky ones.
2. Failures are quietly shelved; only wins get shared.
3. Failures are documented, but rarely reviewed by others.
4. Failures are treated as valuable learnings and shared broadly.
5. Failure rates are actively tracked and celebrated — a low failure rate is a red flag that we're not being bold enough.

*Maps to: Statsig "80% of hypotheses are wrong"; Kohavi "Bing 15% success rate"; Thomke "learning mindset."*

### 7. How would you describe experimentation literacy across teams (PMs, engineers, designers, marketers)?
1. Most people can't explain what an A/B test does or why randomization matters.
2. Product teams are literate; other functions are not.
3. Product and data teams are strong; marketing and CX are catching up.
4. Most functions can design and interpret their own tests with light support.
5. Experimentation vocabulary and rigor are shared fluency across all functions.

*Maps to: Bain "People & skills — MVP mindset, value-focused mindset, test analytics."*

---

## Dimension 3 — Volume & Velocity

### 8. Roughly how many controlled experiments does your organization run per month?
1. 0–1 (ad hoc, sporadic).
2. 2–5.
3. 6–20.
4. 20–100.
5. 100+ (multiple concurrent experiments per team per week).

*Maps to: Bain "Crawl (infrequent) → Run (100s per quarter)"; Statsig "5 to 5,000 annually."*

### 9. From "we have an idea" to "the test is live in production," how long does a typical experiment take?
1. Months — every test is a bespoke project.
2. 3–6 weeks.
3. 1–2 weeks.
4. A few days.
5. Hours — self-serve setup with lightweight review.

*Maps to: Conversion "Velocity"; Bain "testing velocity uplift" case studies.*

### 10. How often do teams run more than one experiment against the same surface or feature (iterative sequences vs. one-and-done)?
1. Never — we test once and move on.
2. Occasionally, when results are inconclusive.
3. Frequently for high-value surfaces, rarely elsewhere.
4. Most meaningful features go through 2–3 iterations informed by prior test results.
5. Continuous iteration is the norm — surfaces are treated as evolving hypotheses.

*Maps to: Statsig "compounding growth = growth rate ^ turns"; Conversion "Optimized" stage.*

---

## Dimension 4 — Process & Methodology

### 11. How are experiment hypotheses generated and prioritized?
1. Whoever has an idea runs a test.
2. Ideas come from a backlog, but prioritization is informal.
3. We use a scoring framework (ICE, PIE, RICE, etc.), inconsistently.
4. We have a documented, standardized prioritization process used across teams.
5. Prioritization is data-driven, informed by prior test results, research, and impact estimates.

*Maps to: Conversion "Delivery and Process"; Bain "Test ideation, value-based prioritization."*

### 12. How rigorous is your typical experiment design (sample size, power, guardrails)?
1. We rarely calculate sample size; we stop tests when they "look right."
2. We check significance at the end but don't pre-plan.
3. We pre-calculate sample sizes and stopping rules for major tests.
4. Every experiment has a pre-registered design with primary, secondary, and guardrail metrics.
5. We use advanced methods (sequential testing, CUPED, variance reduction, heterogeneous treatment effects) to increase power and reduce false positives.

*Maps to: Kohavi "Measurement and Control → Fundamental Understanding."*

### 13. How are experiment results documented and shared?
1. Results live in the head of whoever ran the test.
2. Results are shared in Slack or email, then forgotten.
3. We have a repository of write-ups, but search is manual.
4. There's a central, searchable knowledge base that teams actively reference.
5. Learnings feed automatically into a shared insights layer that informs future test design and strategy.

*Maps to: Conversion "cross-functional learning"; Bain "Insights and scaling."*

### 14. How do research and qualitative discovery feed into your experimentation pipeline?
1. We rarely do research; ideas come from meetings and intuition.
2. Research is done ad hoc when a specific question arises.
3. We do periodic research sprints that inform quarterly test plans.
4. Research and experimentation are tightly coupled — quant and qual continuously feed each other.
5. "Always-on" research (surveys, interviews, behavioral analytics) constantly seeds the experiment pipeline (Mixed Methods).

*Maps to: Conversion "Data & Tools — research maturity"; Mixed Methods framework.*

---

## Dimension 5 — Metrics & Measurement

### 15. Do you have a defined Overall Evaluation Criterion (OEC) or primary success metric for experiments?
1. No — success is judged case by case.
2. Individual teams define their own metrics per test.
3. We have a documented primary metric per product area.
4. We have a company-wide OEC balancing multiple business outcomes.
5. Our OEC evolves based on meta-analyses of prior experiments and long-term validation.

*Maps to: Kohavi "Bing OEC — revenue, relevance, user satisfaction."*

### 16. How do you handle guardrail metrics (things you don't want to hurt)?
1. We don't formally track them.
2. We eyeball obvious ones (revenue, retention) after the fact.
3. Every experiment has a defined set of guardrail metrics.
4. Guardrails are automated with alerts and auto-shutoff for severe regressions.
5. We monitor trust metrics (SRM, novelty, primacy) and long-term holdout effects continuously.

*Maps to: Kohavi "trustworthy experimentation"; Statsig "Trustworthy."*

### 17. What types of metrics do experiments most often move?
1. Surface-level UI/UX or vanity metrics (clicks, page views).
2. Conversion at a single funnel step.
3. End-to-end funnel and short-term revenue.
4. Retention, LTV, and behavioral north-star metrics.
5. Long-term causal metrics validated through holdouts and downstream measurement.

*Maps to: Bain "Behavioral over UX/Functionality"; shift from output to outcome.*

---

## Dimension 6 — Tools & Infrastructure

### 18. Which best describes your experimentation platform?
1. Manual code branches or no dedicated tooling.
2. Basic A/B testing tool used by one team.
3. Dedicated feature-flag / experimentation platform used by some teams.
4. Enterprise platform used company-wide with SDKs across web, mobile, backend.
5. Integrated platform with automated analysis, decisioning, and personalization built in (or a mature in-house build).

*Maps to: Conversion "Data and Tools"; Bain "Optimization software."*

### 19. How integrated is your experimentation platform with your analytics and data stack?
1. Not integrated — results live in silos.
2. Manual data pulls for post-hoc analysis.
3. Basic integration; experiment data lands in the warehouse.
4. Full integration; experiment metrics are automatically derived from a governed metric layer.
5. Bidirectional — experiment results feed personalization models, ML systems, and downstream decisioning.

*Maps to: Bain "Analytical platform"; Conversion "integrated tech stack."*

### 20. What kinds of experiments can your infrastructure support today?
1. Simple front-end A/B tests.
2. Server-side A/B tests on key flows.
3. MVTs and holdouts across product areas.
4. Multi-armed bandits, switchbacks, quasi-experiments.
5. Full personalization, contextual bandits, and causal ML at scale.

*Maps to: Bain "A/B → MVT → Bandit → Contextual Bandit spectrum."*

---

## Scoring / diagnostic notes

- **Sum** = 20–100. Rough banding:
  - 20–35: **Reactive / Crawl / Awareness** — no formal program
  - 36–55: **Emerging / Belief** — pockets of practice, no system
  - 56–75: **Strategic / Walk / Commitment** — real program, uneven
  - 76–90: **Integrated / Run / Diffusion** — company-wide muscle
  - 91–100: **Optimized / Embeddedness** — competitive advantage
- **Per-dimension scoring is more useful than the total.** Almost every source
  warns that organizations mature unevenly — a company can be Strategic on
  goals but Reactive on tools. Show a radar chart, not just a number.
- **The three dimensions that predict future maturity best** (per Kohavi, Thomke,
  and Bain's Airline case): Leadership & Culture (Dim 2), Metrics & Measurement
  (Dim 5), and Volume & Velocity (Dim 3). Consider weighting or spotlighting.

## Notes on question design

- Every question has a **clearly observable** answer — no "on a scale of 1–10 how
  data-driven are you?" abstractions.
- Volume/velocity questions use **concrete ranges** rather than adjectives.
- Culture questions use **behavioral scenarios** ("when a result contradicts a
  leader…") rather than self-assessment ("how humble is leadership?"), which
  reduces flattering bias.
- Tools/infra questions describe **capabilities** rather than vendor names, so
  the assessment stays vendor-neutral and Amplitude/Statsig positioning happens
  in the follow-up.

## Open questions for the product

1. Should we ask **one question per dimension first** (a fast 7-question triage)
   and then unlock the deeper set? Would shorten time-to-value.
2. Should we ask for **industry and company size** up front so we can benchmark
   the score against peers? This is the #1 thing Bain and Conversion do
   differently from academic models.
3. Should we surface **"what to do next"** recommendations tied to the weakest
   dimension (e.g., "Your infra is Reactive — start here"), which is the whole
   point of the Conversion model?
4. Do we want a question specifically about **safe deployment / feature flags
   decoupled from experiments**? Kohavi calls this a key accelerator; it may be
   too niche for question #20 but could be a great follow-up.
