import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactOnRails from 'react-on-rails';

import { connect } from 'react-redux';

import SearchForm from '../components/SearchForm';
import PackageTags from '../components/PackageTags';
import TrendGraphBox from '../components/TrendGraphBox';
import PackageStats from '../components/PackageStats';
import PopularSearches from '../components/PopularSearches';
import RelatedSearches from '../components/RelatedSearches';

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
		return (this.state.packets !== nextState.packets);
	}

	colors = () => {
		return [[0,116,217],[255,133,27],[46,204,64],[255,65,54],[255,220,0],[127,219,255],[177,13,201],[57,204,204],[0,31,63],[1,255,112]];
	}

	loadPackets = (props) => {
		var packets = props.params.packets;

		if (!packets){
			this.setPageMeta([]);
			this.setState({ packets: [] });
			return;
		}

		var packets_arr = packets.split('-vs-');
		var packets_data = [];
		var packets_left = packets_arr.length;

		packets_arr.map(function(packet){
			var url = "https://api.npms.io/v2/package/" + encodeURIComponent(encodeURIComponent(packet));
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

		function addData(data, passedThis) {
			var formatted_data = {id: data.collected.metadata.name,
				                    name: data.collected.metadata.name,
				                    description: data.collected.metadata.description,
				                    repository: data.collected.metadata.repository,
				                    npmsData: data};
			packets_data.push(formatted_data);
			packets_left -= 1;
			if(packets_left === 0){
				//preserve original order
				var sorted_data = packets_arr.map(function(packet_name){
					var data_hash;
					packets_data.forEach(function(packet_data){
						if(packet_data.name === decodeURIComponent(packet_name)){
							data_hash = packet_data;
						}
					});
					return data_hash;
				});
				passedThis.setPageMeta(packets_arr);
				passedThis.setState({packets: sorted_data});
				passedThis.logSearch();
			}
		}
	}

	setPageMeta = (packets_arr) => {
		if(packets_arr.length){
			var packets_string = packets_arr.length > 1 ? decodeURIComponent(packets_arr.join(' vs ')) : decodeURIComponent(packets_arr[0]);
			document.title = packets_string + " | npm trends";
			$('meta[name=description]').attr('content', "Compare npm package download statistics over time: " + packets_string);
		}else{
			document.title = "npm trends: Compare NPM package downloads";
			document.description = "Which NPM package should you use? Compare NPM package download stats over time. Spot trends, pick the winner.";
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

	updateFromSearch = (query) => {
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

	logSearch = () => {
		const packets_array = this.props.params.packets.split("-vs-");

		$.ajax({
			url: '/s/log',
			dataType: 'json',
			type: 'POST',
			data: {
				search_query: packets_array,
				search_type: 'package_added',
				authenticity_token: ReactOnRails.authenticityToken(),
			},
			success: function(data){}.bind(this),
			error: function(xhr, status, error){
				console.log(xhr);
			}.bind(this)
		});
	}

	pageHeading = () => {
		if (!this.props.params.packets) return <span className="text--bold">Compare package download counts over time</span>;
		return this.props.params.packets.split('-vs-').map(function(name, i){
			return(
				<span key={i}>
					<span className="text--bold">{name}</span>{ this.props.params.packets.split('-vs-').length - 1 !== i && ' vs ' }
				</span>
			);
		}, this);
	}

	render() {
		return (
			<div className="container">
				<h1>{this.pageHeading()}</h1>
				<SearchForm
					onSearch={this.updateFromSearch}/>
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
				<div className="suggestions--container">
					<RelatedSearches packetsArray={this.props.params.packets ? this.props.params.packets.split("-vs-") : []} />
					<PopularSearches />
				</div>
				<div id="extra_info">
					<p>If you find any bugs or have a feature request, please open an issue on <a target="_blank" href="http://github.com/johnmpotter/npm-trends">github</a>!</p>
					<p>The npm package download data comes from npm's <a target="_blank" href="https://github.com/npm/download-counts">download counts</a> api and package details come from <a target="_blank" href="https://api-docs.npms.io/">npms.io</a>.</p>
				</div>
			</div>
		);
	}

};

export default connect(mapStateToProps)(PackageComparison);
