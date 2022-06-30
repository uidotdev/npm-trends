import Fetch from './Fetch';

const apiUrl = (path) => `${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`;

class API {
  static async logSearch(packetNamesArray: string[], searchType) {
    const postData = {
      search_query: packetNamesArray,
      search_type: searchType,
    };

    try {
      await Fetch.postJSON(apiUrl('/s/log'), postData);
    } catch {
      // continue regardless of error
    }
  }
}

export default API;
