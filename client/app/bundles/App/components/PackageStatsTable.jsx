import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class PackageStatsTable extends Component {

	static defaultProps = {
		githubStats: []
	}

	static propTypes = {
		githubStats: PropTypes.array,
	}

	render() {
		if(!this.props.githubStats.length) return null;

		// array of stats to display
		// format: [name_to_display, github_api_attribute_name]
		var stats = [ ["", "name"], 
		              ["stars 🌟", "stargazers_count"], 
		              ["forks 🍽", "forks_count"], 
		              ["issues ⚠️", "open_issues_count"],
		              ["updated 🛠", "pushed_at"],
								  ["created 🐣", "created_at"],
								];

		var headCols = stats.map(function(stat){ 
			return( 
				<th key={stat[0]} >
					{stat[0]}
				</th>
			)
		});

		var bodyRows = this.props.githubStats.map(function(ghStat){
			var rowCells = stats.map(function(stat){
				var attributeName = stat[1];
				var attributeValue;
				switch(attributeName){
					case 'created_at':
						attributeValue = ghStat[attributeName] !== undefined ? 
														Date.parse(ghStat[attributeName]).toString("MMM d, yyyy") : "";
						break;
					case 'pushed_at':
						attributeValue = ghStat[attributeName] !== undefined ? 
														Date.parse(ghStat[attributeName]).toString("MMM d, yyyy") : "";
						break;
					case 'name':
						attributeValue = ghStat[attributeName] !== undefined ? 
														(<a className="name-header" href={ghStat.html_url}> {ghStat[attributeName]} </a>) : "";
						break;
					default:
						attributeValue = ghStat[attributeName] !== undefined ? ghStat[attributeName] : "";
				}
				return(
					<td key={attributeName}>{attributeValue}</td>
				)
			}, this);
			return(
				<tr key={ghStat.name} >
					{rowCells}
				</tr>
			)
		}, this);

		return(
			<div className="table-container">
				<table className="table">
					<thead>
						<tr>
							{headCols}
						</tr>
					</thead>
					<tbody>
						{bodyRows}
					</tbody>
				</table>
			</div>
		)
	}
};


