import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get as _get } from 'lodash';

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
    renderer: (packet) => (
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
  { heading: 'stars 🌟', renderer: (packet) => Number(_get(packet, 'github.stargazers_count')).toLocaleString() },
  { heading: 'issues ⚠️', renderer: (packet) => Number(_get(packet, 'github.open_issues_count')).toLocaleString() },
  { heading: 'updated 🛠', renderer: (packet) => Date.parse(_get(packet, 'github.pushed_at')).toString('MMM d, yyyy') },
  {
    heading: 'created 🐣',
    renderer: (packet) => Date.parse(_get(packet, 'github.created_at')).toString('MMM d, yyyy'),
  },
  { heading: 'size 🏋️‍♀️', renderer: (packet) => <BundlephobiaRenderer packet={packet} /> },
];

const propTypes = {
  packets: PropTypes.arrayOf(PropTypes.object).isRequired,
};

class PackageStats extends Component {
  columnHeadings = () =>
    columns.map((column) => (
      <th key={column.heading.replace(/\s/g, '')}>{!column.hideHeading ? column.heading : ''}</th>
    ));

  tableRows = () => {
    const { packets } = this.props;
    return packets.map((packet) => <PackageStatsRow key={packet.name} packet={packet} columns={columns} />);
  };

  render() {
    const { packets } = this.props;

    if (!packets.length) return null;

    return (
      <div className="package-stats">
        <h2>Stats</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>{this.columnHeadings()}</tr>
            </thead>
            <tbody>{this.tableRows()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

PackageStats.propTypes = propTypes;

export default PackageStats;
