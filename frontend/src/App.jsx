import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState, lazy, Suspense } from "react";

import Header from 'components/layout/Header'
import Sidebar from 'components/layout/Sidebar'

import Home from 'pages/HomePage'
import Resume from 'pages/ResumePage'
import Everything from 'pages/EverythingPage'
import MiniAppPage from 'pages/MiniAppPage'
import MiniApps from 'pages/MiniAppsPage'

import './App.css'

// dev-only editor: in the production build this is null and the code is left out
const EverythingAdmin = import.meta.env.DEV
  ? lazy(() => import('features/everything/Admin'))
  : null

const routes = [
  { path: '/', component: <Home />, name: 'Home' },
  { path: '/resume', component: <Resume />, name: 'Resume' },
  { path: '/everything', component: <Everything />, name: 'Everything' },
  { path: '/miniapps', component: <MiniApps />, name: 'MiniApps' },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // close the menu after navigating
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // close the menu with Esc
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Header routes={routes} menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((o) => !o)} />
      <div className="app-layout">
        <Sidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />
        <main className="app-main">
          <Routes>
            {routes.map(({ path, component }) => (
              <Route key={path} path={path} element={component} />
            ))}
            <Route path="/miniapps/:slug" element={<MiniAppPage />} />
            {EverythingAdmin && (
              <Route
                path="/admin/everything"
                element={
                  <Suspense fallback={null}>
                    <EverythingAdmin />
                  </Suspense>
                }
              />
            )}
          </Routes>
        </main>
      </div>
    </>
  )
}

export default App