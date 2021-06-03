import { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { MenuAlt1Icon } from '@heroicons/react/outline';
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
  NavLink,
} from 'react-router-dom';
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
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    async function loadFriends() {
      try {
        if (isLoggedIn) {
          const friendsResponse = await fetch(`/api/friends`, {
            credentials: 'include',
          });
          if (friendsResponse.status === 200) {
            const friends = await friendsResponse.json();
            setFriends(friends["users"] || []);
          }
        }
      } catch (error) {
        setFriends([]);
        return;
      }
    }
    loadFriends();
  }, []);

  return (
    <Router>
      <div className="">
        {isLoggedIn && (
          <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        )}

        <Switch>
          <Route exact path="/">
            {isLoggedIn ? <Redirect to="/report" /> : <Landing />}
          </Route>
          <Route path="/report">
            <Report />
          </Route>
          <Route path="/friends">
            <RadarChart friends={friends}/>
          </Route>
          <Route path="/settings">{isLoggedIn && <Logout />}</Route>
        </Switch>
      </div>
    </Router>
  );
}

function Header({ isLoggedIn, setIsLoggedIn }) {
  const [user, setUser] = useState();

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch(`/api/me`, {
          credentials: 'include',
        });
        if (response.status === 401) {
          setIsLoggedIn(false);
          setUser(null);
          return;
        }
        setUser(await response.json());
      } catch (error) {
        setUser(null);
        return;
      }
    }
    loadUser();
  }, [isLoggedIn]);

  return (
    <>
      <header className="text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
            <Menu as="div" className="relative inline-block text-left">
              {({ open }) => (
                <>
                  <div>
                    <Menu.Button className=" flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                      <MenuAlt1Icon className="h-8 w-8" aria-hidden="true" />
                    </Menu.Button>
                  </div>

                  <Transition
                    show={open}
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items
                      static
                      className="origin-top-left absolute left-0 mt-2 w-24 rounded-md shadow-lg bg-white ring-1 left-black ring-opacity-5 focus:outline-none"
                    >
                      <div className="py-1">
                        <a href={`${HOST}/auth/logout`}>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                type="submit"
                                className={classNames(
                                  active
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-700',
                                  'block w-full text-left px-4 py-2 text-sm'
                                )}
                              >
                                Log out
                              </button>
                            )}
                          </Menu.Item>
                        </a>
                      </div>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>

            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Icon className="mx-auto h-12 w-auto"></Icon>
            </div>
          </div>

          <div className="flex items-center space-x-4 lg:space-x-6">
            <img
              className="mt-4 ml-4 w-16 h-16 rounded-full lg:w-20 lg:h-20"
              src={user && user.profile_image_url_https}
              alt=""
            />
            <div className="mt-4 font-medium text-lg leading-4">
              <h3 className="text-2xl text-left font-semibold text-gray-900">
                Hello, {user && user.name}!
              </h3>
              <p className="text-xs text-left font-normal text-gray-500">
                Welcome! Let's explore your network diversity
              </p>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex text-xs items-center justify-center h-8">
          <NavLink
            className="nav-link"
            to="/"
            activeClassName="border-indigo-300"
          >
            Diversity report
          </NavLink>
          <NavLink
            className="nav-link"
            to="/friends"
            activeClassName="border-indigo-300"
          >
            Challenge friends
          </NavLink>
        </div>
      </nav>
    </>
  );
}

function Landing() {
  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
      style={{
        background:
          'linear-gradient(180deg, #A5B4FC 0%, rgba(238, 242, 255, 0) 100%)',
      }}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Icon className="mx-auto h-12 w-auto" />
        <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
          Welcome to Echo Balancer
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Find out your Twitter influencers’ diversity*, compare to others from
          the community, and share your results.
        </p>

        <p className="mt-8 text-center text-sm text-gray-500">
          *Echo Balancer only shows results when you have more than 100
          following accounts on Twitter.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-8 px-4 sm:px-10">
          <a href={`${HOST}/auth/login`}>
            <LoginButton />
          </a>
        </div>
        <p className="mt-6 px-4 text-sm text-gray-500">
          Disclaimer: Your private data are safe with us as we do not store any
          of your data as soon as you close this page.
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
