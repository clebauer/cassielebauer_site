// No need to import React with "react-jsx"
import { Link } from 'react-router-dom';

// Define props type
type HeaderProps = {
  routes: { path: string; name: string }[];
};

function Header({ routes }: HeaderProps) {
  return (
    <header className="navbar">
      <nav>
        <ul>
          {routes.map(({ path, name }) => (
            <li key={path}>
              <Link to={path}>{name}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
