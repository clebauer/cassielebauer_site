import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Header from 'components/layout/Header'
import Home from 'pages/Home'
import './App.css'

const routes = [
  { path: '/', component: <Home />, name: 'Home' },
]

function App() {
  return (
    <Router>
      <Header routes={routes} />
      <main>
        <Routes>
          {routes.map(({ path, component }) => (
            <Route key={path} path={path} element={component} />
          ))}
        </Routes>
      </main>
    </Router>
  )
}

export default App
