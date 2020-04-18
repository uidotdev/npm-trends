import queryString from 'query-string';

import Fetch from '../services/Fetch';
import actionTypes from '../_constants/packagesConstants';

export function fetchPakcagesSuccess(packages) {
  return {
    type: actionTypes.FETCH_PACKAGES_SUCCESS,
    packages,
  };
}

export function fetchPackagesFailure(error) {
  return {
    type: actionTypes.FETCH_PACKAGES_FAILURE,
    error,
  };
}

export function fetchPackages(packages) {
  return dispatch =>
    Fetch.getJSON(`/packages?${queryString.stringify(packages)}`)
      .then(data => dispatch(fetchPakcagesSuccess(data)))
      .catch(error => dispatch(fetchPackagesFailure(error)));
}
