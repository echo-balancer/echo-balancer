import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from 'react-router-dom';
import { Tweets } from './Tweets';

const HOST =
  process.env.NODE_ENV !== 'production' ? 'http://localhost:5000' : '';

function App() {
  const [data, setData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(
    () =>
      process.env.NODE_ENV !== 'production' ||
      document.querySelector('meta[name=login]').content === 'True'
  );

  useEffect(() => {
    async function loadData() {
      if (isLoggedIn) {
        try {
          const tweetsResponse = await fetch(`/api/tweets?limit=10`, {
            credentials: 'include',
          });
          if (tweetsResponse.status === 401) {
            setIsLoggedIn(false);
            setData([]);
            return;
          }
          const tweets = await tweetsResponse.json();
          console.log(tweets);
          setData(tweets);
        } catch (error) {
          setData([]);
          return;
        }
      }
    }
    loadData();
  }, [isLoggedIn]);

  return (
    <Router>
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <header className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Echo Chamber Meter
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            How diversified is your social circle?
          </p>
        </header>

        <Switch>
          <Route exact path="/">
            {isLoggedIn ? (
              <Tweets data={data} />
            ) : (
              <a href={`${HOST}/auth/login`}>
                <button type="button" className="btn">
                  Login
                </button>
              </a>
            )}
          </Route>
          <Route path="/hashtags">
            <h1>Hashtags Page</h1>
          </Route>
          <Route path="/settings">
            {isLoggedIn ? (
              <a href={`${HOST}/auth/logout`}>
                <button type="button" className="btn">
                  Logout
                </button>
              </a>
            ) : (
              <a href={`${HOST}/auth/login`}>
                <button type="button" className="btn">
                  Login
                </button>
              </a>
            )}
          </Route>
        </Switch>

        <div className="max-w-3xl fixed bottom-0 left-0 right-0 z-0 bg-indigo-600 border-t border-gray-200 px-4 flex items-center justify-between sm:px-0">
          <nav
            className="max-w-3xl relative mx-auto flex justify-between space-x-4 text-white"
            aria-label="Navbar"
          >
            <div>
              <NavLink to="/" activeClassName="bg-indigo-300">
                Home
              </NavLink>
            </div>
            <div>
              <NavLink to="/hashtags" activeClassName="bg-indigo-300">
                Hashtags
              </NavLink>
            </div>
            <div>
              <NavLink to="/settings" activeClassName="bg-indigo-300">
                Settings
              </NavLink>
            </div>
          </nav>
        </div>
      </div>
    </Router>
  );
}

export default App;
