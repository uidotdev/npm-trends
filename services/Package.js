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

    const validPackages = fetchedPackages.filter((p) => !p.hasError);
    const invalidPackages = fetchedPackages.filter((p) => p.hasError || !p.collected).map((p) => p.name);

    const formattedPackageData = validPackages.map((packageData, i) => ({
      id: packageData.collected.metadata.name,
      name: packageData.collected.metadata.name,
      description: packageData.collected.metadata.description,
      repository: packageData.collected.metadata.repository,
      npmsData: packageData,
      color: colors[i],
    }));

    return {
      validPackages: formattedPackageData,
      invalidPackages,
    };
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
