import { useState, useEffect, useCallback, Suspense } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import PackageDownloads from 'services/PackageDownloads';

import dynamic from 'next/dynamic';

const TrendGraph = dynamic(() => import('./TrendGraph'), {
  suspense: true,
});

const djsToStartDate = (djs) => djs.startOf('week').format('YYYY-MM-DD');

const propTypes = {
  packets: PropTypes.arrayOf(PropTypes.object).isRequired,
  colors: PropTypes.arrayOf(PropTypes.array).isRequired,
};

const TrendGraphBox = ({ packets, colors }) => {
  const [graphStats, setGraphStats] = useState([]);
  const [startDate, setStartDate] = useState(djsToStartDate(dayjs().subtract(12, 'months')));

  const getStats = useCallback(async () => {
    if (packets.length < 0) {
      setGraphStats([]);
    }

    const packetNames = packets.map((packet) => packet.name);

    // Only show last full week
    const endDate = dayjs().subtract(1, 'week').endOf('week').format('YYYY-MM-DD');

    const fetchGraphStatsPromiseArray = packetNames.map((packetName) =>
      PackageDownloads.fetchDownloads(packetName, startDate, endDate),
    );

    const fetchedGraphStats = await Promise.all(fetchGraphStatsPromiseArray);

    setGraphStats(fetchedGraphStats);
  }, [packets, startDate]);

  useEffect(() => {
    getStats();
  }, [getStats, packets, startDate]);

  const handlePeriodChange = (e) => {
    setStartDate(e.target.value);
  };

  const heading = () => {
    if (graphStats.length > 0) {
      const selectOptionsData = [
        ['1 Month', djsToStartDate(dayjs().subtract(1, 'month'))],
        ['3 Months', djsToStartDate(dayjs().subtract(3, 'month'))],
        ['6 Months', djsToStartDate(dayjs().subtract(6, 'month'))],
        ['1 Year', djsToStartDate(dayjs().subtract(1, 'year'))],
        ['2 Years', djsToStartDate(dayjs().subtract(2, 'year'))],
        ['5 Years', djsToStartDate(dayjs().subtract(5, 'year'))],
        ['All time', djsToStartDate(dayjs('2015-01-10'))],
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
      <Suspense fallback={<div style={{ width: '100%', height: '900px', backgroundColor: 'rgba(0,0,0,.1)' }} />}>
        <TrendGraph graphStats={graphStats} colors={colors} />
      </Suspense>
    </div>
  );
};

TrendGraphBox.propTypes = propTypes;

export default TrendGraphBox;
