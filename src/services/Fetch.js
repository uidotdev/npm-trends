function handleErrors(response) {
  return new Promise((resolve, reject) => {
    if (!response.ok) {
      return reject(response);
    }

    if (response.status === 204) {
      return resolve();
    }

    return response
      .json()
      .then(resolve)
      .catch(resolve);
  });
}

function fullUrl(url) {
  if (/^(f|ht)tps?:\/\//i.test(url)) return url;

  return process.env.REACT_APP_BACKEND_URL + url;
}

function getHeaders() {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  return headers;
}

class Fetch {
  static getJSON(url) {
    return fetch(fullUrl(url), {
      headers: getHeaders(),
    }).then(handleErrors);
  }

  static postJSON(url, data = {}) {
    return fetch(fullUrl(url), {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleErrors);
  }
}

export default Fetch;
