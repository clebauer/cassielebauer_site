import "components/ui/FactList.css";
import "./ResumeSection.css";

function Bullets({ items }) {
  return (
    <ul className="facts">
      {items.map((item, i) => {
        const { label, text } = typeof item === "string" ? { text: item } : item;
        return (
          <li key={label ?? text} style={{ "--bullet-color": `var(--color-${(i % 6) + 1})` }}>
            {label && <strong>{label}: </strong>}
            {text}
          </li>
        );
      })}
    </ul>
  );
}

function Entry({ name, role, dates, bullets }) {
  return (
    <article className="resume-entry">
      <h3 className="entry-name">{name}</h3>
      {dates && <p className="entry-dates">{dates}</p>}
      {role && <p className="entry-role">{role}</p>}
      {bullets && <Bullets items={bullets} />}
    </article>
  );
}

export default function ResumeSection({ title, items, entries }) {
  return (
    <section className="resume-section">
      <h2 className="resume-section-title">{title}</h2>
      <div>
        {entries
          ? entries.map((entry) => <Entry key={entry.name} {...entry} />)
          : <Bullets items={items} />}
      </div>
    </section>
  );
}