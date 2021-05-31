import { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from 'react-router-dom';
import { Tweets } from './Tweets';
import { Report } from './Report';

const HOST =
  process.env.NODE_ENV !== 'production' ? 'http://localhost:5000' : '';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () =>
      process.env.NODE_ENV !== 'production' ||
      document.querySelector('meta[name=login]').content === 'True'
  );

  return (
    <Router>
      <div className="">
        <header className="text-center">
          <h2 className="text-2xl font-extrabold text-gray-900">
            Echo Chamber Meter
          </h2>
          <p className="text-gray-500">
            How diversified is your social circle?
          </p>
        </header>

        <nav className="bg-white">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 flex text-xs items-center justify-center h-8">
            <NavLink
              className="nav-link"
              to="/"
              exact
              activeClassName="border-indigo-300"
            >
              Home
            </NavLink>
            <NavLink
              className="nav-link"
              to="/report"
              activeClassName="border-indigo-300"
            >
              Report
            </NavLink>
            <NavLink
              className="nav-link"
              to="/friends"
              activeClassName="border-indigo-300"
            >
              Friends
            </NavLink>
            <NavLink
              className="nav-link"
              to="/settings"
              activeClassName="border-indigo-300"
            >
              Settings
            </NavLink>
          </div>
        </nav>

        <Switch>
          <Route exact path="/">
            {isLoggedIn ? (
              <Tweets isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Login />
            )}
          </Route>
          <Route path="/report">
            <Report />
          </Route>
          <Route path="/challenge">
            <h1>Challenge friends</h1>
          </Route>
          <Route path="/settings">{isLoggedIn ? <Logout /> : <Login />}</Route>
        </Switch>
      </div>
    </Router>
  );
}

function Login() {
  return (
    <a href={`${HOST}/auth/login`}>
      <button type="button" className="btn">
        Login
      </button>
    </a>
  );
}
function Logout() {
  return (
    <a href={`${HOST}/auth/logout`}>
      <button type="button" className="btn">
        Logout
      </button>
    </a>
  );
}

export default App;
