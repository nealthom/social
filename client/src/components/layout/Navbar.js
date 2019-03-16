import React, {Component} from 'react';
import Styles from './Navbar.module.css';
export class Navbar extends Component {
  render() {
    return (
      <div>
        <div className={Styles.backdrop} />
        <nav className={Styles.mobile_nav}>
          <ul className={Styles.mobile_nav__items}>
            <li className={Styles.mobile_nav__item}>
              <a href="packages/index.html">Packages</a>
            </li>
            <li className={Styles.mobile_nav__item}>
              <a href="customers/index.html">Customers</a>
            </li>
          </ul>
        </nav>
        <header className={Styles.navbar_header}>
          <div>
            <button className={Styles.toggle_button}>
              <span className={Styles.toggle_button__bar} />
              <span className={Styles.toggle_button__bar} />
              <span className={Styles.toggle_button__bar} />
            </button>
            <a href="index.html" className={Styles.main_header__brand}>
              N
            </a>
          </div>
          <nav className={Styles.main_nav}>
            <ul className={Styles.main_nav__items}>
              <li className={Styles.main_nav__item}>
                <a href="profiles.html">Explore Users</a>
              </li>
              <li className={Styles.main_nav__item}>
                <a href="register.html">Sign Up</a>
              </li>
              <li className={Styles.main_nav__item}>
                <a href="login.html">Login</a>
              </li>
            </ul>
          </nav>
        </header>
      </div>
    );
  }
}

export default Navbar;
