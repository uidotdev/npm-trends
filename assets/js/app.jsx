"use strict";

var React = require('react');
var ReactDOM = require('react-dom');

var App = React.createClass({
	getInitialState: function(){
		return{
			packets: this.props.packets
		}
	},
	getDefaultProps: function(){
		return{
			packets: []
		}
	},
	updateFromSeach: function(packet){
		var packets = this.state.packets;
		packets.push(packet);
		this.setState({packets: packets});
	},
	removePacket: function(packet_id){
		var old_packets = this.state.packets;
		var new_packets = $.grep(old_packets, function(packet) {
		  return ( packet.id !== packet_id );
		});
		this.setState({packets: new_packets});
	},
	render: function(){
		return (
			<div>
				<div className="row">
					<div className="col-xs-12">
						<h1>NPM Trends</h1>
					</div>
					<div className="col-xs-12">
						<SearchForm onSearch={this.updateFromSeach}/>
						<PacketTags onTagRemove={this.removePacket}
											  packets={this.state.packets}/>
					</div>
				</div>
				<div className="row">
					<div className="col-xs-12">
						<PacketsComparison packets={this.state.packets}/>
					</div>
				</div>
			</div>
		);
	}
});

var SearchForm = React.createClass({
	handleSubmit: function(e){
		e.preventDefault();
		var url = "http://npm-registry-cors-proxy.herokuapp.com/" + this.refs.search_query.value.toLowerCase();
		$.ajax({
			url: url,
			dataType: 'json',
			success: function(data){
				var packet = {id: data._id, name: data.name, description: data.description};
				this.refs.search_query.value = '';
				this.props.onSearch(packet);
			}.bind(this),
			error: function(data, status, err){
				console.log(data);
				console.error(url, status, err.toString());
			}.bind(this)
		});
		return;
	},
	render: function(){
		return (
			<form onSubmit={this.handleSubmit} id="search_form">
				<input id="search_form_input" 
				       ref="search_query" 
				       type="text"
				       placeholder="Add an NPM package..."/>
			</form>
		);
	}
});

var PacketTags = React.createClass({
	handleClick: function(packet_id){
		this.props.onTagRemove(packet_id);
	},
	render: function(){
		var packets = this.props.packets.map(function(packet){
			var boundClick = this.handleClick.bind(this, packet.id);
			return(
				<li key={packet.id} className="package-search-tag" onClick={boundClick}>
					<span className="search-tag-name">
						{packet.name}
					</span>
					<span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
				</li>
			);
		}, this);
		return (
			<ul className="package-search-tags list-unstyled">
				{packets}
			</ul>
		);
	}
});

var PacketsComparison = React.createClass({
	render: function(){
		return (
			<div>
				<TrendGraphBox packets={this.props.packets}/>
			</div>
		);
	}
});

var TrendGraphBox = React.createClass({
	getInitialState: function(){
		return{
			graphStats: this.props.graphStats
		};
	},
	getDefaultProps: function(){
		return{
			graphStats: []
		};
	},
	componentWillMount: function(){
		this.getStats(this.props.packets);
	},
	componentWillReceiveProps: function(nextProps){
		this.getStats(nextProps.packets);
	},
	getStats: function(packets){
		var graphStats = packets.map(function(packet){
			var url = "https://api.npmjs.org/downloads/range/2014-1-1:2015-11-16/" + packet.name;
			var result = $.ajax({
				url: url,
				dataType: 'json',
				async: false
			}).responseText;
			return(JSON.parse(result));
		});
		this.setState({graphStats: graphStats});
	},
	render: function(){
		return (
			<div><TrendGraph graphStats={this.state.graphStats}/></div>
		);
	}
});

var TrendGraph = React.createClass({
	componentDidMount: function(){
		this.loadChart();
	},
	componentDidUpdate: function(){
		this.loadChart(true);
	},
	loadChart: function(){
		if(this.download_chart){
			this.download_chart.destroy();
		}
		if(this.props.graphStats.length > 0){
			var chart_data = {labels: [], datasets: []};
			this.props.graphStats.map(function(graphStat, i){
				var groupedData = groupDates(graphStat.downloads, 'week');
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
					fillColor: "rgba(220,220,220,0.2)",
	        strokeColor: "rgba(220,220,220,1)",
	        pointColor: "rgba(220,220,220,1)",
	        pointStrokeColor: "#fff",
	        pointHighlightFill: "#fff",
	        pointHighlightStroke: "rgba(220,220,220,1)",
	        data: data
				}
				chart_data.datasets.push(dataset);
			});
			console.log(chart_data);

			var chart_options = {
				pointDotRadius : 4
			}
			var ctx = document.getElementById("download_chart").getContext("2d");
			this.download_chart = new Chart(ctx).Line(chart_data, chart_options);
		}
	},
	render: function(){
		return(
			<div>
				<canvas id="download_chart"></canvas>
			</div>
		)
	}
})

// Expect format:
// dates: [{"day":"2012-10-22","downloads":279},{"day":"2012-10-23","downloads":2042}]
// period: 'week' or 'month'
var groupDates = function(dates, period){
	var groupedDates = []
	var current_period;
	var previous_day;
	var current_period_downloads;
	var total_dates = dates.length;
	dates.forEach(function(date, i){
		var dayObj = new Date(date.day.split('-'));
		if(period === 'week'){
			var dayNumber = [6,0,1,2,3,4,5]; // makes sunday last day of week
			var dayOfWeek = dayNumber[dayObj.getDay()];
			if( !current_period || (dayOfWeek <= previous_day) || (i + 1 === total_dates)){
				function addWeekPeriod(){
					var last_day_of_week = new Date( dayObj.setDate( dayObj.getDate() + (6 - dayOfWeek) ) );
					var day = last_day_of_week.getDate();
					var month_names = ['Jan', 'Feb', 'Mar', 'Apr', 
					                    'May', 'Jun', 'Jul', 'Aug', 
					                    'Sep', 'Oct', 'Nov', 'Dec']
					var month = month_names[last_day_of_week.getMonth()];
					current_period = month + ' ' + day.toString();
					groupedDates.push({period: current_period, downloads: current_period_downloads});
				}
				if( current_period ){
					if(i + 1 === total_dates){
						current_period_downloads += date.downloads;
					}
					addWeekPeriod();
				}
				current_period = date.day;
				previous_day = dayOfWeek;
				current_period_downloads = 0;
			}
		}else{
			var dayOfMonth = dayObj.getMonth();
			if( !current_period || (dayOfMonth === current_period)){
				if( current_period ){
					groupedDates.push({period: current_period, downloads: current_period_downloads});
				}
				current_period = dayOfMonth;
				current_period_downloads = 0;
			}
		}

		current_period_downloads += date.downloads;
	});

	console.log(groupedDates);

	return groupedDates;
}

ReactDOM.render( <App/>, document.querySelector('#app'));





