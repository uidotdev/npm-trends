import React, { Component } from 'react';

export default class Footer extends Component {
  render() {
    return (
      <footer>
        <div className="container">
          <div className="footer-content">
            <ul id="footer_menu" className="list-unstyled">
              <li className="inline">
                Made by{' '}
                <a target="_blank" rel="noopener noreferrer" href="http://twitter.com/johnmpotter">
                  John Potter
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    );
  }
}
