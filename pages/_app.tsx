import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import PlausibleProvider from 'next-plausible';
import { QueryClientProvider, QueryClient } from 'react-query';
import Script from 'next/script';
import AppHead from 'components/_templates/AppHead';
import { pageview, FB_PIXEL_ID, TWITTER_PIXEL_ID } from '../utils/pixel';

import 'normalize.css/normalize.css';
import 'reset-css/reset.css';
import '@reach/combobox/styles.css';
import '../styles/index.scss';
import ReactGGPromoBanner from 'components/_components/Banners/ReactGGPromoBanner';

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
  const router = useRouter();

  useEffect(() => {
    pageview();

    const handleRouteChange = () => {
      pageview();
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);

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
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', ${FB_PIXEL_ID});
          `,
          }}
        />
        <Script
          id="tw-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
            },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
            a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
            twq('config', "${TWITTER_PIXEL_ID}");
            `,
          }}
        />
        <ReactGGPromoBanner />
        <Component {...pageProps} />
      </QueryClientProvider>
    </PlausibleProvider>
  );
};

MyApp.propTypes = propTypes;

export default MyApp;
