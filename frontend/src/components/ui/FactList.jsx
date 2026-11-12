import SourceLink from "components/ui/SourceLink";
import "./FactList.css";

export default function FactList({ title, facts, accent }) {
  return (
    <section className="facts-section">
      <h2
        className="squiggle-title"
        style={accent ? { "--squiggle-color": `var(--color-${accent})` } : undefined}
      >
        {title}
      </h2>
      <ul className="facts">
        {facts.map((fact, i) => {
          const { text, links = [] } = typeof fact === "string" ? { text: fact } : fact;
          return (
            <li key={i} style={{ "--bullet-color": `var(--color-${(i % 6) + 1})` }}>
              {text}
              {links.map((l) => (
                <SourceLink key={l.label} {...l} />
              ))}
            </li>
          );
        })}
      </ul>
    </section>
  );
}