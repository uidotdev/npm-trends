import React, {Component, PropTypes} from 'react';

import TrendGraph from './TrendGraph';

export default class TrendGraphBox extends Component {

	static defaultProps = {
		graphStats: [],
		timePeriod: 6,
	}

	static propTypes = {
		graphStats: PropTypes.array,
		timePeriod: PropTypes.number,
		packets: PropTypes.array.isRequired,
		colors: PropTypes.array.isRequired,
		proxy_url: PropTypes.string.isRequired,
	}

	state = {
		graphStats: this.props.graphStats,
		timePeriod: this.props.timePeriod,
	}

	componentDidMount() {
		this.getStats(this.props.packets, this.state.timePeriod);
	}

	componentWillReceiveProps(nextProps) {
		this.getStats(nextProps.packets, this.state.timePeriod);
	}

	shouldComponentUpdate(nextProps, nextState) {
		// prevents updating before new stats are fetched
		return nextState.graphStats !== this.state.graphStats;
	}

	getStats = (packets, period) => {
		if( packets.length > 0 ){
			var packet_names = packets.map(function(packet){
				return packet.name;
			});
			var endDate = Date.today().toString("yyyy-MM-dd");
			var timeAgo = Date.today().addMonths(-period);
			// Get full start week data by making start date a monday
			var startDate = timeAgo.is().monday() ? timeAgo.toString("yyyy-MM-dd") : timeAgo.next().monday().toString("yyyy-M-dd");
			packet_names.forEach(function(packet_name){
				var url = "https://api.npmjs.org/downloads/range/" 
														+ startDate + ":" 
														+ endDate + "/" 
			                     	+ packet_name;
				$.ajax({
					url: this.props.proxy_url + url,
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
	}

	handlePeriodChange = (e) => {
		this.getStats(this.props.packets,  e.target.value);
	}

	heading = () => {
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
	}

	render(){
		return (
			<div>
				{this.heading()}
				<TrendGraph graphStats={this.state.graphStats}/>
			</div>
		);
	}

};

