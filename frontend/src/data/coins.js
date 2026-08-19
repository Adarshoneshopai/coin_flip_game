import indiaHeads from "../assets/coins/india-heads.png";
import indiaTails from "../assets/coins/india-tails.png";
import pennyTails from "../assets/coins/penny-tails.png";
import pennyHeads from "../assets/coins/penny-heads.png";
import ukHead from "../assets/coins/uk-head.png";
import ukTail from "../assets/coins/uk-tails.png";
import uaeTail from "../assets/coins/uae-tails.png";
import uaeHead from "../assets/coins/uae-heads.png";

// Stylized, flag-themed coin designs by default — not photorealistic
// reproductions of real currency (a coin photo is usually copyrighted by
// whoever took it, even when the underlying design is a government work,
// so shipping scraped images in a monetized app is a real infringement
// risk). If you have properly licensed photos (your own, or from a mint's
// press kit / a paid stock license), drop them in /public/coins/ and add
// headsImage/tailsImage below — Coin.jsx will use them automatically and
// fall back to the symbol design if a path is missing or fails to load.

export const COINS = [
  {
    id: "india",
    name: "India",
    flag: "🇮🇳",
    currency: "₹",
    headsSymbol: "🦁",
    headsLabel: "BHARAT",
    tailsSymbol: "₹",
    tailsLabel: "ONE RUPEE",
    headsImage: indiaHeads,
    tailsImage: indiaTails,
    colors: {
      light: "#f7b731",
      mid: "#e08e0b",
      dark: "#8a5a06",
      ringOpacity: 0.55,
    },
  },
  {
    id: "usa",
    name: "United States",
    flag: "🇺🇸",
    currency: "$",
    headsSymbol: "⭐",
    headsLabel: "LIBERTY",
    tailsSymbol: "$",
    tailsLabel: "ONE DOLLAR",
    headsImage: pennyHeads,
    tailsImage: pennyTails,
    colors: {
      light: "#e3e8ee",
      mid: "#aab4c0",
      dark: "#5b6673",
      ringOpacity: 0.5,
    },
  },
  {
    id: "uk",
    name: "United Kingdom",
    flag: "🇬🇧",
    currency: "£",
    headsSymbol: "👑",
    headsLabel: "ROYAL MINT",
    tailsSymbol: "£",
    tailsLabel: "ONE POUND",
    headsImage: ukHead,
    tailsImage: ukTail,
    colors: {
      light: "#f0d78c",
      mid: "#d4af37",
      dark: "#7a5c1a",
      ringOpacity: 0.55,
    },
  },
  {
    id: "uae",
    name: "UAE",
    flag: "🇦🇪",
    currency: "د.إ",
    headsSymbol: "🌙",
    headsLabel: "EMIRATES",
    tailsSymbol: "د.إ",
    tailsLabel: "ONE DIRHAM",
    headsImage: uaeHead,
    tailsImage: uaeTail,
    colors: {
      light: "#dcd0b8",
      mid: "#b89b5e",
      dark: "#5e4a24",
      ringOpacity: 0.5,
    },
  },
  {
    id: "classic",
    name: "Classic Gold",
    flag: "🪙",
    currency: "",
    headsSymbol: "H",
    headsLabel: "HEADS",
    tailsSymbol: "T",
    tailsLabel: "TAILS",
    headsImage: null,
    tailsImage: null,
    colors: {
      light: "#f0d78c",
      mid: "#d4af37",
      dark: "#8a6a1e",
      ringOpacity: 0.55,
    },
  },
];

export const DEFAULT_COIN_ID = "india";

export const getCoinById = (id) => COINS.find((c) => c.id === id) || COINS[0];
