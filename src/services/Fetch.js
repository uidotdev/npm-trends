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

function getHeaders() {
  const headers = {
    'Content-Type': 'application/json',
  };

  return headers;
}

class Fetch {
  static getJSON(url, internal = false) {
    return fetch(url, {
      headers: internal ? getHeaders() : {},
    }).then(handleErrors);
  }

  static postJSON(url, data = {}, internal = false) {
    return fetch(url, {
      method: 'POST',
      headers: internal ? getHeaders() : {},
      body: JSON.stringify(data),
    }).then(handleErrors);
  }
}

export default Fetch;
