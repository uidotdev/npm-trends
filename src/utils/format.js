// 'react-vs-angular' -> 'react vs angular'
export const searchPathToDisplayString = searchPath => searchPath.replace('-', ' ');

export const getCanonical = searchPath => (
  `/${
    searchPath
      .split('-vs-')
      .sort()
      .join('-vs-')}`
);
