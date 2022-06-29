import { useEffect, useCallback, useRef } from 'react';
import dayjs from 'dayjs';
import Chart from 'chart.js';

import { groupDownloadsByPeriod } from 'utils/groupDates';

type Props = {
  graphStats: any[];
  colors: number[][];
};

const TrendGraph = ({ graphStats, colors }: Props) => {
  const chartInstance = useRef(null);

  const getChartData = useCallback(() => {
    const chartData = { labels: [], datasets: [] };
    graphStats.forEach((graphStat, i) => {
      const dataColor = colors[i].join(',');

      const groupedData = groupDownloadsByPeriod(graphStat.downloads, 'week');
      if (i === 0) {
        const labels = groupedData.map((periodData) => periodData.period);
        chartData.labels = labels;
      }

      const data = groupedData.map((periodData) => ({
        x: periodData.period,
        y: periodData.downloads,
      }));

      const dataset = {
        label: graphStat.package,
        backgroundColor: `rgba(${dataColor},1)`,
        borderColor: `rgba(${dataColor},1)`,
        pointRadius: 4,
        pointHoverRadius: 4,
        pointBorderWidth: 1,
        pointBackgroundColor: 'transparent',
        pointBorderColor: 'transparent',
        pointHoverBackgroundColor: `rgba(${dataColor},1)`,
        pointHoverBorderColor: '#ffffff',
        fill: false,
        data,
      };
      chartData.datasets.push(dataset);
    }, this);

    return chartData;
  }, [graphStats, colors]);

  const getChartOptions = useCallback(() => {
    const firstDateForChartdayjs = dayjs(graphStats[0].downloads[0].day);
    const monthsToNow = dayjs().diff(firstDateForChartdayjs, 'months');

    let xAxisDispalyUnit = 'week';
    if (monthsToNow >= 24) {
      xAxisDispalyUnit = 'year';
    } else if (monthsToNow >= 12) {
      xAxisDispalyUnit = 'quarter';
    } else if (monthsToNow >= 3) {
      xAxisDispalyUnit = 'month';
    }

    const chartOptions = {
      scaleFontColor: '#000000',
      responsive: true,
      datasetFill: false,
      scaleLabel: "<%= ' ' + value%>",
      maintainAspectRatio: false,
      legend: {
        onClick: (e) => e.stopPropagation(),
        labels: {
          padding: 25,
          fontSize: 14,
          usePointStyle: true,
          generateLabels: (chart) => {
            const { data } = chart;
            if (!data.datasets.length) {
              return [];
            }

            return data.datasets.map((dataset) => ({
              text: dataset.label,
              fillStyle: dataset.borderColor,
              strokeStyle: 'transparent',
            }));
          },
        },
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: (value) => Number(value).toLocaleString(),
            },
          },
        ],
        xAxes: [
          {
            type: 'time',
            time: {
              unit: xAxisDispalyUnit,
              tooltipFormat: 'll',
              displayFormats: {
                quarter: 'MMM YYYY',
              },
            },
          },
        ],
      },
      tooltips: {
        mode: 'index',
        intersect: false,
        displayColors: true,
        multiKeyBackground: 'transparent',
        xPadding: 10,
        yPadding: 10,
        titleMarginBottom: 10,
        bodySpacing: 10,
        callbacks: {
          label: (tooltipItem, data) => {
            const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].y;
            return ` ${Number(value).toLocaleString()}`;
          },
          labelColor: (tooltipItem, chart) => ({
            backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].backgroundColor,
            borderColor: 'transparent',
          }),
        },
      },
      hover: {
        mode: 'index',
        intersect: false,
      },
    };

    return chartOptions;
  }, [graphStats]);

  const updateChart = useCallback(() => {
    if (chartInstance.current) {
      chartInstance.current.data = getChartData();
      chartInstance.current.options = getChartOptions();
      chartInstance.current.update();
    }
  }, [getChartData, getChartOptions]);

  useEffect(() => {
    updateChart();
  }, [updateChart]);

  if (!graphStats.length) return null;

  return (
    <div className="graph-container">
      <canvas
        ref={(el) => {
          if (!chartInstance.current) {
            const ctx = el.getContext('2d');
            chartInstance.current = new Chart(ctx, { type: 'line' });
          }
        }}
        id="download_chart"
      />
    </div>
  );
};

export default TrendGraph;
