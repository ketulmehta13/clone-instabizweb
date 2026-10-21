# TeddyPups Clone (React + Vite)

Clone of https://puppy.instabizweb.com/ built with React 19, Vite, TypeScript, React Router 7,
Tailwind CSS v4 and Motion. Plan: PLAN.md · Prompt log: PROMPTS.md

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
npx oxlint src     # lint
```

## Progress (PLAN.md phases)

- [x] 1–2 Study site, choose tools
- [x] 3 Project set up (Vite React TS, Tailwind v4, React Router, fonts)
- [x] 4 Git initialised, commits per phase (GitHub remote NOT added/pushed yet)
- [x] 5 Colours, fonts, base/component CSS (src/index.css, src/styles/site.css)
- [x] 6 Routes, header (scroll hide/show), mobile menu, footer, WhatsApp bar, 404 "Lost" poster
- [x] 7 Content in src/data (15 available + 27 rehomed puppies, 64 family photos, 9 FAQs, journeys); media in public/media
- [x] 8 Building blocks: Img, RevealScope, Polaroid, photo viewer, PuppyCard (sketch), Chapter, Scene, Twinkles, Teddy (PupDrawing/PupRig/PupBuddy/PupStop)
- [x] 9 Home page (hero lineup, meet the pups pinned scroll, two ways + flight, journey chat, passport, families wall, questions, CTA)
- [x] 10 Puppies list with URL filters + puppy story page (gallery, enquiry → WhatsApp, prev/next)
- [x] 11 Happy families, How it works, FAQ notice board, Visit & contact letter form, Gone home tickets
- [x] 12 Walking Teddy across home page (PupJourney), page-change curtain (RouteCurtain), paw-trail cursor canvas, Lenis smooth scroll, back/forward scroll restore
- [ ] 13 Testing at 360/390/768/1024/1440, keyboard/a11y, Lighthouse, lint+build clean
- [ ] 14 vercel.json SPA rewrite, push to GitHub, deploy on Vercel
- [ ] 15 Final README, PROMPTS.md updated with every prompt

## Folder structure

```
src/pages        one file per page
src/components   layout/, home/, puppy/, how/, faq/, contact/, pup/ (Teddy engine), shared blocks
src/data         content (puppies.ts, home.ts, families.ts, faqs.ts, journeys.ts, site.ts, types.ts)
src/lib          motion helpers, page meta, enquiry → WhatsApp
public/media     photos/videos named <id>.<ext>
```

## Notes / decisions

- React + Vite instead of Next.js; vercel.json rewrite needed for deep links.
- Original CSS class names reused, so its stylesheet drives the look.
- Enquiry forms open WhatsApp with the message prefilled (no backend).
- Photos resized to ≤1600px to keep the repo small.
- Walking Teddy: stops are `<PupStop>` elements on the page; `pup/journey.ts` works out the route, `pup/PupJourney.tsx` animates it. On phones he peeks up from above the WhatsApp bar instead.
- Movement (walker, curtain, paw trail, smooth scroll) is off when the device asks for reduced motion.
- Reference tooling lives outside the repo in C:\dev\ref (screenshots: `node shot.mjs <url> <out.png> 1440 900 1`; walker check: `node pupcheck.mjs <url> <outDir> 1440 900`; curtain check: `node curtaincheck.mjs`; compare.py).
