import Icon from "components/ui/Icon";
import { findMe } from "features/home/findMe";
import "./FindMe.css";

export default function FindMe() {
  return (
    <ul className="find-me" aria-label="find me elsewhere">
      {findMe.map((item, i) => {
        const external = !item.href.startsWith("mailto:");
        return (
          <li key={item.label}>
            <a
              className="find-pill"
              href={item.href}
              style={{ "--pill-color": `var(--color-${(i % 6) + 1})` }}
              {...(external && { target: "_blank", rel: "noopener noreferrer" })}
            >
              <Icon name={item.icon} />
              <span className="find-pill-label">{item.label}</span>
              {external && <span className="visually-hidden"> (opens in a new tab)</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
}