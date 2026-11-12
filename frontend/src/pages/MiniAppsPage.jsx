import { Link } from "react-router-dom";
import Page from "components/ui/Page";
import { miniApps } from "features/miniapps/registry";

export default function MiniApps() {
  return (
    <Page title="mini apps">
      <ul className="app-grid">
        {miniApps.map((app, i) => (
          <li key={app.slug}>
            <Link
              to={`/miniapps/${app.slug}`}
              className="app-card"
              style={{ "--card-color": `var(--color-${(i % 6) + 1})` }}
            >
              <h2>{app.title}</h2>
              <p>{app.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </Page>
  );
}