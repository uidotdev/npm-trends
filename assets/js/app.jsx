"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
import { Router, Route, Link } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

var colors = [[77,77,255],[255,0,9],[255,170,0],[244,52,255],[111,255,0]];

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
	componentDidMount: function(){
		this.loadPackets(this.props);
	},
	componentWillReceiveProps: function(nextProps){
		this.loadPackets(nextProps);
	},
	shouldComponentUpdate: function(nextProps, nextState){
		return this.state.packets !== nextState.packets;
	},
	loadPackets: function(props){
		var packets = props.params.packages;
		if (packets){
			var packets_arr = packets.split('-vs-');
			var packets_data = [];
			var packets_left = packets_arr.length;
			function addData(data, passed_this){
				var formatted_data = {id: data._id, 
					                    name: data.name, 
					                    description: data.description,
					                    repository: data.repository};
				packets_data.push(formatted_data);
				packets_left -= 1;
				if(packets_left === 0){
					//preserve original order
					var sorted_data = packets_arr.map(function(packet_name){
						var data_hash;
						packets_data.forEach(function(packet_data){
							if(packet_data.name === packet_name){
								data_hash = packet_data;
							}
						}); 
						return data_hash;
					});
					passed_this.setState({packets: sorted_data});
				}
			}
			packets_arr.map(function(packet){
				var url = "http://registry.npmjs.com/" + packet + "/latest";
				$.ajax({
					url: "http://localhost:4444/?url=" + url,
					dataType: 'json',
					success: function(data){
						addData(data, this);
					}.bind(this)
				});
			}, this);
		}else{
			this.setState({packets: []});
		}
	},
	updateFromSeach: function(query){
		var new_param;
		if( this.props.params.packages ){
			var packets_array = this.props.params.packages.split("-vs-");
			if(packets_array.indexOf(query) < 0){
				packets_array.push(query);
			}
			var new_param = packets_array.join("-vs-");
		}else{
			new_param = query;
		}
		var url = "/" + new_param;
		this.props.history.pushState(null, url);
	},
	removePacket: function(packet_name){
		var packets_array = this.props.params.packages.split("-vs-");
		var remaining_packets = $.grep(packets_array, function(packet) {
		  return ( packet !== packet_name );
		});
		var new_param = remaining_packets.join("-vs-");
		var url = "/" + new_param;
		this.props.history.pushState(null, url);
	},
	render: function(){
		return (
			<div>
				<div className="row">
					<div className="col-xs-12">
						<h1>npm trends</h1>
					</div>
					<div className="col-xs-12">
						<SearchForm curr_packets={this.props.params.packages} onSearch={this.updateFromSeach}/>
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
	componentDidMount: function(){
		var getAutocompleteResults = function(query, cb){
			var suggest_query = {
				'autocomplete_suggest': {
					'text': query,
					'completion': {
						'field': 'suggest'
					} 
				}
			}

			$.ajax({
				url: "http://search-npm-registry-4654ri5rsc4mybfyhytyfu225m.us-east-1.es.amazonaws.com/npm/_suggest",
				dataType: 'json',
				method: "POST",
				data: JSON.stringify(suggest_query),
				success: function(data){
					cb(data.autocomplete_suggest[0].options);
				}.bind(this)
			});
		}

		$('.autocomplete').autocomplete({
		  hint: false
		},
		{
		  source: getAutocompleteResults,
		  templates: {
		    suggestion: function (data) {
		      return "<div class='autocomplete-name'>" + data.text + "</div><div class='autocomplete-description'>" + data.payload.description + "</div>";
		    }
			}
		}).on('autocomplete:selected', function(event, suggestion, dataset) {
			this.value = suggestion.text;
	  });
	},
	handleSubmit: function(e){
		console.log('yes');
		e.preventDefault();
		$('.autocomplete').autocomplete('close');
		var query = this.refs.search_query.value.toLowerCase();
		this.refs.search_query.value = '';
		this.props.onSearch(query);
		return;
	},
	render: function(){
		return (
			<form onSubmit={this.handleSubmit} name="seachForm" id="search_form" autoComplete="off">
				<input id="search_form_input" 
							 className="autocomplete"
				       ref="search_query" 
				       type="text"
				       placeholder="Enter an npm package..."/>
			</form>
		);
	}
});

