export const getPacketsParamFromQuery = (query) => {
  // Some packages are namespaced like @angular/core
  // The challenge with this is that the slash acts as a delimeter
  // Next.js treats these as two path segments
  // Therefore we use a catch all route [[...packets]]
  // This provides an array of the path segments react-vs-@angular/core -> ['react-vs-@angular', 'core']
  const { packets: queryParamPacketsArray } = query;

  // We then join this array to get the desired packets param value
  // ['react-vs-@angular', 'core'] -> 'react-vs-@angular/core'

  return queryParamPacketsArray && queryParamPacketsArray.length ? queryParamPacketsArray.join('/') : '';
};

// 'react-vs-angular' -> 'react vs angular'
export const searchPathToDisplayString = (searchPath) => searchPath.replace(/-/g, ' ');

export const getCanonical = (searchPath) => `/${searchPath.split('-vs-').sort().join('-vs-')}`;
