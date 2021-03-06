import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./Shared.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="Shared">
          <Navbar />
          <div className="main">
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
