# Score Cards 🎲⛳🥏🃏

A mobile-first score sheet app for real-world games. You bring the dice, clubs, or cards — the app replaces pen and paper, keeps everyone's scores, and does the math.

**▶ Use it here: https://magnusai.github.io/scorecards/**

No install, no accounts, no backend. Scores are saved in your browser, so you can close the tab mid-game and pick up where you left off.

## What's in it

- **Yatzy** — 6-dice "super yatzy" with upper-section bonus and all combinations. Dice count and bonus rules are configurable, and the sheet adapts (fewer dice hides the six-dice-only rows).
- **Mini Golf & Disc Golf** — strokes per hole, adjustable hole count, lowest total wins.
- **500** — points per round for the card game, first to 500 wins.
- **Custom cards** — build your own score card: name it, type in the rows you want to score, and a total row is added automatically. Perfect for whatever game night comes up with.

Small touches that matter at the table:

- Totals are **hidden by default** behind a 👁️ toggle — nobody knows who's winning until the reveal.
- Each game keeps its own players and scores; "New game" clears scores but keeps the names.
- Enter `0` to cross out a category you're sacrificing.
- Designed for phones (portrait), with sticky player names and synchronized scrolling for many players.

## Running locally

```bash
npm install
npm run dev
```

Then open **http://localhost:5173/scorecards/** — note the `/scorecards/` base path, which matches the GitHub Pages URL.

Other scripts: `npm run build` (type-check + production build), `npm run lint`, `npm run preview`.

## Tech

React 19 + TypeScript + Vite, CSS Modules, and a tiny hand-rolled hash router — no other runtime dependencies. Pushing to `main` deploys to GitHub Pages via GitHub Actions.

## More documentation

Architecture, how to add a game template, storage details, and the roadmap live in the **[project wiki](https://github.com/MagnusAI/scorecards/wiki)**.
