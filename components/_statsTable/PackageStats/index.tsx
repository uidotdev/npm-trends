import { get as _get } from 'lodash';
import moment from 'moment';

import IPackage from 'types/IPackage';

import DetailsPopover from 'components/_components/_popovers/DetailsPopover';

import PackageStatsRow from './PackageStatsRow';
import BundlephobiaRenderer from './BundlephobiaRenderer';

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
          {_get(packet, 'repository.url') ? (
            <a className="name-header" target="_blank" rel="noopener noreferrer" href={_get(packet, 'repository.url')}>
              {' '}
              {packet.name}{' '}
            </a>
          ) : (
            <div className="name-header">{packet.name}</div>
          )}
        </DetailsPopover>
      </div>
    ),
  },
  {
    heading: 'Name',
    hideHeading: true,
    renderer: (packet: IPackage) => (
      <div>
        <DetailsPopover packageName={packet.name}>
          {_get(packet, 'repository.url') ? (
            <a className="name-header" target="_blank" rel="noopener noreferrer" href={_get(packet, 'repository.url')}>
              {' '}
              {packet.name}{' '}
            </a>
          ) : (
            <div className="name-header">{packet.name}</div>
          )}
        </DetailsPopover>
      </div>
    ),
  },
  {
    heading: 'stars',
    renderer: (packet: IPackage) => packet.github?.starsCount?.toLocaleString() || '',
  },
  {
    heading: 'issues',
    renderer: (packet: IPackage) => packet.github?.openIssuesCount?.toLocaleString() || '',
  },
  {
    heading: 'version',
    renderer: (packet: IPackage) => packet.version || '',
  },
  {
    heading: 'last published',
    renderer: (packet: IPackage) => (packet.versionDate ? moment().from(packet.versionDate) : ''),
  },
  {
    heading: 'created',
    renderer: (packet: IPackage) =>
      packet.github?.createdAt
        ? new Date(packet.github.pushedAt).toLocaleString(undefined, { year: 'numeric', month: 'short' })
        : '',
  },
  { heading: 'size', renderer: (packet: IPackage) => <BundlephobiaRenderer packet={packet} /> },
];

type Props = {
  packets: IPackage[];
};

const PackageStats = ({ packets }: Props) => {
  const columnHeadings = () =>
    columns.map((column) => (
      <th key={column.heading.replace(/\s/g, '')}>{!column.hideHeading ? column.heading : ''}</th>
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
