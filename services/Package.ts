import { get as _get } from 'lodash';
import hostedGitInfo from 'hosted-git-info';

import { urlWithProxy } from 'utils/proxy';
import { colors } from 'utils/colors';
import IPackage from 'types/IPackage';
import Fetch from './Fetch';
import PackageDownloads from './PackageDownloads';

class Package {
  static fetchPackages = async (
    packetNames: string[],
  ): Promise<{ validPackages: IPackage[]; invalidPackages: string[] }> => {
    // packageNames format: ['react', '@angular-core']

    const fetchedPackages: (IPackage | { hasError: boolean; name: string })[] = await Promise.all(
      packetNames.map(async (packageName) => {
        try {
          return await Package.fetchPackage(packageName);
        } catch (e) {
          console.error(
            'Problem fetching npms and manual data. This either because the repository does not exist, or we had an error in both of our data sources',
            e,
          );
          return {
            hasError: true,
            name: packageName,
          };
        }
      }),
    );

    const isValidPackage = (p) => !p.hasError && p.name;

    const validPackages: IPackage[] = fetchedPackages
      .filter((p): p is IPackage => isValidPackage(p))
      .map((p, i) => ({
        ...p,
        color: colors[i],
      }));

    const invalidPackages = fetchedPackages.filter((p) => !isValidPackage(p)).map((p) => p.name);

    return {
      validPackages,
      invalidPackages,
    };
  };

  static formatRepositoryData = (npmRepositoryUrl: string) => {
    try {
      const gitInfo = hostedGitInfo.fromUrl(npmRepositoryUrl);

      return {
        type: gitInfo.type,
        url: gitInfo.browse(),
      };
    } catch {
      return {
        type: null,
        url: null,
      };
    }
  };

  static fetchPackage = async (packageName: string): Promise<IPackage> => {
    try {
      return await Package.fetchPackageFromNpms(packageName);
    } catch (e) {
      console.error('Problem fetching npms data', e);
      return Package.fetchPackageManually(packageName);
    }
  };

  static fetchPackageFromNpms = async (packageName: string): Promise<IPackage> => {
    const url = `https://api.npms.io/v2/package/${encodeURIComponent(encodeURIComponent(packageName))}`;

    const fetchRegistryData = async () => {
      try {
        return await Package.fetchRegistryPackageData(packageName);
      } catch (e) {
        console.error('Problem fetching NPM registry data', e);
        return {};
      }
    };

    const [npmsPackageData, registryPackageData] = await Promise.all([
      Fetch.getJSON(urlWithProxy(url)),
      fetchRegistryData(),
    ]);

    const repository = Package.formatRepositoryData(_get(npmsPackageData, 'collected.metadata.repository.url', null));

    return {
      id: _get(npmsPackageData, 'collected.metadata.name', null),
      name: _get(npmsPackageData, 'collected.metadata.name', null),
      description: _get(npmsPackageData, 'collected.metadata.description', null),
      version: _get(npmsPackageData, 'collected.metadata.version', null),
      versionDate: new Date(_get(npmsPackageData, 'collected.metadata.date', null)).toJSON(),
      repository,
      github: {
        starsCount: _get(npmsPackageData, 'collected.github.starsCount', null),
        forksCount: _get(npmsPackageData, 'collected.github.forksCount', null),
        issuesCount: _get(npmsPackageData, 'collected.github.issues.count', null),
        openIssuesCount: _get(npmsPackageData, 'collected.github.issues.openCount', null),
      },
      links: {
        npm: _get(npmsPackageData, 'collected.metadata.links.npm', null),
        homepage: _get(npmsPackageData, 'collected.metadata.links.homepage', null),
      },
      downloads: {
        weekly: _get(npmsPackageData, 'collected.npm.downloads[1].count', null),
      },
      ...registryPackageData,
    };
  };

  static fetchPackageManually = async (packageName: string): Promise<IPackage> => {
    const registryPackageDataFormatted = await Package.fetchPackageDetails(packageName);

    let github = null;

    try {
      github = registryPackageDataFormatted.repository.url.includes('github')
        ? await Package.fetchGithubRepo(registryPackageDataFormatted.repository.url)
        : null;
    } catch (e) {
      console.error('Problem fetching github data', e);
    }

    const weeklyDownloads = await PackageDownloads.fetchPoint(registryPackageDataFormatted.name, 'last-week');

    return {
      ...registryPackageDataFormatted,
      github: {
        starsCount: _get(github, 'stargazers_count', null),
        forksCount: _get(github, 'collected.metadata.github.forksCount', null),
        issuesCount: _get(github, 'collected.metadata.github.issues.count', null),
        openIssuesCount: _get(github, 'open_issues_count', null),
      },
      downloads: {
        weekly: weeklyDownloads.downloads,
      },
    };
  };

  static fetchRegistryPackageData = async (packageName: string): Promise<Partial<IPackage>> => {
    const registryPackageData = await Package.fetchPackageDetails(packageName);

    const repository = Package.formatRepositoryData(_get(registryPackageData, 'repository.url', null));

    const version = _get(registryPackageData, 'dist-tags.latest');

    const dateOfFirstVersion = <string>(
      Object.values(registryPackageData?.time).sort((aKey: any, bKey: any) => aKey.localeCompare(bKey))[0]
    );

    return {
      id: registryPackageData.name,
      name: registryPackageData.name,
      description: _get(registryPackageData, 'description', null),
      version,
      versionDate: new Date(registryPackageData?.time[version]).toJSON(),
      createdDate: new Date(dateOfFirstVersion).toJSON(),
      readme: _get(registryPackageData, 'readme', ''),
      repository,
      links: {
        npm: `https://npmjs.com/package/${registryPackageData.name}`,
        homepage: _get(registryPackageData, 'homepage', null),
      },
    };
  };

  static fetchGithubRepo = async (url: string) => {
    try {
      const repositoryPath = url.split('.com')[1].replace('.git', '');

      const githubUrl = `https://api.github.com/repos${repositoryPath}`;

      return await Fetch.getJSON(urlWithProxy(githubUrl));
    } catch (e) {
      console.error('Problem fetching GitHub data', e);
      return {};
    }
  };

  static fetchPackageDetails = async (packetName: string): Promise<any> => {
    const url = `https://registry.npmjs.org/${encodeURIComponent(packetName)}`;

    return Fetch.getJSON(urlWithProxy(url));
  };
}

export default Package;
