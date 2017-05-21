import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Chart from 'chart.js'

import { groupDates } from '../libs/groupDates';

export default class TrendGraph extends Component {

	static defaultProps = {
		graphStats: PropTypes.array.isRequired,
		colors: PropTypes.array.isRequired,
	}

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
				var dataColor = this.props.colors[i].join(',');
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
					backgroundColor: "rgba(" + dataColor + ",0)",
	        borderColor: "rgba(" + dataColor + ",1)",
	        pointRadius: 5,
	        pointHoverRadius: 5,
	        pointBackgroundColor: "rgba(" + dataColor + ",1)",
	        pointBorderColor: "#fff",
	        pointBorderWidth: 1,
	        pointHoverBackgroundColor: "#ffffff",
	        pointHoverBorderColor: "rgba(" + dataColor + ",1)",
	        fill: false,
	        data: data
				}
				chart_data.datasets.push(dataset);
			}, this);
			var chart_options = {
				scaleFontColor: "#000000",
				responsive: true,
				datasetFill: false,
				scaleLabel: "<%= ' ' + value%>"
			}
			var ctx = document.getElementById("download_chart").getContext("2d");
			this.download_chart = new Chart(ctx, {
				type: 'line', 
				data: chart_data, 
				options: chart_options
			});
		}
	}

	render(){
		if (!this.props.graphStats.length) return null;

		return(
			<div className="graph-container">
				<canvas id="download_chart"></canvas>
			</div>
		)
	}

};





