import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class SuggestedPackages extends Component {

	handleClick = () => {
		window.scrollTo(0, 0);
	}

	suggestionsList = () => {
		var suggestions = [
			['redux', 'reflux', 'flummox', 'alt'],
			['react', 'angular'],
			['gulp', 'grunt']
		]
		var list = suggestions.map(function(suggestion, i){
			var base_url = window.location.host;
			var href = "/" + suggestion.join('-vs-');
			var name = suggestion.join(' vs ');
			return(
				<li key={i}><Link to={href} onClick={this.handleClick}>{name}</Link></li>
			)
		}, this);
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

