const proxyUrl = process.env.REACT_APP_NEXT_PUBLIC_PROXY_URL;

export const urlWithProxy = url => `${proxyUrl}/?url=${url}`;
