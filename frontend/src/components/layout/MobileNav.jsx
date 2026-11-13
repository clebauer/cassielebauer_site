import { NavLink } from "react-router-dom";
import Icon from "components/ui/Icon";
import { pages } from "./navItems";
import "./MobileNav.css";

const items = [{ id: "home", label: "home", to: "/", icon: "home" }, ...pages];

// Phone-only page switcher: a row of pills that sticks to the top while you scroll.
// (Hidden on desktop, where the sidebar does this job.)
export default function MobileNav() {
  return (
    <nav className="mobile-nav" aria-label="main">
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <NavLink
              to={item.to}
              end={item.to === "/"}
              className="mobile-nav-link"
              style={{ "--pill-color": `var(--color-${(index % 6) + 1})` }}
            >
              <Icon name={item.icon} />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}