Build a complete clone of https://puppy.instabizweb.com/ using React, matching its design, layout, responsiveness and functionality as closely as possible.

Tech stack:
- React + TypeScript with Vite
- React Router for pages
- Tailwind CSS for styling
- The same fonts as the original: Fraunces (headings), Figtree (body text), Shantell Sans (handwritten notes)

Pages to build (same URLs as the original):
- / (Home)
- /puppies (all puppies, with filters by breed and by local/imported, kept in the URL like ?breed=maltipoo and ?origin=local)
- /puppies/:slug (single puppy page with photos, video, details and a WhatsApp enquiry button)
- /happy-families
- /how-it-works (including the #delivery section)
- /faq
- /contact (Visit & contact)
- /gone-home
- a 404 page for unknown URLs

Shared parts:
- Header with logo, menu (paw under the active page) and a green "WhatsApp us" button; a full-screen menu on phones
- Footer with links, breeds, phone, email and social media
- A bottom bar on phones with WhatsApp and Call buttons
- Every WhatsApp button opens wa.me/971541676733 with a pre-filled message

Home page sections, top to bottom:
1. Hero: "every puppy is family" tagline, big headline, two buttons, arched puppy photos, scalloped edge and lattice pattern
2. Meet the pups: row of puppy cards with "Available" badges and the cartoon puppy
3. Two ways to meet your puppy: showroom in Dubai vs imported from Korea
4. Your puppy journey: 3 steps with a WhatsApp chat mock and breed buttons
5. Why families trust TeddyPups: 4 trust points
6. Happy families: quote and family photos
7. Questions, answered: 3 FAQs with a link to the full FAQ
8. Final call to action: "Ready to meet your new best friend?"

Content:
- Put all puppies, FAQs, family photos and contact details in separate typed data files in src/data, copied from the original site
- Put images in public/ with clear names

Animations:
- Sections reveal on scroll, the walking cartoon puppy with paw prints, hover effects on cards and buttons, header changes on scroll
- Turn all motion off when the device prefers reduced motion

Quality:
- Fully responsive: check every page at 360, 390, 768, 1024 and 1440 px against the original, with no sideways scrolling
- Accessible: alt text on images, keyboard-usable menus and FAQ
- The production build and lint must pass with no errors

Work step by step: project setup, colours and fonts, pages and layout, content, reusable components, home page, puppy pages, other pages, animations, then testing. Make a git commit after each step and compare with the original before moving on.

Finally, add a vercel.json rewrite so direct links to inner pages work when deployed on Vercel.