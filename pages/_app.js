import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';
import $ from 'jquery';

import AppHead from 'components/_templates/AppHead';

import 'normalize.css/normalize.css';
import 'reset-css/reset.css';
import '../styles/index.scss';

require('datejs');

ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID);

const propTypes = {
  Component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  pageProps: PropTypes.object,
};

const MyApp = ({ Component, pageProps }) => {
  // TODO: track GA somehow
  // ReactGA.pageview(pathname);

  useEffect(() => {
    window.jQuery = $;
    window.$ = $;
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
