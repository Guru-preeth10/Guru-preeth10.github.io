# Gurupreeth H — Portfolio

A cinematic, dark-theme portfolio framed as a camera viewfinder — built for an AI/ML engineering student with a minor in Film Direction.

**Live:** https://guru-preeth10.github.io

## Highlights

- **Film-leader preloader** — 3 · 2 · 1 countdown with a sweeping hand, then the shutters open.
- **Viewfinder HUD** — REC indicator, a running 24 fps timecode, a scene slate that follows your scroll position, and a frame-strip progress bar.
- **Raw WebGL hero** — a domain-warped noise "light leak", an anamorphic lens flare that follows the pointer, film grain and gate weave. One full-screen triangle, no 3D library.
- **Pinned horizontal "scenes"** — each project comes with a live mini-visual:
  - LLM Safety Gateway: a replay of prompts moving through the RITD → NCD → LDF pipeline
  - Mini OS Simulator: a working Gantt chart computing FCFS / SJF / Round Robin / Priority schedules
  - Smart Finance Advisor: a `docker compose up` terminal with a container diagram
  - RVU Bites: an interactive Android phone mockup
- **Festival circuit** — hackathons shown as film-festival laurels.
- **End credits** — contact info and a rolling credits sequence.

## Stack

React 19 · TypeScript · Vite · GSAP + ScrollTrigger · Lenis · WebGL (GLSL)
Type: Bricolage Grotesque, Instrument Serif, Geist, JetBrains Mono

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

Content lives in [`src/data.ts`](src/data.ts). Edit it to update projects, skills or links.
Every push to `main` deploys to GitHub Pages through `.github/workflows/deploy.yml`.

Respects `prefers-reduced-motion`, works without WebGL, and is fully responsive.
