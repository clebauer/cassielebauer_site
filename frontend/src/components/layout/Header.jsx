import { Link } from "react-router-dom";
import "./Header.css";
import FindMe from "./FindMe";

function Header() {
  return (
    <header className="navbar">
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