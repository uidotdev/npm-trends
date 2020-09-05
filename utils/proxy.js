const proxyUrl = process.env.NEXT_PUBLIC_PROXY_URL;

export const urlWithProxy = url => `${proxyUrl}/?url=${url}`;
