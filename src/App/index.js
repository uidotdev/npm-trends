import React from 'react';
import { Route, Switch } from 'react-router-dom';

import AppContainer from './_templates/AppContainer';

require('datejs');

// TODO Fix
const ga = () => {};

const App = () => {
  const onUpdate = () => {
    // Track in Google Analytics
    ga('send', 'pageview', window.location.pathname);
    return null;
  };

  return (
    <div className="App">
      <Route component={onUpdate} />
      <Switch>
        <Route exact path="/" component={AppContainer} />
        <Route path="/:packets+" component={AppContainer} />
      </Switch>
    </div>
  );
};

export default App;
