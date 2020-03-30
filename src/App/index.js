import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ReactGA from 'react-ga';

import AppContainer from './_templates/AppContainer';

require('datejs');

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID);

const App = () => {
  const trackAnalyticsOnRouteUpdate = ({ location: { pathname } }) => {
    ReactGA.pageview(pathname);
    return null;
  };

  return (
    <div className="App">
      <Route component={trackAnalyticsOnRouteUpdate} />
      <Switch>
        <Route exact path="/" component={AppContainer} />
        <Route path="/:packets+" component={AppContainer} />
      </Switch>
    </div>
  );
};

export default App;
