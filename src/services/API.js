import Fetch from './Fetch';

const apiUrl = path => `${process.env.REACT_APP_BACKEND_URL}${path}`;

class API {
  static logSearch(packetNamesArray, searchType) {
    const postData = {
      search_query: packetNamesArray,
      search_type: searchType,
      // authenticity_token: xxxxx,  May need authenticity_token (CSRF protection)
    };

    Fetch.postJSON(apiUrl('/s/log'), postData);
  }

  static postJSON() {}
}

export default API;
