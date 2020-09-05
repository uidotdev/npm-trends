import React from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import Footer from './Footer';

const propTypes = {
  children: PropTypes.object.isRequired,
};

const Layout = ({ children }) => (
  <div className="site-wrapper">
    <Header />
    <div className="content-wrapper">{children}</div>
    <Footer />
  </div>
);

Layout.propTypes = propTypes;

export default Layout;
