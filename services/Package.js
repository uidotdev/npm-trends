import { urlWithProxy } from 'utils/proxy';
import { colors } from 'utils/colors';
import Fetch from './Fetch';

class Package {
  static async fetchPackages(queryParamPackets) {
    // queryParamPackets format: react-vs-@angular-core
    if (!queryParamPackets) {
      return [];
    }

    const packetsArr = queryParamPackets.split('-vs-');

    const fetchedPackages = await Promise.all(
      packetsArr.map(async (packageName) => {
        try {
          return await Package.fetchPackageDetails(packageName);
        } catch {
          return {
            hasError: true,
            name: packageName,
          };
        }
      }),
    );

    const formattedPackageData = fetchedPackages.map((packageData, i) => ({
      id: packageData.name,
      name: packageData.name,
      description: packageData.description,
      repository: packageData.repository,
      npmData: packageData,
      color: colors[i],
    }));

    return { formattedPackageData };
  }

  static fetchStats(packet) {
    return Promise.all([this.fetchGithubStats(packet)]).then(([github]) => ({ github }));
  }

  static async fetchGithubRepo(repoUrl) {
    const repositoryPath = repoUrl.split('.com')[1].replace('.git', '');

    const githubUrl = `https://api.github.com/repos${repositoryPath}`;

    return Fetch.getJSON(urlWithProxy(githubUrl));
  }

  static async fetchPackageDetails(packetName) {
    const url = `https://registry.npmjs.org/${encodeURIComponent(encodeURIComponent(packetName))}`;

    return Fetch.getJSON(urlWithProxy(url));
  }

  static async fetchGithubStats(npmPackageData) {
    if (npmPackageData.repository && npmPackageData.repository.url.indexOf('github') >= 0) {
      try {
        return this.fetchGithubRepo(npmPackageData.repository.url);
      } catch {
        const packetData = { name: npmPackageData.name };
        return packetData;
      }
    } else {
      const packetData = { name: npmPackageData.name };
      return packetData;
    }
  }
}

export default Package;
