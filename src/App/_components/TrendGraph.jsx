import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Chart from 'chart.js';

import { groupDates } from 'utils/groupDates';

const propTypes = {
  graphStats: PropTypes.arrayOf(PropTypes.object).isRequired,
  colors: PropTypes.arrayOf(PropTypes.array).isRequired,
};

class TrendGraph extends Component {
  componentDidMount() {
    this.loadChart();
  }

  componentDidUpdate() {
    this.loadChart();
  }

  loadChart = () => {
    const { graphStats, colors } = this.props;

    if (typeof this.download_chart !== 'undefined') {
      this.download_chart.destroy();
    }
    if (graphStats.length > 0) {
      const chartData = { labels: [], datasets: [] };
      graphStats.forEach((graphStat, i) => {
        const dataColor = colors[i].join(',');
        const groupedData = groupDates(graphStat.downloads, 'week', graphStat.start, graphStat.end);
        if (i === 0) {
          const labels = groupedData.map(download => download.period);
          chartData.labels = labels;
        }
        const data = groupedData.map(download => download.downloads);
        const dataset = {
          label: graphStat.package,
          backgroundColor: `rgba(${dataColor},0)`,
          borderColor: `rgba(${dataColor},1)`,
          pointRadius: 5,
          pointHoverRadius: 5,
          pointBackgroundColor: `rgba(${dataColor},1)`,
          pointBorderColor: '#fff',
          pointBorderWidth: 1,
          pointHoverBackgroundColor: '#ffffff',
          pointHoverBorderColor: `rgba(${dataColor},1)`,
          fill: false,
          data,
        };
        chartData.datasets.push(dataset);
      }, this);
      const chartOptions = {
        scaleFontColor: '#000000',
        responsive: true,
        datasetFill: false,
        scaleLabel: "<%= ' ' + value%>",
        maintainAspectRatio: false,
      };
      const ctx = document.getElementById('download_chart').getContext('2d');
      this.download_chart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions,
      });
    }
  };

  render() {
    const { graphStats } = this.props;

    if (!graphStats.length) return null;

    return (
      <div className="graph-container">
        <canvas id="download_chart" />
      </div>
    );
  }
}

TrendGraph.propTypes = propTypes;

export default TrendGraph;
