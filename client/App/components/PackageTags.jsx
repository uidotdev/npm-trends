import React, {Component} from 'react';
import PropTypes from 'prop-types';

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
			var border = "2px solid rgb(" + this.props.colors[i].join(',') + ")";
			return(
				<li key={packet.id} className="package-search-tag" style={{border}} onClick={boundClick}>
					<span className="search-tag-name">
						{packet.name}
					</span>
					<i className="icon icon-cross" />
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