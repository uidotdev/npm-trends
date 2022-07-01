export const getPacketParamFromQuery = (query) => {
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

export const getPacketNamesFromQuery = (query) => {
  const param = getPacketParamFromQuery(query);

  return param.length ? param.split('-vs-') : [];
};

export const packetNamesToParam = (packetNames) => packetNames.sort().join('-vs-');

// 'react-vs-angular' -> 'react vs angular'
export const searchPathToDisplayString = (packetNames) => packetNames.join(' vs ');

export const getCanonical = (packetNames) => `/${packetNames.sort().join('-vs-')}`;
