import { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { MenuAlt1Icon } from "@heroicons/react/outline";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
  NavLink,
} from "react-router-dom";
import { Report } from "./Report";
import RadarChart from "./RadarChart";
import { ReactComponent as LoginButton } from "./figures/login_button.svg";
import { ReactComponent as Icon } from "./figures/icon1.svg";
import quote from "./figures/quote.png";
import { cachedFetch } from "../utils/cachedFetch";

const HOST =
  process.env.NODE_ENV !== "production" ? "http://localhost:5000" : "";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () =>
      process.env.NODE_ENV !== "production" ||
      document.querySelector("meta[name=login]").content === "True"
  );

  function PrivateRoute({ children, ...rest }) {
    return (
      <Route
        {...rest}
        render={() => {
          return isLoggedIn === true ? children : <Redirect to="/" />;
        }}
      />
    );
  }

  const [diversityData, setDiversityData] = useState(null);
  const [friends, setFriends] = useState([]);

  // TODO: support toggle to influencer mode
  async function loadDiversityData() {
    try {
      if (isLoggedIn) {
        const { status, json: data } = await cachedFetch("/api/v2/diversity");
        if (status === 200) {
          setDiversityData(data);
        } else {
          if (data.message) {
            alert(data.message);
          }
        }
      }
    } catch (error) {
      setDiversityData(null);
    }
  }
  async function loadFriends() {
    try {
      if (isLoggedIn) {
        const {status, json: data} = await cachedFetch(`/api/friends`);
        if (status === 200) {
          setFriends(data["users"] || []);
        } else {
          if (data.message) {
            alert(data.message);
          }
        }
      }
    } catch (error) {
      setFriends([]);
      return;
    }
  }
  useEffect(() => {
    loadDiversityData();
    loadFriends();
  }, []);

  return (
    <Router>
      {!isLoggedIn ? (
        <Landing />
      ) : (
        <div className="mx-auto max-w-screen-sm">
          <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          <Switch>
            <Route exact path="/">
              <Redirect to="/report" />
            </Route>
            <PrivateRoute path="/report">
              <Report diversityData={diversityData} />
            </PrivateRoute>
            <PrivateRoute path="/friends">
              <RadarChart diversityData={diversityData} friends={friends} />
            </PrivateRoute>
            <Route path="/settings">{isLoggedIn && <Logout />}</Route>
          </Switch>
        </div>
      )}
    </Router>
  );
}

function Header({ isLoggedIn, setIsLoggedIn }) {
  const [user, setUser] = useState();

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  useEffect(() => {
    async function loadUser() {
      try {
        const { status, json } = await cachedFetch("/api/me");
        if (status === 401) {
          setIsLoggedIn(false);
          setUser(null);
          return;
        }
        setUser(json);
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
        <div className="px-4 mx-auto max-w-7xl sm:px-6">
          <div className="flex items-center justify-between pt-4">
            <Menu as="div" className="relative inline-block text-left">
              {({ open }) => (
                <>
                  <div>
                    <Menu.Button className="flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                      <MenuAlt1Icon className="w-8 h-8" aria-hidden="true" />
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
                      className="absolute left-0 w-24 mt-2 bg-white shadow-lg origin-top-left rounded-md ring-1 left-black ring-opacity-5 focus:outline-none"
                    >
                      <div className="py-1">
                        <a href={`${HOST}/auth/logout`}>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                type="submit"
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block w-full text-left px-4 py-2 text-sm"
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

            <div className="">
              <Icon className="w-auto h-12 mx-auto"></Icon>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <img
              className="w-16 h-16 mt-4 ml-4 rounded-full lg:w-20 lg:h-20"
              src={user && user.profile_image_url_https}
              alt=""
            />
            <div className="mt-4 text-lg font-medium leading-4">
              <h3 className="text-2xl font-semibold text-left text-gray-900">
                Hello, {user && user.name}!
              </h3>
              <p className="text-xs font-normal text-left text-gray-500">
                Welcome! Let's explore your network diversity
              </p>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white">
        <div className="flex items-center justify-center h-8 px-4 mx-auto text-sm font-medium text-gray-500">
          <NavLink
            className="nav-link"
            to="/report"
            activeClassName="text-indigo-600 border-indigo-600"
          >
            Diversity Report
          </NavLink>
          <NavLink
            className="nav-link"
            to="/friends"
            activeClassName="text-indigo-600 border-indigo-600"
          >
            Community Check
          </NavLink>
        </div>
      </nav>
    </>
  );
}

function Landing() {
  return (
    <div
      className="flex flex-col justify-center min-h-screen py-12 bg-gray-50 sm:px-6 lg:px-8"
      style={{
        background:
          "linear-gradient(180deg, #A5B4FC 0%, rgba(238, 242, 255, 0) 100%)",
      }}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Icon className="mx-auto" />
        <h2 className="mt-6 text-3xl font-bold text-center text-gray-900 leading-9">
          Welcome to <br></br>
          Echo Balancer
        </h2>

        <img className="mx-auto mt-6" src={quote} alt="quote" />

        <p
          className="mx-auto text-sm font-medium text-center leading-4"
          style={{ maxWidth: "250px" }}
        >
          We need diversity if we are to change, grow, and innovate”
        </p>

        <p className="mt-2 text-sm font-medium text-center">
          -- Dr. Katherine W. Phillips
        </p>

        <p
          className="mx-auto mt-12 text-sm font-normal text-center text-gray-700 leading-6"
          style={{ maxWidth: "327px" }}
        >
          We believe that informational diversity fuels innovation. Find out how
          diverse your current Twitter following is!
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="px-4 py-4 sm:px-10">
          <a href={`${HOST}/auth/login`}>
            <LoginButton className="mx-auto" />
          </a>
          <p className="ml-6 text-sm text-gray-500">
            *Privacy disclaimer: we do not store any of your personal data
          </p>
        </div>
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
