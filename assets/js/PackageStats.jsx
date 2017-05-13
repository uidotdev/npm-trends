import React, {Component, PropTypes} from 'react';

import PackageStatsTable from './PackageStatsTable';

export default class PackageStats extends Component {
	
	static defaultProps = {
		githubStats: []
	}

	static propTypes = {
		githubStats: PropTypes.array,
	}

	state = {
		githubStats: this.props.githubStats
	}

	componentDidMount() {
		this.getGithubStats(this.props.packets);
	}

	componentWillReceiveProps(nextProps) {
		this.getGithubStats(nextProps.packets);
	}

	getGithubStats(packets) {
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
	}

	heading() {
		if (this.props.githubStats){
			return <h2>Github Stats</h2>;
		}
	}

	render(){
		return(
			<div>
				{ this.heading()}
				<PackageStatsTable githubStats={this.state.githubStats} />
			</div>
		)
	}

};


