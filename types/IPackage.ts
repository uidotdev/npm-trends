interface GitHub {
  starsCount: number;
  forksCount: number;
  issuesCount: number;
  openIssuesCount: number;
  pushedAt?: string;
  createdAt?: string;
}

export default interface IPackage {
  id: string;
  name: string;
  description: string;
  version: string;
  versionDate: string;
  color?: number[];
  repository: {
    type: string;
    url: string;
  };
  github: GitHub;
  links: {
    npm: string;
    homepage: string;
  };
  downloads: {
    weekly: number;
  };
}
