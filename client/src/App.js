import { useEffect, useState } from "react";

import "./App.css";

const HOST =
  process.env.NODE_ENV !== "production" ? "http://localhost:5000" : "";

function App() {
  const [data, setData] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      let params = new URL(document.location).searchParams;
      if (params.get("auth") === "login") {
        setIsLoggedIn(true);
        const tweetsResponse = await fetch(`${HOST}/api/tweets`);
        const tweets = await tweetsResponse.json();
        console.log(tweets);
        setData(tweets)
      } else {
        const response = await fetch(`${HOST}/api/hello`);
        setData(await response.text());
      }
    })();
  }, [setData]);

  return (
    <div className="App">
      <h1>{data}</h1>
      <a href={`${HOST}/auth/login`}>Login</a>
      <a href={`${HOST}/auth/logout`}>Logout</a>
    </div>
  );
}

export default App;
