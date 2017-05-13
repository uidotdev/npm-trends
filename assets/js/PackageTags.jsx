import React, {Component, PropTypes} from 'react';

export default class PackageTags extends Component {

	static propTypes = {
		onTagRemove: PropTypes.func.isRequired,
		packets: PropTypes.array.isRequired,
		colors: PropTypes.array.isRequired,
	}

	handleClick = (packet_id) => {
		this.props.onTagRemove(packet_id);
	}

	render(){
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

};