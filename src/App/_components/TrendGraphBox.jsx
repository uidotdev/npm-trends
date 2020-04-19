import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Fetch from 'services/Fetch';

import TrendGraph from './TrendGraph';

const propTypes = {
  timePeriod: PropTypes.number,
  packets: PropTypes.arrayOf(PropTypes.object).isRequired,
  colors: PropTypes.arrayOf(PropTypes.array).isRequired,
};

const defaultProps = {
  timePeriod: 6,
};

class TrendGraphBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphStats: [],
      timePeriod: props.timePeriod,
    };
  }

  componentDidMount() {
    const { packets } = this.props;
    const { timePeriod } = this.state;

    this.getStats(packets, timePeriod);
  }

  componentWillReceiveProps(nextProps) {
    const { timePeriod } = this.state;

    this.getStats(nextProps.packets, timePeriod);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { graphStats } = this.state;

    // prevents updating before new stats are fetched
    return nextState.graphStats !== graphStats;
  }

  getStats = (packets, period) => {
    if (packets.length > 0) {
      const packetNames = packets.map(packet => packet.name);
      const endDate = Date.today().toString('yyyy-MM-dd');
      const timeAgo = Date.today().addMonths(-period);
      // Get full start week data by making start date a monday
      const startDate = timeAgo.is().monday()
        ? timeAgo.toString('yyyy-MM-dd')
        : timeAgo
          .next()
          .monday()
          .toString('yyyy-M-dd');

      packetNames.forEach(packetName => {
        const url = `https://api.npmjs.org/downloads/range/${startDate}:${endDate}/${packetName}`;
        Fetch.getJSON(`${process.env.REACT_APP_PROXY_URL}?url=${url}`).then(data => {
          addData(data, this);
        });
      }, this);

      const totalRequests = packets.length;
      let requestsCompleted = 0;
      const graphStatsData = {};

      const addData = (data, passedThis) => {
        requestsCompleted += 1;
        graphStatsData[data.package] = data;
        if (requestsCompleted === totalRequests) {
          // persists order
          const graphStats = packetNames.map(packetName => graphStatsData[packetName]);
          passedThis.setState({ graphStats, timePeriod: period });
        }
      };
    } else {
      this.setState({ graphStats: [], timePeriod: period });
    }
  };

  handlePeriodChange = e => {
    const { packets } = this.props;
    this.getStats(packets, e.target.value);
  };

  heading = () => {
    const { graphStats, timePeriod } = this.state;

    if (graphStats.length > 0) {
      const selectOptionsData = [
        ['1 Month', 1],
        ['3 Months', 3],
        ['6 Months', 6],
        ['1 Year', 12],
        ['2 Years', 24],
        ['5 Years', 60],
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
            <select className="chart-heading-select" value={timePeriod} onChange={this.handlePeriodChange}>
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
