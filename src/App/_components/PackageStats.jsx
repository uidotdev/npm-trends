import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PackageStatsRow from './PackageStatsRow';

// array of stats to display
// format: [name_to_display, api_source, api_attribute_name]
const columns = [
  ['', 'github', 'name'],
  ['stars 🌟', 'github', 'stargazers_count'],
  ['forks 🍽', 'github', 'forks_count'],
  ['issues ⚠️', 'github', 'open_issues_count'],
  ['updated 🛠', 'github', 'pushed_at'],
  ['created 🐣', 'github', 'created_at'],
  ['size 🏋️‍♀️', 'bundlephobia', 'size'],
];

const propTypes = {
  packets: PropTypes.arrayOf(PropTypes.object).isRequired,
};

class PackageStats extends Component {
  columnHeadings = () => columns.map(column => <th key={column[2]}>{column[0]}</th>);

  tableRows = () => {
    const { packets } = this.props;
    return packets.map(packet => <PackageStatsRow key={packet.name} packet={packet} columns={columns} />);
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
