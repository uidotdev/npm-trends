import mirrorCreator from 'mirror-creator';

const actionTypes = mirrorCreator([
  'FETCH_PACKAGES_SUCCESS',
  'FETCH_PACKAGES_FAILURE',
]);

export default actionTypes;