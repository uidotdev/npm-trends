import React, { Component } from 'react';

export default class Header extends Component {
  render() {
    return (
      <header>
        <div className="container">
          <a href="/" className="site-logo">
            <img className="site-logo--img" alt="NPM Trends Logo" src="images/logos/npm_trends_logo.png" />
            <span className="site-logo--name">npm trends</span>
          </a>
        </div>
      </header>
    );
  }
}
