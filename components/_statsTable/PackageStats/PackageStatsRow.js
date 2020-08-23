import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Package from 'services/Package';

import DetailsPopover from 'components/_components/_popovers/DetailsPopover';

const propTypes = {
  packet: PropTypes.object,
  columns: PropTypes.arrayOf(PropTypes.array),
};

class PackageStatsRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      packageStats: null,
      hideSize: false,
    };
  }

  componentDidMount() {
    const { packet } = this.props;
    this.getStats(packet);
  }

  getStats(packet) {
    Package.fetchStats(packet).then(data => {
      this.setState({ packageStats: data });
    });
  }

  hideSize = () => {
    this.setState({ hideSize: true });
  };

  tableCell = column => {
    const { packet } = this.props;
    const { packageStats, hideSize } = this.state;

    const [, apiSource, attributeName] = column;

    const hasPacketStats = !!(packageStats && packageStats[apiSource] && packageStats[apiSource][attributeName]);

    switch (attributeName) {
      case 'color':
        return <div className="stats-row--color" style={{ backgroundColor: `rgb(${packet.color.join(',')})` }} />;
      case 'name':
        return (
          <div>
            <DetailsPopover packageName={packet.name}>
              {packageStats && packageStats[apiSource] ? (
                <a
                  className="name-header"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={packageStats[apiSource].html_url}
                >
                  {' '}
                  {packet.name}{' '}
                </a>
              ) : (
                <div className="name-header">{packet.name}</div>
              )}
            </DetailsPopover>
          </div>
        );
      case 'stargazers_count':
      case 'open_issues_count':
      case 'forks_count':
        if (!hasPacketStats) return null;
        return Number(packageStats[apiSource][attributeName]).toLocaleString();
      case 'created_at':
      case 'pushed_at':
        if (!hasPacketStats) return null;
        return Date.parse(packageStats[apiSource][attributeName]).toString('MMM d, yyyy');
      case 'size': {
        if (hideSize) return null;

        const sizeUrl = `https://bundlephobia.com/result?p=${packet.name}`;
        return (
          <a href={sizeUrl} target="_blank" rel="noopener noreferrer">
            <img
              onError={this.hideSize}
              src={`https://flat.badgen.net/bundlephobia/minzip/${packet.name}`}
              alt={`Minified + gzip package size for ${packet.name} in KB`}
              className="badge--in-table"
            />
          </a>
        );
      }
      default:
        if (!hasPacketStats) return null;
        return packageStats[apiSource][attributeName];
    }
  };

  rowCells = () => {
    const { columns } = this.props;

    return columns.map(column => <td key={column[2]}>{this.tableCell(column)}</td>);
  };

  render() {
    const { packet } = this.props;

    return <tr key={packet.name}>{this.rowCells()}</tr>;
  }
}

PackageStatsRow.propTypes = propTypes;

export default PackageStatsRow;
