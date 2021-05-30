import React from "react";
import axios from "axios";
import "./App.css";

const HOST =
  process.env.NODE_ENV !== "production" ? "http://localhost:5000" : "";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoggedIn: false
    };
  }

  componentDidMount() {
    this.checkLoginStatus();
    this.loadData();
  }

  checkLoginStatus() {
    axios.get(`${HOST}/auth/logged_in`, { withCredentials: true} )
      .then(response => {
        this.setState({
          isLoggedIn: response.data.logged_in
        })
      })
  }

  async loadData() {
    let params = new URL(document.location).searchParams;
    if (params.get("auth") === "login") {
      axios.get(`${HOST}/api/tweets`)
        .then(response => {
            console.log(response.data);
            // this.setState({
            //   data: response.data
            // })
        })
    } else {
      axios.get(`${HOST}/api/hello`)
        .then(response => {
            console.log(response.data);
            this.setState({
              data: response.data
            })
        })
    }
  }

  render() {
    return (
      <div className="App">
        <h1>{this.state.data}</h1>
        { this.state.isLoggedIn ?
          <a href={`${HOST}/auth/logout`}>Logout</a>
          :
          <a href={`${HOST}/auth/login`}>
            <img src="/sign-in-with-twitter-gray.png.twimg.2560.png" />
          </a>
        }
      </div>
    );
  }
}

export default App;
