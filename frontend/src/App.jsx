import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from "react";

import Header from 'components/layout/Header'
import MobileNav from 'components/layout/MobileNav'
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
  return (
    <>
      <Header />
      <MobileNav />
      <div className="app-layout">
        <Sidebar />
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