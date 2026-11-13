import { useEffect, useState } from "react";
import data from "features/everything/data/everything.json";
import Page from "components/ui/Page";
import { SIDES, sideOf } from "features/everything/data/everything";
import "./Admin.css";

// Dev-only editor for everything.json. See the route note in App.

const DEFAULT_IMAGE = "/images/everything/default.jpg";
const STAR_PATH =
  "M12 3.2 L14.4 9 L20.6 9.5 L15.8 13.5 L17.3 19.7 L12.1 16.4 L6.7 19.6 L8.3 13.4 L3.5 9.4 L9.7 9Z";
const UNSAVED = "You have unsaved changes. Leave without saving?";

// the six site colors, in the order of --color-1 … --color-6
const COLORS = [
  [1, "pink"],
  [2, "orange"],
  [3, "yellow"],
  [4, "green"],
  [5, "blue"],
  [6, "purple"],
];

const tagColor = (t) => `var(--color-${t.color})`;

const slugify = (label) =>
  label.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "topic";

const blankDraft = () => ({
  title: "",
  blurb: "",
  year: "",
  endYear: "",
  ongoing: false,
  tags: [],
  side: "personal",
  starred: false,
  hidden: false,
  reviewed: false,
  imageSrc: DEFAULT_IMAGE,
  imageAlt: "",
  links: [],
});

const toDraft = (i) => ({
  title: i.title,
  blurb: i.blurb ?? "",
  year: i.year ?? "",
  endYear: i.endYear ?? "",
  ongoing: !!i.ongoing,
  tags: [...i.tags],
  side: sideOf(i),
  starred: !!i.starred,
  hidden: !!i.hidden,
  reviewed: !!i.reviewed,
  imageSrc: i.image?.src ?? "",
  imageAlt: i.image?.alt ?? "",
  links: (i.links ?? []).map((l) => ({ ...l })),
});

// drop empty fields so the JSON stays tidy
const fromDraft = (d) => {
  const item = { title: d.title.trim() };
  if (d.blurb.trim()) item.blurb = d.blurb.trim();
  if (d.year !== "") item.year = Number(d.year);
  if (d.endYear !== "") item.endYear = Number(d.endYear);
  if (d.ongoing) item.ongoing = true;
  item.tags = d.tags;
  item.side = d.side;
  item.starred = d.starred;
  if (d.hidden) item.hidden = true;
  if (d.reviewed) item.reviewed = true;
  if (d.imageSrc) item.image = { src: d.imageSrc, alt: d.imageAlt };
  item.links = d.links
    .filter((l) => l.url.trim())
    .map((l) => ({ label: l.label.trim(), url: l.url.trim() }));
  return item;
};

const dateText = ({ year, endYear, ongoing }) => {
  if (ongoing) return year ? `${year} – present` : "ongoing";
  if (endYear && endYear !== year) return `${year} – ${endYear}`;
  return year ? String(year) : "";
};

