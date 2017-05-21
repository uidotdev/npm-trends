import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';

import Immutable from 'immutable';

import reducers, { initialStates } from '../reducers';

const configureStore = (props, railsContext) => {
	
	const { 
		$$packagesState, 
	} = initialStates;

	const initialState = {
		$$packagesStore: $$packagesState,
		railsContext: railsContext,
	}

	const reducer = combineReducers(reducers);
	const composedStore = compose(
    applyMiddleware(thunkMiddleware)
  );

  return composedStore(createStore)(reducer, initialState);
};

export default configureStore;