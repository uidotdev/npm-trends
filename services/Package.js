import { get as _get } from 'lodash';
import hostedGitInfo from 'hosted-git-info';

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
          return await this.fetchPackage(packageName);
        } catch (e) {
          return {
            hasError: true,
            name: packageName,
          };
        }
      }),
    );

    const isValidPackage = (p) => !p.hasError && p.name;

    const validPackages = fetchedPackages
      .filter((p) => isValidPackage(p))
      .map((p, i) => ({
        ...p,
        color: colors[i],
      }));
    const invalidPackages = fetchedPackages.filter((p) => !isValidPackage(p)).map((p) => p.name);

    return {
      validPackages,
      invalidPackages,
    };
  }

  static formatRepositoryData(npmRepositoryData) {
    const gitInfo = hostedGitInfo.fromUrl(npmRepositoryData);

    return {
      type: gitInfo.type,
      url: gitInfo.browse(),
    };
  }

  static async fetchPackage(packageName) {
    const npmPackageData = await Package.fetchPackageDetails(packageName);

    const repository = this.formatRepositoryData(_get(npmPackageData, 'repository.url', ''));

    const github = repository.type === 'github' ? await this.fetchGithubRepo(repository.url) : null;

    return {
      id: _get(npmPackageData, 'name'),
      name: _get(npmPackageData, 'name'),
      description: _get(npmPackageData, 'description', ''),
      repository,
      links: {
        npm: `https://npmjs.com/package/${_get(npmPackageData, 'name')}`,
        homepage: _get(npmPackageData, 'homepage', ''),
      },
      github,
    };
  }

  static async fetchGithubRepo(url) {
    const repositoryPath = url.split('.com')[1].replace('.git', '');

    const githubUrl = `https://api.github.com/repos${repositoryPath}`;

    return Fetch.getJSON(urlWithProxy(githubUrl));
  }

  static async fetchPackageDetails(packetName) {
    const url = `https://registry.npmjs.org/${packetName}`;

    return Fetch.getJSON(urlWithProxy(url));
  }

  static async fetchGithubStats(packageData) {
    if (_get(packageData, 'type') === 'github') {
      try {
        return this.fetchGithubRepo(packageData.repository.url);
      } catch {
        const packetData = { name: packageData.name };
        return packetData;
      }
    } else {
      const packetData = { name: packageData.name };
      return packetData;
    }
  }
}

export default Package;
