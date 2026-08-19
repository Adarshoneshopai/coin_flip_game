import indiaHeads from "../assets/coins/india-heads.png";
import indiaTails from "../assets/coins/india-tails.png";
import pennyTails from "../assets/coins/penny-tails.png";
import pennyHeads from "../assets/coins/penny-heads.png";
import ukHead from "../assets/coins/uk-head.png";
import ukTail from "../assets/coins/uk-tails.png";
import uaeTail from "../assets/coins/uae-tails.png";
import uaeHead from "../assets/coins/uae-heads.png";



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
      light: "#e6e3dc",
      mid: "#c8c0b5",
      dark: "#10100f",
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
      light: "#c6cba1",
      mid: "#cbcfd4",
      dark: "#272728",
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
      light: "#8b8060",
      mid: "#d47b37",
      dark: "#bd5622",
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
      light: "#ffffff",
      mid: "#ffffff",
      dark: "#C0C0C0",
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
