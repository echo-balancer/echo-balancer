import { useEffect, useState } from "react";

const HOST =
  process.env.NODE_ENV !== "production" ? "http://localhost:5000" : "";

function App() {
  const [data, setData] = useState("Hello World");
  const [isLoggedIn, setIsLoggedIn] = useState(
    () =>
      process.env.NODE_ENV !== "production" ||
      document.querySelector("meta[name=login]").content === "True"
  );

  useEffect(() => {
    async function loadData() {
      if (isLoggedIn) {
        try {
          const tweetsResponse = await fetch(`/api/tweets`, { credentials: 'include' });
          if (tweetsResponse.status === 401) {
            setIsLoggedIn(false);
            setData("Hello World");
            return;
          }
          const tweets = await tweetsResponse.json();
          console.log(tweets);
          setData(JSON.stringify(tweets, null, 2));
        } catch (error) {
          setData("API failed");
          return;
        }
      }
    }
    loadData();
  }, [isLoggedIn]);

  return (
    <div className="App">
      <header>
        <h1>Echo Chamber Meter</h1>
        {isLoggedIn ? (
          <a href={`${HOST}/auth/logout`}>Logout</a>
        ) : (
          <a href={`${HOST}/auth/login`}>Login</a>
        )}
      </header>
      <pre>{data}</pre>
    </div>
  );
}

export default App;
