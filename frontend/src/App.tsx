import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from 'components/layout/Header';
import Home from 'pages/Home';

// Define route type
type RouteType = {
  path: string;
  component: JSX.Element;
  name: string;
};

const routes: RouteType[] = [
  { path: '/', component: <Home status="initial" />, name: 'Home' },
];

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Header routes={routes} />
      <Routes>
        {routes.map(({ path, component }) => (
          <Route key={path} path={path} element={component} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
