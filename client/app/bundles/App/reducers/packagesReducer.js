import { combineReducers } from 'redux-immutable';
import Immutable from 'immutable';

import actionTypes from '../constants/packagesConstants';

export const $$initialState = Immutable.fromJS({
  packages: [],
})

const packages = ($$state = $$initialState.get('packages'), action) => {
	switch (action.type){
		case actionTypes.FETCH_PACKAGES_SUCCESS:
		  return $$state;
		case actionTypes.FETCH_PACKAGES_FAILURE:
		  return $$state;
		default:
      return $$state;
	}
};

const packagesReducer = combineReducers({
  packages
});

export default packagesReducer;

export const getPackages = ($$packagesStore) => $$packagesStore.get('packages').toJS();