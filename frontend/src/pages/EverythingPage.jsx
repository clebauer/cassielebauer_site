import { useState } from "react";
import { items, TAGS, SIDES } from "features/everything/data/everything";
import "features/everything/Everything.css";
import Page from "components/ui/Page";
import Icon from "components/ui/Icon";
import SourceLink from "components/ui/SourceLink";

// which tab the page opens on: "professional", "personal" or "all"
const DEFAULT_TAB = "all";

const TABS = [...SIDES, { id: "all", label: "everything", color: 6 }];
const tagColor = (t) => `var(--color-${t.color})`;
const tagById = Object.fromEntries(TAGS.map((t) => [t.id, t]));

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

function Entry({ item, activeTag, onTag }) {
  const color = sorted.indexOf(item); // stable color, even when filtering
  const date = dateLabel(item);
  return (
    <li className="entry">
      {item.image && (
        <img
          className="thumb"
          src={item.image.src}
          alt={item.image.alt}
          width="64"
          height="64"
          loading="lazy"
        />
      )}
      <div className="entry-body">
        <div className="entry-head">
          <div className="entry-title-row">
            {item.starred && (
              <span className="entry-star">
                <Icon name="star" />
                <span className="visually-hidden">starred</span>
              </span>
            )}
            <h2 className="entry-title">{item.title}</h2>

            <span className="entry-links">
              {(item.links ?? []).map((l, n) => (
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
        {item.blurb && <p>{item.blurb}</p>}

        <div className="entry-tags">
          {item.tags.map((id) => {
            const t = tagById[id];
            if (!t) return null;
            return (
              <button
                key={id}
                type="button"
                className="tag"
                style={{ "--tag-color": tagColor(t) }}
                aria-pressed={activeTag === id}
                onClick={() => onTag(id)}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
    </li>
  );
}

export default function Everything() {
  const [tab, setTab] = useState(DEFAULT_TAB);
  const [sort, setSort] = useState("newest"); // "newest" | "tag"
  const [tag, setTag] = useState(null); // one tag id, or null
  const [starredOnly, setStarredOnly] = useState(false);
  const [view, setView] = useState("list");
  const [closed, setClosed] = useState(() => new Set()); // collapsed tag sections

  const shown = sorted.filter(
    (i) =>
      (tab === "all" || i.side === tab) &&
      (!starredOnly || i.starred) &&
      (!tag || i.tags.includes(tag))
  );

  // sorting by tag: one section per tag, and a thing shows under every tag it has.
  // (if you've picked a single tag, the list is just that tag, so no sections)
  const grouped = sort === "tag" && !tag;
  const sections = grouped
    ? TAGS.map((t) => ({ tag: t, rows: shown.filter((i) => i.tags.includes(t.id)) })).filter(
        (s) => s.rows.length
      )
    : [];

  const toggleTag = (id) => setTag((cur) => (cur === id ? null : id));
  const toggleSection = (id) =>
    setClosed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const listClass = `entries${view === "list" ? " entries--list" : ""}`;
  const renderList = (rows) => (
    <ul className={listClass}>
      {rows.map((i) => (
        <Entry key={i.title} item={i} activeTag={tag} onTag={toggleTag} />
      ))}
    </ul>
  );

  const clearAll = () => {
    setTag(null);
    setStarredOnly(false);
  };

  return (
    <Page title="everything">
      <p className="intro">
        Things I'm proud of, including the ones that aren't on a resume.
      </p>

      <div className="tabs" role="tablist" aria-label="Show">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            className={`tab${tab === t.id ? " squiggle-title" : ""}`}
            style={{ "--squiggle-color": tagColor(t) }}
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="toolbar">
        <label className="filter-select">
          <span className="visually-hidden">sort</span>
          <select
            value={sort}
            disabled={!!tag}
            title={tag ? "clear the tag to sort by tag" : undefined}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">newest first</option>
            <option value="tag">by tag</option>
          </select>
        </label>

        <button
          type="button"
          className="chip"
          style={{ "--chip-color": "var(--color-3)" }}
          aria-pressed={starredOnly}
          onClick={() => setStarredOnly((s) => !s)}
        >
          <Icon name="star" />
          starred
        </button>

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
        {tag && tagById[tag] && (
          <>
            {" "}
            tagged{" "}
            <button
              type="button"
              className="chip chip--small"
              style={{ "--chip-color": tagColor(tagById[tag]) }}
              aria-pressed="true"
              onClick={() => setTag(null)}
            >
              {tagById[tag].label} <span aria-hidden="true">✕</span>
              <span className="visually-hidden">clear this tag</span>
            </button>
          </>
        )}
        {shown.length === 0 && (tag || starredOnly) && (
          <>
            {" "}
            <button type="button" className="chip chip--small" onClick={clearAll}>
              clear filters
            </button>
          </>
        )}
      </p>

      <div role="tabpanel">
        {grouped
          ? sections.map(({ tag: t, rows }) => {
              const open = !closed.has(t.id);
              return (
                <section key={t.id} className="group">
                  <h2 className="group-head">
                    <button
                      type="button"
                      className="group-toggle"
                      style={{ "--tag-color": tagColor(t) }}
                      aria-expanded={open}
                      aria-controls={`group-${t.id}`}
                      onClick={() => toggleSection(t.id)}
                    >
                      <span className="dot" aria-hidden="true" />
                      {t.label}
                      <span className="n">{rows.length}</span>
                    </button>
                  </h2>
                  <div id={`group-${t.id}`} hidden={!open}>
                    {renderList(rows)}
                  </div>
                </section>
              );
            })
          : renderList(shown)}
      </div>
    </Page>
  );
}