# TeddyPups Website Clone — Project Plan

**Goal:** rebuild the website <https://puppy.instabizweb.com/> so it looks and works the same —
on laptops, tablets and phones — then put the code on GitHub and the site live on the internet.

**Built with:** React (the code), Vite (runs and packages the code), React Router (moves between
pages), Tailwind CSS (styling), GitHub (stores the code), Vercel (puts the site online).

**AI help:** Claude Code. Every instruction I gave it is in [PROMPTS.md](PROMPTS.md).

---

## How the work progresses

Each phase builds on the one before it. I finish and check one phase before starting the next,
and save my progress to GitHub at the end of each phase.

```
 1. Study the site  →  2. Pick tools  →  3. Set up project  →  4. Connect GitHub
        ↓
 5. Colours & fonts  →  6. Header & footer  →  7. Add content  →  8. Building blocks
        ↓
 9. Home page  →  10. Puppy pages  →  11. Other pages  →  12. Animations
        ↓
13. Testing  →  14. Go live  →  15. Write the README
```

---

## Phase 1 — Study the original website

1. Open the original site and scroll through every page, on a laptop screen and a phone screen.
2. List every page: Home, Puppies, each puppy's own page, Happy families, How it works, FAQ, Visit & contact, Gone home.
3. Note the look: cream background, dark-brown text, brown and green rounded buttons, dark-brown footer.
4. Note the fonts: a bold curvy font for headings (Fraunces), a clean font for text (Figtree), a handwriting font for small notes (Shantell Sans).
5. Note the special shapes: arch-shaped photo frames, a wavy "scalloped" edge, a criss-cross pattern, paw-print icons.
6. Note what moves: sections slide in while scrolling, a cartoon puppy walks across the page.
7. Note what each button does: most open WhatsApp with a ready-made message; others filter puppies by breed or by "in Dubai" vs "imported".
8. Note the content: 15 puppies, customer photos, frequently asked questions, contact details.

**Result:** a clear checklist of everything the clone must have.

---

## Phase 2 — Choose the tools

9. **React** — lets me build each repeated piece (like a puppy card) once and reuse it everywhere.
10. **Vite** — starts the site on my computer instantly while I work, and packages it for the internet.
11. **React Router** — handles moving between pages without reloading the whole site.
12. **Tailwind CSS** — lets me style quickly and adjust the layout for each screen size.
13. **Vercel** — free hosting that updates the live site automatically whenever I save to GitHub.

*Why React and not Next.js (what the original uses)?* The site only shows information — no logins,
payments or databases — so React alone does everything needed, and it's what I know best.

**Result:** a simple, well-known set of tools I can fully explain.

---

## Phase 3 — Set up the project

14. Check Node.js (runs the project) and Git (tracks changes) are installed.
15. Create a new React project with Vite in a short folder path (long Windows paths cause errors).
16. Install the extra tools: React Router, Tailwind CSS, and the three fonts.
17. Remove the sample files that come with a new project.
18. Start the project and open it in the browser to confirm it runs.

**Result:** an empty project that runs on my computer.

---

## Phase 4 — Connect to GitHub

19. Set my name and email in Git (one time only).
20. Turn the project folder into a Git repository and save the first version ("commit").
21. Create a new public repository on github.com called `teddypups-clone`.
22. Link the folder to that repository and upload the code ("push").
23. Add this plan and the prompt log to the project.

From here on, after every phase: **save (commit) → upload (push)**, so the history shows step-by-step progress.