function Chip({ on, color, onClick, children }) {
  return (
    <button
      type="button"
      className="admin-chip"
      aria-pressed={on}
      style={color ? { "--chip-color": color } : undefined}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// ---------- add / rename / recolor / reorder / delete topics ----------
function TopicsManager({ tags, items, status, onSave, onClose }) {
  const [rows, setRows] = useState(() => tags.map((t) => ({ ...t })));
  const [error, setError] = useState("");
  const changed = JSON.stringify(rows) !== JSON.stringify(tags);

  const used = (id) => items.filter((i) => i.tags.includes(id)).length;
  const update = (n, patch) => setRows((r) => r.map((t, i) => (i === n ? { ...t, ...patch } : t)));

  const move = (n, dir) =>
    setRows((r) => {
      const m = n + dir;
      if (m < 0 || m >= r.length) return r;
      const next = [...r];
      [next[n], next[m]] = [next[m], next[n]];
      return next;
    });

  const add = () => setRows((r) => [...r, { id: "", label: "", color: 5 }]);

  const close = () => {
    if (changed && !window.confirm("Discard your topic changes?")) return;
    onClose();
  };

  function save() {
    const labels = rows.map((t) => t.label.trim());
    if (labels.some((l) => !l)) return setError("every topic needs a name");
    if (new Set(labels.map((l) => l.toLowerCase())).size !== labels.length) {
      return setError("two topics have the same name");
    }

    // new topics get an id made from their name; existing ids never change
    const taken = new Set(rows.map((t) => t.id).filter(Boolean));
    const final = rows.map((t) => {
      let id = t.id;
      if (!id) {
        const base = slugify(t.label);
        id = base;
        for (let n = 2; taken.has(id); n++) id = `${base}-${n}`;
        taken.add(id);
      }
      return { id, label: t.label.trim(), color: t.color };
    });
    setError("");
    onSave(final);
  }

  return (
    <section className="admin-card admin-topics" aria-label="Manage topics">
      <h3 className="admin-card-title">manage topics</h3>

      <ul className="admin-topic-list">
        {rows.map((t, n) => {
          const count = t.id ? used(t.id) : 0;
          return (
            <li className="admin-topic-row" key={t.id || `new-${n}`}>
              <input
                aria-label={`topic ${n + 1} name`}
                placeholder="topic name"
                value={t.label}
                onChange={(e) => update(n, { label: e.target.value })}
              />

              <div className="admin-swatches" role="group" aria-label={`color for ${t.label || "new topic"}`}>
                {COLORS.map(([num, name]) => (
                  <button
                    key={num}
                    type="button"
                    className="admin-swatch"
                    aria-label={name}
                    aria-pressed={t.color === num}
                    style={{ "--swatch": `var(--color-${num})` }}
                    onClick={() => update(n, { color: num })}
                  />
                ))}
              </div>

              <span className="admin-topic-used">{count ? `${count} in use` : "unused"}</span>

              <button
                type="button"
                className="admin-ghost admin-icon"
                aria-label={`move ${t.label || "topic"} up`}
                disabled={n === 0}
                onClick={() => move(n, -1)}
              >
                ↑
              </button>
              <button
                type="button"
                className="admin-ghost admin-icon"
                aria-label={`move ${t.label || "topic"} down`}
                disabled={n === rows.length - 1}
                onClick={() => move(n, 1)}
              >
                ↓
              </button>
              <button
                type="button"
                className="admin-ghost admin-icon"
                aria-label={`delete ${t.label || "topic"}`}
                title={count ? "remove it from those entries first" : "delete topic"}
                disabled={count > 0}
                onClick={() => setRows((r) => r.filter((_, i) => i !== n))}
              >
                ✕
              </button>
            </li>
          );
        })}
      </ul>

      <div className="admin-actions-row">
        <button type="button" className="admin-ghost" onClick={add}>+ add topic</button>
        <button type="button" className="admin-primary" disabled={!changed} onClick={save}>
          save topics
        </button>
        <button type="button" className="admin-ghost" onClick={close}>close</button>
        <span className="admin-status" role="status">{error || status}</span>
      </div>
      <p className="admin-hint">
        Order here is the order of the list and the filter chips. Topics nothing uses won't show on
        the live page.
      </p>
    </section>
  );
}

export default function EverythingAdmin() {
  const [items, setItems] = useState(data.items);
  const [tags, setTags] = useState(data.tags);
  const [sel, setSel] = useState(null); // an index, "new", or null
  const [draft, setDraft] = useState(null);
  const [baseline, setBaseline] = useState(""); // the draft as it was when opened
  const [status, setStatus] = useState("");
  const [collapsed, setCollapsed] = useState(() => new Set());
  const [grouping, setGrouping] = useState("first"); // "first" | "all"
  const [reviewFilter, setReviewFilter] = useState("all"); // "all" | "todo" | "done"
  const [topicsOpen, setTopicsOpen] = useState(false);

  const dirty = !!draft && JSON.stringify(draft) !== baseline;
  const reviewedCount = items.filter((i) => i.reviewed).length;

  const set = (key, value) => setDraft((d) => ({ ...d, [key]: value }));
  const tagLabel = (id) => tags.find((t) => t.id === id)?.label ?? id;

  // ---------- unsaved-changes protection ----------
  useEffect(() => {
    if (!dirty) return;

    // closing the tab, refreshing, typing a new address
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    // clicking any link on the site (sidebar, header, brand)
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.("a[href]");
      if (!a || a.target === "_blank") return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (!window.confirm(UNSAVED)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [dirty]);

  const confirmDiscard = () => !dirty || window.confirm("You have unsaved changes. Discard them?");

  const open = (index) => {
    if (index === sel) return;
    if (!confirmDiscard()) return;
    const next = index === "new" ? blankDraft() : toDraft(items[index]);
    setSel(index);
    setDraft(next);
    setBaseline(JSON.stringify(next));
    setStatus("");
  };

  const close = () => {
    setSel(null);
    setDraft(null);
    setBaseline("");
  };

  const cancel = () => {
    if (confirmDiscard()) close();
  };

  // ---------- saving ----------
  async function persist(next, nextTags = tags) {
    // keep the file grouped by first tag, in the same order as the tag list
    const order = (i) => nextTags.findIndex((t) => t.id === i.tags[0]);
    const ordered = [...next].sort((a, b) => order(a) - order(b));
    const res = await fetch("/__everything", {
      method: "POST",
      body: JSON.stringify({ tags: nextTags, items: ordered }),
    });
    if (!res.ok) {
      setStatus(`save failed: ${await res.text()}`);
      return false;
    }
    setItems(ordered);
    setTags(nextTags);
    setStatus("saved ✓");
    return true;
  }

  async function save() {
    const title = draft.title.trim();
    if (!title) return setStatus("needs a title");
    if (!draft.tags.length) return setStatus("pick at least one topic");
    const dupe = items.some(
      (x, n) => n !== sel && x.title.trim().toLowerCase() === title.toLowerCase()
    );
    if (dupe) return setStatus("something with that title already exists");

    const item = fromDraft(draft);
    const next = sel === "new" ? [...items, item] : items.map((x, n) => (n === sel ? item : x));
    if (await persist(next)) close();
  }

  async function remove() {
    if (!window.confirm(`delete "${items[sel].title}"?`)) return;
    if (await persist(items.filter((_, n) => n !== sel))) close();
  }

  async function saveTopics(nextTags) {
    if (await persist(items, nextTags)) setTopicsOpen(false);
  }

  function downloadBackup() {
    const blob = new Blob([JSON.stringify({ tags, items }, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "everything.json";
    a.click();
  }

  // ---------- small helpers ----------
  const toggleGroup = (id) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // tags keep the order you clicked them in; the first one is where it's filed
  const toggleTag = (id) =>
    set("tags", draft.tags.includes(id) ? draft.tags.filter((t) => t !== id) : [...draft.tags, id]);

  const setLink = (n, key, value) =>
    set(
      "links",
      draft.links.map((l, i) => (i === n ? { ...l, [key]: value } : l))
    );

  const filedUnder = draft && tags.find((t) => t.id === draft.tags[0]);

  // does this item pass the "checked off / not yet" filter?
  const passesReview = (item) =>
    reviewFilter === "all" || (reviewFilter === "done") === !!item.reviewed;

  // the groups shown on the left
  const byTag = tags
    .map((tag) => ({
      tag,
      rows: items
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => passesReview(item))
        .filter(({ item }) =>
          grouping === "all" ? item.tags.includes(tag.id) : item.tags[0] === tag.id
        ),
    }))
    .filter((g) => g.rows.length);

  const bySide = SIDES.map((side) => ({
    tag: side,
    rows: items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => passesReview(item))
      .filter(({ item }) => sideOf(item) === side.id),
  })).filter((g) => g.rows.length);

  const groups = grouping === "side" ? bySide : byTag;

  return (
    <Page title="edit everything">
      <p className="admin-note">
        Dev only: this page doesn't exist on the live site. Saving writes to everything.json; then
        commit and push as usual.
      </p>

      <div className="admin-toolbar">
        <label className="admin-grouping">
          <span>list</span>
          <select value={grouping} onChange={(e) => setGrouping(e.target.value)}>
            <option value="first">see by first</option>
            <option value="all">see by all</option>
            <option value="side">see by tab</option>
          </select>
        </label>

        <label className="admin-grouping">
          <span>show</span>
          <select value={reviewFilter} onChange={(e) => setReviewFilter(e.target.value)}>
            <option value="all">everything</option>
            <option value="todo">not checked off yet</option>
            <option value="done">checked off</option>
          </select>
        </label>

        <span className="admin-progress">
          ✓ {reviewedCount} of {items.length} feel good
        </span>

        <button
          type="button"
          className="admin-ghost admin-toolbar-end"
          aria-expanded={topicsOpen}
          onClick={() => {
            setStatus("");
            setTopicsOpen((o) => !o);
          }}
        >
          manage topics
        </button>
      </div>

      <div className="admin">
        {/* ---------- left: the list ---------- */}
        <aside className="admin-list" aria-label="All items">
          <div className="admin-list-top">
            <button type="button" className="admin-primary" onClick={() => open("new")}>
              + new item
            </button>
            <button type="button" className="admin-ghost" onClick={downloadBackup}>
              backup
            </button>
          </div>

          {groups.length === 0 && <p className="admin-hint">nothing matches that filter</p>}

          {groups.map(({ tag, rows }) => {
            const isOpen = !collapsed.has(tag.id);
            return (
              <section key={tag.id} className="admin-group">
                <h2 className="admin-group-title" style={{ "--dot": tagColor(tag) }}>
                  <button
                    type="button"
                    className="admin-group-toggle"
                    aria-expanded={isOpen}
                    aria-controls={`group-${tag.id}`}
                    onClick={() => toggleGroup(tag.id)}
                  >
                    <span className="admin-chevron" aria-hidden="true" />
                    <span className="admin-dot" aria-hidden="true" />
                    {tag.label}
                    <span className="admin-count">{rows.length}</span>
                  </button>
                </h2>
                <ul id={`group-${tag.id}`} hidden={!isOpen}>
                  {rows.map(({ item, index }) => {
                    const secondary = grouping !== "side" && item.tags[0] !== tag.id;
                    return (
                      <li key={item.title}>
                        <button
                          type="button"
                          className="admin-row"
                          aria-current={sel === index}
                          data-hidden={item.hidden || undefined}
                          data-secondary={secondary || undefined}
                          onClick={() => open(index)}
                        >
                          <span className="admin-row-title">
                            {item.starred && (
                              <span className="admin-star" aria-label="starred">★</span>
                            )}
                            {item.title}
                            {item.reviewed && (
                              <span className="admin-checkmark" aria-label="feels good">✓</span>
                            )}
                            {item.hidden && <span className="admin-badge">hidden</span>}
                            {item.tags.length > 1 && (
                              <span className="admin-also">
                                (
                                {item.tags.map((id, n) => (
                                  <span key={id}>
                                    {n > 0 && ", "}
                                    {n === 0 ? <strong>{tagLabel(id)}</strong> : tagLabel(id)}
                                  </span>
                                ))}
                                )
                              </span>
                            )}
                          </span>
                          <span className="admin-date">{dateText(item)}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </aside>

        {/* ---------- right: topics manager + the form ---------- */}
        <div className="admin-form">
          {topicsOpen && (
            <TopicsManager
              tags={tags}
              items={items}
              status={status}
              onSave={saveTopics}
              onClose={() => setTopicsOpen(false)}
            />
          )}

          {!draft ? (
            <div className="admin-empty">
              <p>Pick something on the left, or add a new one.</p>
              {!topicsOpen && status && <p role="status">{status}</p>}
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                save();
              }}
            >
            <div className="admin-bar">
              {sel !== "new" && (
                <button type="button" className="admin-danger" onClick={remove}>delete</button>
              )}
              {dirty && <span className="admin-unsaved">unsaved changes</span>}
              <span className="admin-status" role="status">{!topicsOpen && status}</span>
              <button type="button" className="admin-ghost admin-bar-end" onClick={cancel}>cancel</button>
              <button type="submit" className="admin-primary">save</button>
            </div>
              <section className="admin-card">
                <div className="admin-head">
                  <button
                    type="button"
                    className="admin-starbtn"
                    aria-pressed={draft.starred}
                    aria-label={draft.starred ? "starred (click to unstar)" : "not starred (click to star)"}
                    onClick={() => set("starred", !draft.starred)}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d={STAR_PATH} />
                    </svg>
                  </button>

                  <input
                    className="admin-title-input"
                    aria-label="title"
                    placeholder="title"
                    value={draft.title}
                    onChange={(e) => set("title", e.target.value)}
                  />

                  <button
                    type="button"
                    role="switch"
                    aria-checked={!draft.hidden}
                    className="admin-switch"
                    onClick={() => set("hidden", !draft.hidden)}
                  >
                    <span className="admin-switch-track" aria-hidden="true">
                      <span className="admin-switch-thumb" />
                    </span>
                    {draft.hidden ? "hidden" : "active"}
                  </button>

                  <label className="admin-review" title="i feel good about the state of this entry">
                    <input
                      type="checkbox"
                      checked={draft.reviewed}
                      onChange={(e) => set("reviewed", e.target.checked)}
                    />
                    feels good
                  </label>
                </div>

                <label className="admin-field">
                  <span>blurb</span>
                  <textarea
                    rows="3"
                    value={draft.blurb}
                    onChange={(e) => set("blurb", e.target.value)}
                  />
                </label>
              </section>

              <section className="admin-card">
                <h3 className="admin-card-title">when</h3>
                <div className="admin-fields admin-fields--when">
                  <label className="admin-field">
                    <span>year</span>
                    <input
                      type="number"
                      value={draft.year}
                      onChange={(e) => set("year", e.target.value)}
                    />
                  </label>
                  <label className="admin-field">
                    <span>end year</span>
                    <input
                      type="number"
                      value={draft.endYear}
                      onChange={(e) => set("endYear", e.target.value)}
                    />
                  </label>
                  <div className="admin-field admin-field--chip">
                    <Chip on={draft.ongoing} onClick={() => set("ongoing", !draft.ongoing)}>
                      ongoing
                    </Chip>
                  </div>
                </div>
              </section>

              <section className="admin-card">
                <h3 className="admin-card-title">shows under</h3>
                <div className="admin-chips" role="group" aria-label="Which tab">
                  {SIDES.map((s) => (
                    <Chip
                      key={s.id}
                      color={tagColor(s)}
                      on={draft.side === s.id}
                      onClick={() => set("side", s.id)}
                    >
                      {s.label}
                    </Chip>
                  ))}
                </div>
                <p className="admin-hint">it always shows under everything, too</p>
              </section>

              <section className="admin-card">
                <h3 className="admin-card-title">topics</h3>
                <div className="admin-chips" role="group" aria-label="Topics">
                  {tags.map((t) => (
                    <Chip
                      key={t.id}
                      color={tagColor(t)}
                      on={draft.tags.includes(t.id)}
                      onClick={() => toggleTag(t.id)}
                    >
                      {t.label}
                    </Chip>
                  ))}
                </div>
                <p className="admin-hint">
                  {filedUnder
                    ? `filed under ${filedUnder.label} (the first one you picked)`
                    : "pick at least one"}
                </p>
              </section>

              <section className="admin-card">
                <h3 className="admin-card-title">links</h3>
                {draft.links.map((l, n) => (
                  <div className="admin-link" key={n}>
                    <input
                      placeholder="label"
                      aria-label={`link ${n + 1} label`}
                      value={l.label}
                      onChange={(e) => setLink(n, "label", e.target.value)}
                    />
                    <input
                      placeholder="https://..."
                      aria-label={`link ${n + 1} url`}
                      value={l.url}
                      onChange={(e) => setLink(n, "url", e.target.value)}
                    />
                    <button
                      type="button"
                      className="admin-ghost"
                      aria-label={`remove link ${n + 1}`}
                      onClick={() => set("links", draft.links.filter((_, i) => i !== n))}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <div>
                  <button
                    type="button"
                    className="admin-ghost"
                    onClick={() => set("links", [...draft.links, { label: "", url: "" }])}
                  >
                    + add link
                  </button>
                </div>
              </section>

              <details className="admin-card admin-more">
                <summary>image</summary>
                <div className="admin-fields">
                  <label className="admin-field">
                    <span>path</span>
                    <input
                      value={draft.imageSrc}
                      onChange={(e) => set("imageSrc", e.target.value)}
                    />
                  </label>
                  <label className="admin-field">
                    <span>alt text (blank if decorative)</span>
                    <input
                      value={draft.imageAlt}
                      onChange={(e) => set("imageAlt", e.target.value)}
                    />
                  </label>
                </div>
              </details>

            </form>
          )}
        </div>
      </div>
    </Page>
  );
}