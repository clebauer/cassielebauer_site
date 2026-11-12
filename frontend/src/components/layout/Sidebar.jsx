import { NavLink } from "react-router-dom";
import Icon from "components/ui/Icon";
import "./Sidebar.css";

const items = [
  { id: "resume", label: "resume", to: "/resume", icon: "resume" },
  { id: "miniapps", label: "mini apps", to: "/miniapps", icon: "code" },
  { id: "everything", label: "everything", to: "/everything", icon: "chest" },
];

//     { id: "about", label: "about me", to: "/" },
//     { id: "tech", label: "tech", to: "/" },
//     { id: "art", label: "art", to: "/" },
//     { id: "community", label: "community", to: "/" },
//     { id: "home", label: "Home", to: "/" },
//     { id: "projects", label: "Projects", to: "/projects" },
//     { id: "skills", label: "Skills", to: "/skills" },
//     { id: "tools", label: "Tools", to: "/tools" }, ];

export default function Sidebar({ open, onNavigate }) {
  return (
    <div id="site-menu" className={`sidebar panel${open ? " is-open" : ""}`}>
      <NavLink to="/" end className="col-title brand" onClick={onNavigate}>
        <Icon name="home" />
        cassie /
      </NavLink>

      <nav className="sidebar-nav" aria-label="main">
        {items.map((item, index) => (
          <NavLink
            key={item.id}
            to={item.to}
            end={item.to === "/"}
            className="sidebar-link"
            style={{ "--color-index": index + 1 }}
            onClick={onNavigate}
          >
            <Icon name={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
