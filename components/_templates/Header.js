import React, { Component } from 'react';
import Link from 'next/link';

export default class Header extends Component {
  render() {
    return (
      <header>
        <div className="container">
          <Link href="/[[...packets]]" as="/">
            <a className="site-logo">
              <img className="site-logo--img" alt="NPM Trends Logo" src="/images/logos/npm_trends_logo.png" />
              <span className="site-logo--name">npm trends</span>
            </a>
          </Link>
        </div>
      </header>
    );
  }
}
