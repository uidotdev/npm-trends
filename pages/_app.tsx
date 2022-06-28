import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import $ from 'jquery';
import { ToastContainer } from 'react-toastify';
import PlausibleProvider from 'next-plausible';

import AppHead from 'components/_templates/AppHead';

import { initGA, logPageView } from 'utils/googleAnalytics';

import 'normalize.css/normalize.css';
import 'reset-css/reset.css';
import '../styles/index.scss';

const propTypes = {
  Component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  pageProps: PropTypes.object,
};

const MyApp = ({ Component, pageProps }) => {
  useEffect(() => {
    (window as any).jQuery = $;
    (window as any).$ = $;

    if (!(window as any).GA_INITIALIZED) {
      initGA();
      (window as any).GA_INITIALIZED = true;
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
    <PlausibleProvider
      domain="npmtrends.com"
      scriptProps={{
        async: true,
        defer: true,
        src: `https://pl-proxy.uidotdev.workers.dev/js/script.js`,
      }}
    >
      <ToastContainer />
      <AppHead title={pageTitle} description={pageDescription} />
      <Component {...pageProps} />
    </PlausibleProvider>
  );
};

MyApp.propTypes = propTypes;

export default MyApp;
