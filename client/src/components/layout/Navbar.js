import React, {Component} from 'react';
import Styles from './Navbar.module.css';
export class Navbar extends Component {
  state = {
    mobileNav: false
  };
  hamburgerClick = () => {
    this.setState({
      mobileNav: !this.state.mobileNav
    });
    console.log(this.state.mobileNav)
  };
  render() {
    let mobileNav = '';
    let backdropNav = '';

    if (this.state.mobileNav === true) {
      mobileNav = (
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
      );
      backdropNav = (
        <div className={Styles.backdrop} onClick={this.hamburgerClick} />
      );
    }

    return (
      <div>
        {mobileNav}

        <header className={Styles.navbar_header}>
          {backdropNav}
          <div>
            <button
              onClick={this.hamburgerClick}
              className={Styles.toggle_button}
            >
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