var PacketTags = React.createClass({
	handleClick: function(packet_id){
		this.props.onTagRemove(packet_id);
	},
	render: function(){
		var packets = this.props.packets.map(function(packet, i){
			var boundClick = this.handleClick.bind(this, packet.name);
			var border = "2px solid rgb(" + colors[i].join(',') + ")";
			return(
				<li key={packet.id} className="package-search-tag" style={{border}} onClick={boundClick}>
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
				<GithubStats packets={this.props.packets}/>
			</div>
		);
	}
});

var TrendGraphBox = React.createClass({
	getInitialState: function(){
		return{
			graphStats: this.props.graphStats,
			timePeriod: this.props.timePeriod
		};
	},
	getDefaultProps: function(){
		return{
			graphStats: [],
			timePeriod: 6
		};
	},
	componentDidMount: function(){
		this.getStats(this.props.packets, this.state.timePeriod);
	},
	componentWillReceiveProps: function(nextProps){
		this.getStats(nextProps.packets, this.state.timePeriod);
	},
	shouldComponentUpdate: function(nextProps, nextState){
		return this.state.graphStats !== nextState.graphStats;
	},
	getStats: function(packets, period){
		if(packets.length > 0){
			var packet_names = packets.map(function(packet){
				return packet.name;
			});
			var endDate = Date.today().toString("yyyy-M-d");
			var timeAgo = Date.today().addMonths(-period);
			// Get full start week data by making start date a monday
			var startDate = timeAgo.is().monday() ? timeAgo.toString("yyyy-M-d") : timeAgo.next().monday().toString("yyyy-M-d");
			var url = "https://api.npmjs.org/downloads/range/" 
														+ startDate + ":" 
														+ endDate + "/" 
			                     	+ packet_names.join(',');
			var result = $.ajax({
				url: "http://localhost:4444/?url=" + url,
				dataType: 'json',
				success: function(data){
					addData(data, this);
				}.bind(this)
			});
			function addData(data, passed_this){
				var graphStats = packet_names.map(function(packet_name){
					if (packet_names.length > 1){
						return data[packet_name];
					}else{
						return data;
					}
				});
				passed_this.setState({graphStats: graphStats, timePeriod: period});
			};
		}else{
			this.setState({graphStats: [], timePeriod: period});
		}
	},
	handlePeriodChange: function(e){
		this.getStats(this.props.packets,  e.target.value);
	},
	heading: function(){
		if(this.state.graphStats.length > 0){
		 	var select_options = [["1 Month", 1], ["3 Months", 3], ["6 Months", 6], 
		 												["1 Year", 12]];
		 	var select_options = select_options.map(function(option){
		 		return(
		 			<option key={option[1]} value={option[1]}>{option[0]}</option>
		 		)
		 	});
			return(
				<h2 className="chart-heading">
					Downloads in past 
					<span className="select-container">
						<select className="chart-heading-select" value={this.state.timePeriod} onChange={this.handlePeriodChange}>{select_options}</select>
					</span>
				</h2>
			)
		}
	},
	render: function(){
		return (
			<div>
				{this.heading()}
				<TrendGraph graphStats={this.state.graphStats}/>
			</div>
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
				scaleFontColor: "#eeeeee",
				responsive: true,
				scaleLabel: "<%= ' ' + value%>"
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

var GithubStats = React.createClass({
	getInitialState: function(){
		return{
			githubStats: this.props.githubStats
		};
	},
	getDefaultProps: function(){
		return{
			githubStats: []
		};
	},
	componentDidMount: function(){
		this.getGithubStats(this.props.packets);
	},
	componentWillReceiveProps: function(nextProps){
		this.getGithubStats(nextProps.packets);
	},
	getGithubStats: function(packets){
		if (packets){
			var githubData = [];
			var packets_left = packets.length;
			function addData(data, passed_this){
				githubData.push(data);
				packets_left -= 1;
				if(packets_left === 0){
					//preserve original order
					passed_this.setState({githubStats: githubData});
				}
			}
			packets.map(function(packet){
				if (packet.repository){
					var repository_url = packet.repository.url.split('.com')[1].replace('.git', '');
					var github_url = "https://api.github.com/repos" + repository_url;
					$.ajax({
						url: "http://localhost:4444/?url=" + github_url,
						dataType: 'json',
						success: function(data){
							addData(data, this);
						}.bind(this)
					});
				}else{
					var packet_data = {name: packet.name}
					addData(packet_data, this);
				}
			}, this);
		}else{
			this.setState({packets: []});
		}
	},
	table: function(){
		var stats = [["", "name"], ["stars", "stargazers_count"], ["open issues", "open_issues_count"],
								 ["created", "created_at"]];

		var rows = stats.map(function(stat){
			var ghStats = this.state.githubStats.map(function(ghStat){
				var attrubute = stat[1];
				var ghAttribute = ghStat[attrubute] ? ghStat[attrubute] : "";
				return(
					<td key={ghStat.id}>{ghAttribute}</td>
				)
			}, this);
			return(
				<tr key={stat[0]} >
					<td>{stat[0]}</td>
					{ghStats}
				</tr>
			)
		}, this);

		if(this.state.githubStats.length > 0){
			return(
				<table className="table">
					<tbody>
						{rows}
					</tbody>
				</table>
			)
		}
	},
	render: function(){
		return(
			<div>
				<h2>Github Stats</h2>
				{this.table()}
			</div>
		)
	}
})

// Expect format:
// dates: [{"day":"2012-10-22","downloads":279},{"day":"2012-10-23","downloads":2042}]
// period: 'week'
// start: '2015-5-14'
// end: '2015-11-17'
var groupDates = function(dates, period, start, end){
	var groupedDates = []
	var startDate = Date.parse(start);
	var endDate = Date.parse(end);
	var total_dates = dates.length;
	var current_period = startDate.is().sunday() ? startDate : startDate.next().sunday();
	var current_period_downloads = 0;
	dates.forEach(function(date, i){
		var dayObj = new Date(date.day.split('-'));

		function addWeekPeriod(){
			var current_period_formatted = current_period.toString("MMM d");
			groupedDates.push({period: current_period_formatted, downloads: current_period_downloads});
			current_period = current_period.next().sunday();
			current_period_downloads = 0;
		}

		// totals previous week and creates new week if data is in a different week
		if (dayObj.isAfter(current_period)) {
			addWeekPeriod();
		}
		
		current_period_downloads += date.downloads;
	});

	return groupedDates;
}


ReactDOM.render((
  <Router history={createBrowserHistory()}>
    <Route path="/" component={App}>
    	<Route path="/:packages" component={App}/>
    </Route>
  </Router>
), document.querySelector('#app'))





