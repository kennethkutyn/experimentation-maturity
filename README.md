# Experimentation Maturity Assessment

A free, static web app that helps organizations diagnose the maturity of their
experimentation program across seven dimensions, including AI product
experimentation, and see tailored next steps.

Built as a lead-generation asset for Amplitude + Statsig.

**Live demo:** _add GitHub Pages URL once enabled_

## What it does

- Asks for industry and company size, then walks the user through 23 diagnostic
  questions across strategy, culture, velocity, process, metrics, tools, and
  AI product experimentation.
- Scores the response, places the org on a five-stage maturity curve
  (Reactive → Emerging → Strategic → Integrated → Optimized), and returns a
  per-category breakdown.
- Surfaces next steps for the weakest-scoring category and specific gap advice
  for the 5 lowest-scoring questions.
- Offers PDF download and a stateless shareable link (full state encoded in the
  URL hash; no backend needed).
- Includes an opt-in benchmark checkbox for community aggregation
  (submission endpoint is a stub; wire to your own backend).

## Structure

```
index.html          # Assessment app
admin.html          # Admin view of all questions + advice
app.js              # Data (questions, categories, stages) + all logic
styles.css          # Statsig.com-inspired styles
footer-pets.svg     # Footer illustration
README.md
```

Everything is a static file; no build step, no framework.

## Frameworks the assessment draws on

- Stefan Thomke (HBS): 5 stages: Awareness → Belief → Commitment → Diffusion → Embeddedness
- Ronny Kohavi: Hubris → Measurement & Control → Accept Results → Fundamental Understanding
- Conversion.com: Reactive → Emerging → Strategic → Integrated → Optimized
- Bain & Co: Crawl / Walk / Run + Testing focus, Process, People, Tools
- Statsig: "Simple + Trustworthy," compounding growth = growth rate ^ turns

## Local development

```bash
python3 -m http.server 4321
# open http://localhost:4321/
```

## Deployment

Designed for GitHub Pages. Enable Pages on the `main` branch (root) and the
site will be live at `https://<user>.github.io/experimentation-maturity/`.

## Wiring the benchmark endpoint

The opt-in benchmark submission is currently a no-op stub inside
`submitBenchmark()` in `app.js`. Uncomment the `fetch()` block and point it at
your endpoint. Payload is `{ industry, size, answers, submittedAt, version }`.
If the endpoint is on a different origin, add it to the `connect-src` directive
in the CSP meta tags in both HTML files.
