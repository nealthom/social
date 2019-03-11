import React, {Component} from 'react';
import Styles from './Navbar.module.css';
export class Navbar extends Component {
  render() {
    return (
      <header className={Styles.navbar_header}>
        {console.log(Styles)}
        <div>
          <a href="index.html" className={Styles.main_header__brand}>
            Social App
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
    );
  }
}

export default Navbar;
