/* eslint-disable prefer-destructuring */
// Why no destructuring? See: https://github.com/vercel/next.js/issues/19420
const PROXY_URL = process.env.NEXT_PUBLIC_PROXY_URL;
const GITHUB_REPOS_API_ENDPOINT = process.env.NEXT_PUBLIC_GITHUB_REPOS_API_ENDPOINT;
const NPM_DOWNLOADS_API_ENDPOINT = process.env.NEXT_PUBLIC_NPM_DOWNLOADS_API_ENDPOINT;
const NPM_REGISTRY_API_ENDPOINT = process.env.NEXT_PUBLIC_NPM_REGISTRY_API_ENDPOINT;
const NPMS_PACKAGE_API_ENDPOINT = process.env.NEXT_PUBLIC_NPMS_PACKAGE_API_ENDPOINT;

export const urlWithProxy = (url) => {
    if (PROXY_URL) {
        return `${PROXY_URL}/?url=${url}`;
    }
    return url;
};

// See: https://docs.github.com/en/rest/repos/repos#get-a-repository
export const githubReposURL = (path) => {
    if (GITHUB_REPOS_API_ENDPOINT) {
        return `${GITHUB_REPOS_API_ENDPOINT}/${path}`;
    }
    return urlWithProxy(`https://api.github.com/repos/${path}`);
};

// See: https://github.com/npm/registry/blob/cfe04736f34db9274a780184d1cdb2fb3e4ead2a/docs/download-counts.md
export const npmDownloadsURL = (path) => {
    if (NPM_DOWNLOADS_API_ENDPOINT) {
        return `${NPM_DOWNLOADS_API_ENDPOINT}/${path}`;
    }
    return urlWithProxy(`https://api.npmjs.org/downloads/${path}`);
};

// See: https://github.com/npm/registry/blob/cfe04736f34db9274a780184d1cdb2fb3e4ead2a/docs/REGISTRY-API.md#package-endpoints
export const npmRegistryURL = (path) => {
    if (NPM_REGISTRY_API_ENDPOINT) {
        return `${NPM_REGISTRY_API_ENDPOINT}/${path}`;
    }
    return urlWithProxy(`https://registry.npmjs.org/${path}`);
};

// See: https://api-docs.npms.io/#api-Package
export const npmsPackageURL = (path) => {
    if (NPMS_PACKAGE_API_ENDPOINT) {
        return `${NPMS_PACKAGE_API_ENDPOINT}/${path}`;
    }
    return urlWithProxy(`https://api.npms.io/v2/package/${path}`);
};
