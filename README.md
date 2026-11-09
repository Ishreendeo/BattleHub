# Battle Hub — Esports Tournament Management Platform

**Compete. Conquer. Celebrate.**

A fully interactive, front-end-only esports tournament platform built with React, Tailwind CSS v4, Framer Motion, React Router, and Recharts. Built by **Team Front Fusion** (Ishreen, Sana, Arshit) for a hackathon submission.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To build a production bundle:

```bash
npm run build
npm run preview
```

## What's inside

- **Tournament registration** — browse, search, filter, sort tournaments; register a team; registrations persist and instantly appear in the tournament's roster.
- **Team management** — create teams, edit info, add/remove roster members, upload a logo (stored as a data URL preview, no backend).
- **Dynamic bracket system** — brackets generate automatically from registered teams and update as new teams join. "Simulate Winner" advances the bracket using the same stat-weighted engine that powers the AI predictor.
- **Live Match Center** — start/pause/reset a match timer, adjust scores, and finish a match; results flow straight into the leaderboard.
- **Match Schedule** — organizers can add, remove, and track upcoming/live/completed matches.
- **Leaderboard** — wins, losses, and points are recalculated automatically from completed matches.
- **ArenaX Match Predictor (AI Match Predictor)** — the flagship feature. Pick two teams and a game, and a weighted statistical model (recent form, K/D, map win rate, tournament experience, head-to-head) produces a win probability, confidence score, MVP suggestion, key strengths, and a typewriter "AI reasoning" readout — all computed client-side from live team data, no API calls.
- **Notifications** — toasts confirm registrations, match starts/finishes, and other key actions.
- **Dashboard stats** — registered teams, active matches, completed matches, and total prize pool update live.
- **Dark/light theme** — toggled from the navbar, preference saved to Local Storage.
- **Accessibility** — semantic landmarks, labeled form fields, visible focus rings, skip-to-content link, `prefers-reduced-motion` support.
- **Fully responsive** — mobile, tablet, and desktop layouts throughout.

All application data (teams, tournaments, brackets, matches) is persisted to `localStorage` under the key `battlehub_data_v2`, so everything survives a page refresh. There is no backend and no external API — this is a genuine front-end application, not a static prototype.

## Tech stack

React 19 · Vite · Tailwind CSS v4 · Framer Motion · React Router v7 · Recharts · lucide-react · react-hot-toast
