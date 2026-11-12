import { Link } from "react-router-dom";
import "./Header.css";
import Icon from "components/ui/Icon";
import FindMe from "./FindMe";

function Header({ menuOpen, onMenuToggle }) {
  return (
    <header className="navbar">
      <button
        type="button"
        className="menu-button"
        aria-label="menu"
        aria-expanded={menuOpen}
        aria-controls="site-menu"
        onClick={onMenuToggle}
      >
        <Icon name={menuOpen ? "close" : "menu"} />
      </button>

      <Link to="/" className="site-title">
        hi there, cassie lebauer here!
      </Link>

      <p className="tagline">
        creator of apps, art, accessibility, and community. &lt;3{" "}
      </p>
      <FindMe />

    </header>
  );
}

export default Header;
