import "./ResumeIntro.css";

// two matching callouts: who i am, and what i'm after.
// tone picks the colors (see ResumeIntro.css); squiggle is the 1-6 palette number under the label.
const CALLOUTS = [
  {
    label: "who am i",
    tone: "who",
    squiggle: 6,
    text: "a full-stack software engineer who uses react, python/fastapi, and sql to built tools/web apps with accessibility built in from the start.",
  },
  {
    label: "looking for",
    tone: "want",
    squiggle: 2,
    text: "a front-end or full-stack role on a small, product-minded team where i can own features end to end and help the team grow.",
  },
];

export default function ResumeIntro() {
  return (
    <section className="resume-intro" aria-label="summary">
      {CALLOUTS.map(({ label, tone, squiggle, text }) => (
        <div className={`callout callout--${tone}`} key={label}>
          <h2
            className="callout-label squiggle-title"
            style={{ "--squiggle-color": `var(--color-${squiggle})` }}
          >
            {label}
          </h2>
          <p>{text}</p>
        </div>
      ))}
    </section>
  );
}