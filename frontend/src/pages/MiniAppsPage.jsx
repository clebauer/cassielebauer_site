import { Link } from 'react-router-dom'
import { miniApps } from 'features/miniapps/registry'

export default function MiniApps() {
  return (
    <ul>
      {miniApps.map(({ slug, title, description }) => (
        <li key={slug}>
          <Link to={`/miniapps/${slug}`}>{title}</Link> – {description}
        </li>
      ))}
    </ul>
  )
}