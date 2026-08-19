# Coin images go here

This folder is empty on purpose. The game currently uses stylized,
flag-colored coin designs (see `src/data/coins.js`) instead of real
currency photos, because a coin photo is usually copyrighted by whoever
took it — even when the coin's underlying design is a government work —
so shipping a scraped/downloaded image in a monetized app is a real
infringement risk, not a formality.

## To use real photos

1. Get images you actually have the right to use commercially:
   - Photos you took yourself of real coins, or
   - A mint's official press/media kit (many explicitly allow promotional
     use — check the specific terms on the mint's site), or
   - A paid stock-photo license (Adobe Stock, Shutterstock, etc.)
2. Crop them to a tight circle, square canvas, ~500×500px, transparent or
   plain background. Two files per coin: heads and tails.
3. Drop them here, e.g.:
   ```
   /coins/india-heads.png
   /coins/india-tails.png
   ```
4. In `src/data/coins.js`, set the matching entry's `headsImage` /
   `tailsImage` to the path (e.g. `"/coins/india-heads.png"`).

`Coin.jsx` will render the photo on that face automatically — no other
code changes needed. Leave a field `null` to keep the stylized fallback
design for that coin.
