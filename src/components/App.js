import { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from 'react-router-dom';
import { Tweets } from './Tweets';
import { Report } from './Report';
import RadarChart from './RadarChart';
import { ReactComponent as LoginButton } from './figures/login_button.svg';
import { ReactComponent as Icon } from './figures/icon1.svg';

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
        {isLoggedIn && <Header />}

        <Switch>
          <Route exact path="/">
            {isLoggedIn ? (
              <Tweets isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Landing />
            )}
          </Route>
          <Route path="/report">
            <Report />
          </Route>
          <Route path="/friends">
            <RadarChart />
          </Route>
          <Route path="/settings">{isLoggedIn && <Logout />}</Route>
        </Switch>
      </div>
    </Router>
  );
}

function Header() {
  return (
    <>
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
    </>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8" style={{background: "linear-gradient(180deg, #A5B4FC 0%, rgba(238, 242, 255, 0) 100%)"}}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Icon
          className="mx-auto h-12 w-auto"
        />
        <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
          Welcome to Echo Balancer
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Find out your Twitter influencers’ diversity*, compare to others from the community, and share your results.
        </p>

        <p className="mt-8 text-center text-sm text-gray-500">
          *Echo Balancer only shows results when you have more than 100 following accounts on Twitter.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-8 px-4 sm:px-10">
          <a href={`${HOST}/auth/login`}>
            <LoginButton />
          </a>
        </div>
        <p className="mt-6 px-4 text-sm text-gray-500">
          Disclaimer: Your private data are safe with us as we do not store any of your data as soon as you close this page.
        </p>
      </div>
    </div>
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
