import { combineReducers } from 'redux';

import packagesReducer, * as fromPackages from './packagesReducer';

export default () =>
  combineReducers({
    $$packagesStore: packagesReducer,
  });

export const getPackages = state => fromPackages.getPackages(state.$$packagesStore);
