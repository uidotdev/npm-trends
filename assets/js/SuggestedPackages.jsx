import React, {Component, PropTypes} from 'react';

export default class SuggestedPackages extends Component {

	suggestionsList = () => {
		var suggestions = [
			['redux', 'reflux', 'flummox', 'alt'],
			['react', 'angular'],
			['gulp', 'grunt']
		]
		var list = suggestions.map(function(suggestion, i){
			var base_url = window.location.host;
			var href = "http://" + base_url + "/" + suggestion.join('-vs-');
			var name = suggestion.join(' vs ');
			return(
				<li key={i}><a href={href}>{name}</a></li>
			)
		});
		return list
	}

	render() {
		return(
			<div id="suggested_packages">
				<h2>Suggestions:</h2>
				<ul className="list-unstyled">
					{this.suggestionsList()}
				</ul>
			</div>
		)
	}

};

