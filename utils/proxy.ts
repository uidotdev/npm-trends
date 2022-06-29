/* eslint-disable prefer-destructuring */
// Why no destructuring? See: https://github.com/vercel/next.js/issues/19420
const GITHUB_REPOS_API_ENDPOINT = process.env.NEXT_PUBLIC_GITHUB_REPOS_API_ENDPOINT;
const NPM_DOWNLOADS_API_ENDPOINT = process.env.NEXT_PUBLIC_NPM_DOWNLOADS_API_ENDPOINT;
const NPM_REGISTRY_API_ENDPOINT = process.env.NEXT_PUBLIC_NPM_REGISTRY_API_ENDPOINT;

// See: https://docs.github.com/en/rest/repos/repos#get-a-repository
export const githubReposURL = (path) => `${GITHUB_REPOS_API_ENDPOINT}${path}`;

// See: https://github.com/npm/registry/blob/cfe04736f34db9274a780184d1cdb2fb3e4ead2a/docs/download-counts.md
export const npmDownloadsURL = (path) => `${NPM_DOWNLOADS_API_ENDPOINT}/${path}`;

// See: https://github.com/npm/registry/blob/cfe04736f34db9274a780184d1cdb2fb3e4ead2a/docs/REGISTRY-API.md#package-endpoints
export const npmRegistryURL = (path) => `${NPM_REGISTRY_API_ENDPOINT}/${path}`;
