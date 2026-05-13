import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Header from 'components/layout/Header'
import Sidebar from 'components/layout/Sidebar'

import Home from 'pages/home/Home'
import Resume from 'pages/resume/index'

import './App.css'

const routes = [
  { path: '/', component: <Home />, name: 'Home' },
  // { path: '/resume', component: <Resume />, name: 'Resume' },
]

function App() {
  return (
    <Router>
      <Header routes={routes} />

      <div className="app-layout">
        <Sidebar />
          <main className="app-main">
            <Routes>
              {routes.map(({ path, component }) => (
                <Route key={path} path={path} element={component} />
              ))}
            </Routes>
          </main>
      </div>
    </Router>
  )
}

export default App
