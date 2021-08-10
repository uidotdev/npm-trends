import { get as _get } from 'lodash';
import moment from 'moment';

import IPackage from 'types/IPackage';

import DetailsPopover from 'components/_components/_popovers/DetailsPopover';
import PackageLinks from 'components/_components/PackageLinks';
import Tooltip from 'components/_components/Tooltip';

import PackageStatsRow from './_components/PackageStatsRow';
import BundlephobiaRenderer from './_components/BundlephobiaRenderer';

import styles from './PackageStats.module.scss';

// array of stats to display
// format: [name_to_display, api_source, api_attribute_name]
const columns = [
  {
    heading: 'color',
    hideHeading: true,
    renderer: (packet) => (
      <div className="stats-row--color" style={{ backgroundColor: `rgb(${packet.color.join(',')})` }} />
    ),
  },
  {
    heading: 'Name',
    hideHeading: true,
    renderer: (packet: IPackage) => (
      <div>
        <DetailsPopover packageName={packet.name}>
          <div className="name-header">{packet.name}</div>
        </DetailsPopover>
      </div>
    ),
  },
  {
    heading: 'Links',
    hideHeading: true,
    renderer: (packet: IPackage) => (
      <div className={styles.links_container}>
        <PackageLinks packet={packet} />
      </div>
    ),
  },
  {
    heading: 'Stars',
    renderer: (packet: IPackage) => packet.github?.starsCount?.toLocaleString() || '',
  },
  {
    heading: 'Issues',
    renderer: (packet: IPackage) => packet.github?.openIssuesCount?.toLocaleString() || '',
  },
  {
    heading: 'Version',
    renderer: (packet: IPackage) => packet.version || '',
  },
  {
    heading: 'Updated',
    tooltip:
      'Publish date for the version tagged "latest". This may differ from the "Last publish" date seen on the NPM website because that includes all version tags (experimental, next, alpha, etc.)',
    renderer: (packet: IPackage) => (packet.versionDate ? moment().to(packet.versionDate) : ''),
  },
  // We fetch from npms as our primary search and npms does not have a created date.
  // Hiding for now since this will be empty most of the time.
  // {
  //   heading: 'Created',
  //   tooltip: 'Date first version was published',
  //   renderer: (packet: IPackage) =>
  //     packet.createdDate ? moment().to(packet.createdDate, false) : <i className="icon icon-dash" />,
  // },
  { heading: 'Size', renderer: (packet: IPackage) => <BundlephobiaRenderer packet={packet} /> },
];

type Props = {
  packets: IPackage[];
};

const PackageStats = ({ packets }: Props) => {
  const columnHeadings = () =>
    columns.map((column) => (
      <th key={column.heading.replace(/\s/g, '')}>
        {!column.hideHeading && column.heading}
        {column.tooltip && (
          <Tooltip overlay={column.tooltip}>
            <i className={`${styles.tooltip_icon} icon icon-question-circle`} />
          </Tooltip>
        )}
      </th>
    ));

  const tableRows = () =>
    packets.map((packet) => <PackageStatsRow key={packet.name} packet={packet} columns={columns} />);

  if (!packets.length) return null;

  return (
    <div className="package-stats">
      <h2>Stats</h2>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>{columnHeadings()}</tr>
          </thead>
          <tbody>{tableRows()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default PackageStats;
