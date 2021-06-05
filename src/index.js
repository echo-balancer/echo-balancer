import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";

function initializeGA() {
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "G-YXVZDLCTXW");
}

if (process.env.NODE_ENV === "production") {
  initializeGA();
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
