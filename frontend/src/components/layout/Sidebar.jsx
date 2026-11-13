import { NavLink } from "react-router-dom";
import Icon from "components/ui/Icon";
import { pages } from "./navItems";
import "./Sidebar.css";

// Desktop only: on phones this is hidden and MobileNav takes over.
export default function Sidebar() {
  return (
    <div id="site-menu" className="sidebar panel">
      <NavLink to="/" end className="col-title brand">
        <Icon name="home" />
        cassie /
      </NavLink>

      <nav className="sidebar-nav" aria-label="main">
        {pages.map((item, index) => (
          <NavLink
            key={item.id}
            to={item.to}
            end={item.to === "/"}
            className="sidebar-link"
            style={{ "--color-index": index + 1 }}
          >
            <Icon name={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}


//     { id: "about", label: "about me", to: "/" },
//     { id: "tech", label: "tech", to: "/" },
//     { id: "art", label: "art", to: "/" },
//     { id: "community", label: "community", to: "/" },
//     { id: "home", label: "Home", to: "/" },
//     { id: "projects", label: "Projects", to: "/projects" },
//     { id: "skills", label: "Skills", to: "/skills" },
//     { id: "tools", label: "Tools", to: "/tools" }, ];
