import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';

import { Router, Route, Link } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import SearchForm from './SearchForm';
import PackageTags from './PackageTags';
import TrendGraphBox from './TrendGraphBox';
import PackageStats from './PackageStats';
import SuggestedPackages from './SuggestedPackages';

const env = $("meta[name='node_env']").attr('content');
const proxy_url = (env === 'dev') ? 'http://localhost:4444/?url=' : 'http://' + $("meta[name='proxy_url']").attr('content') + '/?url=';

class App extends Component {

	static defaultProps = {
		packets: [],
	}

	static propTypes = {
		packets: PropTypes.array,
	}

	state = {
		packets: this.props.packets,
	}

	componentDidMount() {
		this.loadPackets(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.loadPackets(nextProps);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.state.packets !== nextState.packets;
	}

	colors = () => {
		return [[0,116,217],[255,133,27],[46,204,64],[255,65,54],[255,220,0],[127,219,255],[177,13,201],[57,204,204],[0,31,63],[1,255,112]];
	}

	loadPackets = (props) => {
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
					var packets_string = packets_arr.length > 1 ? packets_arr.join(' vs ') : packets_arr[0];
					document.title = packets_string + " - npm trends";
					$('meta[name=description]').attr('content', "Compare npm package download statistics over time: " + packets_string);
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
			document.title = "npm trends";
			document.description = "Compare npm package download statistics over time.";
		}
	}

	handleInvalidQuery = (query) => {
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
	}

	updateFromSeach = (query) => {
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
	}

	removePacket = (packet_name) => {
		var packets_array = this.props.params.packages.split("-vs-");
		var remaining_packets = $.grep(packets_array, function(packet) {
		  return ( packet !== packet_name );
		});
		var new_param = remaining_packets.join("-vs-");
		var url = "/" + new_param;
		this.props.history.pushState(null, url);
	}

	render() {
		return (
			<div className="container">
				<div className="row">
					<div className="col-xs-12">
						<SearchForm 
							curr_packets={this.props.params.packages} 
							onSearch={this.updateFromSeach}/>
						<PackageTags 
							onTagRemove={this.removePacket}
							packets={this.state.packets}
							colors={this.colors()} />
					</div>
				</div>
				<div className="row">
					<div className="col-xs-12">
						{this.state.packets.length > 0 && 
							<div>
								<TrendGraphBox proxy_url={proxy_url} packets={this.props.packets} colors={this.colors()}/>
								<PackageStats packets={this.props.packets}/>
							</div>
						}
					</div>
				</div>
				<div className="row">
					<div className="col-xs-12">
						<SuggestedPackages />
					</div>
				</div>
				<div className="row">
					<div className="col-xs-12">
						<div id="extra_info">
							<p>If you find any bugs or have a feature request, please open an issue on <a href="http://github.com/johnmpotter/npm-trends">github</a>!</p>
							<p>The npm package download data comes from the awesome <a href="https://github.com/npm/download-counts">download counts</a> api provided by <a href="http://npmjs.com">npm</a>.</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

};


ReactDOM.render((
  <Router history={createBrowserHistory()}>
    <Route path="/" component={App}>
    	<Route path="/:packages" component={App}/>
    </Route>
  </Router>
), document.querySelector('#app'));


