import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import PackageDownloads from 'services/PackageDownloads';

import TrendGraph from './TrendGraph';

const momentToStartDate = momentDate => momentDate.startOf('week').format('YYYY-MM-DD');

const propTypes = {
  startDate: PropTypes.string,
  packets: PropTypes.arrayOf(PropTypes.object).isRequired,
  colors: PropTypes.arrayOf(PropTypes.array).isRequired,
};

const defaultProps = {
  startDate: momentToStartDate(moment().subtract(6, 'months')),
};

class TrendGraphBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphStats: [],
      startDate: props.startDate,
    };
  }

  componentDidMount() {
    const { packets } = this.props;
    const { startDate } = this.state;

    this.getStats(packets, startDate);
  }

  componentWillReceiveProps(nextProps) {
    const { startDate } = this.state;

    this.getStats(nextProps.packets, startDate);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { graphStats } = this.state;

    // prevents updating before new stats are fetched
    return nextState.graphStats !== graphStats;
  }

  getStats = async (packets, startDate) => {
    if (packets.length > 0) {
      const packetNames = packets.map(packet => packet.name);

      // Only show last full week
      const endDate = moment()
        .subtract(1, 'week')
        .endOf('week')
        .format('YYYY-MM-DD');

      const graphStats = [];

      packetNames.forEach(packetName => {
        const downloads = PackageDownloads.fetchDownloads(packetName, startDate, endDate);
        graphStats.push(downloads);
      });

      const fetchedGraphStats = await Promise.all(graphStats);

      this.setState({ graphStats: fetchedGraphStats, startDate });
    } else {
      this.setState({ graphStats: [], startDate });
    }
  };

  handlePeriodChange = e => {
    const { packets } = this.props;
    this.getStats(packets, e.target.value);
  };

  heading = () => {
    const { graphStats, startDate } = this.state;

    if (graphStats.length > 0) {
      const selectOptionsData = [
        ['1 Month', momentToStartDate(moment().subtract(1, 'month'))],
        ['3 Months', momentToStartDate(moment().subtract(3, 'month'))],
        ['6 Months', momentToStartDate(moment().subtract(6, 'month'))],
        ['1 Year', momentToStartDate(moment().subtract(1, 'year'))],
        ['2 Years', momentToStartDate(moment().subtract(2, 'year'))],
        ['5 Years', momentToStartDate(moment().subtract(5, 'year'))],
        ['All time', momentToStartDate(moment('2015-01-10'))],
      ];
      const selectOptions = selectOptionsData.map(option => (
        <option key={option[1]} value={option[1]}>
          {option[0]}
        </option>
      ));
      return (
        <h2 className="chart-heading">
          Downloads <span className="text--light">in past</span>
          <span className="select-container">
            <select className="chart-heading-select" value={startDate} onChange={this.handlePeriodChange}>
              {selectOptions}
            </select>
          </span>
        </h2>
      );
    }
    return null;
  };

  render() {
    const { colors } = this.props;
    const { graphStats } = this.state;

    return (
      <div>
        {this.heading()}
        <TrendGraph graphStats={graphStats} colors={colors} />
      </div>
    );
  }
}

TrendGraphBox.propTypes = propTypes;

TrendGraphBox.defaultProps = defaultProps;

export default TrendGraphBox;
