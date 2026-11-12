import { useState } from "react";
import { items, TAGS } from "features/everything/data/everything";
import "features/everything/Everything.css";
import Page from "components/ui/Page";
import Icon from "components/ui/Icon";
import SourceLink from "components/ui/SourceLink";

const FILTERS = [
  { id: "all", label: "all", color: "var(--gray-mid)" },
  { id: "starred", label: "starred", color: "var(--color-3)" },
  ...TAGS.map((t) => ({ ...t, color: `var(--color-${t.color})` })),
];

// "2023 - present", "2012 - 2013", "ongoing", "2022", or "" if undated
function dateLabel({ year, endYear, ongoing }) {
  if (ongoing) return year ? `${year} - present` : "ongoing";
  if (endYear && endYear !== year) return `${year} - ${endYear}`;
  return year ? String(year) : "";
}

// ongoing counts as "now"; otherwise use the end year, then the start year
const latest = (i) => (i.ongoing ? Infinity : i.endYear ?? i.year ?? 0);

// newest to oldest; ties go to the later start year, then data-file order
const sorted = [...items].sort(
  (a, b) => latest(b) - latest(a) || (b.year ?? 0) - (a.year ?? 0)
);

function matches(item, filter) {
  if (filter === "all") return true;
  if (filter === "starred") return !!item.starred;
  return item.tags.includes(filter);
}

export default function Everything() {
  const [active, setActive] = useState("all");
  const [view, setView] = useState("list");

  const shown = sorted.filter((i) => matches(i, active));

  return (
    <Page title="everything">
      <p className="intro">
        Things I'm proud of, including the ones that aren't on a resume.
      </p>

      <div className="toolbar">
        <div className="filters" role="group" aria-label="Filter by topic">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className="chip"
              style={{ "--chip-color": f.color }}
              aria-pressed={active === f.id}
              onClick={() => setActive(f.id)}
            >
              {f.id === "starred" && <Icon name="star" />}
              {f.label}
            </button>
          ))}
        </div>

        <div className="filters view-toggle" role="group" aria-label="View">
          <button
            type="button"
            className="chip"
            aria-pressed={view === "cards"}
            onClick={() => setView("cards")}
          >
            <Icon name="grid" /> cards
          </button>
          <button
            type="button"
            className="chip"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
          >
            <Icon name="list" /> list
          </button>
        </div>
      </div>

      <p className="count" aria-live="polite">
        {shown.length} {shown.length === 1 ? "thing" : "things"}
      </p>

      <ul className={`entries${view === "list" ? " entries--list" : ""}`}>
        {shown.map((i) => {
          const color = sorted.indexOf(i); // stable color, even when filtering
          const date = dateLabel(i);
          return (
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
                  <div className="entry-title-row">
                    {i.starred && (
                      <span className="entry-star">
                        <Icon name="star" />
                        <span className="visually-hidden">starred</span>
                      </span>
                    )}
                    <h2 className="entry-title">{i.title}</h2>

                    <span className="entry-links">
                      {(i.links ?? []).map((l, n) => (
                        <SourceLink
                          key={l.url}
                          label={l.label}
                          href={l.url}
                          accent={((color + n) % 6) + 1}
                        />
                      ))}
                    </span>
                  </div>
                  {date && <span className="year">{date}</span>}
                </div>
                {i.blurb && <p>{i.blurb}</p>}
              </div>
            </li>
          );
        })}
      </ul>
    </Page>
  );
}