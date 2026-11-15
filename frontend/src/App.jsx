import { Link, Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect, useRef } from "react";

import Header from 'components/layout/Header'
import MobileNav from 'components/layout/MobileNav'
import Sidebar from 'components/layout/Sidebar'
import Page from 'components/ui/Page'

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

// moves focus to the page heading on route change and sets the tab title
function RouteFocus() {
  const { pathname } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    const h1 = document.querySelector("main h1");
    if (first.current) { first.current = false; return; }
    if (h1) { h1.setAttribute("tabindex", "-1"); h1.focus({ preventScroll: true }); }
  }, [pathname]);
  return null;
}

function App() {
  useEffect(() => {
  const el = document.querySelector(".site-top");
  const phone = window.matchMedia("(max-width: 768px)");
  const set = () =>
    document.documentElement.style.setProperty(
      "--site-top-h", phone.matches && el ? `${el.offsetHeight + 8}px` : "0px"
    );
  set();
  const ro = new ResizeObserver(set);
  if (el) ro.observe(el);
  phone.addEventListener("change", set);
  return () => { ro.disconnect(); phone.removeEventListener("change", set); };
}, []);

  return (
    <>
      <a href="#main" className="skip-link">skip to main content</a>
      <RouteFocus />

      {/* header + phone page pills; on phones this whole block stays locked at the top */}
      <div className="site-top">
        <Header />
        <MobileNav />
      </div>
      <div className="app-layout">
        <Sidebar />
        <main className="app-main" id="main">
          <Routes>
            {routes.map(({ path, component }) => (
              <Route key={path} path={path} element={component} />
            ))}
            <Route path="/miniapps/:slug" element={<MiniAppPage />} />
            <Route path="*" element={<Page title="not found"><p>that page doesn't exist. <Link to="/">back home</Link></p></Page>} />
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