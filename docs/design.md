# Nazomachi World — Design Document

DevFest GDGoC Japan Hackathon 2026 / Team Mirai Craft (DF-2026-T208, Osaka)
Category: Entertainment (primary) × Tourism (secondary)
Theme: "Own the Why, Build with Intent."

## 1. Product concept

Pick a real place, and an AI-generated mystery that can only happen *there* unfolds.
Players investigate inside real Street View imagery, collect clues at real spots,
ask the AI game master (GM) for staged hints, deduce the culprit and the trick,
and in the solution chapter the **real history of the town** is revealed together
with the truth. A play session ends with knowledge of a real place — play connects
to tourism and learning.

Problem: town-walking / tourism content is too expensive to produce, so it only
exists for famous destinations. Most towns stay "places where nothing happens",
which concentrates tourism on a few famous spots (overtourism), while people who
cannot travel (health, money, distance) never receive the travel experience at all.
Nazomachi World drives the production cost of a local experience to zero, so any
town can have its own story.

## 2. Game flow

1. Choose a place and a theme (detective / school / horror-tinged)
2. A mystery is generated for that place: intro, 5 real spots, clues, 3 suspects, the truth
3. Investigate in Street View, collecting one clue per spot
4. When stuck, ask the AI GM — hints come in stages (Lv.1–3) so nobody dead-ends
5. Deduce: pick the culprit *and* the trick
6. Solution chapter: the truth + "the town's real story" (real history, specialties, places)
7. Share the result by link — friends can challenge the same mystery

## 3. MVP scope (this submission)

### In
- **Home mode only (Street View)** — a demo that works 100% on a desk at the venue
- **Preset scenarios for 3 locations**: Osaka Umeda / Kyoto Gion / Tokyo Asakusa,
  each with 5 real spots, 3 suspects, a complete truth and a "real story" ending
- **Zero-latency generation**: all scenarios are pre-generated and shipped with the
  app, so a case starts instantly (no loading screen in front of judges)
- **Staged GM hints** (3 levels) + follow-up messages for right/wrong deductions
- **Deduction = culprit + trick** (two questions, so guessing one is not enough)
- **Share link** via URL parameters with a copy button
- Key visual generated from a prompt designed in an AI critique loop (Gemini)

### Out (with reasons — Own the Why)
- **Town mode (GPS check-in)**: cut for this submission. Verifying GPS behaviour
  (geofence radius, drift) cannot be done reliably from an indoor venue, and it
  would eat the time needed to polish the core mystery experience. Moved to the
  next roadmap, stated openly in the app and in this document.
- **Free-form place input**: cut. Unconstrained generation risks inventing places
  that do not exist (hallucination) and breaking scenario quality. Three curated
  locations guarantee every spot and fact is real.
- **Realtime image-based clue extraction**: cut. Sending Street View images to a
  vision model per clue costs latency and tokens, and Street View resolution is
  uneven. Clues are anchored to *arriving at a real spot*, not to reading small
  text in an image.
- **Accounts / backend DB**: cut. The MVP is a fully standalone static app; share
  state travels in the URL. Firebase is used for Hosting only.

## 4. Tech choices and trade-offs (Own the Why)

| Choice | Why this one | Alternative rejected, and why |
|---|---|---|
| Street View as the stage | The world's real scenery is already photographed; the stage is "discovered", not built. No equivalent asset exists | Shooting our own photos — only places we can visit would be playable; "anywhere in the world" disappears |
| Pre-generated scenarios (shipped data) | Zero latency in demos; quality is reviewable by humans before shipping; zero API cost | Full realtime generation — 30s–1min of silence per case in front of judges; unreviewable quality; API cost per play |
| Gemini as the scenario author (offline, in the design loop) | One model covers story writing, local-fact weaving and critique; scenarios were produced and refined in a Muse × Gemini critique loop during development | Human-written only — does not scale to many towns, which is the product's core claim |
| Places / real-spot anchoring | Every spot in a case is a real place ID / real name; facts in the solution chapter are real | Free invention by the model — breaks trust and the tourism connection |
| Firebase Hosting (Spark, free tier) | Google infrastructure as required; static hosting is enough for a backend-less MVP; zero running cost | Cloud Run backend — needs a billing account; unnecessary for shipped-data architecture |
| Keyless Maps embed | Works with no API key, no cost, no key leakage | Maps JavaScript API with a key — key management and billing risk for an MVP that only needs an embedded view |

