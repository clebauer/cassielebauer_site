import { Link, NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ open, onNavigate }) {
    const items = [
        { id: "resume", label: "resume", to: "/resume" },
        { id: "miniapps", label: "mini apps", to: "/miniapps" },
        { id: "everything", label: "everything", to: "/everything" },
//         { id: "about", label: "about me", to: "/" },
//         { id: "tech", label: "tech", to: "/" },
//         { id: "art", label: "art", to: "/" },
//         { id: "community", label: "community", to: "/" },
//         { id: "there", label: "there", to: "/" },
//         { id: "will", label: "will", to: "/" },
//         { id: "be", label: "be", to: "/" },
//         { id: "more", label: "more", to: "/" },
//         { id: "soon", label: "soon", to: "/" },
//
//         { id: "home", label: "Home", to: "/" },
//         { id: "resume", label: "Resume", to: "/resume" },
//         { id: "projects", label: "Projects", to: "/projects" },
//         { id: "skills", label: "Skills", to: "/skills" },
//         { id: "tools", label: "Tools", to: "/tools" },
    ];

    return (
        <div id="site-menu" className={`sidebar panel${open ? " is-open" : ""}`}>
            <NavLink to="/" end className="col-title brand" onClick={onNavigate}>
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
                    {item.label}
                </NavLink>
                ))}
            </nav>
        </div>
    );
}
