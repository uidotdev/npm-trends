import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import { ToastContainer } from 'react-toastify';
import PlausibleProvider from 'next-plausible';
import { QueryClientProvider, QueryClient } from 'react-query';

import AppHead from 'components/_templates/AppHead';

import { initGA, logPageView } from 'utils/googleAnalytics';

import 'normalize.css/normalize.css';
import 'reset-css/reset.css';
import '@reach/combobox/styles.css';
import '../styles/index.scss';

const propTypes = {
  Component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  pageProps: PropTypes.object,
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const MyApp = ({ Component, pageProps }) => {
  useEffect(() => {
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
      <QueryClientProvider client={queryClient}>
        <ToastContainer />
        <AppHead title={pageTitle} description={pageDescription} />
        <Component {...pageProps} />
      </QueryClientProvider>
    </PlausibleProvider>
  );
};

MyApp.propTypes = propTypes;

export default MyApp;
