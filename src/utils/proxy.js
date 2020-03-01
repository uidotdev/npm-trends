const proxyUrl = process.env.PROXY_URL;

export const urlWithProxy = url => `${proxyUrl}/?url=${url}`;
