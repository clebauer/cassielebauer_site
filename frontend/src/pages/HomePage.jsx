import { Link } from "react-router-dom";
import Icon from "components/ui/Icon";
import "features/home/Home.css";

const professional = [
  "I'm a senior full stack developer working in React and Python.",
  "I have a master's in computer science, and I've co-authored cancer-detection research.",
  "I founded Access Indeed and spent eight years in accessibility and business intelligence at Indeed.",
  "I founded Alterknitive, a fiber arts community with over 500 members.",
];

const personal = [
  "I knit, crochet, embroider, and do woodwork.",
  "I'm building a video game with a hand-drawn desktop OS look.",
  "I play trombone and euphonium, and I'm a section leader in NJGSO.",
  "I'm fluent in ASL.",
];

const goLinks = [
  { icon: "code", label: "see what I've built", to: "/tech" },
  { icon: "heart", label: "meet Alterknitive", to: "/community" },
  { icon: "palette", label: "browse my art", to: "/art" },
];

const findMe = [
  { icon: "mail", label: "email", href: "mailto:cassie.lebauer@gmail.com" },
  { icon: "branch", label: "github", href: "https://github.com/clebauer" },
  { icon: "person", label: "linkedin", href: "https://www.linkedin.com/in/cassielebauer" },
  { icon: "camera", label: "instagram", href: "https://www.instagram.com/theartodidact" },
  { icon: "yarn", label: "ravelry", href: "https://www.ravelry.com/projects/QueerHearts" },
];

function FactList({ title, facts }) {
  return (
    <section className="facts-section">
      <h3>{title}</h3>
      <ul className="facts">
        {facts.map((text, i) => (
          <li key={text} style={{ "--bullet-color": `var(--color-${(i % 6) + 1})` }}>
            {text}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <h2>I make apps, accessible tools, communities, and art.</h2>

      <FactList title="professionally," facts={professional} />
      <FactList title="personally," facts={personal} />

      <div className="pill-row">
        {goLinks.map((l, i) => (
          <Link
            key={l.to}
            to={l.to}
            className="pill"
            style={{ "--pill-color": `var(--color-${i + 1})` }}
          >
            <Icon name={l.icon} />
            {l.label}
          </Link>
        ))}
      </div>

      <div className="pill-row">
        {findMe.map((l, i) => (
          <a
            key={l.label}
            href={l.href}
            className="pill"
            style={{ "--pill-color": `var(--color-${((i + 3) % 6) + 1})` }}
            {...(l.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
          >
            <Icon name={l.icon} />
            {l.label}
          </a>
        ))}
      </div>
    </>
  );
}