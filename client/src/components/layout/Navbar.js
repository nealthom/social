import React, { Component } from "react";
import { Link } from "react-router-dom";
import Styles from "./Navbar.module.css";
class Navbar extends Component {
  state = {
    mobileNav: false
  };
  hamburgerClick = () => {
    this.setState({
      mobileNav: !this.state.mobileNav
    });
    console.log(this.state.mobileNav);
  };
  render() {
    let mobileNav = "";
    let backdropNav = "";

    if (this.state.mobileNav === true) {
      mobileNav = (
        <nav className={Styles.mobile_nav}>
          <ul className={Styles.mobile_nav__items}>
            <li className={Styles.mobile_nav__item}>
              <Link to="/">Packages</Link>
            </li>
            <li className={Styles.mobile_nav__item}>
              <Link to="/">Customers</Link>
            </li>
          </ul>
        </nav>
      );
      backdropNav = (
        <div className={Styles.backdrop} onClick={this.hamburgerClick} />
      );
    }

    return (
      <div>
        {mobileNav}
        {backdropNav}
        <header className={Styles.navbar_header}>
          <div>
            <button
              onClick={this.hamburgerClick}
              className={Styles.toggle_button}
            >
              <span className={Styles.toggle_button__bar} />
              <span className={Styles.toggle_button__bar} />
              <span className={Styles.toggle_button__bar} />
            </button>
            <Link to="/" className={Styles.main_header__brand}>
              Neal
            </Link>
          </div>
          <nav className={Styles.main_nav}>
            <ul className={Styles.main_nav__items}>
              <li className={Styles.main_nav__item}>
                <Link to="/">Explore Users</Link>
              </li>
              <li className={Styles.main_nav__item}>
                <Link to="/register">Sign Up</Link>
              </li>
              <li className={Styles.main_nav__item}>
                <Link to="/login">Login</Link>
              </li>
            </ul>
          </nav>
        </header>
      </div>
    );
  }
}

export default Navbar;
