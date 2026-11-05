import { Suspense } from 'react'
import { Link, useParams } from 'react-router-dom'
import { miniApps } from 'features/miniapps/registry'

export default function MiniAppPage() {
  const { slug } = useParams()
  const app = miniApps.find((a) => a.slug === slug)

  if (!app) {
    return <p>App not found. <Link to="/miniapps">Back to mini apps</Link></p>
  }

  const AppComponent = app.component
  return (
    <>
      <Link to="/miniapps">← All mini apps</Link>
      <Suspense fallback={<p>Loading…</p>}>
        <AppComponent />
      </Suspense>
    </>
  )
}