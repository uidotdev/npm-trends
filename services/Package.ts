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
      return Package.fetchPackageFromNpms(packageName);
    } catch (e) {
      console.error('Problem fetching npms data', e);
      return Package.fetchPackageManually(packageName);
    }
  };

  static fetchPackageFromNpms = async (packageName: string): Promise<IPackage> => {
    const url = `https://api.npms.io/v2/package/${encodeURIComponent(encodeURIComponent(packageName))}`;

    const npmsPackageData = await Fetch.getJSON(urlWithProxy(url));

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
    };
  };

  static fetchPackageManually = async (packageName: string): Promise<IPackage> => {
    const npmPackageData = await Package.fetchPackageDetails(packageName);

    const repository = Package.formatRepositoryData(_get(npmPackageData, 'repository.url', null));

    const github = repository.type === 'github' ? await Package.fetchGithubRepo(repository.url) : null;

    const weeklyDownloads = await PackageDownloads.fetchPoint(npmPackageData.name, 'last-week');

    const version = _get(npmPackageData, 'dist-tags.latest');

    const firstVersion = Object.keys(npmPackageData?.versions)
      .filter((key) => !key.includes('-'))
      .sort((aKey, bKey) => aKey.localeCompare(bKey))[0];

    const dateOfFirstVersion = <string>npmPackageData?.time[firstVersion];

    return {
      id: npmPackageData.name,
      name: npmPackageData.name,
      description: _get(npmPackageData, 'description', null),
      version,
      versionDate: new Date(npmPackageData?.time[version]).toJSON(),
      createdDate: new Date(dateOfFirstVersion).toJSON(),
      repository,
      github: {
        starsCount: _get(github, 'stargazers_count', null),
        forksCount: _get(github, 'collected.metadata.github.forksCount', null),
        issuesCount: _get(github, 'collected.metadata.github.issues.count', null),
        openIssuesCount: _get(github, 'open_issues_count', null),
      },
      links: {
        npm: `https://npmjs.com/package/${npmPackageData.name}`,
        homepage: _get(npmPackageData, 'homepage', null),
      },
      downloads: {
        weekly: weeklyDownloads.downloads,
      },
    };
  };

  static fetchGithubRepo = async (url: string) => {
    try {
      const repositoryPath = url.split('.com')[1].replace('.git', '');

      const githubUrl = `https://api.github.com/repos${repositoryPath}`;

      return Fetch.getJSON(urlWithProxy(githubUrl));
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
