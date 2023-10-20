import { useEffect, useCallback, useRef } from 'react';
import dayjs from 'dayjs';
import Chart from 'chart.js';

import { groupDownloadsByPeriod } from 'utils/groupDates';

type Props = {
  graphStats: any[];
  dataType: string;
  colors: number[][];
};

const usePreviousValue = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const datasetConsts = {
  pointRadius: 4,
  pointHoverRadius: 4,
  pointBorderWidth: 1,
  pointBackgroundColor: 'transparent',
  pointBorderColor: 'transparent',
  pointHoverBorderColor: '#ffffff',
  fill: false,
};

const TrendGraph = ({ graphStats, dataType, colors }: Props) => {
  const stats = graphStats?.filter(Boolean);
  const chartInstance = useRef(null);
  const prevDataType = usePreviousValue(dataType);
  const isDownloadView = dataType == "Downloads";

  if (prevDataType != dataType && chartInstance.current) {
    const chartType = (function () {
      switch(dataType) { 
        case "Downloads": 
          return "line"
        case "Avg Grown Rate": 
          return "bar"
      } 
    })();   
    const ctx = chartInstance.current.ctx;
    const data = chartInstance.current.data;
    
    // to change the graph type in Chart.js, we must recreate the graph
    // simply changing the chartInstance.type property does not re-render
    chartInstance.current.destroy();
    chartInstance.current = new Chart(ctx, {
      type: chartType,
      data: data
    });
  }

  const getDownloadsChartData = useCallback(() => {
    const chartData = { labels: [], datasets: [] };
    stats.filter(Boolean).forEach((graphStat, i) => {
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
      const downloadsDataset = {
        label: graphStat.package,
        backgroundColor: `rgba(${dataColor},1)`,
        borderColor: `rgba(${dataColor},1)`,
        pointHoverBackgroundColor: `rgba(${dataColor},1)`,
        data,
      };
      const dataset = Object.assign({}, datasetConsts, downloadsDataset);

      chartData.datasets.push(dataset);
    }, this);

    return chartData;
  }, [stats, colors]);

  const getAvgRateOfChangeChartData = useCallback(() => {
    const chartData = { labels: [], datasets: [] };
    const typeLabels = Object.keys(stats).map(key => stats[key].package);
    let totalData = []
    chartData.labels = typeLabels
    
    stats.filter(Boolean).forEach((graphStat, i) => {
      const downloads = graphStat.downloads;
      const avgRateOfChange = (downloads[downloads.length-1].downloads - downloads[0].downloads)/downloads.length;
      totalData.push({y: avgRateOfChange});
    }, this);
    
    const backgroundColors = colors.map(color  => `rgba(${color.join(',')},1)`).slice(0, totalData.length);
    const avgRateOfChangeDataset = {
      labels: typeLabels,
      backgroundColor: backgroundColors, 
      borderColor:backgroundColors,
      pointHoverBackgroundColor: backgroundColors,
      data: totalData,
    };
    const dataset = Object.assign({}, datasetConsts, avgRateOfChangeDataset);
    
    chartData.datasets.push(dataset);
    return chartData;
  }, [stats, colors]);


  const getChartOptions = useCallback(() => {
    const firstDateForChartdayjs = dayjs(stats?.[0]?.downloads?.[0]?.day || '2021-06-27');
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
      animation: {
        duration: 0,
      },
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
              return [
                {
                  text: "loading",
                  fillStyle: "rgba(0,0,0,0.05)",
                  strokeStyle: 'transparent',
                }
              ];
            }
            // if this is the download view, there are multiple datasets, each with one label
            // if this is the avg rate of change view, there is a single dataset with the lists of labels
            return isDownloadView
            ? data.datasets.map((dataset) => ({
                text: dataset.label,
                fillStyle: dataset.borderColor,
                strokeStyle: 'transparent',
              }))
            : (function () {
                const dataset = data.datasets[0];
                return dataset.labels.map((label, idx) => ({
                  text: label,
                  fillStyle: dataset.borderColor[idx],
                  strokeStyle: 'transparent',
                }));
              })();
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
            type: isDownloadView ? 'time' : 'category',
            time: {
              unit: xAxisDispalyUnit,
              tooltipFormat: 'll',
              displayFormats: {
                quarter: 'MMM YYYY',
              },
            }
          },
        ],
      },
      tooltips: {
        mode: isDownloadView ? 'index' : 'nearest',
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
          labelColor: (tooltipItem, chart) => {
            // if this is the download view, there are multiple datasets, each with one background color
            // if this is the avg rate of change view, there is a single dataset with the list of background colors
            const backgroundColorInfo = chart.data.datasets[tooltipItem.datasetIndex].backgroundColor;
            const backgroundColor = isDownloadView ? backgroundColorInfo : backgroundColorInfo[tooltipItem.index];
            return {
              backgroundColor: backgroundColor,
              borderColor: 'transparent',
            }
          },
        },
      },
      hover: {
        mode: 'index',
        intersect: false,
      },
    };

    return chartOptions;
  }, [stats, isDownloadView]);

  const updateChart = useCallback(() => {
    if (chartInstance.current) {
      chartInstance.current.data = isDownloadView ? getDownloadsChartData() : getAvgRateOfChangeChartData();
      chartInstance.current.options = getChartOptions();
      chartInstance.current.update();
    }
  }, [getDownloadsChartData, getAvgRateOfChangeChartData, getChartOptions, isDownloadView]);

  useEffect(() => {
    updateChart();
  }, [updateChart]);

  return (
    <div className="graph-container">
      <canvas
        ref={(el) => {
          if (!chartInstance.current) {
            const ctx = el.getContext('2d');
            chartInstance.current = new Chart(ctx, { type: isDownloadView ? "line" : "bar" });
          }
        }}
        id="download_chart"
      />
    </div>
  );
};

export default TrendGraph;
