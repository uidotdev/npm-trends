export default interface IPackage {
  id: string;
  name: string;
  description: string;
  version: string;
  versionDate: string;
  createdDate?: string;
  readme?: string;
  repository: {
    type: string;
    url: string;
  };
  links: {
    npm: string;
    homepage: string;
  };
}
