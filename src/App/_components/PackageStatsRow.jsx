import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Package from 'services/Package';

const propTypes = {
  packet: PropTypes.object,
  columns: PropTypes.arrayOf(PropTypes.object),
};

class PackageStatsRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      packageStats: null,
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

  tableCell = column => {
    const { packet } = this.props;
    const { packageStats } = this.state;

    const apiSource = column[1];
    const attributeName = column[2];
    let attributeValue;
    switch (attributeName) {
      case 'created_at':
        attributeValue =
          packageStats && packageStats[apiSource][attributeName] !== undefined
            ? Date.parse(packageStats[apiSource][attributeName]).toString('MMM d, yyyy')
            : '';
        break;
      case 'pushed_at':
        attributeValue =
          packageStats && packageStats[apiSource][attributeName] !== undefined
            ? Date.parse(packageStats[apiSource][attributeName]).toString('MMM d, yyyy')
            : '';
        break;
      case 'name':
        attributeValue = packageStats ? (
          <a className="name-header" target="_blank" rel="noopener noreferrer" href={packageStats[apiSource].html_url}>
            {' '}
            {packet.name}{' '}
          </a>
        ) : (
          <div className="name-header">{packet.name}</div>
        );
        break;
      case 'size': {
        if (!packageStats) {
          attributeValue = '';
          break;
        }
        const sizeUrl = `https://bundlephobia.com/result?p=${packet.name}`;
        attributeValue = (
          <a href={sizeUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={`https://flat.badgen.net/bundlephobia/minzip/${packet.name}`}
              alt={`Minified + gzip package size for ${packet.name} in KB`}
              className="badge--in-table"
            />
          </a>
        );
        break;
      }
      default:
        attributeValue =
          packageStats && packageStats[apiSource][attributeName] !== undefined
            ? packageStats[apiSource][attributeName]
            : '';
    }

    return <td key={attributeName}>{attributeValue}</td>;
  };

  rowCells = () => {
    const { columns } = this.props;

    return columns.map(column => this.tableCell(column));
  };

  render() {
    const { packet } = this.props;

    return <tr key={packet.name}>{this.rowCells()}</tr>;
  }
}

PackageStatsRow.propTypes = propTypes;

export default PackageStatsRow;
