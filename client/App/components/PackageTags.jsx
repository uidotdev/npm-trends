import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class PackageTags extends Component {

	static propTypes = {
		packets: PropTypes.array.isRequired,
		colors: PropTypes.array.isRequired,
	}

	state = {
		relatedPackets: [],
	}

	componentDidMount = () => {
		if (this.props.packets.length) {
			this.fetchRelatedPackets();
		}
	}

	componentDidUpdate = (prevProps) => {
		if (this.props.packets !== prevProps.packets) {
			this.fetchRelatedPackets();
		}
	}

	handleClick = (packet_id) => {
		this.props.onTagRemove(packet_id);
	}

	packetNamesArray = () => {
		const { packets } = this.props;

		return packets.map(packet => packet.name);
	}

	fetchRelatedPackets = () => {
		const { packets } = this.props;
		if (!packets.length) return;

		$.ajax({
			url: '/s/related_packages',
			dataType: 'json',
			type: 'GET',
			data: {
				search_query: this.packetNamesArray(),
			},
			success: function(data){
				this.setState({relatedPackets: data});
			}.bind(this),
			error: function(xhr, status, error){
				console.log(xhr);
			}.bind(this)
		});
	}

	newUrlAfterRemove = (packetNameToRemove) => {
		const { packets } = this.props;
		var remaining_packets = $.grep(this.packetNamesArray(), function(packet) {
		  return ( packet !== packetNameToRemove );
		});
		return '/' + remaining_packets.join('-vs-');
	}

	newUrlAfterAdd = (packetNameToAdd) => {
		return '/' + this.packetNamesArray().join('-vs-') + '-vs-' + packetNameToAdd;
	}

	packetTags = () => {
		const { packets } = this.props;

		return packets.map((packet, i) => {
			const boundClick = this.handleClick.bind(this, packet.name);
			const border = "2px solid rgb(" + this.props.colors[i].join(',') + ")";
			return(
				<li key={packet.id} className="package-search-tag" style={{border}}>
					<Link to={this.newUrlAfterRemove(packet.name)}>
						<span className="search-tag-name">
							{packet.name}
						</span>
						<i className="icon icon-cross" />
					</Link>
				</li>
			);
		});
	}

	relatedPackets = () => {
		const { packets } = this.props;
		const { relatedPackets } = this.state;

		if (packets.length >= 10) return null;

		return relatedPackets.map((packet, i) => {
			return (
				<li key={packet} className="related-package" style={{marginLeft: i === 0 && '10px'}}>
					<div>
						<Link to={this.newUrlAfterAdd(packet)}>
							<i className="icon icon-plus" />
							<span className="related-package--name">{packet}</span>
						</Link>
					</div>
				</li>
			)
		});
	}

	render(){
		return (
			<div className="package-search--tag-container">
				<ul className="package-search-tags list-unstyled">
					{this.packetTags()}
					{this.relatedPackets()}
				</ul>
			</div>
		);
	}

};
