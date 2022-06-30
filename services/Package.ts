import _get from 'lodash/get';
import hostedGitInfo from 'hosted-git-info';

import { githubReposURL, npmRegistryURL } from 'utils/proxy';
import { colors } from 'utils/colors';
import IPackage from 'types/IPackage';
import INpmRegistryDataFormatted from 'types/INpmRegistryDataFormatted';
import Fetch from './Fetch';
import PackageDownloads from './PackageDownloads';

class Package {
  static fetchPackages = async (packetNames: string[]): Promise<{ validPackages: IPackage[] }> => {
    // packageNames format: ['react', '@angular-core']
    const pkgs = await Promise.allSettled(packetNames.map((name) => Package.fetchPackage(name)));
    const validPackages = pkgs.reduce((acc, pkg, i) => {
      if (pkg.status === 'fulfilled') {
        acc.push({ ...pkg.value, color: colors[i] });
      }
      return acc;
    }, []);

    return {
      validPackages,
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

    const [weeklyDownloads, registry] = await Promise.all([
      PackageDownloads.fetchPoint(packageName, 'last-week'),
      Package.fetchAndFormatNpmRegistryData(packageName),
    ]);

    let github = {};
    
    if (registry?.repository?.url?.includes('github')) {
      github = await Package.fetchGithubRepo(registry.repository.url);
    }

    return {
      ...registry,
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

  static fetchAndFormatNpmRegistryData = async (packageName: string): Promise<INpmRegistryDataFormatted> => {
    const registryPackageData = await Package.fetchNpmRegistryData(packageName);

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
      return await Fetch.getJSON(githubReposURL(repositoryPath));
    } catch (e) {
      console.error('Problem fetching GitHub data', e);
      return {};
    }
  };

  static fetchNpmRegistryData = async (packetName: string): Promise<any> => {
    const url = npmRegistryURL(encodeURIComponent(packetName));
    return Fetch.getJSON(url);
  };
}

export default Package;
