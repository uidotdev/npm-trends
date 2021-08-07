export interface IPackage {
  id: string;
  name: string;
  description: string;
  repository: {
    type: string,
    url: string,
  };
  github?: any;
  links: {
    npm: string,
    homepage: string,
  };
  downloads: {
    weekly: number,
  };
}
