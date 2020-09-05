import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import $ from 'jquery';

import AppHead from 'components/_templates/AppHead';

import { initGA, logPageView } from 'utils/googleAnalytics';

import 'normalize.css/normalize.css';
import 'reset-css/reset.css';
import '../styles/index.scss';

require('datejs');

const propTypes = {
  Component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  pageProps: PropTypes.object,
};

const MyApp = ({ Component, pageProps }) => {
  useEffect(() => {
    window.jQuery = $;
    window.$ = $;

    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();

    Router.events.on('routeChangeComplete', () => {
      logPageView();
    });
  }, []);

  const pageTitle = 'NPM Trends: Compare NPM package downloads';
  const pageDescription =
    'Which NPM package should you use? Compare NPM package download stats over time. Spot trends, pick the winner!';

  return (
    <>
      <AppHead title={pageTitle} description={pageDescription} />
      <Component {...pageProps} />
    </>
  );
};

MyApp.propTypes = propTypes;

export default MyApp;