The commands, for reference:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git init
git add .
git commit -m "Set up React project"
git remote add origin https://github.com/<username>/teddypups-clone.git
git branch -M main
git push -u origin main
```

**Result:** the code is safely stored on GitHub.

---

## Phase 5 — Colours and fonts

24. Save the site's colours in one central place, so every page uses exactly the same shades.
25. Load the three fonts and set where each is used (headings, text, handwritten notes).
26. Set the cream page background and dark-brown text for the whole site.

**Result:** every page automatically gets the TeddyPups look.

---

## Phase 6 — Header, footer and page structure

27. Create all the pages as empty placeholders, each with its own web address.
28. Make a shared frame so every page has the same header on top and footer at the bottom.
29. Build the header: logo, menu links (with a paw under the current page), green "WhatsApp us" button.
30. On phones, turn the menu into a button that opens a full-screen menu.
31. Build the footer: links, puppy breeds, phone, email and social media.
32. Add the phone-only bar fixed to the bottom of the screen with WhatsApp and Call buttons.
33. Make every WhatsApp button open a chat with a ready-made message.
34. Show a friendly "page not found" for wrong addresses.

**Result:** you can click through every page, even though most are still empty.

---

## Phase 7 — Add the content

35. Write down each of the 15 puppies: name, breed, boy/girl, age, in Dubai or imported, photos, video, description.
36. Write down the questions and answers, the happy-family photos and captions, and the contact details.
37. Save all photos, the logo and the video into the project with clear names.

The content lives in its own files, separate from the design, so adding a new puppy later means
adding one entry — no design changes needed.

**Result:** all the words and pictures are ready to place.

---

## Phase 8 — Reusable building blocks

38. **Buttons** — brown, outlined and green WhatsApp styles, with the same shadow and press effect.
39. **Puppy card** — arch-shaped photo, name, short description and an "Available" label.
40. **Section title** — big heading with a short line of text underneath.
41. **Question box** — click to open and close the answer.
42. **Decorations** — arch frames, wavy edge, criss-cross pattern, paw icon.

**Result:** pieces I build once and reuse on every page, so the whole site stays consistent.

---

## Phase 9 — Home page (one section at a time, top to bottom)

43. **Welcome banner** — "every puppy is family", the big headline, two buttons, arched puppy photos, wavy edge.
44. **Meet the pups** — a scrolling row of puppy cards with the cartoon puppy.
45. **Two ways to meet your puppy** — visit the Dubai showroom, or import from Korea.
46. **Your puppy journey** — 3 simple steps beside a pretend WhatsApp chat with breed buttons.
47. **Why families trust us** — 4 reasons: vet-checked, safe travel, 24/7 support, trusted worldwide.
48. **Happy families** — a customer quote and photos of puppies with their new owners.
49. **Questions, answered** — 3 common questions and a link to the full FAQ.
50. **Final invitation** — "Ready to meet your new best friend?" with a WhatsApp button.

After each section I compare it side by side with the original before moving on.

**Result:** a finished home page that matches the original.

---

## Phase 10 — Puppy pages

51. **All puppies page** — every puppy in a grid: 1 per row on phones, up to 4 on large screens.
52. **Filters** — buttons to show only one breed, or only Dubai / imported puppies.
53. The chosen filter appears in the web address, so links like "show me Cavapoos" from the home page open the list already filtered.
54. A friendly message when no puppy matches, with a WhatsApp button.
55. **Single puppy page** — big photos, video, details, and a WhatsApp button that mentions that puppy's name.
56. "More puppies" suggestions at the bottom of each puppy page.

**Result:** visitors can browse, filter and open any puppy.

---

## Phase 11 — Remaining pages

57. **Happy families** — all customer stories and photos.
58. **How it works** — the full adoption steps, including the delivery section.
59. **FAQ** — every question, each opening on click.
60. **Visit & contact** — showroom address, map, phone, email, social media.
61. **Gone home** — puppies that have already found families.

**Result:** every link in the menu and footer leads to a finished page.

---

## Phase 12 — Animations and finishing touches

62. Sections gently fade and slide in as you scroll.
63. The cartoon puppy walks with paw prints, like the original.
64. Cards lift and photos zoom slightly when the mouse is over them.
65. The header gets a background once you scroll down.
66. All movement switches off for visitors who've turned off animations on their device.

**Result:** the site feels as lively as the original.

---

## Phase 13 — Testing

67. Click every link and button on every page — nothing should be broken.
68. Check every WhatsApp button opens the right chat with the right message.
69. Check the filters and every puppy page.
70. Check on 5 screen sizes: small phone, normal phone, tablet, laptop, large monitor — nothing should be cut off or need sideways scrolling.
71. Compare each page side by side with the original.
72. Check the site works with the keyboard only, and every image has a text description.
73. Run Google Lighthouse to score speed, accessibility and search-engine friendliness.
74. Run the project's error checks and production build — both must finish with no errors.

**Result:** confidence that the site works everywhere.

---

## Phase 14 — Go live

75. Add a small settings file so opening any page's link directly (not just the home page) works on the live site.
76. Upload the latest code to GitHub.
77. Sign in to Vercel with GitHub, choose the `teddypups-clone` repository, and click Deploy.
78. Vercel gives a public web address, e.g. `teddypups-clone.vercel.app`.
79. Test the live site again on a laptop and a real phone.

From now on, every upload to GitHub updates the live site automatically within a minute.

**Result:** the site is online for anyone to visit.

---

## Phase 15 — Write the README

80. Write the README (the project's front page on GitHub): what it is, the live link, the tools used, how to run it, and how the folders are organised.
81. Make sure the prompt log has every instruction I gave the AI.
82. Final save and upload to GitHub.

**Result:** anyone opening the GitHub repository understands the project in a minute.

---

## How the code is organised

```
teddypups-clone/
├─ PLAN.md, PROMPTS.md, README.md   ← documentation
├─ public/                          ← logo, puppy photos, video
└─ src/
   ├─ pages/        ← one file per page (Home, Puppies, Contact…)
   ├─ components/   ← reusable pieces (header, footer, buttons, puppy card…)
   ├─ data/         ← the content: puppies, questions, family photos, contact details
   ├─ App.tsx       ← the list of pages and their web addresses
   └─ index.css     ← colours, fonts and shared styles
```
