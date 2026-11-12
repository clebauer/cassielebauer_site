import { Suspense } from 'react'
import { Link, useParams } from 'react-router-dom'
import { miniApps } from 'features/miniapps/registry'
import Page from "components/ui/Page";

export default function MiniAppPage() {
  const { slug } = useParams()
  const app = miniApps.find((a) => a.slug === slug)

  if (!app) {
    return (
      <Page title="not found" parents={[{ label: "mini apps", to: "/miniapps" }]}>
        <p>that app doesn't exist. <Link to="/miniapps">back to mini apps</Link></p>
      </Page>
    );
}

  const AppComponent = app.component
  return (
    <Page
      title={app.title}
      parents={[{ label: "mini apps", to: "/miniapps" }]}
    >
      <Suspense fallback={<p>loading…</p>}>
        <AppComponent />
      </Suspense>
    </Page>
  )
}