import { urlWithProxy } from 'utils/proxy';
import Fetch from './Fetch';

class Package {
  static fetchStats(packet) {
    return Promise.all([this.fetchGithubStats(packet)]).then(([github]) => ({ github }));
  }

  static async fetchGithubRepo(repoUrl) {
    const repositoryPath = repoUrl.split('.com')[1].replace('.git', '');

    const githubUrl = `https://api.github.com/repos${repositoryPath}`;

    return Fetch.getJSON(urlWithProxy(githubUrl));
  }

  static async fetchPackageDetails(packetName) {
    const url = `https://api.npms.io/v2/package/${encodeURIComponent(encodeURIComponent(packetName))}`;

    return Fetch.getJSON(urlWithProxy(url));
  }

  static async fetchGithubStats(npmsPackageData) {
    if (npmsPackageData.repository && npmsPackageData.repository.url.indexOf('github') >= 0) {
      try {
        return this.fetchGithubRepo(npmsPackageData.repository.url);
      } catch {
        const packetData = { name: npmsPackageData.name };
        return packetData;
      }
    } else {
      const packetData = { name: npmsPackageData.name };
      return packetData;
    }
  }
}

export default Package;
