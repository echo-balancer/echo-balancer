import { useEffect, useState } from "react";

const HOST =
  process.env.NODE_ENV !== "production" ? "http://localhost:5000" : "";

function App() {
  const [data, setData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(
    () =>
      process.env.NODE_ENV !== "production" ||
      document.querySelector("meta[name=login]").content === "True"
  );

  useEffect(() => {
    async function loadData() {
      if (isLoggedIn) {
        try {
          const tweetsResponse = await fetch(`/api/tweets?limit=10`, {
            credentials: "include",
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
    <div className="container px-4 mx-auto sm:px-6 lg:px-8">
      <header className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Echo Chamber Meter
        </h2>
        <p className="mt-4 text-lg text-gray-500">
          How diversified is your social circle?
        </p>
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
      </header>
      <ul className="divide-y divide-gray-200">
        {data.map((tweet) => (
          <TweetCard tweet={tweet} />
        ))}
      </ul>
    </div>
  );
}

function TweetCard({ tweet: { user, text, created_at, id } }) {
  return (
    <li
      key={id}
      className="relative px-4 py-5 bg-white hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600"
    >
      <div className="flex justify-between space-x-3">
        <img
          className="w-10 h-10 rounded-full"
          src={user.profile_image_url_https}
          alt={user.name}
        />
        <div className="flex-1 min-w-0">
          <a href="/#" className="block focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.name}
            </p>
            <p className="text-sm text-gray-500 truncate">{user.description}</p>
          </a>
        </div>
        <time
          dateTime={created_at}
          className="flex-shrink-0 text-sm text-gray-500 whitespace-nowrap"
        >
          {new Date(created_at).toDateString()}
        </time>
      </div>
      <div className="mt-1">
        <p className="text-sm text-gray-600">{text}</p>
      </div>
    </li>
  );
}

export default App;
