const proxyUrl = process.env.REACT_APP_PROXY_URL;

export const urlWithProxy = url => `${proxyUrl}/?url=${url}`;
