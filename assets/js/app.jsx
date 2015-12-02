"use strict";

var React = require('react'),
		ReactDOM = require('react-dom'),
		env = process.env.NODE_ENV || 'dev',
		proxy_url = (env === 'dev') ? 'http://localhost:4444/?url=' : 'http://proxy.npmtrends.com/?url=',
		colors = [[0,116,217],[255,133,27],[46,204,64],[255,65,54],[255,220,0],[127,219,255],[177,13,201],[57,204,204],[0,31,63],[1,255,112]];

import { Router, Route, Link } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

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
					url: proxy_url + url,
					dataType: 'json',
					success: function(data){
						addData(data, this);
					}.bind(this),
					error: function(xhr, status, error){
						this.handleInvalidQuery(packet);
					}.bind(this)
				});
			}, this);
		}else{
			this.setState({packets: []});
		}
	},
	handleInvalidQuery: function(query){
		var packets_array = this.props.params.packages.split("-vs-");
		var remaining_packets = [];
		packets_array.forEach(function(packet){
			if(packet !== query){
				remaining_packets.push(packet);
			}
		});
		var packets_url = (remaining_packets.length > 1) ? remaining_packets.join("-vs-") : remaining_packets.join('');
		var url = "/" + packets_url;
		this.props.history.pushState(null, url);
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
						<h1 id="site_heading">npm trends</h1>
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
		var component = this;

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
		  displayKey: 'text',
		  templates: {
		    suggestion: function (data) {
		      return "<div class='autocomplete-name'>" + data.text + "</div><div class='autocomplete-description'>" + data.payload.description + "</div>";
		    }
			}
		}).on('autocomplete:selected', function(event, suggestion, dataset) {
			component.props.onSearch(suggestion.text);
			this.form.reset();
			$('.autocomplete').autocomplete('val', '');
	  });
	},
	handleSubmit: function(e){
		e.preventDefault();
		$('.autocomplete').autocomplete('close');
		var query = this.refs.search_query.value.toLowerCase();
		this.refs.search_query.form.reset();
		$('.autocomplete').autocomplete('val', '');
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
		// prevents updating before new stats are fetched
		return nextState.graphStats !== this.state.graphStats;
	},
	getStats: function(packets, period){
		if( packets.length > 0 ){
			var packet_names = packets.map(function(packet){
				return packet.name;
			});
			var endDate = Date.today().toString("yyyy-M-dd");
			var timeAgo = Date.today().addMonths(-period);
			// Get full start week data by making start date a monday
			var startDate = timeAgo.is().monday() ? timeAgo.toString("yyyy-M-dd") : timeAgo.next().monday().toString("yyyy-M-dd");
			packet_names.forEach(function(packet_name){
				var url = "https://api.npmjs.org/downloads/range/" 
														+ startDate + ":" 
														+ endDate + "/" 
			                     	+ packet_name;
				$.ajax({
					url: proxy_url + url,
					dataType: 'json',
					success: function(data){
						addData(data, this);
					}.bind(this)
				});
			}, this);
			var total_requests = packets.length;
			var requests_completed = 0;
			var graphStatsData = {};
			function addData(data, passed_this){
				requests_completed += 1
				graphStatsData[data.package] = data;
				if (requests_completed === total_requests){
					// persists order
					var graphStats = packet_names.map(function(packet_name){
						return graphStatsData[packet_name];
					});
					passed_this.setState({graphStats: graphStats, timePeriod: period});
				}
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
		this.loadChart();
	},
	loadChart: function(){
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
	},
	chart: function(){
		if (this.props.graphStats.length > 0){
			return <canvas id="download_chart"></canvas>;
		}
	},
	render: function(){
		return(
			<div>
				{this.chart()}
			</div>
		)
	}
});

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
		if ( packets.length > 0 ){
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
				// adds packages that have a github repository
				if (packet.repository && (packet.repository.url.indexOf('github') >= 0)){
					var repository_url = packet.repository.url.split('.com')[1].replace('.git', '');
					var github_url = "https://api.github.com/repos" + repository_url;
					$.ajax({
						url: proxy_url + github_url,
						dataType: 'json',
						success: function(data){
							addData(data, this);
						}.bind(this),
						error: function(data){
							var packet_data = {name: packet.name}
							addData(packet_data, this);
						}.bind(this)
					});
				}else{
					var packet_data = {name: packet.name}
					addData(packet_data, this);
				}
			}, this);
		}else{
			this.setState({githubStats: []});
		}
	},
	heading: function(){
		if (this.props.githubStats.length > 0){
			return <h2>Github Stats</h2>;
		}
	},
	table: function(){
		var stats = [["", "name"], ["stars", "stargazers_count"], ["open issues", "open_issues_count"],
								 ["created", "created_at"]];

		var rows = stats.map(function(stat){
			var ghStats = this.state.githubStats.map(function(ghStat){
				var attribute = stat[1];
				var ghAttribute;
				if(attribute === 'created_at'){
					ghAttribute = ghStat[attribute] ? Date.parse(ghStat[attribute]).toString("MMM d, yyyy") : "";
				}else if(attribute === 'name'){
					ghAttribute = ghStat[attribute] ? ( <a className="name-header" href={ghStat.html_url}> {ghStat[attribute]} </a> ) : "";
				}
				else{
					ghAttribute = ghStat[attribute] ? ghStat[attribute] : "";
				}
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
				{ this.heading()}
				{this.table()}
			</div>
		)
	}
});

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





