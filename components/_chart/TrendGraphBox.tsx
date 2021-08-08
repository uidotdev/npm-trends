import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import PackageDownloads from 'services/PackageDownloads';

import TrendGraph from './TrendGraph';

const momentToStartDate = (momentDate) => momentDate.startOf('week').format('YYYY-MM-DD');

const propTypes = {
  packets: PropTypes.arrayOf(PropTypes.object).isRequired,
  colors: PropTypes.arrayOf(PropTypes.array).isRequired,
};

const TrendGraphBox = ({ packets, colors }) => {
  const [graphStats, setGraphStats] = useState([]);
  const [startDate, setStartDate] = useState(momentToStartDate(moment().subtract(6, 'months')));

  const getStats = useCallback(async () => {
    if (packets.length < 0) {
      setGraphStats([]);
    }

    const packetNames = packets.map((packet) => packet.name);

    // Only show last full week
    const endDate = moment().subtract(1, 'week').endOf('week').format('YYYY-MM-DD');

    const fetchGraphStatsPromiseArray = packetNames.map((packetName) =>
      PackageDownloads.fetchDownloads(packetName, startDate, endDate),
    );

    const fetchedGraphStats = await Promise.all(fetchGraphStatsPromiseArray);

    setGraphStats(fetchedGraphStats);
  }, [packets, startDate]);

  useEffect(() => {
    getStats();
  }, [getStats, packets, startDate]);

  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   const { startDate } = this.state;
  //
  //   this.getStats(nextProps.packets, startDate);
  // }
  //
  // shouldComponentUpdate(nextProps, nextState) {
  //   const { graphStats } = this.state;
  //
  //   // prevents updating before new stats are fetched
  //   return nextState.graphStats !== graphStats;
  // }

  const handlePeriodChange = (e) => {
    setStartDate(e.target.value);
  };

  const heading = () => {
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
      const selectOptions = selectOptionsData.map((option) => (
        <option key={option[1]} value={option[1]}>
          {option[0]}
        </option>
      ));
      return (
        <h2 className="chart-heading">
          Downloads <span className="text--light">in past</span>
          <span className="select-container">
            <select className="chart-heading-select" value={startDate} onChange={handlePeriodChange}>
              {selectOptions}
            </select>
          </span>
        </h2>
      );
    }
    return null;
  };

  return (
    <div>
      {heading()}
      <TrendGraph graphStats={graphStats} colors={colors} />
    </div>
  );
};

TrendGraphBox.propTypes = propTypes;

export default TrendGraphBox;
