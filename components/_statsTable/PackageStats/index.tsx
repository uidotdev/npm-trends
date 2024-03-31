import dayjs, { ConfigType as DayjsConfigType } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Dispatch, useEffect, useReducer } from 'react';
import _orderBy from 'lodash/orderBy';
import { compareVersions } from 'compare-versions';
import IPackage from 'types/IPackage';
import DetailsPopover from 'components/_components/_popovers/DetailsPopover';
import PackageLinks from 'components/_components/PackageLinks';
import Tooltip from 'components/_components/Tooltip';
import PackageStatsRow from './_components/PackageStatsRow';
import BundlephobiaRenderer from './_components/BundlephobiaRenderer';
import styles from './PackageStats.module.scss';

dayjs.extend(relativeTime);
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
    renderer: (packet: IPackage) =>
      packet.github?.starsCount?.toLocaleString() || <i aria-hidden className="icon icon-dash" />,
  },
  {
    heading: 'Issues',
    renderer: (packet: IPackage) =>
      packet.github?.openIssuesCount?.toLocaleString() || <i aria-hidden className="icon icon-dash" />,
  },
  {
    heading: 'Version',
    renderer: (packet: IPackage) => packet.version || <i aria-hidden className="icon icon-dash" />,
  },
  {
    heading: 'Updated',
    tooltip:
      'Publish date for the version tagged "latest". This may differ from the "Last publish" date seen on the NPM website because that includes all version tags (experimental, next, alpha, etc.)',
    renderer: (packet: IPackage) =>
      packet.versionDate ? dayjs(packet.versionDate).fromNow() : <i aria-hidden className="icon icon-dash" />,
  },
  {
    heading: 'Created',
    tooltip: 'Date first version was published',
    renderer: (packet: IPackage) =>
      packet.createdDate ? dayjs(packet.createdDate).fromNow() : <i aria-hidden className="icon icon-dash" />,
  },
  { heading: 'Size', renderer: (packet: IPackage) => <BundlephobiaRenderer packet={packet} /> },
];

type Props = {
  packets: IPackage[];
};

const sortable = ['Name', 'Stars', 'Issues', 'Version', 'Updated', 'Created'] as const;
type SortOption = typeof sortable[number];
type Order = 'asc' | 'desc';

const isSortable = (heading: string): heading is SortOption => !!sortable.find((s) => s === heading);

const compareDate = (aDate: DayjsConfigType, bDate: DayjsConfigType) => {
  if (dayjs(aDate).isBefore(dayjs(bDate))) return 1;
  if (dayjs(aDate).isSame(dayjs(bDate))) return 0;
  return -1;
};

const reducer = (
  state: {
    packets: IPackage[];
    sortBy: SortOption;
    order: Order;
  },
  action: { sortBy: SortOption; packets?: IPackage[] },
) => {
  let packets = action.packets || state.packets;
  let sortBy = action.sortBy;
  let order = state.order;

  if (!action.packets) {
    if (sortBy !== state.sortBy) {
      order = 'asc';
    } else if (order === 'desc') {
      sortBy = 'Name';
      order = 'asc';
    } else {
      order = 'desc';
    }
  }

  const sortDirection = order === 'desc' ? -1 : 1;
  switch (sortBy) {
    case 'Name':
      packets = _orderBy(packets, ['name'], [order]);
      break;
    case 'Stars':
      packets = _orderBy(packets, (packet: IPackage) => packet.github?.starsCount || 0, [order]);
      break;
    case 'Issues':
      packets = _orderBy(packets, (packet: IPackage) => packet.github?.openIssuesCount || 0, [order]);
      break;
    case 'Version':
      packets = packets.sort((a, b) => compareVersions(a.version, b.version) * sortDirection);
      break;
    case 'Updated':
      packets = packets.sort((a, b) => compareDate(a.versionDate || 0, b.versionDate || 0) * sortDirection);
      break;
    case 'Created':
      packets = packets.sort((a, b) => compareDate(a.createdDate || 0, b.createdDate || 0) * sortDirection);
  }

  return { packets, sortBy, order };
};

const PackageStats = ({ packets }: Props) => {
  const [{ packets: sortedPackets, sortBy, order }, dispatch] = useReducer(reducer, {
    packets,
    sortBy: 'Name',
    order: 'asc',
  });

  useEffect(() => {
    dispatch({ sortBy, packets });
  }, [packets]);

  const columnHeadings = () =>
    columns.map((column) => (
      <th key={column.heading.replace(/\s/g, '')}>
        {!column.hideHeading &&
          (isSortable(column.heading) ? (
            <button
              className="stats-column-heading--button"
              onClick={() => dispatch({ sortBy: column.heading as SortOption })}
            >
              {column.heading}
              {column.heading === sortBy && (
                <i
                  aria-hidden
                  className={`${styles.icon} icon icon-arrow-alt-circle-down`}
                  style={order === 'asc' ? { transform: 'rotate(180deg)' } : {}}
                />
              )}
            </button>
          ) : (
            column.heading
          ))}
        {column.tooltip && (
          <Tooltip overlay={column.tooltip}>
            <i aria-hidden className={`${styles.icon} icon icon-question-circle`} />
          </Tooltip>
        )}
      </th>
    ));

  const tableRows = () =>
    sortedPackets.map((packet) => <PackageStatsRow key={packet.name} packet={packet} columns={columns} />);

  if (!sortedPackets?.length) return null;

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
