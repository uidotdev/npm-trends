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

const TrendGraph = ({ graphStats, dataType, colors }: Props) => {
  const stats = graphStats?.filter(Boolean);
  const chartInstance = useRef(null);
  const prevDataType = usePreviousValue(dataType);

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
    
    chartInstance.current.destroy();
    chartInstance.current = new Chart(ctx, {
        type: chartType,
        data:data
      });
  }

  const getChartData = useCallback(() => {
    const chartData = { labels: [], datasets: [] };
    const typeLabels = Object.keys(stats).map(key => stats[key].package);

    stats.filter(Boolean).forEach((graphStat, i) => {
      const dataColor = colors[i].join(',');
      const downloads = graphStat.downloads;
      const groupedData = groupDownloadsByPeriod(graphStat.downloads, 'week');
      const avgRateOfChange = (downloads[downloads.length-1].downloads - downloads[0].downloads)/downloads.length;

      if (i === 0) {
        chartData.labels =
          dataType == "Downloads"
          ? groupedData.map((periodData) => periodData.period)
          : typeLabels;
      }

      const data = 
        dataType == "Downloads"
        ? groupedData.map((periodData) => ({
            x: periodData.period,
            y: periodData.downloads
        }))
        : [{
            x: graphStat.package,
            y: avgRateOfChange
        }];

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
            type: dataType == "Downloads" ? 'time' : 'category',
            align: 'center',
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
  }, [stats]);

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

  return (
    <div className="graph-container">
      <canvas
        ref={(el) => {
          if (!chartInstance.current) {
            const ctx = el.getContext('2d');
            chartInstance.current = new Chart(ctx, { type: dataType == "Downloads" ? "line" : "bar" });
          }
        }}
        id="download_chart"
      />
    </div>
  );
};

export default TrendGraph;
