# Pick'em Kit

A self-hosted group-stage + knockout-bracket pick'em kit for a major football tournament. Static HTML/CSS/vanilla JS — no build step — served from GitHub Pages, with standings pulled from a private Google Sheet published as CSV.

## How it works

Each **pool** (a group of friends, coworkers, neighbors, etc.) gets its own folder containing three pages — **group picks**, **knockout bracket**, and a **live leaderboard** — plus a small `config.js`. All pools share one copy of the game logic in `shared/`; only `config.js` differs per pool, so adding a pool is cheap and tournament data is updated once for everyone.

Picks stay private: the workbook is kept Restricted in Drive, and only the two leaderboard tabs are published. The leaderboard pages show names, points, and rank — never anyone's actual picks.

## Layout

```
shared/
  *.css            page styles
  data.js          tournament data (groups + bracket), one source of truth
  group.js
  bracket.js
  leaderboard.js   page logic; each reads window.POOL from a pool's config.js
<pool>/
  config.js        the only per-pool file: label, submit + published-CSV URLs
  group.html
  bracket.html
  leaderboard.html
```

## Set up your own pool

1. Copy an existing pool folder to a new name and edit its `config.js` (set `label`, the submit URL, and — after publishing — the two leaderboard CSV URLs).
2. Make a private copy of the workbook in Google Drive, keep sharing **Restricted**, and publish only the two leaderboard tabs as CSV.
3. Commit and push. The pool's pages go live at `https://<you>.github.io/<repo>/<pool>/`.

No changes to `shared/` are needed to add a pool.

## Run locally

```bash
python3 -m http.server 8765
# then open http://localhost:8765/<pool>/group.html
```

See **[SETUP.md](SETUP.md)** for the full workflow (privacy model, GitHub Pages setup, per-pool configuration, collecting picks, and updating the bracket once the knockout round is set).