Production vision (post-hackathon): a Cloud Run generation backend (API keys stay
server-side), Places API for spot grounding, Gemini for on-demand generation with
caching, Firestore for shared cases, and the GPS town mode.

## 5. Quality / safety design

- **No dead-ends**: staged GM hints guarantee every player can reach the ending
- **Two-layer UI only**: "map (place)" and "story (text)" — first-time mystery
  players cannot get lost
- **No personal data**: no accounts, no location is stored (town mode will be
  designed so user location never leaves the device to a server log)
- **Reality check on content**: scenarios are built only from real spots and
  verifiable local facts; the solution chapter separates fiction (the case)
  from fact (the town's real story)

## 6. Judging criteria map (8 items)

See the product document (submission) for the full self-assessment. Highlights:
Google tech (Street View / Maps / Firebase / Gemini in the loop), product quality
(complete playable loop, zero latency), social impact (tourism dispersion,
accessibility of travel), and explicit trade-off documentation (this file).

## 7. Submission checklist (deadline 2026-11-10 19:00 JST, per organizers' notice)

- [ ] Product explanation document
- [ ] Demo video
- [ ] Materials-use sheet (organizers' replaced sheet, 2026-11-07 version)
- [ ] Presentation slides (on-site venue)
- [x] Public URL live on Google infrastructure (Firebase Hosting, Spark plan): https://nazomachi-world-a3598.web.app — kept up until Regional Day 2026-11-14
- [x] GitHub repository updated (this repo)

## 8. Development process note

Built in an AI critique loop: Muse (chair/build/verify) × Gemini (design
critique, scope line-drawing, the Umeda scenario, key-visual prompt), with the
human team deciding the product (Nazomachi World) and giving the go-ahead.
Jules (Google's coding agent) was evaluated for GitHub-integrated work; it could
not be installed on this organization-owned repository without the org owner's
approval, so documentation was produced by the loop instead — recorded here as
part of the build log.

## Design references (checked on the live sites, 2026-11-09)

The station-sign direction was validated against real products rather than invented:

- **Tokyo Metro sign system** — colour + letter + number codes (e.g. G02) so identity never depends on colour alone. Nazomachi cases carry codes in the same grammar (UMD-01 / GIN-01 / ASK-01). Metro also linearises geography on route maps while keeping relative order — the same rule our route maps use.
- **Citymapper** — the map stays pale and only information gets coloured chips. Our investigation map follows this: pale schematic, saturated pins and route lines only.
- **SCRAP / Real Escape Game** — the site chrome stays black-and-white and colour lives in the event poster. Our UI is ink-and-paper with signal colours reserved for meaning; the per-case key illustration is treated as the "poster".
- **GeoGuessr** — the pin is both brand and core interaction. Our spot pins are the primary control of the investigation screen.
- **NAZOTOWN (mystery walking tours)** — conditions (time, difficulty, what to bring) are shown up front in labelled tables, and progress is shown as stamps. Our case cards carry the same numeric metadata (minutes / clues / difficulty) before play starts.

Common thread across all five: verifiable specifics (real names, codes, numbers) come first, decoration is rationed to one system, and operational traces (a trial mystery, notes, constraints) are shown instead of hidden. That is what removes the "AI-generated" feel, and it is also why the station-sign language fits this product: the game is about navigating real places, so the design borrows the real city's own navigation grammar.
