import React, {Component} from 'react';
import PropTypes from 'prop-types';

import PackageStatsRow from '../components/PackageStatsRow';

// array of stats to display
// format: [name_to_display, api_source, api_attribute_name]
const columns = [
	["", "github", "name"],
	["stars 🌟", "github", "stargazers_count"],
	["forks 🍽", "github", "forks_count"],
	["issues ⚠️", "github", "open_issues_count"],
	["updated 🛠", "github", "pushed_at"],
	["created 🐣", "github", "created_at"],
	["size 🏋️‍♀️", "bundlephobia", "size"],
];

export default class PackageStats extends Component {

	static propTypes = {
		packets: PropTypes.array.isRequired,
	}

	columnHeadings = () => {
		return columns.map(function(column){
			return(
				<th key={column[2]} >
					{column[0]}
				</th>
			)
		});
	}

	tableRows = () => {
		return this.props.packets.map((packet) => (
			<PackageStatsRow key={packet.name} packet={packet} columns={columns} />
		));
	}

	render() {
		if(!this.props.packets.length) return null;

		return(
			<div className="package-stats">
				<h2>Stats</h2>
				<div className="table-container">
					<table className="table">
						<thead>
							<tr>
								{ this.columnHeadings() }
							</tr>
						</thead>
						<tbody>
							{ this.tableRows() }
						</tbody>
					</table>
				</div>
			</div>
		)
	}
};
