import React from 'react'
import { Link } from 'react-router-dom'

function Header({ routes }) {
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
  )
}

export default Header
