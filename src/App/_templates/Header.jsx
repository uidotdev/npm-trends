import React, { Component } from 'react';

import logo from 'images/logos/npm_trends_logo.png';

export default class Header extends Component {
  render() {
    return (
      <header>
        <div className="container">
          <a href="/" className="site-logo">
            <img className="site-logo--img" alt="NPM Trends Logo" src={logo} />
            <span className="site-logo--name">npm trends</span>
          </a>
        </div>
      </header>
    );
  }
}
