import { useState } from "react";
import { items, TAGS } from "features/everything/data/everything";
import "./Everything.css";

export default function Everything() {
  const [active, setActive] = useState("all");

  const shown = items.filter((i) => active === "all" || i.tags.includes(active));

  return (
    <>
      <h2>everything</h2>
      <p className="intro">
        The long version: things I'm proud of, including the ones that aren't on a resume.
      </p>

      <div className="filters" role="group" aria-label="Filter by topic">
        <button
          type="button"
          className="chip"
          aria-pressed={active === "all"}
          onClick={() => setActive("all")}
        >
          all
        </button>
        {TAGS.map((t) => (
          <button
            key={t.id}
            type="button"
            className="chip"
            aria-pressed={active === t.id}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="count" aria-live="polite">
        {shown.length} {shown.length === 1 ? "thing" : "things"}
      </p>

      <ul className="entries">
        {shown.map((i) => (
          <li key={i.title} className="entry">
              {i.image && (
                <img
                  className="thumb"
                  src={i.image.src}
                  alt={i.image.alt}
                  width="64"
                  height="64"
                  loading="lazy"
                />
              )}
              <div className="entry-body">
                <div className="entry-head">
                  <h3>{i.title}</h3>
                  {i.year && <span className="year">{i.year}</span>}
                </div>
                <p>{i.blurb}</p>
                {i.links.length > 0 && (
                  <p className="links">
                    {i.links.map((l) => (
                      <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer">
                        {l.label}
                      </a>
                    ))}
                  </p>
                )}
              </div>
            </li>
        ))}
      </ul>
    </>
  );
}