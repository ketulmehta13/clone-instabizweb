# AI Prompt Log

All prompts given to the AI during this project, **copied exactly as typed**.

- **Tool:** Claude Code — Claude desktop app (Code tab), Claude Pro subscription
- **Model:** Claude Opus 5.5
- **How to read this file:** Part A is what has already been sent. Part B is the prompt for each
  remaining phase in [PLAN.md](PLAN.md). When you send a Part B prompt, move it into Part A
  with the date and a one-line note of what the AI did and what you changed yourself.

---

## Part A — Prompts sent

### Prompt 1 — Kick-off (2026-10-21)

I pasted the assignment email, then wrote:

```text
Hi
Congratulations!
You have been shortlisted for the Technical Round at Insta Biz Web.
As the next step, we would like you to complete a technical assignment to evaluate your development skills, problem-solving approach, and practical understanding of building real-world applications.
Assignment: Clone the Complete Website
Reference Website: https://puppy.instabizweb.com/
Requirements:

* Build a complete clone of the reference website, matching its design, layout, responsiveness, and functionality as closely as possible.
* Deploy the website and share the live URL.
* Share your GitHub repository with the complete source code.
* Record a Loom video with screen sharing, explaining your complete development process, project structure, technologies used, AI tools, exact prompts, implementation decisions, challenges, testing, and deployment.

AI Tools Policy: You are free to use any AI tools or development tools of your choice. However, you must understand your implementation and be able to explain your complete workflow.
Deadline: You have 48 hours from your reply to this email confirming acceptance of the assignment to submit all deliverables.
Important: Your final submission and Loom video will play a key role in determining your shortlisting for the next stage of the hiring process.
Please reply to confirm your acceptance of the assignment and the deadline.
All the best!
Regards,
Gaurav Teli
Insta Biz Web

now have to make clone website of this teddypuppy

I have claude pro subscription and have to set up all the things and to make whole project with github , also to shoot video , explain the plan md files , prompt I have to show so that they can see what i have given the exact prompt
```

**What the AI did:** opened the reference site in the built-in browser, read the page text, links,
fonts, colours and images, and found it is a Next.js + Tailwind site with 8 routes and 15 puppy
detail pages.

**Problem hit:** Windows path-length limit — the temp folder path was too long for `curl`/`npm`.

### Prompt 2 — Plan and prompt log

```text
write plan(including git set up) , prompt ,
```

**What the AI did:** wrote the first PLAN.md (analysis, stack, structure, git/GitHub setup,
milestones, testing, deployment, Loom outline) and this file.

### Prompt 3 — Next.js or React?

```text
in plan md its written to use nextjs but can I use react to make this ?
```

**What the AI did:** explained that Next.js is a framework on top of React, compared Next.js with
React + Vite (routing, images, fonts, rendering, deployment), and recommended choosing the one I can
explain confidently.

### Prompt 4 — Switch the plan to React

```text
I want to use react so make changes in plan md accordingly
```

**What the AI did:** updated PLAN.md for React + Vite + React Router, including the `vercel.json`
rewrite needed for deep links, and updated the Part B prompts.

### Prompt 5 — Full step-by-step React plan

```text
give me a proper plan once with proper steps to make project of react
```

**What the AI did:** rewrote PLAN.md as one complete plan: site analysis, stack, folder structure,
18 numbered steps (prerequisites → scaffold → git/GitHub → tokens → routing → components → pages →
animations → QA → deploy → README → Loom → submit) with commands, code snippets and a "done when"
for each, a 48-hour timeline, testing checklist and video outline.

### Prompt 6 — Remove video and submission

```text
in plan dont include video , submission process because I have to show them the prompt
```

**What happened:** I stopped this edit before it was applied and gave a clearer instruction (Prompt 7).

### Prompt 7 — Plain-language, step-by-step plan

```text
make plan in systematic way with progression linewise and in lamen language for the viewers point of view
```

**What the AI did:** rewrote PLAN.md in plain language for someone reading it for the first time:
15 phases in order (study the site → pick tools → set up → GitHub → colours & fonts → header &
footer → content → building blocks → home page → puppy pages → other pages → animations → testing
→ go live → README), 82 numbered steps written one per line, a flow diagram, and a "Result" line
for each phase. Removed the video and submission sections.

---

## Part B — Prompts for the remaining phases

Send these one at a time, in order. Before sending the next one, check the result (run the site,
compare with the original) and save to GitHub. Phase 1 is already done, and the Vercel clicks in
Phase 14 are done by me.

### Phase 3 — Set up the project

```text
Follow PLAN.md Phase 3: create the React + Vite + TypeScript project in this folder, install React Router, Tailwind CSS and the three fonts, remove the sample files, and make sure it runs.
```

### Phase 4 — Connect to GitHub

```text
Follow PLAN.md Phase 4: initialise git, add a .gitignore and make the first commit. I'll create the GitHub repository myself and give you the link to push to.
```

### Phase 5 — Colours and fonts

```text
Follow PLAN.md Phase 5: set up the site's colours and fonts in one central place. Check the exact colours on https://puppy.instabizweb.com/ and use those.
```

### Phase 6 — Header, footer and page structure

```text
Follow PLAN.md Phase 6: create all the pages with their web addresses, the shared header and footer, the phone menu, the phone bottom bar, the WhatsApp links and the not-found page. Match https://puppy.instabizweb.com/ on laptop and phone sizes.
```

### Phase 7 — Add the content

```text
Follow PLAN.md Phase 7: put all 15 puppies, the questions, the happy-family photos and the contact details into data files, and add the images to the project.
```

### Phase 8 — Reusable building blocks

```text
Follow PLAN.md Phase 8: build the buttons, puppy card, section title, question box and the decorative shapes.
```

### Phase 9 — Home page

```text
Follow PLAN.md Phase 9: build the home page one section at a time, top to bottom, matching the original. Commit after each section.
```

### Phase 10 — Puppy pages

```text
Follow PLAN.md Phase 10: build the all-puppies page with filters kept in the web address, and the single puppy page with photos, video, details and a WhatsApp button.
```

### Phase 11 — Remaining pages

```text
Follow PLAN.md Phase 11: build the Happy families, How it works, FAQ, Visit & contact and Gone home pages to match the original.
```

### Phase 12 — Animations

```text
Follow PLAN.md Phase 12: add the scroll animations, the walking cartoon puppy, the hover effects and the header change on scroll. Turn movement off for visitors who prefer reduced motion.
```

### Phase 13 — Testing

```text
Follow PLAN.md Phase 13: check every page at 360, 390, 768, 1024 and 1440 px wide against the original, fix any differences, and make the error checks and production build pass.
```

### Phases 14–15 — Go live and README

```text
Follow PLAN.md Phases 14 and 15: add the Vercel settings file so direct page links work, write the README, and tell me exactly what to click in Vercel.
```

---

## My own decisions

- Chose React + Vite + React Router over Next.js (which the original uses) because the site only shows information and React is what I know best; direct page links on the live site are handled with a small Vercel settings file.
- Kept content in separate data files instead of a database — the site is content-only, so it's faster and free to host.
- _Add: anything you changed by hand, AI output you rejected, and why._
