# Pick'em — Setup Guide

Your kit: a workbook (`WorldCup2026_Pickem.xlsx`, scoring + payouts) and three web pages per pool — `group.html`, `bracket.html`, `leaderboard.html`. All pools share one repo and one set of game-logic files in `shared/`; each pool is a folder with its own `config.js`.

> This guide uses placeholders: `<you>` is your GitHub username, `<repo>` your repo name, and `<pool>` a pool's folder name. Substitute your own.

---

## The privacy model (read this first)

You want two things at once: **the leaderboard is public**, but **nobody can peek at anyone's picks**. Here's how that's guaranteed — it is *not* "share the sheet view-only" (that would let people open the Picks tabs).

1. **Keep the workbook private.** In the Share dialog, leave access on **Restricted** (only you). Do **not** pick "Anyone with the link." Because the file is private, the Group Picks and Knockout Picks tabs are visible to **you only**.
2. **Publish only the leaderboard tabs.** Google's *Publish to web* is a separate feature from sharing. You publish just the two Leaderboard tabs as public CSV links. The file itself stays Restricted; only those two tabs become readable.
3. **The leaderboards never contain picks.** They show names, points, and rank — not which teams anyone chose. So publishing them reveals *who's in and how they're doing*, never their actual bracket.

Net result: picks live only in the private file (admin = you); the leaderboard page reads the published leaderboard tabs.

> The website itself is public no matter what — anyone with a page link can open it. Privacy comes entirely from the spreadsheet settings above, not from the repo. Pool folders use plain names of your choosing; share pool links directly rather than advertising them.

---

## One-time setup (GitHub Pages)

1. Push this repo to your GitHub account and, in **Settings → Pages**, set the source to the `main` branch, root folder. (On a free account the repo must be public; nothing sensitive lives in it.)
2. Your site goes live at `https://<you>.github.io/<repo>/`. Each pool lives at `https://<you>.github.io/<repo>/<pool>/` — and that pool root **is the leaderboard** (the standings page, `index.html`), with links from there to the group picks (`group.html`) and the knockout bracket (`bracket.html`).
3. A `.nojekyll` file is included so the base URL stays a neutral 404 instead of rendering the README — the site doesn't advertise your pools.

No per-pool repo setup is needed — adding a pool is just adding a folder (see "Adding a pool" below).

---

## Per-pool setup (repeat for each pool)

### A. The workbook
1. Upload the workbook to Google Drive and open with Google Sheets. Name it for the pool (e.g. *WC2026 — <Pool Name>*).
2. **Settings tab:** set the group buy-in and knockout buy-in (and point values if you want to change them).
3. **Teams tab:** verify the 12 groups against the official tournament site; fix any team that differs (and update `shared/data.js` to match).
4. Delete the shaded **sample rows** on *Group Picks* and *Knockout Picks*, and clear the sample values on *Results*.

### B. Lock down sharing
5. **Share → keep it on *Restricted* (only you).** This is what keeps every pick private.

### C. Publish the two leaderboards
6. **File → Share → Publish to web.**
7. In the dropdown, switch from *Entire document* to the **Group Leaderboard** tab. Set format to **Comma-separated values (.csv)**. Click **Publish** and copy the link.
8. Repeat for the **Knockout Leaderboard** tab → copy that link too.
   - ⚠️ Publish *only* these two tabs. Never publish *Entire document* or the Picks tabs.

### D. Configure the pool (one file only)

All per-pool settings live in **one file**: `<pool>/config.js`. Open it and fill in the fields:

```js
window.POOL = {
  label:            "Your Pool Name",  // displayed on every page
  submitUrl:        "",                // where pick codes go — see "Collecting picks" below
  bracketSubmitUrl: "",                // optional; falls back to submitUrl if blank
  groupCsvUrl:      "...",             // paste the Group Leaderboard published CSV link here
  knockoutCsvUrl:   "...",             // paste the Knockout Leaderboard published CSV link here
  refreshSeconds:   60
};
```

That's it — no edits to the HTML files. Commit and push; the pages update automatically.

### E. Share the links
- **To entice / show standings:** share the pool link `https://<you>.github.io/<repo>/<pool>/`. It opens the leaderboard (both sections + who's in, refreshing about once a minute) with buttons to the picks pages.
- **To collect picks:** share `…/<pool>/group.html` now; share `…/<pool>/bracket.html` after the group stage ends. (The leaderboard's **Knockout Bracket** button stays grayed out until you set the real Round of 32 — see below.)

---

## Adding a pool

1. Copy any existing pool folder: `cp -r <existing-pool> <new-pool>`
2. Edit `<new-pool>/config.js` — change `label`, paste the new pool's CSV URLs, etc.
3. Create and publish the new pool's Google Sheet (same steps as above).
4. Commit and push. No changes to `shared/` needed.

---

## Updating the Round of 32

Once the Round-of-32 matchups are confirmed, edit **one file**: `shared/data.js`. Replace the placeholder `window.R32` array with the 16 real matchups. This update applies to **all pools** at once — and it also automatically un-grays the **Knockout Bracket** link on every pool's leaderboard (the link unlocks the moment `R32` no longer matches the shipped placeholders; no other switch to flip). Commit and push.

---

## Collecting picks

Players enter their **name + email**, make their picks, and tap **Submit my picks**. Each page also has a **Copy code** button as a manual fallback. There are two ways to receive picks:

### Recommended: one-tap direct submit (Apps Script web app)

Picks land straight in the workbook — no forms, no copy/paste, no manual entry. Set this up **once per pool**:

1. Open the pool's Google Sheet → **Extensions → Apps Script**.
2. Delete the starter code, paste the contents of [`apps-script/Code.gs`](apps-script/Code.gs), and Save.
3. **Deploy → New deployment → Web app.** Set **Execute as: Me** and **Who has access: Anyone**. Deploy and authorize (you'll approve access to your own sheet).
4. Copy the **Web app URL** (ends in `/exec`) and put it in that pool's `config.js` as `submitUrl`. Commit and push.

Now a submit writes the row directly into **Group Picks** (16 fields) or **Knockout Picks** (33 fields) — the script picks the right tab automatically. **Email is the last field**, so it lands in a trailing column without touching the scoring columns, and re-submitting with the same email **updates** that person's row instead of duplicating it. Email stays in the private Picks tab — it's never in the published leaderboard.

### No-setup alternative

Leave `submitUrl` blank. Players tap **Copy code** and send it to you (email/chat); you paste each code into the next empty row of the matching tab — **Group Picks** (16 fields) or **Knockout Picks** (33 fields). Because the code is tab-separated, one paste fills the whole row.

Everything else — scoring, the two leaderboards, and both payouts — updates on its own as you fill the **Results** tab.

---

## Running it

- **Before the opener:** share the group pages and leaderboard; collect group codes into *Group Picks*.
- **As group games finish:** enter actual group winners, the worst team, and total goals on *Results*.
- **When the Round of 32 is set:** drop the 16 real matchups into `window.R32` in `shared/data.js`, commit and push. Share the bracket pages. Collect knockout codes into *Knockout Picks*.
- **Through the final:** enter knockout results on *Results*; the knockout leaderboard and payout update live.
