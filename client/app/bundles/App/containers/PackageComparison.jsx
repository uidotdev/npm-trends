import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import SearchForm from '../components/SearchForm';
import PackageTags from '../components/PackageTags';
import TrendGraphBox from '../components/TrendGraphBox';
import PackageStats from '../components/PackageStats';
import SuggestedPackages from '../components/SuggestedPackages';

const mapStateToProps = (state) => {
  return { 
  	railsContext: state.railsContext,
  };
}

class PackageComparison extends Component {

	static propTypes = {
		params: PropTypes.object.isRequired,
		history: PropTypes.object.isRequired,
		railsContext: PropTypes.object.isRequired,
	}

	state = {
		packets: [],
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
		var packets = props.params.packets;
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
					url: this.props.railsContext.proxyUrl + url,
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
		var packets_array = this.props.params.packets.split("-vs-");
		var remaining_packets = [];
		packets_array.forEach(function(packet){
			if(packet !== query){
				remaining_packets.push(packet);
			}
		});
		var packets_url = (remaining_packets.length > 1) ? remaining_packets.join("-vs-") : remaining_packets.join('');
		var url = "/" + packets_url;
		this.props.history.push(url);
	}

	updateFromSeach = (query) => {
		let new_param;
		if( this.props.params.packets ){
			let packets_array = this.props.params.packets.split("-vs-");
			if(packets_array.indexOf(query) < 0){
				packets_array.push(query);
			}
			new_param = packets_array.join("-vs-");
		}else{
			new_param = query;
		}
		const url = "/" + new_param;
		this.props.history.push(url);
	}

	removePacket = (packet_name) => {
		var packets_array = this.props.params.packets.split("-vs-");
		var remaining_packets = $.grep(packets_array, function(packet) {
		  return ( packet !== packet_name );
		});
		var new_param = remaining_packets.join("-vs-");
		var url = "/" + new_param;
		this.props.history.push(url);
	}

	render() {
		return (
			<div className="container">
				<SearchForm 
					onSearch={this.updateFromSeach}/>
				<PackageTags 
					onTagRemove={this.removePacket}
					packets={this.state.packets}
					colors={this.colors()} />
				{this.state.packets.length > 0 && 
					<div>
						<TrendGraphBox proxy_url={this.props.railsContext.proxyUrl} packets={this.state.packets} colors={this.colors()}/>
						<PackageStats packets={this.state.packets} proxy_url={this.props.railsContext.proxyUrl}/>
					</div>
				}
				<SuggestedPackages />
				<div id="extra_info">
					<p>If you find any bugs or have a feature request, please open an issue on <a href="http://github.com/johnmpotter/npm-trends">github</a>!</p>
					<p>The npm package download data comes from the awesome <a href="https://github.com/npm/download-counts">download counts</a> api provided by <a href="http://npmjs.com">npm</a>.</p>
				</div>
			</div>
		);
	}

};

export default connect(mapStateToProps)(PackageComparison);
