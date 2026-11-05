import { describe, expect, it } from "vitest";
import { COUNTRIES, CONTINENTS } from "./data/countries.js";
import { initialState, reducer, normalize, TOTAL } from "./quizLogic.js";

const play = (s, ...guesses) => guesses.reduce((st, g) => reducer(st, { type: "guess", text: g }), s);
const started = () => reducer(initialState(), { type: "start" });

describe("matching", () => {
  it("normalises accents, punctuation, st./saint, leading 'the'", () => {
    expect(normalize("  Côte d’Ivoire ")).toBe(normalize("cote d'ivoire"));
    expect(normalize("St. Lucia")).toBe("saint lucia");
    expect(normalize("The Bahamas")).toBe("bahamas");
  });
  it("accepts common alternate names", () => {
    const cases = { usa: "United States", "ivory coast": "Côte d'Ivoire", "czech republic": "Czechia", burma: "Myanmar", uk: "United Kingdom" };
    for (const [guess, name] of Object.entries(cases)) {
      const c = COUNTRIES.find((x) => x.name === name);
      let st = started();
      st = { ...st, current: c.continent };
      st = play(st, guess);
      expect(st.found, guess).toContain(c.id);
    }
  });
  it("short country-code words don't match", () => {
    for (const w of ["no", "it", "in", "is", "be", "at", "so"]) expect(play(started(), w).found).toEqual([]);
  });
});

describe("cycle", () => {
  it("rejects a real country from the wrong continent and a duplicate", () => {
    let st = play(started(), "France");
    expect(st.feedback.kind).toBe("wrong-continent");
    expect(st.found).toEqual([]);
    st = play(st, "Canada");
    expect(st.current).toBe("South America");
    st = play({ ...st, current: "North America" }, "Canada");
    expect(st.feedback.kind).toBe("duplicate");
  });
  it("pass moves on without scoring", () => {
    const st = reducer(started(), { type: "pass" });
    expect(st.current).toBe("South America");
    expect(st.passes).toBe(1);
  });
  it("follows the exact slot sequence and finishes at 197", () => {
    // independent re-derivation of the expected cycle: round-robin, skipping empty continents
    const left = Object.fromEntries(CONTINENTS.map((c) => [c, COUNTRIES.filter((x) => x.continent === c).length]));
    const slots = [];
    while (Object.values(left).some((n) => n > 0)) for (const c of CONTINENTS) if (left[c] > 0) { slots.push(c); left[c]--; }
    expect(slots.length).toBe(TOTAL);
    const pools = Object.fromEntries(CONTINENTS.map((c) => [c, COUNTRIES.filter((x) => x.continent === c).map((x) => x.name)]));
    let st = started();
    for (const want of slots) {
      expect(st.current).toBe(want);
      st = play(st, pools[want].shift());
    }
    expect(st.status).toBe("done");
    expect(st.found.length).toBe(197);
  });
});
