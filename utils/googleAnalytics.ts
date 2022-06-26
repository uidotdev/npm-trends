// We use mix of a few approches;
// https://johnkueh.com/articles/adding-a-use-analytics-hook
// https://medium.com/@austintoddj/using-google-analytics-with-next-js-423ea2d16a98

import ReactGA from 'react-ga';

const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID;

export const initGA = () => {
  if (gaId) {
    ReactGA.initialize(gaId);
  }
};

export const logPageView = () => {
  if (gaId) {
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);
  }
};
