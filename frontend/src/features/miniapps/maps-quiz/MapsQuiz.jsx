import { memo, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { CONTINENTS, COUNTRIES } from "./data/countries.js";
import { MAP_SHAPES, VIEWBOX } from "./data/mapData.js";
import {
  TOTAL,
  TOTALS,
  countryById,
  formatTime,
  initialState,
  reducer,
  remainingByContinent,
} from "./quizLogic.js";
import "./MapsQuiz.css";

const kClass = (continent) => (continent ? `cq-k${CONTINENTS.indexOf(continent)}` : "");

// Countries in the quiz that have no shape on the map (too tiny to draw), e.g. Tuvalu.
const DRAWN = new Set(MAP_SHAPES.map((s) => s.id).filter(Boolean));
const TOO_SMALL = COUNTRIES.filter((c) => !DRAWN.has(c.id)).map((c) => c.name);

/* The map is memoised: typing in the input box never re-renders ~200 paths. */
const WorldMap = memo(function WorldMap({ found, current, lastId, status }) {
  const foundSet = useMemo(() => new Set(found), [found]);
  const label =
    status === "playing"
      ? `World map. ${current} is highlighted. ${found.length} of ${TOTAL} countries named.`
      : "World map with the six continents.";
  return (
    <svg className="cq-map" viewBox={VIEWBOX} role="img" aria-label={label}>
      {MAP_SHAPES.map((s, i) => {
        const isFound = s.id && foundSet.has(s.id);
        let state = "is-dim";
        if (status === "idle") state = "is-idle";
        else if (isFound) state = "is-found";
        else if (s.c && s.c === current && status === "playing") state = "is-active";
        else if (status !== "playing" && s.c) state = "is-missed";
        return (
          <path
            key={i}
            d={s.d}
            className={`cq-shape ${kClass(s.c)} ${state}${s.id && s.id === lastId ? " is-just" : ""}`}
          />
        );
      })}
    </svg>
  );
});

export default function MapsQuiz({
  title = "Countries of the World, except one per continent (repeat)",
  className = "",
}) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const { status, current, found, passes, feedback } = state;
  const [text, setText] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);
  const t0 = useRef(0);

  const remaining = useMemo(() => remainingByContinent(found), [found]);
  const continentsLeft = CONTINENTS.filter((c) => remaining[c] > 0).length;
  const playing = status === "playing";

  // timer
  useEffect(() => {
    if (status === "playing") {
      t0.current = Date.now();
      setElapsed(0);
      const id = setInterval(() => setElapsed(Date.now() - t0.current), 250);
      return () => clearInterval(id);
    }
    if (status === "done" || status === "gaveup") setElapsed(Date.now() - t0.current);
  }, [status]);

  // focus the box when play starts
  useEffect(() => {
    if (playing) inputRef.current?.focus();
  }, [playing]);

  // after a miss, select the text so the next try replaces it
  useEffect(() => {
    if (feedback && !["correct", "pass"].includes(feedback.kind)) inputRef.current?.select();
  }, [feedback]);

  const submit = (e) => {
    e.preventDefault();
    const action = { type: "guess", text };
    const result = reducer(state, action); // pure, so we can peek at the outcome
    dispatch(action);
    if (result.feedback?.kind === "correct") setText(""); // clear right away on a hit
    inputRef.current?.focus();
  };

  const missed = useMemo(() => {
    const got = new Set(found);
    return CONTINENTS.map((c) => ({
      continent: c,
      list: COUNTRIES.filter((x) => x.continent === c && !got.has(x.id)).map((x) => x.name),
    })).filter((g) => g.list.length);
  }, [found]);

  const resultText = `${title}\n${found.length}/${TOTAL} in ${formatTime(elapsed)}${passes ? ` (${passes} pass${passes === 1 ? "" : "es"})` : ""}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(resultText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable: ignore */
    }
  };

  const lastId = feedback?.kind === "correct" ? feedback.id : null;
  const next = playing && feedback?.kind === "correct" ? current : null;

  return (
    <section className={`cq-root ${className}`} aria-labelledby="cq-title">
      <header className="cq-head">
        <h2 id="cq-title" className="cq-title">{title}</h2>
        <p className="cq-sub">
          Name one country from each continent, in order, over and over. When a continent runs out of countries,
          it drops out of the cycle.
        </p>
      </header>

      <WorldMap found={found} current={current} lastId={lastId} status={status} />
      {TOO_SMALL.length > 0 && (
        <p className="cq-note">
          Too tiny to see on the map, but they still count: {TOO_SMALL.join(", ")}.
        </p>
      )}

      {status === "idle" && (
        <div className="cq-panel">
          <p>
            Order: {CONTINENTS.join(" → ")}. North America includes Central America and the Caribbean.
          </p>
          <button className="cq-btn cq-primary" onClick={() => dispatch({ type: "start" })}>
            Start
          </button>
        </div>
      )}

      {(playing || status === "done" || status === "gaveup") && (
        <dl className="cq-stats">
          <div><dt>Named</dt><dd>{found.length} / {TOTAL}</dd></div>
          <div><dt>Time</dt><dd>{formatTime(elapsed)}</dd></div>
          <div><dt>Continents left</dt><dd>{continentsLeft} / {CONTINENTS.length}</dd></div>
        </dl>
      )}

      {playing && (
        <form className="cq-panel" onSubmit={submit} autoComplete="off">
          <p className="cq-prompt">
            Name a country in{" "}
            <strong className={`cq-pill ${kClass(current)}`}>{current}</strong>
          </p>
          <div className="cq-row">
            <label htmlFor="cq-input" className="cq-sr">Type a country</label>
            <input
              id="cq-input"
              ref={inputRef}
              className="cq-input"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a country, press Enter"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="go"
            />
            <button type="submit" className="cq-btn cq-primary">Enter</button>
          </div>
          <p
            role="status"
            className={`cq-feedback ${feedback ? `is-${feedback.kind}` : ""}`}
          >
            {feedback?.kind === "correct" && (
              <>
                <span aria-hidden="true">✓ </span>
                {feedback.text}
                <span className="cq-sr">. Correct. Next continent: {next}.</span>
              </>
            )}
            {feedback && feedback.kind !== "correct" && feedback.text}
          </p>
          <div className="cq-row cq-actions">
            <button
              type="button"
              className="cq-btn"
              onClick={() => dispatch({ type: "pass" })}
              disabled={continentsLeft < 2}
              title="Skip this continent for now and move on to the next one"
            >
              Pass this continent
            </button>
            <button type="button" className="cq-btn" onClick={() => dispatch({ type: "giveup" })}>
              Give up
            </button>
          </div>
        </form>
      )}

      {(playing || status !== "idle") && (
        <ol className="cq-tracker" aria-label="Continents in cycle order">
          {CONTINENTS.map((c) => {
            const left = remaining[c];
            const done = left === 0;
            return (
              <li
                key={c}
                className={`cq-chip ${kClass(c)}${done ? " is-done" : ""}${playing && c === current ? " is-current" : ""}`}
                aria-current={playing && c === current ? "step" : undefined}
              >
                <span className="cq-chip-name">{c}</span>
                <span className="cq-chip-count">
                  {done ? "done ✓" : `${TOTALS[c] - left} / ${TOTALS[c]}`}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      {(status === "done" || status === "gaveup") && (
        <div className="cq-panel cq-end">
          <h3>
            {status === "done"
              ? `All ${TOTAL} named in ${formatTime(elapsed)}!`
              : `You named ${found.length} of ${TOTAL} in ${formatTime(elapsed)}.`}
          </h3>
          <div className="cq-row">
            <button className="cq-btn cq-primary" onClick={() => dispatch({ type: "start" })}>Play again</button>
            <button className="cq-btn" onClick={copy}>{copied ? "Copied!" : "Copy result"}</button>
          </div>
          {missed.length > 0 && (
            <details open>
              <summary>Countries you missed ({TOTAL - found.length})</summary>
              {missed.map((g) => (
                <p key={g.continent} className="cq-list">
                  <strong className={`cq-pill ${kClass(g.continent)}`}>{g.continent}</strong> {g.list.join(", ")}
                </p>
              ))}
            </details>
          )}
        </div>
      )}

      {found.length > 0 && (
        <details className="cq-found">
          <summary>Named so far ({found.length})</summary>
          {CONTINENTS.map((c) => {
            const list = found.map(countryById).filter((x) => x.continent === c);
            return list.length ? (
              <p key={c} className="cq-list">
                <strong className={`cq-pill ${kClass(c)}`}>{c}</strong> {list.map((x) => x.name).join(", ")}
              </p>
            ) : null;
          })}
        </details>
      )}
    </section>
  );
}
