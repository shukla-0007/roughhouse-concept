# Rough House Media — 3D concept site

Sample redesign concept by Ayush Shukla. This is not the official Rough House Media website.

React + Vite + Three.js (React Three Fiber, drei), GSAP + ScrollTrigger, Lenis smooth scroll.

```bash
npm install
npm run dev   # http://localhost:5181
```

## Experience
1. **Loader**: a film-leader countdown.
2. **Hero / gallery wall**: a curved wall of 15 broadcast monitors (CRT shader with scanlines, chroma and power-on). The camera starts tight on one screen and pulls out to a wide shot as you scroll. Hovering a screen puts it "on air"; clicking one jumps to its section.
3. **Who we are**: the statement inks in word by word, with count-up stats.
4. **Three channels**: services as TV channels. Scroll or tap to retune, with a static burst between channels.
5. **The first hour**: a scroll-driven 60-minute crisis clock with a timeline and a mentions counter.
6. **The newsroom**: the team as camera feeds with lower-third straps, tilt and a bio on hover.
7. **Vox pops**: draggable testimonial cards.
8. **Clients**: a typographic list and a news-ticker crawl.
9. **Journal** and **contact**: links to the real blog posts, and an ON AIR sign.

The sample watermarks are the loader line, the fixed "SAMPLE" channel bug, the STAND BY monitor, the ticker, the footer, the page meta and the console.

## Content
All copy and images are set in `src/data.js`.

## Images
Photography from roughhousemedia.co.uk is bundled in `public/media/`. It is © Rough House Media and is included only to illustrate this concept pitch.

## Deploy
Pushing to `main` builds the site and publishes it to GitHub Pages via `.github/workflows/deploy.yml`, served under `/roughhouse-concept/`.
