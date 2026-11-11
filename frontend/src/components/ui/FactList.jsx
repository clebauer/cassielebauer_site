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
                {facts.map((text, i) => (
                    <li key={i} style={{ "--bullet-color": `var(--color-${(i % 6) + 1})` }}>
                        {text}
                    </li>
                ))}
            </ul>
        </section>
    );
}