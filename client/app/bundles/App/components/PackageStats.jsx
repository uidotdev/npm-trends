import React, {Component} from 'react';
import PropTypes from 'prop-types';

import PackageStatsTable from '../components/PackageStatsTable';

export default class PackageStats extends Component {

	static propTypes = {
		packets: PropTypes.array.isRequired,
		proxy_url: PropTypes.string.isRequired,
	}

	state = {
		githubStats: this.props.githubStats,
	}

	componentDidMount() {
		this.getGithubStats(this.props.packets);
	}

	componentWillReceiveProps(nextProps) {
		this.getGithubStats(nextProps.packets);
	}

	getGithubStats(packets) {
		if ( packets.length > 0 ){
			packets.map(function(packet){
				// adds packets that have a github repository
				if (packet.repository && (packet.repository.url.indexOf('github') >= 0)){
					var repository_url = packet.repository.url.split('.com')[1].replace('.git', '');
					var github_url = "https://api.github.com/repos" + repository_url;
					$.ajax({
						url: this.props.proxy_url + github_url,
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

			// Initially store in object to avoid duplicates (2 packages with same repository)
			var githubDataById = {};
			var packets_left = packets.length;

			function addData(data, passed_this){
				githubDataById[data.name] = data;
				packets_left -= 1;
				if(packets_left === 0){
					let githubDataArray = [];
					for (var key in githubDataById){
						githubDataArray.push(githubDataById[key]);
					}
					passed_this.setState({githubStats: githubDataArray});
				}
			}
		}else{
			this.setState({githubStats: []});
		}
	}

	render(){
		return(
			<div>
				{ this.state.githubStats && 
					<h2>Github Stats</h2>
				}
				<PackageStatsTable githubStats={this.state.githubStats} />
			</div>
		)
	}

};


