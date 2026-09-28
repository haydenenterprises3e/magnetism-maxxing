# Site Notes — Magnetism Maxxing (Ascend Awakening)

Quick reference so future sessions don't need to re-read the whole codebase.

## Stack
- TanStack Start (React 19) + Tailwind CSS 4 + Cloudflare Workers (wrangler) + Whop SDK
- **Always use `npm`, never `bun`.** `bun --bun run dev` fails with a miniflare/wrangler
  runtimeDispatcher error specific to Bun's runtime. `npm run dev` / `npm run typecheck` /
  `npm run build` / `whop apps deploy` all work fine.

## Key commands
```bash
npm install
npm run dev          # local dev server, http://localhost:3000
npm run typecheck    # tsc --noEmit, run after every edit
npm run build
whop apps deploy
```

## Key files
- `src/routes/index.tsx` — the homepage. Most edit requests land here.
- `src/lib/pathData.ts` — all lesson/module content for the 4 core tracks
  (Physical, Social, Income, Inner Work), ~106 modules total, plus rank logic.
- `src/lib/plans.ts` — pricing plans/tiers shown on the homepage.
- `src/components/` — AwakeningQuiz, HunterStatus, PricingModal, PriceCountdown,
  ScrollReveal, etc.
- `public/maxxing-images/` — image assets (magnetism-maxxing.png, manifesting-maxxing.jpg,
  money-maxxing.jpg used in the scroll-reveal blocks).

## Editing convention (important)
Manual `nano` edits have corrupted this file before (a stray line break broke a string
literal and took a while to track down). The reliable method now:
1. Write a Python script to `/tmp/*.py` that does an exact string replace via
   `content.replace(old, new)` inside a `cat > /tmp/foo.py << 'PYEOF' ... PYEOF` heredoc
   (quoted heredoc delimiter avoids shell interpreting `$`, backticks, etc.).
2. Run it with `python3 /tmp/foo.py`.
3. Always run `npm run typecheck` right after to confirm nothing broke.
4. Hard-refresh the browser (`Ctrl+Shift+R`) to bypass cache before judging the result.

## Homepage section order (top to bottom)
1. Nav (logo + "Enter the Gate")
2. Hero ("Magnetise your future...") + Hunter Status tracker
3. 4 core tracks grid (Physical / Social / Income / Inner Work) +
   4 Ascending-exclusive tracks grid (Hidden History / Esoteric Perception /
   Universal Law / Modern Systems)
4. Pricing section (Starter vs Ascending plans, countdown timer)
5. "Inside Magnetism Maxxing" (manifesto modal) + "Our Community" (community modal) buttons
6. 3 scroll-reveal "Maxxing" blocks: Magnetism / Manifesting / Money — each has real
   persuasive copy (not placeholder) tied to Tracks 01, 04, 03 respectively
7. **Ascending section** — long fade background (blue veins → purple veins → black),
   mini white lightning bolts near the bottom, two stacked boxes: a large glowing-purple
   "ASCENDING" title box, then a bullet-list box (8 points, key phrases glow purple/gold)
8. **Community/H3E section** — fade from black back to blue, H3E logo image
   (`/maxxing-images/magnetism-maxxing.png`) in a circular frame, "H3E" gold title box,
   then a bullet-list box (8 points, key phrases glow gold/purple) framing the private
   community as the endpoint of the whole curriculum
9. FAQ (accordion)
10. Footer (educational-use disclaimer)

## Content/tone notes
- Site voice throughout is dramatic, "hunter/rank" gamified self-improvement framing
  (Solo Leveling-esque), leaning on urgency (price deadline countdown) and gold/purple
  glow styling for emphasis — consistent with existing manifesto/community modal copy
  already in the file.
- Footer disclaimer explicitly states no guarantee of profit/income — new copy should
  stay consistent with that (frame claims as "what members discuss/build," not promises).
