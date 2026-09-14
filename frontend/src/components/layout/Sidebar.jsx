import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const items = [
    // { id: "home", label: "Home", to: "/" },
    // { id: "resume", label: "Resume", to: "/resume" },
    { id: "there", label: "there", to: "/" },
    { id: "will", label: "will", to: "/" },
    { id: "be", label: "be", to: "/" },
    { id: "more", label: "more", to: "/" },
    { id: "soon", label: "soon", to: "/" },
//     { id: "projects", label: "Projects", to: "/projects" },
//     { id: "skills", label: "Skills", to: "/skills" },
//     { id: "tools", label: "Tools", to: "/tools" },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {items.map((item, index) => (
          <NavLink
            key={item.id}
            to={item.to}
            className="sidebar-link"
            style={{
              "--color-index": index + 1
            }}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}