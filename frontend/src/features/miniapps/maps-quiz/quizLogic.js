// Pure game logic for the continent-cycle quiz. No React in here, so it's easy to test.
import { CONTINENTS, COUNTRIES } from "./data/countries.js";

/** Lowercase, strip accents/punctuation, "st." -> "saint", drop a leading "the". */
export function normalize(s) {
  return String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .map((t) => (t === "st" ? "saint" : t))
    .join(" ")
    .replace(/^the /, "");
}

// alias -> country, built once
const ALIAS_INDEX = new Map();
for (const c of COUNTRIES) for (const a of c.aliases) ALIAS_INDEX.set(a, c);
const BY_ID = new Map(COUNTRIES.map((c) => [c.id, c]));

export const TOTAL = COUNTRIES.length;
export const TOTALS = Object.fromEntries(
  CONTINENTS.map((k) => [k, COUNTRIES.filter((c) => c.continent === k).length])
);
export const countryById = (id) => BY_ID.get(id);

/** How many countries are still unnamed on each continent. */
export function remainingByContinent(found) {
  const r = { ...TOTALS };
  for (const id of found) r[BY_ID.get(id).continent] -= 1;
  return r;
}

/**
 * The continent after `current` in the cycle that still has countries left.
 * Wraps around; may return `current` itself if it is the only one left; null if all done.
 */
export function nextContinent(current, remaining) {
  const start = CONTINENTS.indexOf(current);
  for (let i = 1; i <= CONTINENTS.length; i++) {
    const c = CONTINENTS[(start + i) % CONTINENTS.length];
    if (remaining[c] > 0) return c;
  }
  return null;
}

export const initialState = () => ({
  status: "idle", // idle | playing | done | gaveup
  current: CONTINENTS[0],
  found: [], // country ids, in the order they were named
  passes: 0,
  feedback: null, // { kind: 'correct'|'wrong-continent'|'duplicate'|'unknown'|'pass', text, id? }
});

export function reducer(state, action) {
  switch (action.type) {
    case "start":
      return { ...initialState(), status: "playing" };

    case "reset":
      return initialState();

    case "giveup":
      return state.status === "playing" ? { ...state, status: "gaveup", feedback: null } : state;

    case "pass": {
      if (state.status !== "playing") return state;
      const remaining = remainingByContinent(state.found);
      const next = nextContinent(state.current, remaining);
      if (!next || next === state.current) return state; // nothing to pass to
      return {
        ...state,
        current: next,
        passes: state.passes + 1,
        feedback: { kind: "pass", text: `Passed. Next up: ${next}.` },
      };
    }

    case "guess": {
      if (state.status !== "playing") return state;
      const key = normalize(action.text);
      if (!key) return state;
      const country = ALIAS_INDEX.get(key);
      if (!country) {
        return { ...state, feedback: { kind: "unknown", text: `"${action.text.trim()}" isn't a country I recognise.` } };
      }
      if (state.found.includes(country.id)) {
        return { ...state, feedback: { kind: "duplicate", text: `You already named ${country.name}.` } };
      }
      if (country.continent !== state.current) {
        return {
          ...state,
          feedback: {
            kind: "wrong-continent",
            text: `${country.name} is in ${country.continent}. Right now it's ${state.current}.`,
          },
        };
      }
      const found = [...state.found, country.id];
      const remaining = remainingByContinent(found);
      const next = nextContinent(state.current, remaining);
      if (!next) {
        return { ...state, found, status: "done", feedback: { kind: "correct", text: `${country.name}`, id: country.id } };
      }
      return {
        ...state,
        found,
        current: next,
        feedback: { kind: "correct", text: `${country.name}`, id: country.id },
      };
    }
    default:
      return state;
  }
}

export function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
