import React, {Component, PropTypes} from 'react';

export default class TrendGraph extends Component {

	componentDidMount(){
		this.loadChart();
	}

	componentDidUpdate(){
		this.loadChart();
	}

	loadChart = () => {
		if(typeof this.download_chart !== 'undefined'){
			this.download_chart.destroy();
		}
		if(this.props.graphStats.length > 0){
			var chart_data = {labels: [], datasets: []};
			this.props.graphStats.map(function(graphStat, i){
				var dataColor = colors[i].join(',');
				var groupedData = groupDates(graphStat.downloads, 'week', graphStat.start, graphStat.end);
				if(i == 0){
					var labels = groupedData.map(function(download){
						return download.period;
					});
					chart_data.labels = labels;
				}
				var data = groupedData.map(function(download){
					return download.downloads;
				});
				var dataset = {
					label: graphStat.package,
					fillColor: "rgba(" + dataColor + ",0.1)",
	        strokeColor: "rgba(" + dataColor + ",1)",
	        pointColor: "rgba(" + dataColor + ",1)",
	        pointStrokeColor: "#fff",
	        pointHighlightFill: "#fff",
	        pointHighlightStroke: "rgba(" + dataColor + ",1)",
	        data: data
				}
				chart_data.datasets.push(dataset);
			});
			var chart_options = {
				scaleFontColor: "#000000",
				responsive: true,
				datasetFill: false,
				scaleLabel: "<%= ' ' + value%>"
			}
			var ctx = document.getElementById("download_chart").getContext("2d");
			this.download_chart = new Chart(ctx).Line(chart_data, chart_options);
		}
	}

	chart = () => {
		if (this.props.graphStats.length > 0){
			return <canvas id="download_chart"></canvas>;
		}
	}

	render(){
		return(
			<div>
				{this.chart()}
			</div>
		)
	}

};


var groupDates = function(dates, period, start, end){
	// Expect format:
	// dates: [{"day":"2012-10-22","downloads":279},
	//         {"day":"2012-10-23","downloads":2042}]
	// period: 'week'
	// start: '2015-5-14'
	// end: '2015-11-17'
	var groupedDates = []
	var startDate = Date.parse(start);
	var endDate = Date.parse(end);
	var currentPeriod = startDate.is().sunday() ? startDate : startDate.next().sunday();
	var currentPeriodDownloads = 0;
	dates.forEach(function(date, i){
		var dayObj = new Date(date.day);
	
		checkForCorrectPeriod();

		function checkForCorrectPeriod(){
			if( dayObj.isAfter(currentPeriod) ){
				// go to next period if this date does not fall in currentPeriod
				var currentPeriodFormatted = currentPeriod.toString("MMM d");
				groupedDates.push({period: currentPeriodFormatted, downloads: currentPeriodDownloads});
				currentPeriod = currentPeriod.next().sunday();
				currentPeriodDownloads = 0;
				checkForCorrectPeriod();
			}else{				
				currentPeriodDownloads += date.downloads;
				return;
			}
		}

	});

	return groupedDates;
}


