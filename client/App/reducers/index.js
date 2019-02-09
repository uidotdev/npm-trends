import packagesReducer, * as fromPackages from './packagesReducer';
import railsContextReducer, { initialState as railsContextState } from './railsContextReducer';

export default {
  $$packagesStore: packagesReducer,
  railsContext: railsContextReducer,
};

export const initialStates = {
	$$packagesState: fromPackages.$$initialState,
	railsContextState,
};

export const getPackages = (state) =>
  fromPackages.getPackages(state.$$packagesStore);



