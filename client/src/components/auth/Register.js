import React, { Component } from "react";
import Styles from "./Register.module.css";

class Register extends Component {
  render() {
    return (
      <div className={Styles.container}>
        <div className={Styles.main}>
          <h1 className={Styles.register_title}>Register</h1>
          <form action="/" className={Styles.signup_form}>
            <label for="email">Email</label>
            <input type="email" id="email" />
            <label for="password">Password</label>
            <input type="password" id="password" />
            <label for="password2">Confirm Password</label>
            <input type="password" id="password2" />
            <button type="submit" className={Styles.button}>
              Sign Up
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Register;
