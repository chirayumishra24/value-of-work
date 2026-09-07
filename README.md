# The Value of Work — Community Challenge

A lightweight React + TypeScript Grade 6 Social Science activity about how different kinds of work contribute to connected communities.

## Run locally

```bash
npm install
npm run dev
```

Create a production bundle with:

```bash
npm run build
```

## Included learning interactions

- Two-team or two-player setup, editable team names, turns, scores and contribution tokens
- Quick Quiz with unused-question selection and a steal opportunity
- Connect the Work, Build the Work Chain, What Happens If?, Work Detective, Act It Out, Look Closer and Community Crisis
- 2.5D CSS/SVG community board that unlocks locations as challenges are completed
- Lightweight dependency-ripple visualisation for the transport scenario
- Teacher controls for timer, sound preference, reduced motion, direct round selection, restart, skip and new game
- Local storage for settings and in-progress games
- Keyboard-accessible controls, visible focus styles, mobile/tablet breakpoints and reduced-motion support

## Structure

- `src/data/content.ts` — data-driven questions, chains, scenarios, locations and rounds
- `src/game/types.ts` — core game domain types
- `src/components/` — team panels, community board and reusable challenge UI
- `src/App.tsx` — game state, scoring, turn loop, persistence and screens
- `src/styles/global.css` — visual system and responsive 2.5D presentation

All learning examples are general conceptual activities; they do not claim to quote a particular textbook.
