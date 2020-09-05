// We use mix of a few approches;
// https://johnkueh.com/articles/adding-a-use-analytics-hook
// https://medium.com/@austintoddj/using-google-analytics-with-next-js-423ea2d16a98

import ReactGA from 'react-ga';

export const initGA = () => {
  ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID);
};

export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};
