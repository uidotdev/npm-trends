import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import 'normalize.css/normalize.css';
import 'reset-css/reset.css';
import './styles/index.css';

import App from './App';

import store from './store';
import * as serviceWorker from './utils/serviceWorker';

const target = document.getElementById('root');

render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  target,
);

serviceWorker.unregister();
