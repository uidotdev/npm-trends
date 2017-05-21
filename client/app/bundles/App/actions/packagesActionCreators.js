import requestsManager from '../libs/requestsManager';
import actionTypes from '../constants/packagesConstants';

export function fetchPakcagesSuccess(packages) {
  return {
    type: actionTypes.FETCH_PACKAGES_SUCCESS,
    packages: packages,
  };
}

export function fetchPackagesFailure(error) {
  return {
    type: actionTypes.FETCH_PACKAGES_FAILURE,
    error,
  };
}

export function fetchPackages(packages) {
  return (dispatch) => {
    return (
      requestsManager
        .fetchEntities('/packages', packages )
        .then(res => dispatch(fetchPakcagesSuccess(res.data)))
        .catch(error => dispatch(fetchPackagesFailure(error)))
    );
  };
}