import IPackage from 'types/IPackage';

import Tooltip from 'components/_components/Tooltip';

import styles from './PackageLinks.module.scss';

type Props = {
  packet: IPackage;
};

const PackageLinks = ({ packet }: Props) => {
  const npmUrl = packet.links?.npm;
  const githubUrl = packet.repository.type === 'github' ? packet.repository.url : null;
  const homepageUrl = packet.links?.homepage;

  return (
    <>
      {npmUrl && (
        <Tooltip overlay="NPM">
          <a href={npmUrl} className={styles.link_icon__npm} target="_blank" rel="noopener noreferrer">
            <i className="icon icon-npm" aria-hidden />
          </a>
        </Tooltip>
      )}
      {githubUrl && (
        <Tooltip overlay="GitHub">
          <a href={githubUrl} className={styles.link_icon__github} target="_blank" rel="noopener noreferrer">
            <i className="icon icon-github" aria-hidden />
          </a>
        </Tooltip>
      )}
      {homepageUrl && (
        <Tooltip overlay="Website">
          <a href={homepageUrl} className={styles.link_icon__website} target="_blank" rel="noopener noreferrer">
            <i className="icon icon-link" aria-hidden />
          </a>
        </Tooltip>
      )}
    </>
  );
};

export default PackageLinks;
