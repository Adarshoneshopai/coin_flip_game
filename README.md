# Heads or Tails — MERN Coin Flip Game

A full MERN-stack "Heads or Tails" game: pick a side, flip a realistic
360° 3D coin, and track wins/losses/streaks. Built to be fast, responsive,
SEO-friendly, and AdSense-safe out of the box.

## Stack

- **Frontend:** React 18 + Vite, plain CSS (no framework lock-in), react-helmet-async for SEO tags
- **Backend:** Express + Mongoose (MongoDB)
- **No auth required:** an anonymous UUID stored in `localStorage` scopes each player's history/stats

## Project structure

```
coin-flip-game/
├── backend/
│   ├── config/db.js            Mongo connection
│   ├── models/Flip.js          One document per flip
│   ├── controllers/flipController.js   Fair RNG, history, aggregated stats
│   ├── routes/flipRoutes.js
│   ├── middleware/errorHandler.js
│   └── server.js               Express app (helmet, cors, rate limiting, compression)
└── frontend/
    ├── index.html              Meta tags, Open Graph, JSON-LD structured data
    ├── public/robots.txt, sitemap.xml, ads.txt
    └── src/
        ├── components/Coin.jsx        The 3D coin (see below)
        ├── components/AdSlot.jsx      AdSense-ready ad unit
        ├── hooks/useCoinGame.js       Flip logic + offline fallback
        ├── hooks/useSessionId.js
        ├── api/flipApi.js
        └── pages/Home.jsx
```

## Running locally

**Backend**
```bash
cd backend
cp .env.example .env      # point MONGODB_URI at your Mongo instance
npm install
npm run dev                # http://localhost:5000
```

**Frontend**
```bash
cd frontend
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173, proxies /api to :5000
```

Build for production with `npm run build` in `frontend/`; serve `backend/`
behind your process manager of choice (PM2, Docker, etc.) and point the
frontend's `VITE_API_URL` at its public URL (or serve both from the same
origin/reverse proxy to avoid CORS entirely).

## How the coin flip works

`Coin.jsx` builds a real cylinder in CSS 3D space, not just a flat card
flip:
- Two circular `<div>` faces (heads/tails) with `backface-visibility: hidden`
- A rim made of ~70 thin slices arranged in a circle (`rotateY(angle)
  translateZ(radius)`) so the coin has real edge thickness at every angle
- The parent `.coin` rotates on the Y axis; each flip adds 5–7 full spins
  plus a 0°/180° offset so it always lands showing the correct face, with a
  cubic-bezier easing that decelerates like a real coin losing momentum
- `prefers-reduced-motion` is respected globally

The **outcome is decided server-side** (`crypto.randomInt`, not `Math.random`)
before the coin starts turning toward it, so the animation can't be "steered"
after the player sees which way it's spinning. If the API is unreachable the
game falls back to a local RNG and `localStorage` history automatically, so
it's never blocked by network issues.

### Country coins

`src/data/coins.js` defines a small set of flag-themed coin designs (India,
USA, UK, UAE, plus a neutral "Classic Gold"). `Coin.jsx` recolors the same
3D geometry via CSS custom properties (`--coin-light/mid/dark`) and swaps
the face symbol/label — no separate coin components needed. The choice
persists in `localStorage` alongside the session id.

These are **stylized, flag-colored designs, not reproductions of real
currency artwork** — exact mint designs (and especially any depiction of a
real person's portrait on currency) are protected and can raise
counterfeiting concerns, so this intentionally stays abstract. Add more
countries by appending an entry to the `COINS` array; no other file needs
to change.

## SEO

- Full meta tags, Open Graph/Twitter cards, canonical URL, and a `Game`
  JSON-LD block in `index.html`
- `robots.txt` + `sitemap.xml` in `public/`
- Semantic HTML (`<h1>`/`<h2>` hierarchy, `role="status"` live region for
  results) and per-page `<title>`/description via `react-helmet-async`
- Small, compressed production bundle (`vite-plugin-compression2`, vendor
  chunk splitting) for good Core Web Vitals

For a static export or crawler-heavy use case, consider adding SSR/prerendering
(e.g. `vite-plugin-ssr` or migrating to Next.js) — the component structure
here doesn't need to change to support that later.

## AdSense readiness

- `AdSlot.jsx` renders a labeled placeholder until `VITE_ADSENSE_CLIENT` is
  set, so you can build/test layout before approval without console errors
  or policy-violating empty units going live
- Ads are placed **between** content sections (after the game card, after
  the history list) — never inside the coin/flip interaction, never causing
  layout shift under the coin, and always labeled "Advertisement"
- `public/ads.txt` placeholder — fill in your real publisher line after
  approval
- The AdSense script tag in `index.html` is commented out until approval,
  since loading it before you have a client ID triggers console errors and
  can complicate the review

Before applying for AdSense: deploy to a real domain, add a privacy policy
page (required — this app stores gameplay data), and make sure there's
enough original content (the "How it works" section is a starting point,
consider expanding with rules/FAQ content).

## API

| Method | Route                          | Purpose                          |
|--------|---------------------------------|-----------------------------------|
| POST   | `/api/flips`                    | `{ sessionId, choice }` → flips and stores the result |
| GET    | `/api/flips/history/:sessionId` | Last N flips (default 20)         |
| GET    | `/api/flips/stats/:sessionId`   | Totals, win rate, best streak     |
| GET    | `/api/health`                   | Liveness check                    |

All flip endpoints are rate-limited (60/min/IP) to prevent scripted abuse.
